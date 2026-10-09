from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import math
import logging
import secrets
from datetime import datetime, timezone, timedelta
from typing import Annotated, Optional, List, Literal

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict, AliasChoices, field_validator
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from seed_articles import SAMPLE_ARTICLES

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api = APIRouter(prefix="/api")
logger = logging.getLogger("portfolio")
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

JWT_ALGORITHM = "HS256"
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

CATEGORIES = ["Equities & Valuation", "Macro & Commodities", "Fixed Income & FX", "Industrials & Materials", "Strategy & Leadership", "Fintech & AI", "Sustainability & ESG"]
TOPICS = [
    "Technical Due Diligence",
    "R&D Commercialisation & Business Cases",
    "Process & Cost Optimisation",
    "Sustainability Strategy & ESG",
    "Equity & Market Analysis",
    "Speaking / Mentorship",
]
STATUSES = ["Pending", "Confirmed", "Completed", "Declined"]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Mongo base models ----------
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, validation_alias=AliasChoices("_id", "id"))

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls.model_validate(doc)

    def to_mongo(self) -> dict:
        return self.model_dump(exclude={"id"})


class Article(BaseDocument):
    title: str
    slug: str
    category: str
    excerpt: str
    content: str
    tickers: List[str] = []
    cover_image: str = ""
    linkedin_url: str = ""
    read_minutes: int = 1
    is_sample: bool = False
    published_at: str
    updated_at: str


class Booking(BaseDocument):
    ref: str
    name: str
    email: str
    company: str = ""
    topic: str
    preferred_date: str
    preferred_time: str
    message: str = ""
    status: str = "Pending"
    created_at: str


class User(BaseDocument):
    email: str
    name: str
    role: str
    password_hash: str
    created_at: str


# ---------- Inputs ----------
class ArticleIn(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    category: str
    excerpt: str = Field(min_length=10, max_length=500)
    content: str = Field(min_length=20)
    tickers: List[str] = []
    cover_image: str = ""
    linkedin_url: str = Field(default="", max_length=500)

    @field_validator("category")
    @classmethod
    def valid_category(cls, v):
        if v not in CATEGORIES:
            raise ValueError("Invalid category")
        return v


class BookingIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=200)
    company: str = Field(default="", max_length=150)
    topic: str
    preferred_date: str
    preferred_time: str = Field(min_length=3, max_length=20)
    message: str = Field(default="", max_length=2000)

    @field_validator("email")
    @classmethod
    def valid_email(cls, v):
        v = v.strip().lower()
        if not EMAIL_RE.match(v):
            raise ValueError("Please enter a valid email address")
        return v

    @field_validator("topic")
    @classmethod
    def valid_topic(cls, v):
        if v not in TOPICS:
            raise ValueError("Invalid advisory topic")
        return v

    @field_validator("preferred_date")
    @classmethod
    def valid_date(cls, v):
        try:
            d = datetime.strptime(v, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Date must be YYYY-MM-DD")
        if d < datetime.now(timezone.utc).date():
            raise ValueError("Please choose a future date")
        return v


class StatusIn(BaseModel):
    status: Literal["Pending", "Confirmed", "Completed", "Declined"]


class LoginIn(BaseModel):
    email: str
    password: str


# ---------- Auth helpers ----------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access", "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth = request.headers.get("Authorization", "")
    if not token and auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(401, "Invalid token type")
    doc = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not doc:
        raise HTTPException(401, "User not found")
    u = User.from_mongo(doc)
    return {"id": u.id, "email": u.email, "name": u.name, "role": u.role}


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(403, "Admin only")
    return user


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:80] or "article"


async def unique_slug(title: str, exclude_id: Optional[str] = None) -> str:
    base = slugify(title)
    slug, n = base, 2
    while True:
        q = {"slug": slug}
        if exclude_id:
            q["_id"] = {"$ne": ObjectId(exclude_id)}
        if not await db.articles.find_one(q):
            return slug
        slug = f"{base}-{n}"
        n += 1


def read_minutes(content: str) -> int:
    return max(1, math.ceil(len(content.split()) / 220))


def mask_email(e: str) -> str:
    local, _, domain = e.partition("@")
    return f"{local[:1]}***@{domain}"


def public_name(n: str) -> str:
    parts = n.strip().split()
    return parts[0] if len(parts) == 1 else f"{parts[0]} {parts[-1][0]}."


def public_booking(b: Booking) -> dict:
    return {
        "id": b.id,
        "ref": b.ref,
        "name": public_name(b.name),
        "email": mask_email(b.email),
        "company": b.company,
        "topic": b.topic,
        "preferred_date": b.preferred_date,
        "preferred_time": b.preferred_time,
        "status": b.status,
        "created_at": b.created_at,
    }


# ---------- Routes ----------
@api.get("/")
async def root():
    return {"message": "Kgongwane portfolio API"}


@api.get("/meta")
async def meta():
    return {"categories": CATEGORIES, "topics": TOPICS, "statuses": STATUSES}


