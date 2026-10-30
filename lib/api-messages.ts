import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

const messages = {
  bg: {
    emailInvalid: "Моля, въведете валиден имейл",
    nameTooLong: "Името е твърде дълго",
    productRequired: "Моля, изберете модел",
    consentRequired: "Моля, дайте съгласие, за да ви пишем за ранния достъп",
    rateLimited: "Твърде много опити. Изчакайте минута и опитайте отново.",
    invalidRequest: "Невалидна заявка.",
    checkFields: "Моля, проверете попълнените данни.",
    emailExists: "Този имейл вече е записан. Ще се свържем с вас.",
    saveFailed: "Не успяхме да запишем данните. Опитайте отново.",
  },
  en: {
    emailInvalid: "Please enter a valid email",
    nameTooLong: "That name is too long",
    productRequired: "Please choose a model",
    consentRequired: "Please agree so we can email you about early access",
    rateLimited: "Too many attempts. Wait a minute and try again.",
    invalidRequest: "Invalid request.",
    checkFields: "Please check the details you entered.",
    emailExists: "This email is already on the list. We’ll be in touch.",
    saveFailed: "We couldn’t save your details. Please try again.",
  },
} as const;

export type ApiMessageKey = keyof (typeof messages)["en"];

export function resolveLocale(value: unknown): Locale {
  if (typeof value === "string" && isLocale(value)) return value;
  return defaultLocale;
}

export function apiMessage(locale: Locale, key: ApiMessageKey): string {
  return messages[locale][key];
}
