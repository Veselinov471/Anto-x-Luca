"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { products } from "@/data/products";
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
  const [selected, setSelected] = useState<string[]>(
    preferredProductId ? [preferredProductId] : [],
  );

  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  useEffect(() => {
    if (!preferredProductId) return;
    setSelected((prev) =>
      prev.includes(preferredProductId) ? prev : [preferredProductId, ...prev],
    );
  }, [preferredProductId]);

  const onFocusForm = () => {
    if (started) return;
    setStarted(true);
    trackEvent("lead_form_start", { form_id: formId });
  };

  const toggleProduct = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    if (selected.length === 0) {
      setStatus("error");
      setError(t("productPlaceholder"));
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const utm = getStoredUtm();

    const payload = {
      email: String(data.get("email") ?? ""),
      firstName: String(data.get("firstName") ?? ""),
      preferredProduct: selected[0],
      preferredProducts: selected,
      consentMarketing: data.get("consentMarketing") === "on",
      website: String(data.get("website") ?? ""),
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      content: utm.content,
      term: utm.term,
      landingVariant: `wave1_${locale}`,
      locale,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !json.ok) {
        throw new Error(json.error || t("errorGeneric"));
      }

      trackEvent("lead_submit", {
        form_id: formId,
        product_id: selected[0],
        product_ids: selected.join(","),
      });
      for (const id of selected) {
        const product = products.find((p) => p.id === id);
        trackEvent("product_interest", {
          product_id: id,
          price: product?.priceEur,
          currency: "EUR",
        });
      }

      setStatus("success");
      form.reset();
      setSelected(preferredProductId ? [preferredProductId] : []);
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
          ? "relative space-y-3 sm:space-y-4"
          : "relative space-y-4 border border-[var(--line)] bg-[var(--bg-elevated)] p-4 sm:space-y-5 sm:p-6 md:p-8"
      }
      noValidate
    >
      <div
        className={`grid sm:grid-cols-2 ${compact ? "gap-3 sm:gap-5" : "gap-4 sm:gap-5"}`}
      >
        <label className="block text-sm">
          <span
            className={`block text-[var(--ink-muted)] ${compact ? "mb-1.5" : "mb-2"}`}
          >
            {t("firstName")}
          </span>
          <input
            name="firstName"
            autoComplete="given-name"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span
            className={`block text-[var(--ink-muted)] ${compact ? "mb-1.5" : "mb-2"}`}
          >
            {t("email")}
          </span>
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

      <fieldset className="block text-sm">
        <legend
          className={`block text-[var(--ink-muted)] ${compact ? "mb-1.5" : "mb-2"}`}
        >
          {t("product")}
        </legend>
        <p className="mb-2 text-[0.75rem] text-[var(--ink-muted)]">
          {t("productHint")}
        </p>
        <div
          className={`grid grid-cols-2 gap-1.5 sm:gap-2 ${compact ? "" : "sm:grid-cols-2"}`}
          role="group"
          aria-label={t("product")}
        >
          {products.map((p) => {
            const checked = selected.includes(p.id);
            return (
              <label
                key={p.id}
                className={`flex min-h-11 cursor-pointer items-center gap-2 border px-2.5 py-2 touch-manipulation transition sm:min-h-12 sm:px-3 ${
                  checked
                    ? "border-[var(--ink)] bg-[color-mix(in_srgb,var(--ink)_6%,white)]"
                    : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
                }`}
              >
                <input
                  type="checkbox"
                  name="preferredProducts"
                  value={p.id}
                  checked={checked}
                  onChange={() => toggleProduct(p.id)}
                  className="size-4 shrink-0 accent-[var(--accent)] touch-manipulation sm:size-[1.05rem]"
                />
                <span className="truncate text-[0.82rem] font-medium text-[var(--ink)] sm:text-sm">
                  {tp(`${p.id}.name`)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden
      >
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
