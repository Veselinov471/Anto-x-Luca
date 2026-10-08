import { getTranslations } from "next-intl/server";

export async function WhyItaly() {
  const t = await getTranslations("whyItaly");

  return (
    <section id="why-italy" className="bg-[var(--ink)] text-[var(--bg-elevated)]">
      <div className="section-pad section-y mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-16">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/60 sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-[1.85rem] leading-tight text-balance sm:mt-3 sm:text-3xl md:text-5xl">
            {t("title")}
          </h2>
        </div>
        <div className="space-y-4 text-[0.95rem] leading-relaxed text-white/80 sm:space-y-5 sm:text-base">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <ul className="space-y-3 border-t border-white/15 pt-5 text-sm">
            <li>{t("li1")}</li>
            <li>{t("li2")}</li>
            <li>{t("li3")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
