"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-[var(--bg-elevated)]">
      <div
        className="section-pad mx-auto flex max-w-6xl flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between md:py-12"
        style={{ paddingBottom: "max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))" }}
      >
        <div>
          <p className="font-display text-2xl">Italian Touch</p>
          <p className="mt-2 max-w-sm text-[0.9rem] leading-relaxed text-white/70 sm:text-sm">
            {t("tagline")}
          </p>
          <p className="mt-4 text-sm text-white/70">
            {t("emailLabel")}{" "}
            <a
              className="underline underline-offset-2 break-all"
              href="mailto:hello@italiantouch.example"
            >
              hello@italiantouch.example
            </a>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/45">
            {t("companyNote")}
          </p>
        </div>
        <div className="flex flex-col items-start gap-5 md:items-end">
          <LanguageSwitcher />
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/80">
            <Link href="/privacy" className="min-h-10 inline-flex items-center hover:text-white">
              {nav("privacy")}
            </Link>
            <Link href="/cookies" className="min-h-10 inline-flex items-center hover:text-white">
              {nav("cookies")}
            </Link>
            <Link href="/faq" className="min-h-10 inline-flex items-center hover:text-white">
              {nav("faq")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
