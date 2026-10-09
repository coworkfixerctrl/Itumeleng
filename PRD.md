# PRD — Itumeleng D. Kgongwane Executive Portfolio ("KGONGWANE · Molecule → Margin")

## Original problem statement
Build a premium, ultra-clean personal portfolio website for an executive who bridges Chemical Engineering and Corporate Finance/Strategy.
Design Vibe: "Industrial Prestige". Dark slate gray background (#1E293B) with high-contrast ice blue accents (#38BDF8) and crisp white text. Use minimalist, modern typography and a spacious grid layout.
Include these functional sections:
1. HERO SECTION: A split screen with a bold personal branding statement ("Bridging Molecular Execution and Corporate Strategy") on the left and a minimalist 3-part Bento Box summary grid on the right.
2. TRAJECTORY TIMELINE: An interactive vertical timeline that highlights key professional milestones across "Engineering & R&D" and "Finance & Corporate Strategy".
3. CASE STUDIES GRID: A sleek 3-column clean grid showcasing prominent cross-functional product development projects, showing technical problems solved alongside the financial/business outcome.
4. ADVISORY CONTACT: A functional contact card section with an integrated booking form for scheduling consultation calls, directing inquiries to a clean data table.
Make use of my attached CV to write impactful under 1, 2,3,4 sections. Access my linkedin on www.linkedin.com/in/itumelengidk for more insights about myself.
I need an additional tab/page titled market analysis and commentary where i share articles and analysis regarding financial markets and equities etc like i do on linkedin. On contact page use similar style of social media icons and changing color as in the website of https://stevenbartlett.com/.
Ensure the design is perfectly responsive on mobile devices and utilizes elegant, subtle scroll-fade micro-animations.

User choices: bookings table visible to anyone (we mask emails / shorten names); owner types & posts articles and needs click-to-share on LinkedIn; email notifications, photo, extra socials skipped.

## Architecture
- FastAPI + MongoDB (motor). server.py, seed_articles.py. JWT admin auth (bcrypt, httpOnly cookie + Bearer), brute-force lockout (X-Forwarded-For + email).
- React (CRA/craco) + Tailwind + shadcn, framer-motion, lenis smooth scroll, @tanstack/react-query.
- Routes: / , /market-analysis, /market-analysis/:slug, /contact, /admin, /admin/dashboard.
- Content (timeline, case studies, awards, socials) in frontend/src/data/content.js, written from the CV (LinkedIn could not be scraped).

## User personas
- Recruiters / boards / executives evaluating the owner; clients booking advisory calls; LinkedIn readers of market commentary; the owner as editor.

## Implemented (2026-10-05)
- Hero with masked line reveal, interactive canvas hexagonal "cellulose" lattice (scroll parallax), 3D-tilt bento (R87M EBITDA, R203M NPV, 3.94 GPA)
- Editorial marquee, Profile section with duotone spotlight image + awards
- Dual-track timeline (filters, expandable cards, scroll-progress spine)
- 6 case studies (problem vs outcome, stats)
- Advisory: contact card, booking form (calendar, time slots), public masked bookings ledger
- Market Analysis page (filters, search, featured), article detail (reading progress, LinkedIn share + copy link), 3 SAMPLE articles
- Contact page with Steven Bartlett-style fill-on-hover social links (LinkedIn, Email, Call)
- Admin: login, article CRUD with "Share on LinkedIn" after publish, booking status management
- Original logo mark + SVG favicon

## Implemented (2026-10-05, update)
- Fordham photo (/img/fordham.webp) placed in the timeline beside the 2026 MS Finance card (desktop: fills the empty left track and matches card height; phone: shown below the card)
- Added 4th LinkedIn article "SARB Hike Expected Amid Global Inflationary Backdrop" (17 Sep 2026, stock rand-notes cover; Triple Threat cover swapped to sharp Pexels pumpjack)
- Replaced the 3 sample articles with the owner's real LinkedIn posts (US 10-Year at 5.3%; Barbell Strategy; SA "Triple Threat"), original dates, covers saved to /img/li-*.jpg, "Originally published on LinkedIn" link (new linkedin_url field, editable in admin); categories added: Fixed Income & FX, Strategy & Leadership

## Backlog
- P1: Email notification on new booking (Resend); per-article OG tags for rich LinkedIn previews (needs SSR/prerender)
- P1: Headshot photo; additional social profiles
- P2: Image upload for article covers; newsletter signup; pagination of bookings
- Note: CORS_ORIGINS="*" with credentials (same-origin today) — set explicit origin if API is called cross-origin

## Next tasks
- Replace sample articles with owner's own posts; change admin password in backend/.env
