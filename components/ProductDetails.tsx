"use client";

import { useTranslations } from "next-intl";
import { products } from "@/data/products";

export function ProductDetails() {
  const t = useTranslations("details");
  const tp = useTranslations("products");

  return (
    <section id="details" className="section-pad section-y">
      <div className="mx-auto max-w-6xl">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:text-xs">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 max-w-xl font-display text-[1.85rem] leading-tight sm:mt-3 sm:text-3xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:mt-4 sm:text-sm">
          {t("subtitle")}
        </p>
        <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)] sm:mt-12">
          {products.map((p) => (
            <div
              key={p.id}
              className="grid gap-3 py-6 sm:py-8 md:grid-cols-[160px_1fr] md:gap-10"
            >
              <p className="font-display text-xl">{tp(`${p.id}.name`)}</p>
              <dl className="grid gap-3 text-sm text-[var(--ink-muted)] sm:grid-cols-2 sm:gap-2">
                <div>
                  <dt className="text-[var(--ink)]">{t("material")}</dt>
                  <dd className="mt-0.5">{tp(`${p.id}.material`)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink)]">{t("dimensions")}</dt>
                  <dd className="mt-0.5">{tp(`${p.id}.dimensions`)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink)]">{t("intendedUse")}</dt>
                  <dd className="mt-0.5">{tp(`${p.id}.intendedUse`)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--ink)]">{t("origin")}</dt>
                  <dd className="mt-0.5">{p.madeInItaly ? t("originValue") : "—"}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
