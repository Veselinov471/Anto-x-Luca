# Implementation Plan — Anto x Luca

## Prioritization (ICE × MoSCoW)

Optimize for **maximum learning per euro**, not feature count.

### MUST HAVE

- Next.js + TS + Tailwind scaffold
- Design tokens (premium, non-generic)
- Landing sections 1–8 (BG copy)
- Dual EUR/BGN prices
- Waitlist form + API + Supabase
- Consent banner gating analytics
- GA4 + Meta event taxonomy
- SEO metadata + OG
- Mobile performance basics
- Deploy on Vercel
- Spam protection + validation

### SHOULD HAVE

- Ops email on new lead (Resend)
- Lead confirmation message on-page (and optional email)
- Sitemap / robots
- Product/Organization JSON-LD
- Playwright happy-path test
- FAQ open analytics

### NICE TO HAVE

- EN locale strings
- Vercel Analytics
- Internal simple metrics page
- Upstash rate limit

### DO NOT BUILD YET

- Cart, checkout, payments, accounts
- Admin CRM UI
- CMS
- Recommendations
- Deposit flow (unless offer changes)
- Fake reviews / scarcity widgets
- Clarity (unless counsel OK)

---

## Phases

### Phase 1 — Foundation

- Initialize Next.js App Router, TypeScript, Tailwind, ESLint
- Env example file
- Folder structure per ARCHITECTURE.md
- i18n message files (bg + en stub)

### Phase 2 — Design system

- CSS variables: color, type, spacing
- Typography (distinctive, not Inter/Roboto default stack)
- Button, form controls, layout primitives
- Motion: 2–3 subtle intentional animations

### Phase 3 — Landing page

- Hero (full-bleed), collection, why Italy, details, lifestyle, trust, FAQ, final CTA
- Placeholder products PRODUCT_01–05
- Development image placeholders clearly labeled

### Phase 4 — Lead capture

- Form UX + zod validation
- `/api/leads` + Supabase schema SQL
- Honeypot + basic rate limit
- Success / error states

### Phase 5 — Analytics

- Consent store
- Event helpers
- Pixel + GA4 loaders

### Phase 6 — SEO

- Metadata, OG, Twitter, canonical, sitemap, robots, JSON-LD

### Phase 7 — QA

- Responsive, a11y, performance, Playwright flow

### Phase 8 — Deployment

- Vercel project, env vars, domain (when ready), analytics verification

---

## Photography requirements (for content ops)

Per product ideally: hero, front, back, side, interior, hardware, on-body scale, lifestyle, packaging.  
Aspect ratios: hero ~4/5 or 3/4 mobile; OG 1200×630. Use `next/image` + WebP/AVIF.

---

## Brand foundation (lightweight)

- Working name: Anto x Luca
- Logo: wordmark placeholder
- Colors: warm ivory ground, deep espresso text, muted burgundy accent (avoid purple-gradient AI cliché and cream+terracotta cliché overload — keep refined, Italian leather atelier feel)
- Type: distinctive serif display + refined sans body
- Tone: sophisticated, warm, concise Bulgarian

---

## Risks during build

See OPEN_QUESTIONS blocking list. Ship with placeholders but **do not run paid ads** until B3–B9 answered.

---

## Definition of Done (engineering)

Matches plan section R: docs complete, LP live, waitlist E2E, consent+events verified, no fake social proof, CWV/a11y acceptable, experiment log ready.
