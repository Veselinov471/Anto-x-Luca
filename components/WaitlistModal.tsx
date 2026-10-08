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
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(18,14,12,0.55)] backdrop-blur-[2px]"
        aria-label={t("modalClose")}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)] sm:max-h-[90vh]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
              {t("eyebrow")}
            </p>
            <h2
              id={titleId}
              className="mt-1 font-display text-[1.55rem] leading-tight sm:text-2xl"
            >
              {t("modalTitle")}
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              {t("modalSubtitle")}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center text-2xl leading-none text-[var(--ink-muted)] transition hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            aria-label={t("modalClose")}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="mb-4 sm:mb-5">
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
