"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { products, type Product } from "@/data/products";
import { ProductPhoto } from "@/components/ui/ProductPlaceholder";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Button } from "@/components/ui/Button";
import { WaitlistModal } from "@/components/WaitlistModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { trackEvent } from "@/lib/analytics";

function ProductCard({
  product,
  position,
  featured = false,
  onOpenDetails,
  onWantModel,
}: {
  product: Product;
  position: number;
  /** Desktop-only: larger card on a 2-up row. */
  featured?: boolean;
  onOpenDetails: (productId: string, colorIndex: number) => void;
  onWantModel: (productId: string) => void;
}) {
  const t = useTranslations("collection");
  const tp = useTranslations(`products.${product.id}`);
  const tc = useTranslations("colors");
  const ref = useRef<HTMLElement>(null);
  const name = tp("name");
  const [colorIndex, setColorIndex] = useState(0);
  const color = product.colors[colorIndex] ?? product.colors[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("product_view", {
            product_id: product.id,
            product_name: name,
            price: product.priceEur,
            currency: "EUR",
            position,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product, position, name]);

  const openDetails = () => {
    trackEvent("product_click", {
      product_id: product.id,
      product_name: name,
      price: product.priceEur,
      currency: "EUR",
      position,
      source: "image",
    });
    onOpenDetails(product.id, colorIndex);
  };

  const openWaitlist = () => {
    trackEvent("product_click", {
      product_id: product.id,
      product_name: name,
      price: product.priceEur,
      currency: "EUR",
      position,
      source: "button",
    });
    onWantModel(product.id);
  };

  return (
    <article
      ref={ref}
      id={product.slug}
      className={`group flex h-full flex-col ${
        featured ? "lg:col-span-3" : "lg:col-span-2"
      }`}
    >
      <button
        type="button"
        onClick={openDetails}
        aria-label={t("openDetails", { name })}
        className="relative block w-full touch-manipulation text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
      >
        <ProductPhoto
          src={color.image}
          alt={`${name}, ${tc(color.id)}`}
          priority={position <= 2}
          featured={featured}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[rgba(18,14,12,0.5)] to-transparent pb-3 pt-10 opacity-100 transition duration-500 sm:opacity-0 sm:group-hover:opacity-100">
          <span className="text-[0.65rem] uppercase tracking-[0.18em] text-white/95 lg:text-[0.7rem]">
            {t("viewDetails")}
          </span>
        </span>
      </button>
      <div
        className="mt-2 flex flex-wrap sm:mt-3"
        role="group"
        aria-label={t("colorsLabel")}
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
              className="flex size-9 items-center justify-center touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:size-11"
            >
              <span
                className={`size-3 rounded-full ring-1 ring-black/20 sm:size-3.5 ${
                  selected
                    ? "ring-2 ring-[var(--ink)] ring-offset-1 sm:ring-offset-2"
                    : ""
                }`}
                style={{ backgroundColor: option.swatch }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex flex-1 flex-col space-y-1.5 sm:mt-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-display leading-tight ${
              featured
                ? "text-[1.15rem] sm:text-2xl lg:text-[2.15rem]"
                : "text-[1.15rem] sm:text-2xl"
            }`}
          >
            {name}
          </h3>
          {product.madeInItaly ? (
            <span className="mt-1 hidden shrink-0 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-muted)] sm:inline">
              {t("madeInItaly")}
            </span>
          ) : null}
        </div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          {tc(color.id)}
        </p>
        <p
          className={`hidden leading-relaxed text-[var(--ink-muted)] sm:block ${
            featured ? "text-sm lg:text-[1.05rem]" : "text-sm"
          }`}
        >
          {tp("shortDescription")}
        </p>
        <p className="hidden text-sm text-[var(--ink-muted)] sm:block">
          {tp("material")}
        </p>
        <PriceDisplay
          priceEur={product.priceEur}
          productId={product.id}
          className={
            featured ? "lg:[&_span]:text-xl" : undefined
          }
        />
        <Button
          type="button"
          variant="secondary"
          className="mt-auto w-full px-2 text-[0.78rem] sm:mt-0 sm:w-auto sm:px-6 sm:text-sm"
          ctaId={`product_${product.id}`}
          location="collection"
          onClick={openWaitlist}
        >
          {t("cta")}
        </Button>
      </div>
    </article>
  );
}

export function ProductCollection() {
  const t = useTranslations("collection");
  const [detail, setDetail] = useState<{
    productId: string;
    colorIndex: number;
  } | null>(null);
  const [waitlistProductId, setWaitlistProductId] = useState<string | null>(
    null,
  );

  const detailProduct =
    products.find((p) => p.id === detail?.productId) ?? null;

  return (
    <section id="collection" className="section-pad section-y">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-[1.85rem] leading-tight text-balance sm:mt-3 sm:text-3xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:mt-4 sm:text-base">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-14 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-6 lg:gap-x-10 lg:gap-y-14">
          {products.map((product, index) => {
            const featured =
              index < 2 || index >= products.length - 2;
            return (
              <ProductCard
                key={product.id}
                product={product}
                position={index + 1}
                featured={featured}
                onOpenDetails={(productId, colorIndex) =>
                  setDetail({ productId, colorIndex })
                }
                onWantModel={setWaitlistProductId}
              />
            );
          })}
        </div>
      </div>

      <ProductDetailModal
        open={detail != null}
        product={detailProduct}
        initialColorIndex={detail?.colorIndex ?? 0}
        onClose={() => setDetail(null)}
        onWantModel={(productId) => {
          setDetail(null);
          setWaitlistProductId(productId);
        }}
      />

      <WaitlistModal
        open={waitlistProductId != null}
        productId={waitlistProductId}
        onClose={() => setWaitlistProductId(null)}
      />
    </section>
  );
}
