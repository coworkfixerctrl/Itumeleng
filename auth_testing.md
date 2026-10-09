# Auth Testing Playbook

Admin creds in /app/memory/test_credentials.md

1. MongoDB: `db.users.find({role:"admin"})` → bcrypt hash starts with `$2b$`; index users.email unique.
2. API:
```
curl -c cookies.txt -X POST $API/api/auth/login -H "Content-Type: application/json" -d '{"email":"kgongwane@icloud.com","password":"Kgongwane@2026"}'
curl -b cookies.txt $API/api/auth/me
```
Login returns {user, token} and sets httpOnly `access_token` cookie. /me works with cookie or `Authorization: Bearer <token>`.
3. Admin-only routes (POST/PUT/DELETE /api/articles, /api/admin/bookings*) must return 401 without auth.
4. 5 failed logins for same ip+email → 429 lockout for 15 min.
