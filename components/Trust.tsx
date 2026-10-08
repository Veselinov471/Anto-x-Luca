"use client";

import { useTranslations } from "next-intl";

export function Trust() {
  const t = useTranslations("trust");
  const keys = ["italy", "support", "price", "policies"] as const;

  return (
    <section id="trust" className="section-pad section-y">
      <div className="mx-auto max-w-6xl">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:text-xs">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 max-w-xl font-display text-[1.85rem] leading-tight sm:mt-3 sm:text-3xl md:text-5xl">
          {t("title")}
        </h2>
        <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-8 sm:grid-cols-2">
          {keys.map((key) => (
            <div key={key} className="border-t border-[var(--line)] pt-4 sm:pt-5">
              <h3 className="font-display text-[1.45rem] sm:text-2xl">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:mt-3 sm:text-sm">
                {t(`items.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
