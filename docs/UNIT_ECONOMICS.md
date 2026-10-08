# Unit Economics — Anto x Luca

## Purpose

Decide whether observed **CPL** (and later CAC) can support a profitable business at intended prices. Formulas first; founder fills inputs.

---

## Inputs (enter real numbers)

| Variable | Symbol | Example placeholder | Notes |
| --- | --- | --- | --- |
| Selling price (EUR, VAT-aware — clarify) | `P` | 109 | Wave 1 band €79–€129 |
| Product cost (COGS) | `C` | TBD | Ex-works or landed — specify |
| Shipping to customer | `S` | TBD | |
| Packaging | `K` | TBD | |
| Payment processing fee | `F` | e.g. 1.5%×P + fixed | N/A for waitlist phase |
| Expected return rate | `R` | e.g. 0.08 | Cost of returns separately |
| Cost per return | `Cr` | TBD | |
| VAT / tax treatment | `V` | TBD | **Counsel / accountant** |
| Ad spend | `A` | 500 | Wave 1 |
| Leads | `L` | TBD | Qualified |
| Assumed lead→purchase rate | `Q` | e.g. 0.05–0.15 | **Assumption — label clearly** |

---

## Core formulas

```
Gross profit per order (simplified, before ads) =
  P_net - C - S - K - F - (R * Cr)

# Define P_net consistently (ex-VAT or inc-VAT) — do not mix.

Contribution margin per order =
  Gross profit per order - CAC

CPL = A / L

Estimated CAC = CPL / Q
  (only as scenario planning while offer is waitlist-only)

Break-even CAC = Gross profit per order

Break-even CPL = Break-even CAC * Q

Required waitlist CVR (rough) =
  (sessions needed) depends on CPL targets and CPC
```

### Gross margin %

```
Gross margin % = (P_net - C) / P_net
```

### Contribution margin %

```
CM % = (Gross profit per order - CAC) / P_net
```

---

## Scenario table (fill in)

| Scenario | P | C | S+K+F | Gross profit | Q | Max CPL | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Conservative | | | | | 0.05 | | |
| Base | | | | | 0.10 | | |
| Optimistic | | | | | 0.15 | | |

---

## Wave 1 interpretation

Because Wave 1 is **waitlist-only**, treat economics as:

1. Measure CPL and product mix.
2. Plug into scenarios above.
3. If even optimistic Q cannot clear break-even CAC, **red flag** on price, COGS, or offer.
4. Do not scale inventory until base scenario is plausible.

---

## Optional calculator

Implementation may include `lib/unit-economics.ts` helpers mirroring these formulas. A spreadsheet copy is equally valid for founder use.

---

## Tax disclaimer

VAT, OSS, and BGN/EUR fiscal rules require professional advice. This doc is a **business model worksheet**, not tax advice.
