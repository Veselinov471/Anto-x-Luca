"use client";

import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/LeadForm";
import { PreorderOffer } from "@/components/PreorderOffer";

export function FinalCta() {
  const t = useTranslations("waitlist");

  return (
    <section id="waitlist" className="section-pad section-y scroll-mt-4">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1.1fr] md:items-start md:gap-10">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-[1.85rem] leading-tight text-balance sm:mt-3 sm:text-3xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:mt-4 sm:text-base">
            {t("subtitle")}
          </p>
          <div className="mt-6 max-w-md">
            <PreorderOffer />
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
