/** Official fixed conversion rate for dual display. */
export const EUR_TO_BGN = 1.95583;

export function eurToBgn(eur: number): number {
  return Math.round(eur * EUR_TO_BGN * 100) / 100;
}

export function formatEur(eur: number, locale = "bg-BG"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(eur);
}

export function formatBgn(bgn: number, locale = "bg-BG"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BGN",
  }).format(bgn);
}

export function dualPrice(eur: number) {
  const bgn = eurToBgn(eur);
  return {
    eur,
    bgn,
    eurLabel: formatEur(eur),
    bgnLabel: formatBgn(bgn),
  };
}
