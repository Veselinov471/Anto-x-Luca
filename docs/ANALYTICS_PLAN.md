# Analytics Plan — Anto x Luca

## Principles

1. Instrument **before** paid traffic.
2. Consent-gate non-essential tags (GDPR).
3. **No PII** in analytics event parameters (no email, name, phone).
4. Prefer few reliable tools over many scripts.

---

## Tools (Wave 1)

| Tool | Purpose | Consent |
| --- | --- | --- |
| Google Analytics 4 | Traffic, funnel, events | Analytics consent |
| Meta Pixel | Ad optimization, lead events | Marketing consent |
| Meta CAPI | Optional later if Pixel quality poor | Marketing + server |
| GTM | Optional wrapper | Same as tags loaded |
| Microsoft Clarity | **Only if** legal/privacy OK — default **off** | Strictly optional |

---

## Funnel metrics

### Traffic

Sessions, users, source/medium/campaign/ad, device, geo (BG focus).

### Engagement

product_view, product_click, scroll depth (25/50/75/100), cta_click, faq_open.

### Conversion

lead_form_start, lead_submit, product_interest (preferred product id), price_view.

### Technical

LCP/INP/CLS (CrUX or Vercel analytics), JS errors (basic), API failure rate on `/api/leads`.

---

## Event taxonomy

| Event | When | Key parameters |
| --- | --- | --- |
| `page_view` | LP load | `page_path`, `locale` |
| `product_view` | Product card/detail in viewport or open | `product_id`, `product_name`, `price`, `currency`, `position` |
| `product_click` | Click product | same + `position` |
| `price_view` | Price element impressed | `product_id`, `price`, `currency` |
| `cta_click` | Primary/secondary CTA | `cta_id`, `location` (hero/collection/footer) |
| `faq_open` | FAQ item expand | `faq_id` |
| `lead_form_start` | Focus first field | `form_id` |
| `lead_submit` | Successful API 200 | `form_id`, `product_id` (preferred) |
| `product_interest` | Preference recorded | `product_id`, `price`, `currency` |
| `scroll_depth` | Thresholds | `percent` |

UTM parameters stored on lead row server-side; mirrored to analytics as campaign dimensions where possible **without** storing raw PII in GA.

---

## Primary KPIs

| KPI | Definition |
| --- | --- |
| CTR (ad) | Clicks / impressions |
| LP engagement rate | product_click or deep scroll / sessions |
| Waitlist CVR | lead_submit / sessions |
| CPL | Ad spend / qualified leads (consenting, valid email, product selected) |
| Product interest share | preferred_product distribution |
| Form drop-off | 1 − (lead_submit / lead_form_start) |

---

## Dashboard (simple)

No custom analytics platform. Use:

- GA4 explorers / Meta Ads Manager
- Supabase table export for product preference counts
- Manual weekly summary in EXPERIMENTS.md

---

## Privacy notes

- Cookie / privacy policy placeholders until counsel review
- Marketing consent required for waitlist emails
- Analytics cookies after consent
- Data retention policy TBD with counsel (document assumption in ASSUMPTIONS.md)
