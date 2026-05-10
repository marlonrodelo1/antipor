import { NextResponse } from "next/server";
import { z } from "zod";

const InterveneSchema = z.object({
  userId: z.string().min(1),
  context: z.record(z.string(), z.unknown()).default({}),
});

export const dynamic = "force-dynamic";

const FALLBACK_RESPONSE = {
  source: "fallback",
  message:
    "Eh, espera un segundo. Antes de seguir, ¿qué pasó hoy? Respira profundo cinco veces conmigo.",
  options: [
    { id: "breathe", label: "Respirar 60 segundos" },
    { id: "walk", label: "Salir a caminar 10 minutos" },
    { id: "anchor", label: "Ver una de mis anclas" },
  ],
};

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido en el cuerpo de la petición." },
      { status: 400 }
    );
  }

  const parsed = InterveneSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const webhook = process.env.N8N_INTERVENE_WEBHOOK;
  if (!webhook) {
    // Dev-safe fallback: never fail the user during an impulse moment.
    return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.data),
      // Intervention must be near-instant; cap at 8s.
      signal: AbortSignal.timeout(8_000),
    });

    if (!upstream.ok) {
      return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
    }

    const data = await upstream.json().catch(() => null);
    return NextResponse.json(data ?? FALLBACK_RESPONSE, { status: 200 });
  } catch {
    return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
  }
}
