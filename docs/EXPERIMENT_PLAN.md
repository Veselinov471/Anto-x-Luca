# Experiment Plan — Anto x Luca Wave 1

## Objective

With **€300–€700** Meta spend, learn which product, creative, and audience produce the best **qualified waitlist** economics at visible prices €79–€129.

---

## Hypotheses under test

| ID | Hypothesis | Primary metrics |
| --- | --- | --- |
| H1 | Bags are visually appealing | CTR, product_view, product_click |
| H2 | Made in Italy / craftsmanship lifts response | Creative CTR + LP waitlist rate by creative |
| H3 | €79–€129 prices are acceptable | product_interest distribution; form completion after price view |
| H4 | Visitors take stronger action than browse | cta_click → lead_submit rate |
| H5 | Acquisition can be economically sane | CPL vs break-even model |
| H6 | Some SKUs dominate | preferred_product share |
| H7 | Trust content reduces form drop-off | lead_form_start → lead_submit |

---

## Campaign structure

```
Campaign: AXL_BG_Validation_Wave1
├── Ad set A: Women 25–34 | Sofia + major cities | Broad interests + lookalike later
├── Ad set B: Women 35–44 | Sofia + major cities
└── (Optional) Ad set C: Broader women 25–44 if A/B starved
    └── Creatives 1–5
```

**Budget suggestion:**

| Phase | Share of budget | Purpose |
| --- | --- | --- |
| Learning | ~60% | Equalize creative testing |
| Focus | ~40% | Put weight on early winners |

Exact daily caps depend on total (€300 vs €700). Prefer ≥7 days continuous.

---

## Creative concepts

| # | Concept | Hook (draft BG) | Visual | Hypothesis |
| --- | --- | --- | --- | --- |
| 1 | Craftsmanship | „Изработена в Италия. За всеки ден.“ | Stitching / leather close-up | H2 |
| 2 | Lifestyle | „Елегантност за града.“ | Woman + bag in Sofia-like urban setting | H1 |
| 3 | Product beauty | „Малка селекция. Ясен характер.“ | Clean product on neutral ground | H1/H6 |
| 4 | Price/value | „Италианска кожа в честен ценови диапазон.“ | Product + dual price overlay | H3 |
| 5 | Early access | „Първи достъп до колекцията.“ | Soft brand frame + bag | H4 |

Landing page relationship: **all creatives → same LP** in Wave 1 (isolate creative).

---

## Variables — what NOT to change simultaneously

Do not change creative + headline + price + audience in one step.

Order of learning:

1. Creative × audience (ads)
2. Product interest (on-page)
3. Then LP headline / positioning A/B
4. Then price tests

---

## Sample size caution

€300–€700 will produce **small samples**. Rules:

- Do not declare a creative “winner” on < ~50–100 landing sessions if avoidable
- Separate low CTR (ad problem) from high CTR + low waitlist (LP/offer/trust/price problem)
- Prefer directional learning + next experiment over false certainty

---

## Success interpretation

Use DECISION_FRAMEWORK.md (green / yellow / red). No single universal CVR benchmark.

---

## Logging

Every change → `docs/EXPERIMENTS.md` entry with dates, variants, spend, and outcome.
