"use client";

import { useTranslations } from "next-intl";

export function Lifestyle() {
  const t = useTranslations("lifestyle");
  const scenes = [
    { title: t("office"), hint: t("officeHint"), tone: "#2c3330" },
    { title: t("city"), hint: t("cityHint"), tone: "#3a2f2a" },
    { title: t("weekend"), hint: t("weekendHint"), tone: "#2a2834" },
  ];

  return (
    <section id="lifestyle" className="bg-[var(--bg-elevated)] section-y">
      <div className="section-pad mx-auto max-w-6xl">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--ink-muted)] sm:text-xs">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 max-w-lg font-display text-[1.85rem] leading-tight sm:mt-3 sm:text-3xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:mt-4 sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <div className="section-pad mt-8 sm:mt-12 md:mx-auto md:max-w-6xl">
        <div className="snap-x-row -mx-4 px-4 md:mx-0 md:px-0">
          {scenes.map((scene) => (
            <div
              key={scene.title}
              className="snap-x-item relative aspect-[3/4] overflow-hidden"
              style={{
                background: `linear-gradient(150deg, ${scene.tone}, #100e0c)`,
              }}
            >
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                  {t("soon")}
                </p>
                <p className="mt-1 font-display text-2xl">{scene.title}</p>
                <p className="mt-1 text-sm text-white/70">{scene.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
