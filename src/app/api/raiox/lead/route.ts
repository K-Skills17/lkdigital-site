import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, CURRENT_COHORT, COHORT_LIMIT } from "@/lib/supabase-server";

const leadSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  clinic_name: z.string().min(2, "Nome da clínica é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(10, "WhatsApp inválido").max(11, "WhatsApp inválido")),
  instagram: z.string().optional().default(""),
  site_url: z.string().optional().or(z.literal("")),
  role: z.enum(["Dono(a) / Sócio(a)", "Gerente", "Marketing", "Outro"]),
  chairs: z.enum(["1", "2–3", "4–6", "7+"]),
  procedures: z
    .array(z.enum(["Implantes", "Lentes/Facetas", "Invisalign/Orto", "HOF", "Clínica geral"]))
    .min(1, "Selecione ao menos um procedimento"),
  marketing_owner: z.enum(["Ninguém", "Eu mesmo(a)", "Agência", "Funcionário interno"]),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_content: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const result = leadSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json({ error: "Dados inválidos", fields: errors }, { status: 400 });
  }

  const data = result.data;

  // Check for duplicate in current cohort
  const { count: dupCount } = await getSupabase()
    .from("raiox_leads")
    .select("*", { count: "exact", head: true })
    .eq("cohort", CURRENT_COHORT)
    .eq("whatsapp", data.whatsapp);

  if (dupCount && dupCount > 0) {
    return NextResponse.json(
      { error: "Esse WhatsApp já está cadastrado nesta turma." },
      { status: 409 }
    );
  }

  // Check remaining spots
  const { count: totalCount } = await getSupabase()
    .from("raiox_leads")
    .select("*", { count: "exact", head: true })
    .eq("cohort", CURRENT_COHORT)
    .neq("status", "waitlist");

  const remaining = COHORT_LIMIT - (totalCount ?? 0);
  const isWaitlist = remaining <= 0;

  const { error: insertError } = await getSupabase().from("raiox_leads").insert({
    cohort: CURRENT_COHORT,
    status: isWaitlist ? "waitlist" : "new",
    name: data.name,
    clinic_name: data.clinic_name,
    city: data.city,
    whatsapp: data.whatsapp,
    instagram: data.instagram || null,
    site_url: data.site_url || null,
    role: data.role,
    chairs: data.chairs,
    procedures: data.procedures,
    marketing_owner: data.marketing_owner,
    utm: data.utm ?? null,
  });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return NextResponse.json({ error: "Erro interno ao salvar." }, { status: 500 });
  }

  // Fire-and-forget WhatsApp confirmation via Evolution API
  if (!isWaitlist) {
    sendWhatsAppConfirmation(data.whatsapp, data.name, data.clinic_name).catch((err) =>
      console.error("Evolution API error:", err)
    );
  }

  return NextResponse.json({
    success: true,
    waitlist: isWaitlist,
  });
}

async function sendWhatsAppConfirmation(
  whatsapp: string,
  name: string,
  clinicName: string
) {
  const url = process.env.EVOLUTION_API_URL;
  const key = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;

  if (!url || !key || !instance) {
    console.warn("Evolution API env vars not set — skipping WhatsApp send");
    return;
  }

  const message = `Olá, ${name}! Aqui é o Domingos, da LK Digital. Recebi o pedido do Raio-X Digital da ${clinicName}. ✅ Sua análise entra na fila da Turma Jun–Jul e fica pronta em até 7 dias úteis. Vou te avisar por aqui. Qualquer informação extra sobre a clínica que queira me passar, é só responder esta mensagem.`;

  const response = await fetch(`${url}/message/sendText/${instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
    },
    body: JSON.stringify({
      number: "55" + whatsapp,
      text: message,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Evolution API ${response.status}: ${text}`);
  }
}
