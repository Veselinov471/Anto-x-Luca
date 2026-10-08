"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="inline-flex items-center rounded-sm border border-current/25 p-0.5"
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            className={`min-h-10 min-w-10 touch-manipulation px-2.5 text-[0.65rem] uppercase tracking-[0.16em] transition sm:min-h-9 sm:min-w-9 ${
              active
                ? "bg-current/15 text-current"
                : "opacity-55 hover:opacity-100"
            }`}
            aria-current={active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: code })}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
