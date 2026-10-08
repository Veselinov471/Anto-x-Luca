export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "axl_consent_v1";

export const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(
  partial: Pick<ConsentState, "analytics" | "marketing">,
): ConsentState {
  const next: ConsentState = {
    necessary: true,
    analytics: partial.analytics,
    marketing: partial.marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("axl:consent", { detail: next }));
  return next;
}

export function hasAnsweredConsent(): boolean {
  return readConsent() != null;
}
