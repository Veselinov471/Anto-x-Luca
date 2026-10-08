import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { routing } from "@/i18n/routing";
import { locales } from "@/i18n/config";
import "../globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const path = locale === "bg" ? "" : `/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s · Anto x Luca`,
    },
    description: t("description"),
    alternates: {
      canonical: `${siteUrl}${path || "/"}`,
      languages: {
        bg: siteUrl,
        en: `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "bg" ? "bg_BG" : "en_GB",
      url: `${siteUrl}${path || "/"}`,
      siteName: "Anto x Luca",
      title: t("title"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
