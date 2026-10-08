import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { notifyNewLead } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type MemoryLead = {
  email: string;
  preferred_product: string;
  created_at: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __axlLeads: MemoryLead[] | undefined;
}

function memoryStore(): MemoryLead[] {
  if (!globalThis.__axlLeads) globalThis.__axlLeads = [];
  return globalThis.__axlLeads;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limited = rateLimit(`leads:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Твърде много опити. Изчакайте минута и опитайте отново." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Невалидна заявка." },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Моля, проверете попълнените данни.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot triggered
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const row = {
    email: data.email.toLowerCase(),
    first_name: data.firstName || null,
    preferred_product: data.preferredProduct,
    consent_marketing: true,
    source: data.source || null,
    campaign: data.campaign || null,
    medium: data.medium || null,
    content: data.content || null,
    term: data.term || null,
    landing_variant: data.landingVariant || null,
  };

  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("leads").insert(row);
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            ok: false,
            error: "Този имейл вече е записан. Ще се свържем с вас.",
          },
          { status: 409 },
        );
      }
      console.error("[leads] supabase error", error);
      return NextResponse.json(
        { ok: false, error: "Не успяхме да запишем данните. Опитайте отново." },
        { status: 500 },
      );
    }
  } else {
    const store = memoryStore();
    if (store.some((l) => l.email === row.email)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Този имейл вече е записан. Ще се свържем с вас.",
        },
        { status: 409 },
      );
    }
    store.push({
      email: row.email,
      preferred_product: row.preferred_product,
      created_at: new Date().toISOString(),
    });
    console.info("[leads] stored in memory (no Supabase env)", row.email);
  }

  try {
    await notifyNewLead({
      email: row.email,
      firstName: data.firstName || undefined,
      preferredProduct: row.preferred_product,
      campaign: data.campaign,
    });
  } catch (err) {
    console.error("[leads] notify failed", err);
  }

  return NextResponse.json({ ok: true });
}
