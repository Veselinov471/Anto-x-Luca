export type UnitEconomicsInput = {
  priceNet: number;
  cogs: number;
  shipping: number;
  packaging: number;
  paymentFee: number;
  returnRate: number;
  costPerReturn: number;
  cac?: number;
  cpl?: number;
  leadToPurchaseRate?: number;
};

export type UnitEconomicsResult = {
  grossProfitPerOrder: number;
  grossMarginPct: number;
  contributionMargin: number | null;
  contributionMarginPct: number | null;
  breakEvenCac: number;
  estimatedCac: number | null;
  breakEvenCpl: number | null;
};

export function calculateUnitEconomics(
  input: UnitEconomicsInput,
): UnitEconomicsResult {
  const returnCost = input.returnRate * input.costPerReturn;
  const grossProfitPerOrder =
    input.priceNet -
    input.cogs -
    input.shipping -
    input.packaging -
    input.paymentFee -
    returnCost;

  const grossMarginPct =
    input.priceNet > 0 ? grossProfitPerOrder / input.priceNet : 0;

  const cac =
    input.cac ??
    (input.cpl != null && input.leadToPurchaseRate
      ? input.cpl / input.leadToPurchaseRate
      : undefined);

  const contributionMargin =
    cac != null ? grossProfitPerOrder - cac : null;

  const contributionMarginPct =
    contributionMargin != null && input.priceNet > 0
      ? contributionMargin / input.priceNet
      : null;

  const breakEvenCac = grossProfitPerOrder;
  const estimatedCac = cac ?? null;
  const breakEvenCpl =
    input.leadToPurchaseRate != null
      ? breakEvenCac * input.leadToPurchaseRate
      : null;

  return {
    grossProfitPerOrder,
    grossMarginPct,
    contributionMargin,
    contributionMarginPct,
    breakEvenCac,
    estimatedCac,
    breakEvenCpl,
  };
}
