"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { faqIds } from "@/data/products";
import { trackEvent } from "@/lib/analytics";

type Props = {
  /** Dedicated FAQ page uses h1 and page padding. */
  standalone?: boolean;
};

export function Faq({ standalone = false }: Props) {
  const t = useTranslations("faq");
  const [openId, setOpenId] = useState<string | null>(null);
  const Heading = standalone ? "h1" : "h2";

  return (
    <section
      id="faq"
      className={
        standalone
          ? "section-pad bg-[var(--bg)] pt-10 pb-6 sm:pt-14 sm:pb-8"
          : "bg-[var(--bg-elevated)] section-y"
      }
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:text-xs">
          {t("eyebrow")}
        </p>
        <Heading className="mt-2 font-display text-[1.85rem] leading-tight sm:mt-3 sm:text-3xl md:text-5xl">
          {t("title")}
        </Heading>
        <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)] sm:mt-10">
          {faqIds.map((id) => {
            const open = openId === id;
            return (
              <div key={id}>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:min-h-0 sm:py-5"
                  aria-expanded={open}
                  onClick={() => {
                    const next = open ? null : id;
                    setOpenId(next);
                    if (!open) {
                      trackEvent("faq_open", { faq_id: id });
                    }
                  }}
                >
                  <span className="pr-2 text-[0.95rem] font-medium leading-snug sm:text-base">
                    {t(`items.${id}.q`)}
                  </span>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center text-xl text-[var(--ink-muted)]"
                    aria-hidden
                  >
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <p className="pb-5 text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:text-sm">
                    {t(`items.${id}.a`)}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
