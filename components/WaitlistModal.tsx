"use client";

import { useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { LeadForm } from "@/components/LeadForm";
import { PreorderOffer } from "@/components/PreorderOffer";

type Props = {
  open: boolean;
  productId: string | null;
  onClose: () => void;
};

export function WaitlistModal({ open, productId, onClose }: Props) {
  const t = useTranslations("waitlist");
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-3 sm:px-6"
      style={{
        paddingTop: "max(0.5rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(18,14,12,0.48)] backdrop-blur-[8px]"
        aria-label={t("modalClose")}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[0_24px_80px_rgba(18,14,12,0.28)] sm:max-h-[min(92dvh,44rem)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              {t("eyebrow")}
            </p>
            <h2
              id={titleId}
              className="mt-0.5 font-display text-[1.4rem] leading-tight sm:mt-1 sm:text-2xl"
            >
              {t("modalTitle")}
            </h2>
            <p className="mt-1 text-[0.85rem] leading-snug text-[var(--ink-muted)] sm:text-sm">
              {t("modalSubtitle")}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center text-2xl leading-none text-[var(--ink-muted)] transition hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:size-11"
            aria-label={t("modalClose")}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-3 sm:px-6 sm:py-5">
          <div className="mb-3 sm:mb-5">
            <PreorderOffer prominent />
          </div>
          <LeadForm
            key={productId ?? "any"}
            preferredProductId={productId ?? undefined}
            formId="waitlist_modal"
            compact
            onSuccess={() => {
              /* keep modal open to show success state inside the form */
            }}
          />
        </div>
      </div>
    </div>
  );
}
