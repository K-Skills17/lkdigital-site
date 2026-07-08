// app/api/raio-x/submit/route.ts
// Validates → scores → routes → persists → notifies → returns results payload.
// No PII or scores are returned in URLs — results travel via sessionStorage.

import { NextResponse } from "next/server";
import { z } from "zod";
import { raioXConfig } from "@/lib/raio-x/config";
import { computeScores } from "@/lib/raio-x/score";
import { sinkLead } from "@/lib/raio-x/lead-sink";

const questionIds = raioXConfig.questions.map((q) => q.id);

const submitSchema = z
  .object({
    name: z.string().min(2, "Nome é obrigatório"),
    clinic_name: z.string().min(2, "Nome da clínica é obrigatório"),
    whatsapp: z
      .string()
      .transform((v) => v.replace(/\D/g, ""))
      .pipe(z.string().min(10).max(11))
      .optional()
      .or(z.literal("")),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    // 12 answers keyed by question ID, each 0–3
    answers: z.record(z.enum(questionIds as [string, ...string[]]), z.number().int().min(0).max(3)),
    consent: z.literal(true, { message: "Consentimento LGPD obrigatório" }),
  })
  .refine(
    (d) => !!(d.whatsapp?.trim() || d.email?.trim()),
    { message: "Informe WhatsApp ou e-mail para receber o resultado", path: ["whatsapp"] }
  );

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, clinic_name, whatsapp, email, answers } = parsed.data;

  // Score
  const { visibilidade, operacao, route } = computeScores(answers, raioXConfig);

  // Persist + notify (non-blocking for notifications)
  // If Supabase is not configured (e.g. during testing), skip persistence and return scores.
  const supabaseReady = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  let id = "local-" + Date.now();

  if (supabaseReady) {
    try {
      const result = await sinkLead({
        name,
        clinic_name,
        whatsapp: whatsapp?.trim() || null,
        email: email?.trim() || null,
        answers: questionIds.map((qid) => answers[qid] ?? 0),
        vis_score: visibilidade.score,
        vis_gap: visibilidade.gap,
        op_score: operacao.score,
        op_gap: operacao.gap,
        route,
        consent: true,
      });
      id = result.id;
    } catch (err) {
      console.error("[raio-x/submit]", err);
      return NextResponse.json({ error: "Erro ao salvar. Tente novamente." }, { status: 500 });
    }
  } else {
    console.warn("[raio-x/submit] Supabase not configured — skipping persistence");
  }

  return NextResponse.json({
    id,
    route,
    domainScores: {
      visibilidade: { pct: visibilidade.pct, gap: visibilidade.gap },
      operacao: { pct: operacao.pct, gap: operacao.gap },
    },
  });
}
