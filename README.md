# Italian Touch — Bulgaria market validation

Landing-page MVP to validate demand for Italian-made women's handbags in Bulgaria.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase Postgres for leads (optional in-memory fallback locally)
- Resend for ops notifications
- GA4 + Meta Pixel (consent-gated)

## Languages

- Bulgarian (default): `/`
- English: `/en`

Switch with **BG / EN** in the header or footer.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars, leads are stored in server memory (dev only).

## Supabase

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor, then set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local server |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright happy path |
| `node tests/unit-checks.mjs` | Pricing / unit-economics checks |

## Docs

Strategy and experiment docs live in [`/docs`](./docs). Start with [`PROJECT_DISCOVERY.md`](./docs/PROJECT_DISCOVERY.md) and [`LAUNCH_GATE.md`](./docs/LAUNCH_GATE.md).

## Locked Wave 1 decisions

- Offer: early-access waitlist (email + preferred product + consent)
- Price band: ~€79–€129 with dual EUR/BGN display
- Revisitable after UI/UX critique before paid ads
