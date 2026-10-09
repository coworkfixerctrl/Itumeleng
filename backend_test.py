"""Backend API tests for Kgongwane portfolio."""
import os
import re
import time
import pytest
import requests
from datetime import datetime, timedelta, timezone

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://exec-strategy-4.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "kgongwane@icloud.com"
ADMIN_PASSWORD = "Kgongwane@2026"


def _future_weekday(days=7) -> str:
    d = datetime.now(timezone.utc) + timedelta(days=days)
    while d.weekday() >= 5:
        d += timedelta(days=1)
    return d.strftime("%Y-%m-%d")


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed {r.status_code}: {r.text}")
    return r.json()["token"]


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Health / meta ----------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()

    def test_meta(self, session):
        r = session.get(f"{API}/meta")
        assert r.status_code == 200
        d = r.json()
        assert "categories" in d and "topics" in d and "statuses" in d
        assert len(d["categories"]) >= 5
        assert len(d["topics"]) >= 6


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        d = r.json()
        assert "token" in d and "user" in d
        assert d["user"]["email"] == ADMIN_EMAIL
        assert d["user"]["role"] == "admin"
        # Cookie set
        assert "access_token" in r.cookies or any("access_token" in c for c in r.headers.get("set-cookie", ""))

    def test_me_with_bearer(self, session, admin_token):
        r = session.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        assert r.json()["role"] == "admin"

    def test_me_without_auth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-password"})
        assert r.status_code == 401

    def test_brute_force_lockout(self):
        """Use throwaway email to trigger lockout without affecting admin."""
        throwaway = f"TEST_bruteforce_{int(time.time())}@example.com"
        last = None
        for i in range(6):
            last = requests.post(f"{API}/auth/login", json={"email": throwaway, "password": "nope"})
        # After 5 fails -> 6th should be 429
        assert last.status_code == 429, f"Expected 429 lockout, got {last.status_code}: {last.text}"


# ---------- Articles ----------
class TestArticles:
    def test_list_seeded(self, session):
        r = session.get(f"{API}/articles")
        assert r.status_code == 200
        arts = r.json()
        assert len(arts) >= 3
        for a in arts:
            assert "_id" not in a
            assert "slug" in a and "title" in a

    def test_get_by_slug(self, session):
        arts = session.get(f"{API}/articles").json()
        slug = arts[0]["slug"]
        r = session.get(f"{API}/articles/{slug}")
        assert r.status_code == 200
        assert r.json()["slug"] == slug

    def test_get_missing(self, session):
        r = session.get(f"{API}/articles/does-not-exist-xyz")
        assert r.status_code == 404

    def test_create_requires_auth(self):
        r = requests.post(f"{API}/articles", json={"title": "x", "category": "Fintech & AI", "excerpt": "x", "content": "x"})
        assert r.status_code == 401

    def test_create_update_delete(self, admin_headers):
        payload = {
            "title": f"TEST_Article_{int(time.time())}",
            "category": "Fintech & AI",
            "excerpt": "This is a short test excerpt for the article.",
            "content": "## Heading\n\nThis is a long enough body for testing the article API.",
            "tickers": ["aapl", "msft"],
            "cover_image": "/img/test.jpg",
        }
        r = requests.post(f"{API}/articles", json=payload, headers=admin_headers)
        assert r.status_code == 200, r.text
        art = r.json()
        aid = art["id"]
        assert art["tickers"] == ["AAPL", "MSFT"]
        assert art["slug"]
        # GET to verify persistence
        g = requests.get(f"{API}/articles/{art['slug']}")
        assert g.status_code == 200
        # Update
        up = {**payload, "title": payload["title"] + "_UPD", "excerpt": "Updated excerpt long enough"}
        r2 = requests.put(f"{API}/articles/{aid}", json=up, headers=admin_headers)
        assert r2.status_code == 200
        assert r2.json()["title"].endswith("_UPD")
        # Delete
        r3 = requests.delete(f"{API}/articles/{aid}", headers=admin_headers)
        assert r3.status_code == 200
        g2 = requests.get(f"{API}/articles/{r2.json()['slug']}")
        assert g2.status_code == 404

    def test_create_invalid_category(self, admin_headers):
        r = requests.post(f"{API}/articles", json={
            "title": "TEST_bad", "category": "Nope", "excerpt": "x" * 20, "content": "y" * 30
        }, headers=admin_headers)
        assert r.status_code == 422


# ---------- Bookings ----------
class TestBookings:
    created_ids = []

    def test_booking_past_date(self, session):
        r = session.post(f"{API}/bookings", json={
            "name": "TEST_User", "email": "test@example.com", "topic": "Technical Due Diligence",
            "preferred_date": "2020-01-01", "preferred_time": "10:00",
        })
        assert r.status_code == 422

    def test_booking_bad_email(self, session):
        r = session.post(f"{API}/bookings", json={
            "name": "TEST_User", "email": "not-an-email", "topic": "Technical Due Diligence",
            "preferred_date": _future_weekday(), "preferred_time": "10:00",
        })
        assert r.status_code == 422

    def test_booking_bad_topic(self, session):
        r = session.post(f"{API}/bookings", json={
            "name": "TEST_User", "email": "test@example.com", "topic": "Nonsense",
            "preferred_date": _future_weekday(), "preferred_time": "10:00",
        })
        assert r.status_code == 422

    def test_create_valid_and_list_masked(self, session, admin_headers):
        payload = {
            "name": "TEST_Johnathan Doe",
            "email": "johnathan.doe@example.com",
            "company": "TEST Co",
            "topic": "Equity & Market Analysis",
            "preferred_date": _future_weekday(10),
            "preferred_time": "14:00",
            "message": "Please discuss sector rotation.",
        }
        r = session.post(f"{API}/bookings", json=payload)
        assert r.status_code == 200, r.text
        b = r.json()
        assert b["email"].startswith("j***@") and "example.com" in b["email"]
        assert b["name"] == "TEST_Johnathan D."
        assert b["status"] == "Pending"
        assert "message" not in b
        # list public
        r2 = session.get(f"{API}/bookings")
        assert r2.status_code == 200
        found = [x for x in r2.json() if x["ref"] == b["ref"]]
        assert found
        assert "message" not in found[0]
        assert found[0]["email"].startswith("j***@")
        # admin list has full email
        r3 = requests.get(f"{API}/admin/bookings", headers=admin_headers)
        assert r3.status_code == 200
        a_found = [x for x in r3.json() if x["ref"] == b["ref"]]
        assert a_found
        assert a_found[0]["email"] == "johnathan.doe@example.com"
        assert a_found[0]["message"] == "Please discuss sector rotation."
        TestBookings.created_ids.append(a_found[0]["id"])

    def test_admin_bookings_requires_auth(self):
        r = requests.get(f"{API}/admin/bookings")
        assert r.status_code == 401

    def test_update_status_and_delete(self, admin_headers):
        if not TestBookings.created_ids:
            pytest.skip("no booking created")
        bid = TestBookings.created_ids[0]
        r = requests.patch(f"{API}/admin/bookings/{bid}", json={"status": "Confirmed"}, headers=admin_headers)
        assert r.status_code == 200
        pub = requests.get(f"{API}/bookings").json()
        upd = [x for x in pub if x["id"] == bid]
        assert upd and upd[0]["status"] == "Confirmed"
        # cleanup
        r2 = requests.delete(f"{API}/admin/bookings/{bid}", headers=admin_headers)
        assert r2.status_code == 200

    def test_status_requires_auth(self):
        r = requests.patch(f"{API}/admin/bookings/000000000000000000000000", json={"status": "Confirmed"})
        assert r.status_code == 401
