"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  defaultConsent,
  hasAnsweredConsent,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";
import { Link } from "@/i18n/routing";

type Props = {
  onChange?: (consent: ConsentState) => void;
};

const CONSENT_OFFSET = "5.75rem";

function setConsentOffset(on: boolean) {
  const value = on
    ? `calc(${CONSENT_OFFSET} + env(safe-area-inset-bottom, 0px))`
    : "0px";
  document.documentElement.style.setProperty("--consent-offset", value);
  document.body.style.paddingBottom = on ? value : "";
}

export function ConsentBanner({ onChange }: Props) {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = !hasAnsweredConsent();
    setVisible(shown);
    setConsentOffset(shown);
    return () => {
      setConsentOffset(false);
    };
  }, []);

  const save = (analytics: boolean, marketing: boolean) => {
    const next = writeConsent({ analytics, marketing });
    onChange?.(next);
    setVisible(false);
    setConsentOffset(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2.5 shadow-[var(--shadow-soft)] sm:px-4 sm:py-3 md:px-5"
      style={{ paddingBottom: "max(0.6rem, env(safe-area-inset-bottom, 0px))" }}
      role="dialog"
      aria-label={t("aria")}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <p className="max-w-2xl text-[0.75rem] leading-snug text-[var(--ink-muted)] sm:hidden">
          {t("shortBody")}{" "}
          <Link href="/cookies" className="underline underline-offset-2">
            {t("policy")}
          </Link>
          .
        </p>
        <p className="hidden max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)] sm:block">
          {t("body")}{" "}
          <Link href="/cookies" className="underline underline-offset-2">
            {t("policy")}
          </Link>
          .
        </p>
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
          <button
            type="button"
            className="min-h-10 touch-manipulation border border-[var(--ink)] px-3 text-[0.8rem] sm:min-h-12 sm:text-sm"
            onClick={() => save(false, false)}
          >
            {t("necessary")}
          </button>
          <button
            type="button"
            className="min-h-10 touch-manipulation bg-[var(--ink)] px-3 text-[0.8rem] text-[var(--bg-elevated)] sm:min-h-12 sm:text-sm"
            onClick={() => save(true, true)}
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConsentState() {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  useEffect(() => {
    setConsent(readConsent() ?? defaultConsent);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      setConsent(detail);
    };
    window.addEventListener("axl:consent", handler);
    return () => window.removeEventListener("axl:consent", handler);
  }, []);
  return consent;
}
