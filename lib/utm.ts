export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

const UTM_KEY = "axl_utm_v1";

export function captureUtmFromLocation(): UtmParams {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const utm: UtmParams = {
    source: sp.get("utm_source") ?? undefined,
    medium: sp.get("utm_medium") ?? undefined,
    campaign: sp.get("utm_campaign") ?? undefined,
    content: sp.get("utm_content") ?? undefined,
    term: sp.get("utm_term") ?? undefined,
  };
  if (Object.values(utm).some(Boolean)) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  }
  return getStoredUtm();
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    if (!raw) {
      return captureFromUrlOnly();
    }
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}

function captureFromUrlOnly(): UtmParams {
  const sp = new URLSearchParams(window.location.search);
  return {
    source: sp.get("utm_source") ?? undefined,
    medium: sp.get("utm_medium") ?? undefined,
    campaign: sp.get("utm_campaign") ?? undefined,
    content: sp.get("utm_content") ?? undefined,
    term: sp.get("utm_term") ?? undefined,
  };
}
