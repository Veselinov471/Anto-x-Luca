"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WaitlistModal } from "@/components/WaitlistModal";

const HERO_SLIDES = [
  {
    src: "/images/hero-handbag-1.jpg",
    position: "object-[72%_38%] md:object-[68%_42%]",
  },
  {
    src: "/images/hero-handbag-2.jpg",
    position: "object-[48%_28%] md:object-[50%_35%]",
  },
  {
    src: "/images/hero-handbag-3.jpg",
    position: "object-[58%_32%] md:object-[55%_40%]",
  },
] as const;

const AUTO_MS = 5500;

export function Hero() {
  const t = useTranslations("hero");
  const nav = useTranslations("nav");
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, index]);

  const goTo = useCallback((i: number) => {
    setIndex(i);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (Math.abs(delta) < 48) return;
    setIndex((i) =>
      delta < 0
        ? (i + 1) % HERO_SLIDES.length
        : (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };

  return (
    <header
      className="relative min-h-[100svh] overflow-hidden bg-[#1a1412] text-[var(--bg-elevated)]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="absolute inset-0"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("slideshowLabel")}
      >
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            } ${i === index && !reduceMotion ? "hero-kenburns" : ""}`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${slide.position}`}
            />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,14,12,0.55) 0%, rgba(18,14,12,0.28) 28%, rgba(18,14,12,0.45) 58%, rgba(18,14,12,0.88) 100%), linear-gradient(105deg, rgba(18,14,12,0.72) 0%, rgba(18,14,12,0.35) 55%, rgba(18,14,12,0.2) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div
        className="section-pad relative z-10 flex min-h-[100svh] flex-col justify-between"
        style={{
          paddingTop: "max(1.25rem, var(--safe-top))",
          paddingBottom: "max(1.25rem, var(--safe-bottom))",
        }}
      >
        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="font-display text-[1.35rem] tracking-wide sm:text-2xl md:text-3xl">
            Italian Touch
          </p>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="hidden min-h-11 items-center text-xs uppercase tracking-[0.18em] text-white/80 hover:text-white sm:inline-flex"
            >
              {nav("earlyAccess")}
            </button>
          </div>
        </div>

        <div className="reveal max-w-xl pb-2 pt-10 sm:pb-10 sm:pt-16 md:pb-20 md:pt-24">
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.26em] text-white/70 sm:mb-4 sm:text-xs sm:tracking-[0.28em]">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-[clamp(2.05rem,8.2vw,4.6rem)] leading-[1.06] text-balance">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/85 sm:mt-5 sm:text-base md:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="primary"
              className="w-full bg-white text-[var(--ink)] hover:bg-[var(--bg)] sm:w-auto"
              ctaId="hero_waitlist"
              location="hero"
              onClick={() => setWaitlistOpen(true)}
            >
              {t("ctaWaitlist")}
            </Button>
            <Button
              href="#collection"
              variant="secondary"
              className="w-full border-white/70 text-white hover:bg-white hover:text-[var(--ink)] sm:w-auto"
              ctaId="hero_browse"
              location="hero"
            >
              {t("ctaBrowse")}
            </Button>
          </div>

          <div
            className="mt-8 flex items-center gap-1 sm:mt-10"
            role="tablist"
            aria-label={t("slideshowLabel")}
          >
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={t("goToSlide", { index: i + 1 })}
                onClick={() => goTo(i)}
                className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-7 bg-white sm:w-8" : "w-1.5 bg-white/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <WaitlistModal
        open={waitlistOpen}
        productId={null}
        onClose={() => setWaitlistOpen(false)}
      />
    </header>
  );
}
