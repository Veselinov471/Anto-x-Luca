# Meta Ads Setup & Launch Gate — Anto x Luca

## UI/UX revisit (before paid spend)

Current locked choices:

- Offer **1A** — early-access waitlist
- Price **2A** — ~€79–€129 dual EUR/BGN

After reviewing the live UI/UX, explicitly confirm or change these in EXPERIMENTS.md before Meta spend. Architecture supports CTA/price config changes without a rewrite.

## Campaign checklist (before spend)

- [ ] Domain live on HTTPS
- [ ] Meta Pixel fires `PageView` after marketing consent
- [ ] `Lead` or custom `lead_submit` event verified in Events Manager (test mode)
- [ ] UTMs on all ads: `utm_source=meta&utm_medium=paid_social&utm_campaign=axl_bg_w1&utm_content={creative}`
- [ ] Privacy/cookie pages linked; counsel review status documented
- [ ] Real product images + honest claims (or ads delayed)
- [ ] Company contact visible
- [ ] Dual EUR/BGN prices on LP
- [ ] Waitlist E2E tested on mobile Safari + Android Chrome
- [ ] Unit economics inputs filled enough for CPL interpretation
- [ ] **UI/UX revisit:** confirm stay on offer **1A** and price **2A** — or change and log EXP

## Creative brief pointers

See EXPERIMENT_PLAN.md concepts 1–5. Landing CTA: „Получавам ранен достъп“.

## DoD for validation experiment launch

See IMPLEMENTATION_PLAN.md and DECISION_FRAMEWORK.md. Engineering DoD ≠ business go for inventory.

## Post-wave readout

Fill EXP-001 in EXPERIMENTS.md and choose Continue / Iterate / Reposition / Reprice / Product change / Stop.
