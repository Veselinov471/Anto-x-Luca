"use client";

import { useTranslations } from "next-intl";

type Props = {
  /** Stronger treatment for the modal (first thing they see). */
  prominent?: boolean;
};

export function PreorderOffer({ prominent = false }: Props) {
  const t = useTranslations("waitlist");

  return (
    <aside
      className={`relative overflow-hidden border border-[var(--accent)]/25 ${
        prominent
          ? "bg-[color-mix(in_srgb,var(--accent)_9%,var(--bg-elevated))] px-4 py-4 sm:px-5 sm:py-5"
          : "bg-[color-mix(in_srgb,var(--accent)_7%,var(--bg))] px-4 py-3.5 sm:px-5 sm:py-4"
      }`}
      aria-label={t("offerAria")}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 bg-[var(--accent)]"
        aria-hidden
      />
      <div className="pl-3 sm:pl-4">
        <p
          className={`font-display leading-none tracking-tight text-[var(--accent)] ${
            prominent
              ? "text-[clamp(2.4rem,8vw,3.25rem)]"
              : "text-[clamp(2rem,6vw,2.75rem)]"
          }`}
        >
          {t("offerPercent")}
        </p>
        <p className="mt-2 font-display text-lg leading-snug text-[var(--ink)] sm:text-xl">
          {t("offerHeadline")}
        </p>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--ink-muted)]">
          {t("offerBody")}
        </p>
      </div>
    </aside>
  );
}