@api.post("/auth/login")
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.strip().lower()
    fwd = request.headers.get("x-forwarded-for", "")
    ip = fwd.split(",")[0].strip() if fwd else (request.client.host if request.client else "x")
    ident = f"{ip}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": ident})
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = datetime.fromisoformat(attempt["locked_until"])
        if locked_until > datetime.now(timezone.utc):
            raise HTTPException(429, "Too many attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": ident})
    doc = await db.users.find_one({"email": email})
    if not doc or not verify_password(body.password, doc["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": ident},
            {"$inc": {"count": 1}, "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
            upsert=True,
        )
        raise HTTPException(401, "Invalid email or password")
    await db.login_attempts.delete_one({"identifier": ident})
    u = User.from_mongo(doc)
    token = create_access_token(u.id, u.email)
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    return {"user": {"id": u.id, "email": u.email, "name": u.name, "role": u.role}, "token": token}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", secure=True, samesite="none")
    return {"ok": True}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# Articles
@api.get("/articles")
async def list_articles(category: Optional[str] = None, q: Optional[str] = None):
    query: dict = {}
    if category and category != "All":
        query["category"] = category
    if q:
        rx = {"$regex": re.escape(q), "$options": "i"}
        query["$or"] = [{"title": rx}, {"excerpt": rx}, {"tickers": rx}]
    docs = await db.articles.find(query).sort("published_at", -1).to_list(500)
    return [Article.from_mongo(d).model_dump() for d in docs]


@api.get("/articles/{slug}")
async def get_article(slug: str):
    doc = await db.articles.find_one({"slug": slug})
    if not doc:
        raise HTTPException(404, "Article not found")
    return Article.from_mongo(doc).model_dump()


def clean_tickers(t: List[str]) -> List[str]:
    return [x.strip().upper() for x in t if x.strip()][:12]


@api.post("/articles")
async def create_article(body: ArticleIn, _: dict = Depends(require_admin)):
    ts = now_iso()
    art = Article(
        title=body.title.strip(),
        slug=await unique_slug(body.title),
        category=body.category,
        excerpt=body.excerpt.strip(),
        content=body.content.strip(),
        tickers=clean_tickers(body.tickers),
        cover_image=body.cover_image.strip(),
        linkedin_url=body.linkedin_url.strip(),
        read_minutes=read_minutes(body.content),
        published_at=ts,
        updated_at=ts,
    )
    res = await db.articles.insert_one(art.to_mongo())
    art.id = str(res.inserted_id)
    return art.model_dump()


@api.put("/articles/{article_id}")
async def update_article(article_id: str, body: ArticleIn, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(article_id):
        raise HTTPException(404, "Article not found")
    existing = await db.articles.find_one({"_id": ObjectId(article_id)})
    if not existing:
        raise HTTPException(404, "Article not found")
    update = {
        "title": body.title.strip(),
        "category": body.category,
        "excerpt": body.excerpt.strip(),
        "content": body.content.strip(),
        "tickers": clean_tickers(body.tickers),
        "cover_image": body.cover_image.strip(),
        "linkedin_url": body.linkedin_url.strip(),
        "read_minutes": read_minutes(body.content),
        "is_sample": False,
        "updated_at": now_iso(),
    }
    if update["title"] != existing["title"]:
        update["slug"] = await unique_slug(update["title"], article_id)
    await db.articles.update_one({"_id": ObjectId(article_id)}, {"$set": update})
    doc = await db.articles.find_one({"_id": ObjectId(article_id)})
    return Article.from_mongo(doc).model_dump()


@api.delete("/articles/{article_id}")
async def delete_article(article_id: str, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(article_id):
        raise HTTPException(404, "Article not found")
    res = await db.articles.delete_one({"_id": ObjectId(article_id)})
    if res.deleted_count == 0:
        raise HTTPException(404, "Article not found")
    return {"ok": True}


# Bookings
@api.post("/bookings")
async def create_booking(body: BookingIn):
    b = Booking(
        ref=f"ADV-{secrets.token_hex(3).upper()}",
        name=body.name.strip(),
        email=body.email,
        company=body.company.strip(),
        topic=body.topic,
        preferred_date=body.preferred_date,
        preferred_time=body.preferred_time,
        message=body.message.strip(),
        created_at=now_iso(),
    )
    res = await db.bookings.insert_one(b.to_mongo())
    b.id = str(res.inserted_id)
    return public_booking(b)


@api.get("/bookings")
async def list_bookings():
    docs = await db.bookings.find().sort("created_at", -1).to_list(200)
    return [public_booking(Booking.from_mongo(d)) for d in docs]


@api.get("/admin/bookings")
async def admin_bookings(_: dict = Depends(require_admin)):
    docs = await db.bookings.find().sort("created_at", -1).to_list(1000)
    return [Booking.from_mongo(d).model_dump() for d in docs]


@api.patch("/admin/bookings/{booking_id}")
async def update_booking(booking_id: str, body: StatusIn, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(404, "Booking not found")
    res = await db.bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(404, "Booking not found")
    return {"ok": True}


@api.delete("/admin/bookings/{booking_id}")
async def delete_booking(booking_id: str, _: dict = Depends(require_admin)):
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(404, "Booking not found")
    await db.bookings.delete_one({"_id": ObjectId(booking_id)})
    return {"ok": True}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ["CORS_ORIGINS"].split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.articles.create_index("slug", unique=True)
    email = os.environ["ADMIN_EMAIL"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        u = User(email=email, name="Itumeleng Kgongwane", role="admin", password_hash=hash_password(password), created_at=now_iso())
        await db.users.insert_one(u.to_mongo())
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
    if await db.articles.count_documents({}) == 0:
        for a in SAMPLE_ARTICLES:
            art = Article(**a, slug=slugify(a["title"]), read_minutes=read_minutes(a["content"]), updated_at=a["published_at"])
            await db.articles.insert_one(art.to_mongo())


@app.on_event("shutdown")
async def shutdown():
    client.close()
