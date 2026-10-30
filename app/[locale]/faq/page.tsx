import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Faq } from "@/components/Faq";
import { SiteFooter } from "@/components/SiteFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("title"),
    description: t("eyebrow"),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <>
      <main>
        <Faq standalone />
        <div className="section-pad mx-auto max-w-3xl pb-12 sm:pb-16">
          <Link href="/" className="inline-block text-sm underline underline-offset-2">
            {t("back")}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
