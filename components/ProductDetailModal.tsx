"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";

type Props = {
  open: boolean;
  product: Product | null;
  initialColorIndex?: number;
  onClose: () => void;
  onWantModel: (productId: string) => void;
};

export function ProductDetailModal({
  open,
  product,
  initialColorIndex = 0,
  onClose,
  onWantModel,
}: Props) {
  const t = useTranslations("productDetail");
  const tc = useTranslations("colors");
  const tp = useTranslations(
    product ? `products.${product.id}` : "products.PRODUCT_01",
  );
  const closeRef = useRef<HTMLButtonElement>(null);
  const [colorIndex, setColorIndex] = useState(initialColorIndex);

  useEffect(() => {
    if (open) setColorIndex(initialColorIndex);
  }, [open, initialColorIndex, product?.id]);

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

  if (!open || !product) return null;

  const name = tp("name");
  const color = product.colors[colorIndex] ?? product.colors[0];
  const specs = [
    { label: t("material"), value: tp("material") },
    { label: t("dimensions"), value: tp("dimensions") },
    { label: t("intendedUse"), value: tp("intendedUse") },
    { label: t("hardware"), value: tp("hardware") },
    { label: t("closure"), value: tp("closure") },
    { label: t("carry"), value: tp("carry") },
    {
      label: t("origin"),
      value: product.madeInItaly ? t("originValue") : "—",
    },
  ] as const;

  const openWaitlist = () => {
    trackEvent("product_click", {
      product_id: product.id,
      product_name: name,
      price: product.priceEur,
      currency: "EUR",
      source: "detail_modal_cta",
    });
    onWantModel(product.id);
  };

  const swatches = (
    <div
      className="flex flex-wrap gap-0.5 sm:gap-1.5"
      role="group"
      aria-label={t("colours")}
    >
      {product.colors.map((option, i) => {
        const selected = i === colorIndex;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            aria-label={tc(option.id)}
            onClick={() => setColorIndex(i)}
            className="flex size-7 items-center justify-center touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:size-9"
          >
            <span
              className={`size-3 rounded-full ring-1 ring-black/20 transition sm:size-3.5 ${
                selected
                  ? "scale-110 ring-2 ring-[var(--ink)] ring-offset-1 sm:ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: option.swatch }}
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 md:p-6">
      <button
        type="button"
        className="product-detail-backdrop absolute inset-0 bg-[rgba(18,14,12,0.62)] backdrop-blur-[3px]"
        aria-label={t("close")}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={name}
        className="product-detail-panel relative z-10 flex max-h-[min(92dvh,100%)] w-full max-w-5xl flex-col overflow-y-auto overscroll-contain rounded-2xl bg-[var(--bg-elevated)] shadow-[0_28px_80px_rgba(18,14,12,0.28)] sm:rounded-3xl md:h-[min(90vh,720px)] md:max-h-[90vh] md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:overflow-hidden"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-20 flex size-10 items-center justify-center bg-[var(--bg-elevated)]/95 text-2xl leading-none text-[var(--ink-muted)] shadow-sm backdrop-blur-sm transition hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] md:right-4 md:top-4"
          aria-label={t("close")}
        >
          ×
        </button>

        {/* Mobile: image + identity in one compact row */}
        <div className="grid shrink-0 grid-cols-[34%_1fr] gap-2.5 border-b border-[var(--line)] p-3 pr-12 md:hidden">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe6de]">
            <Image
              key={`m-${color.image}`}
              src={color.image}
              alt={`${name}, ${tc(color.id)}`}
              fill
              priority
              sizes="38vw"
              className="product-detail-image object-cover object-center"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-between gap-2 py-0.5">
            <div>
              <p className="text-[clamp(0.62rem,2.4vw,0.72rem)] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                {t("eyebrow")}
                {product.madeInItaly ? (
                  <>
                    <span className="mx-1 text-[var(--line)]" aria-hidden>
                      ·
                    </span>
                    {t("originBadge")}
                  </>
                ) : null}
              </p>
              <h2 className="mt-1 font-display text-[clamp(1.35rem,6.2vw,1.7rem)] leading-none tracking-tight">
                {name}
              </h2>
              <p className="mt-1.5 text-[clamp(0.72rem,2.8vw,0.85rem)] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                {tc(color.id)}
              </p>
              <div className="mt-2">{swatches}</div>
            </div>
            <PriceDisplay
              priceEur={product.priceEur}
              productId={product.id}
              className="[&_span]:text-[clamp(1.05rem,4.2vw,1.25rem)]"
            />
          </div>
        </div>

        {/* Desktop image — height follows content column */}
        <div className="relative hidden min-h-[min(68vh,560px)] overflow-hidden bg-[#ebe6de] md:block">
          <Image
            key={`d-${color.image}`}
            src={color.image}
            alt={`${name}, ${tc(color.id)}`}
            fill
            priority
            sizes="52vw"
            className="product-detail-image object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(18,14,12,0.08)]"
            aria-hidden
          />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="bg-[var(--bg-elevated)]/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--ink)] backdrop-blur-sm">
              {t("eyebrow")}
            </span>
            {product.madeInItaly ? (
              <span className="bg-[var(--ink)]/80 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--bg-elevated)] backdrop-blur-sm">
                {t("originBadge")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Details — height hugs content; scrolls only when needed */}
        <div className="relative flex min-h-0 flex-col md:overflow-y-auto">
          <div className="hidden items-start justify-between gap-3 border-b border-[var(--line)] px-6 py-4 pr-16 md:flex">
            <div
              className="min-w-0 product-detail-rise"
              style={{ animationDelay: "60ms" }}
            >
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                {tc(color.id)}
                <span className="mx-1.5 text-[var(--line)]" aria-hidden>
                  ·
                </span>
                {t("colourCount", { count: product.colors.length })}
              </p>
              <h2 className="mt-1 font-display text-[clamp(1.75rem,3.5vw,2.35rem)] leading-none tracking-tight">
                {name}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-3 py-3 sm:gap-5 sm:px-6 sm:py-5">
            <div
              className="product-detail-rise"
              style={{ animationDelay: "120ms" }}
            >
              <p className="text-[clamp(0.68rem,2.4vw,0.75rem)] uppercase tracking-[0.18em] text-[var(--accent)]">
                {t("summaryLabel")}
              </p>
              <p className="mt-1.5 text-[clamp(0.92rem,3.4vw,1.08rem)] leading-[1.45] text-[var(--ink)] sm:mt-2 sm:leading-[1.65]">
                {tp("summary")}
              </p>
            </div>

            <div
              className="product-detail-rise hidden md:block"
              style={{ animationDelay: "160ms" }}
            >
              {swatches}
            </div>

            <div
              className="product-detail-rise"
              style={{ animationDelay: "200ms" }}
            >
              <p className="text-[clamp(0.68rem,2.4vw,0.75rem)] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                {t("specsLabel")}
              </p>
              <dl className="mt-1.5 divide-y divide-[var(--line)] border-y border-[var(--line)] sm:mt-3">
                {specs.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[minmax(6.5rem,32%)_1fr] gap-2 py-[0.45rem] text-[clamp(0.84rem,3vw,0.98rem)] leading-snug sm:grid-cols-[9rem_1fr] sm:gap-3 sm:py-2.5 sm:leading-normal"
                  >
                    <dt className="text-[var(--ink-muted)]">{row.label}</dt>
                    <dd className="font-medium text-[var(--ink)]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="product-detail-rise shrink-0 border-t border-[var(--line)] pt-3 sm:pt-4"
              style={{ animationDelay: "260ms" }}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                <div className="hidden md:block">
                  <PriceDisplay
                    priceEur={product.priceEur}
                    productId={product.id}
                    className="[&_span]:text-[clamp(1.1rem,2.2vw,1.35rem)]"
                  />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  className="min-h-11 w-full px-3 text-[clamp(0.88rem,3.2vw,1rem)] sm:min-h-12 sm:px-6 md:w-auto"
                  ctaId={`product_detail_${product.id}`}
                  location="product_detail_modal"
                  onClick={openWaitlist}
                >
                  {t("cta")}
                </Button>
              </div>
              <p className="mt-1.5 text-[clamp(0.72rem,2.6vw,0.85rem)] leading-snug text-[var(--ink-muted)] sm:mt-3">
                {t("hint")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
