import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookies" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cookies");

  return (
    <main className="section-pad mx-auto max-w-3xl py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-4xl">{t("title")}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--ink-muted)]">
        <p className="rounded border border-[var(--line)] bg-[var(--bg-elevated)] p-4 text-[var(--ink)]">
          {t("banner")}
        </p>
        <p>
          <strong className="text-[var(--ink)]">{t("necessary")}</strong>{" "}
          {t("necessaryBody")}
        </p>
        <p>
          <strong className="text-[var(--ink)]">{t("analytics")}</strong>{" "}
          {t("analyticsBody")}
        </p>
        <p>
          <strong className="text-[var(--ink)]">{t("marketing")}</strong>{" "}
          {t("marketingBody")}
        </p>
      </div>
      <Link href="/" className="mt-10 inline-block text-sm underline">
        {t("back")}
      </Link>
    </main>
  );
}
