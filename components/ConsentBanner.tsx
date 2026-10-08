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

export function ConsentBanner({ onChange }: Props) {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = !hasAnsweredConsent();
    setVisible(shown);
    if (shown) {
      document.body.style.paddingBottom =
        "calc(9.5rem + env(safe-area-inset-bottom, 0px))";
    }
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, []);

  const save = (analytics: boolean, marketing: boolean) => {
    const next = writeConsent({ analytics, marketing });
    onChange?.(next);
    setVisible(false);
    document.body.style.paddingBottom = "";
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--bg-elevated)] px-4 pt-4 shadow-[var(--shadow-soft)] md:px-5 md:pt-5"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      role="dialog"
      aria-label={t("aria")}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <p className="max-w-2xl text-[0.85rem] leading-relaxed text-[var(--ink-muted)] sm:text-sm">
          {t("body")}{" "}
          <Link href="/cookies" className="underline underline-offset-2">
            {t("policy")}
          </Link>
          .
        </p>
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
          <button
            type="button"
            className="min-h-12 touch-manipulation border border-[var(--ink)] px-3 text-[0.85rem] sm:text-sm"
            onClick={() => save(false, false)}
          >
            {t("necessary")}
          </button>
          <button
            type="button"
            className="min-h-12 touch-manipulation bg-[var(--ink)] px-3 text-[0.85rem] text-[var(--bg-elevated)] sm:text-sm"
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
