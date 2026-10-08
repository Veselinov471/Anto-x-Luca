"use client";

import { useEffect } from "react";
import { ConsentBanner, useConsentState } from "@/components/ConsentBanner";
import { trackPageView } from "@/lib/analytics";
import { captureUtmFromLocation } from "@/lib/utm";
import { readConsent } from "@/lib/consent";

function loadGa(id: string) {
  if (document.getElementById("ga-gtag")) return;
  const s = document.createElement("script");
  s.id = "ga-gtag";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

function loadMeta(id: string) {
  if (document.getElementById("meta-pixel")) return;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const f = window as any;
  if (f.fbq) return;
  const n: any = (f.fbq = function (...args: unknown[]) {
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
  });
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const s = document.createElement("script");
  s.id = "meta-pixel";
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq?.("init", id);
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const consent = useConsentState();

  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  useEffect(() => {
    const current = readConsent();
    if (!current) return;

    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

    if (current.analytics && gaId) {
      loadGa(gaId);
    }
    if (current.marketing && pixelId) {
      loadMeta(pixelId);
    }
    if (current.analytics || current.marketing) {
      trackPageView();
    }
  }, [consent.analytics, consent.marketing]);

  return (
    <>
      {children}
      <ConsentBanner />
    </>
  );
}
