# HADITH Hotel 2 — Redesign

Total revision of the HADITH Hotel company profile site (Complex of Imam Al Bukhari, Samarkand).

## Stack (same as Hadith-Hotel)

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS 4 — in `web/`
- **Database:** PostgreSQL 16 (Docker)
- **ORM:** Prisma 6

## Quick start

### 1. Start PostgreSQL

```bash
docker compose up -d db
```

### 2. App setup

```bash
cd web
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Local Docker DB uses host port **5435** so it does not conflict with the original Hadith-Hotel Postgres on 5432.

## Project layout

```
Hadith-Hotel-2/
├── docker-compose.yml
├── README.md
└── web/                    # Next.js app
    ├── prisma/
    ├── public/
    └── src/
        ├── app/
        ├── components/
        └── lib/
```

## Notes

- Images and videos use **placeholders** until final assets are chosen.
- Site structure / navigation will follow the redesign brief (Overview, Suites & Rooms, etc.).
