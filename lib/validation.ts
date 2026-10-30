import { z } from "zod";
import { products } from "@/data/products";
import { apiMessage, resolveLocale, type ApiMessageKey } from "@/lib/api-messages";
import type { Locale } from "@/i18n/config";

const productIds = products.map((p) => p.id) as [string, ...string[]];

export function createLeadSchema(locale: Locale) {
  const t = (key: ApiMessageKey) => apiMessage(locale, key);

  return z
    .object({
      email: z.email(t("emailInvalid")),
      firstName: z
        .string()
        .trim()
        .max(80, t("nameTooLong"))
        .optional()
        .or(z.literal("")),
      /** Legacy single-select field */
      preferredProduct: z.enum(productIds).optional(),
      /** Checkbox multi-select */
      preferredProducts: z.array(z.enum(productIds)).optional(),
      consentMarketing: z.literal(true, {
        error: t("consentRequired"),
      }),
      /** Honeypot — must stay empty */
      website: z.string().max(0).optional().or(z.literal("")),
      source: z.string().max(100).optional(),
      campaign: z.string().max(200).optional(),
      medium: z.string().max(100).optional(),
      content: z.string().max(200).optional(),
      term: z.string().max(200).optional(),
      landingVariant: z.string().max(100).optional(),
      locale: z.string().max(10).optional(),
    })
    .superRefine((data, ctx) => {
      const selected = [
        ...(data.preferredProducts ?? []),
        ...(data.preferredProduct ? [data.preferredProduct] : []),
      ];
      const unique = [...new Set(selected)];
      if (unique.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["preferredProducts"],
          message: t("productRequired"),
        });
      }
    })
    .transform((data) => {
      const selected = [
        ...(data.preferredProducts ?? []),
        ...(data.preferredProduct ? [data.preferredProduct] : []),
      ];
      const unique = [...new Set(selected)];
      return {
        ...data,
        preferredProducts: unique,
        preferredProduct: unique[0]!,
      };
    });
}

/** Default BG schema for callers that don’t pass a locale. */
export const leadSchema = createLeadSchema("bg");

export type LeadInput = z.infer<ReturnType<typeof createLeadSchema>>;

export function parseLeadLocale(body: unknown, headerLocale: string | null): Locale {
  const fromBody =
    body && typeof body === "object" && "locale" in body
      ? (body as { locale?: unknown }).locale
      : undefined;
  return resolveLocale(fromBody ?? headerLocale);
}
