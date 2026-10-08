"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { products } from "@/data/products";
import { dualPrice } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { captureUtmFromLocation, getStoredUtm } from "@/lib/utm";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "min-h-12 w-full border border-[var(--line)] bg-white px-3 text-base text-[var(--ink)] touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] sm:text-[0.95rem]";

type Props = {
  preferredProductId?: string;
  formId?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

export function LeadForm({
  preferredProductId,
  formId = "waitlist",
  compact = false,
  onSuccess,
}: Props) {
  const t = useTranslations("waitlist");
  const tp = useTranslations("products");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  const onFocusForm = () => {
    if (started) return;
    setStarted(true);
    trackEvent("lead_form_start", { form_id: formId });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const preferredProduct = String(data.get("preferredProduct") ?? "");
    const utm = getStoredUtm();

    const payload = {
      email: String(data.get("email") ?? ""),
      firstName: String(data.get("firstName") ?? ""),
      preferredProduct,
      consentMarketing: data.get("consentMarketing") === "on",
      website: String(data.get("website") ?? ""),
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      content: utm.content,
      term: utm.term,
      landingVariant: `wave1_${locale}`,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !json.ok) {
        throw new Error(json.error || t("errorGeneric"));
      }

      const product = products.find((p) => p.id === preferredProduct);
      trackEvent("lead_submit", {
        form_id: formId,
        product_id: preferredProduct,
      });
      trackEvent("product_interest", {
        product_id: preferredProduct,
        price: product?.priceEur,
        currency: "EUR",
      });

      setStatus("success");
      form.reset();
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("errorUnexpected"));
    }
  }

  if (status === "success") {
    return (
      <div
        className={`fade-in ${compact ? "py-2" : "border border-[var(--line)] bg-[var(--bg-elevated)] p-6 sm:p-8"}`}
        role="status"
      >
        <p className="font-display text-[1.75rem] text-[var(--success)] sm:text-3xl">
          {t("successTitle")}
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--ink-muted)] sm:text-base">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocus={onFocusForm}
      className={
        compact
          ? "relative space-y-4"
          : "relative space-y-4 border border-[var(--line)] bg-[var(--bg-elevated)] p-4 sm:space-y-5 sm:p-6 md:p-8"
      }
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <label className="block text-sm">
          <span className="mb-2 block text-[var(--ink-muted)]">{t("firstName")}</span>
          <input name="firstName" autoComplete="given-name" className={fieldClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-[var(--ink-muted)]">{t("email")}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-2 block text-[var(--ink-muted)]">{t("product")}</span>
        <select
          name="preferredProduct"
          required
          defaultValue={preferredProductId ?? ""}
          className={`${fieldClass} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235c564e' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          }}
        >
          <option value="" disabled>
            {t("productPlaceholder")}
          </option>
          {products.map((p) => {
            const { eurLabel } = dualPrice(p.priceEur);
            return (
              <option key={p.id} value={p.id}>
                {tp(`${p.id}.name`)} — {eurLabel}
              </option>
            );
          })}
        </select>
      </label>

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-[var(--ink-muted)] sm:text-sm">
        <input
          name="consentMarketing"
          type="checkbox"
          required
          className="mt-0.5 size-5 shrink-0 accent-[var(--accent)] touch-manipulation sm:mt-1 sm:size-4"
        />
        <span>
          {t("consent")}{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            {t("privacyLink")}
          </Link>
          .
        </span>
      </label>

      {error ? (
        <p className="text-sm text-[var(--error)]" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={status === "loading"}
        ctaId="waitlist_submit"
        location={formId}
      >
        {status === "loading" ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
