import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";
import { clientIp, hit, LIMITS, tooManyRequests } from "@/lib/ratelimit";

const leverScoresSchema = z.object({
  posicionamento: z.number().int().min(0).max(6),
  oferta: z.number().int().min(0).max(6),
  modelo: z.number().int().min(0).max(6),
  marca: z.number().int().min(0).max(6),
  aquisicao: z.number().int().min(0).max(6),
  experiencia: z.number().int().min(0).max(6),
  sistemas: z.number().int().min(0).max(6),
});

const schema = z.object({
  timestamp: z.string(),
  nome: z.string().min(2, "Nome é obrigatório"),
  clinica: z.string().min(2, "Nome da clínica é obrigatório"),
  especialidade: z.string().min(1, "Especialidade é obrigatória"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "WhatsApp inválido").max(11, "WhatsApp inválido")),
  email: z.string().email().optional().or(z.literal("")),
  total: z.number().int().min(0).max(42),
  arquetipo: z.string(),
  scores: leverScoresSchema,
  alavancas_fracas: z.array(z.string()).length(2),
  respostas: z.array(z.number().int().min(0).max(3)).length(14),
  consent: z.literal(true, { message: "Consentimento obrigatório" }),
  source: z.string().default("raio-x"),
});

export async function POST(request: Request) {
  const limited = await hit(LIMITS.formIp, clientIp(request.headers));
  if (!limited.ok) return tooManyRequests(limited.retryAfter);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos", fields: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = result.data;

  try {
    await query(
      `insert into unicornio_leads
         (nome, clinica, especialidade, cidade, whatsapp, email, total, arquetipo, scores, alavancas_fracas, respostas, consent, source)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13)`,
      [
        data.nome, data.clinica, data.especialidade, data.cidade, data.whatsapp, data.email || null,
        data.total, data.arquetipo, JSON.stringify(data.scores), data.alavancas_fracas, data.respostas,
        data.consent, data.source,
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/unicornio/lead]", err);
    return NextResponse.json({ error: "Erro ao salvar lead" }, { status: 500 });
  }
}
