import { z } from "zod";
import { products } from "@/data/products";

const productIds = products.map((p) => p.id) as [string, ...string[]];

export const leadSchema = z.object({
  email: z.email("Моля, въведете валиден имейл"),
  firstName: z.string().trim().max(80, "Името е твърде дълго").optional().or(z.literal("")),
  preferredProduct: z.enum(productIds, {
    error: "Моля, изберете модел",
  }),
  consentMarketing: z.literal(true, {
    error: "Моля, дайте съгласие, за да ви пишем за ранния достъп",
  }),
  /** Honeypot — must stay empty */
  website: z.string().max(0).optional().or(z.literal("")),
  source: z.string().max(100).optional(),
  campaign: z.string().max(200).optional(),
  medium: z.string().max(100).optional(),
  content: z.string().max(200).optional(),
  term: z.string().max(200).optional(),
  landingVariant: z.string().max(100).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
