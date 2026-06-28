import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase-server";

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
    const { error } = await getSupabase()
      .from("unicornio_leads")
      .insert({
        nome: data.nome,
        clinica: data.clinica,
        especialidade: data.especialidade,
        cidade: data.cidade,
        whatsapp: data.whatsapp,
        email: data.email || null,
        total: data.total,
        arquetipo: data.arquetipo,
        scores: data.scores,
        alavancas_fracas: data.alavancas_fracas,
        respostas: data.respostas,
        consent: data.consent,
        source: data.source,
      });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/unicornio/lead]", err);
    return NextResponse.json({ error: "Erro ao salvar lead" }, { status: 500 });
  }
}
