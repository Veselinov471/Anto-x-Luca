# Architecture — Anto x Luca Validation MVP

## Goals

- Fast mobile landing page (BG)
- Waitlist capture with product preference
- Consent-aware analytics
- Clean path to future e-commerce
- Minimal ops overhead

---

## Stack choice

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js App Router + TypeScript | SSR/SEO, image optimization, API routes |
| UI | React + Tailwind CSS | Speed, design tokens, mobile-first |
| i18n | Message files (`messages/bg.json`, `en.json` stub) | BG first; EN later without rewrite |
| Hosting | Vercel | Low cost, previews, edge |
| DB | Supabase Postgres | Managed, simple leads table |
| Email | Resend (ops notify + optional lead confirm) | Simple transactional |
| Analytics | GA4 + Meta Pixel | Industry standard for Meta acquisition |

### Alternatives considered

| Option | Why not for Wave 1 |
| --- | --- |
| Shopify | Overkill; template aesthetics; cost before validation |
| Static HTML only | Harder API, i18n, evolution |
| WordPress | Perf and maintenance overhead |
| Custom Node + SPA | Worse SEO defaults; more ops |

---

## High-level diagram

```
Browser (mobile-first)
  → Next.js on Vercel (/, legal stubs, api/leads)
      → Supabase `leads`
      → Resend notify
  → GA4 / Meta Pixel (after consent)
```

---

## Frontend

- Single primary route `/` landing sections as components
- Client islands: lead form, consent banner, FAQ accordion, analytics wrappers
- Server components for static sections where possible
- Dual price helper: `eurToBgn(eur)` using `1.95583`

### Component map

- `Hero`, `ProductCollection`, `ProductCard`, `WhyItaly`, `ProductDetails`, `Lifestyle`, `Trust`, `Faq`, `FinalCta`, `LeadForm`, `ConsentBanner`, `SiteFooter`, `PriceDisplay`

### Routing

- `/` — landing
- `/privacy`, `/cookies` — placeholder legal pages (marked for counsel)
- `/api/leads` — POST lead

---

## Data model

### Lead

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | PK |
| email | text | required |
| first_name | text | optional |
| preferred_product | text | product_id |
| consent_marketing | boolean | required true |
| source | text | e.g. meta |
| campaign | text | UTM |
| medium | text | UTM |
| content | text | UTM |
| term | text | UTM |
| landing_variant | text | optional experiment id |
| created_at | timestamptz | default now() |

### Product

File-based: `data/products.ts` (not DB until catalog grows).

### Experiment

Documented in `docs/EXPERIMENTS.md` first; DB table optional later.

---

## API

`POST /api/leads`

- Validate email, preferred_product, consent
- Honeypot field
- Rate limit (IP-based simple in-memory or Upstash later)
- Insert Supabase with service role
- Send ops email
- Return `{ ok: true }` without leaking internals

---

## Auth

None for end users. Service role key **server-only**.

---

## Analytics

- Consent store (localStorage / cookie)
- `lib/analytics.ts` event helpers
- Load gtag / fbq only after consent categories granted

---

## Security

- Env vars for secrets
- Input validation (zod)
- Spam honeypot + rate limit
- Security headers via Next config
- No secrets in client bundles

---

## Error handling

- Form: inline validation, network error message, duplicate email friendly message
- API: structured JSON errors
- Monitoring: Vercel logs; optional Sentry later (not required Wave 1)

---

## Environment variables

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
LEADS_NOTIFY_EMAIL=
```

---

## Evolution path

Landing → product pages → cart → checkout → orders — see ROADMAP.md. Keep product type and pricing helpers stable so cart can reuse them.
