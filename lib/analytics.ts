type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  );

  if (window.gtag) {
    window.gtag("event", name, cleaned);
  }

  if (window.fbq) {
    const metaMap: Record<string, string> = {
      lead_submit: "Lead",
      page_view: "PageView",
    };
    const metaName = metaMap[name] ?? name;
    if (name === "lead_submit") {
      window.fbq("track", "Lead", cleaned);
    } else if (name !== "page_view") {
      window.fbq("trackCustom", metaName, cleaned);
    }
  }
}

export function trackPageView() {
  trackEvent("page_view", { page_path: window.location.pathname, locale: "bg" });
  if (window.fbq) {
    window.fbq("track", "PageView");
  }
}
