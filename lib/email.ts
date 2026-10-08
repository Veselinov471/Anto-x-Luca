import { Resend } from "resend";

export async function notifyNewLead(payload: {
  email: string;
  firstName?: string;
  preferredProduct: string;
  campaign?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.info("[leads] notify skipped — missing RESEND_API_KEY or LEADS_NOTIFY_EMAIL", payload);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.LEADS_FROM_EMAIL ?? "Anto x Luca <onboarding@resend.dev>",
    to: [to],
    subject: `Нов запис за ранен достъп: ${payload.preferredProduct}`,
    text: [
      `Имейл: ${payload.email}`,
      `Име: ${payload.firstName || "—"}`,
      `Продукт: ${payload.preferredProduct}`,
      `Кампания: ${payload.campaign || "—"}`,
    ].join("\n"),
  });
}
