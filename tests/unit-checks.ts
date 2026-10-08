import assert from "node:assert/strict";
import { eurToBgn, dualPrice } from "../lib/pricing";
import { calculateUnitEconomics } from "../lib/unit-economics";

assert.equal(eurToBgn(100), 195.58);
assert.equal(dualPrice(89).bgn, 174.07);

const econ = calculateUnitEconomics({
  priceNet: 100,
  cogs: 40,
  shipping: 5,
  packaging: 2,
  paymentFee: 2,
  returnRate: 0.1,
  costPerReturn: 10,
  cpl: 8,
  leadToPurchaseRate: 0.1,
});

assert.equal(econ.grossProfitPerOrder, 50);
assert.equal(econ.estimatedCac, 80);
assert.equal(econ.breakEvenCpl, 5);

console.log("unit checks passed");
