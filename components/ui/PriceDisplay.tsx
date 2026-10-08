"use client";

import { useEffect, useRef } from "react";
import { dualPrice } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";

type Props = {
  priceEur: number;
  productId?: string;
  className?: string;
  light?: boolean;
};

export function PriceDisplay({
  priceEur,
  productId,
  className = "",
  light = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { eurLabel } = dualPrice(priceEur);

  useEffect(() => {
    if (!productId || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("price_view", {
            product_id: productId,
            price: priceEur,
            currency: "EUR",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [productId, priceEur]);

  return (
    <div ref={ref} className={className}>
      <span
        className={`text-[0.95rem] font-medium tabular-nums sm:text-lg ${light ? "text-white" : "text-[var(--ink)]"}`}
      >
        {eurLabel}
      </span>
    </div>
  );
}
