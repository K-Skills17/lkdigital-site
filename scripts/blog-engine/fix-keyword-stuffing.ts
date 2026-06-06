import * as fs from "fs";
import * as path from "path";

const CONTENT_DIR = path.join(__dirname, "../../content/blog");

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function destuff(
  content: string,
  keyword: string,
  maxKeep: number,
  replacements: string[]
): string {
  let count = 0;
  const regex = new RegExp(escapeRegex(keyword), "gi");
  return content.replace(regex, (match) => {
    count++;
    if (count <= maxKeep) return match;
    return replacements[(count - maxKeep - 1) % replacements.length];
  });
}

const fixes = [
  {
    file: "cadeiras-vazias-consultorio-como-resolver.json",
    keyword: "cadeiras vazias consultório odontológico",
    maxKeep: 2,
    replacements: [
      "ociosidade na agenda",
      "horários vagos",
      "agenda vazia",
      "baixa ocupação",
      "períodos ociosos",
      "falta de pacientes",
      "agenda subutilizada",
      "horários sem pacientes",
      "baixa taxa de ocupação",
    ],
  },
  {
    file: "escassez-urgencia-consultorio-odontologico.json",
    keyword: "escassez urgência marketing dentista",
    maxKeep: 2,
    replacements: [
      "escassez e urgência no marketing odontológico",
      "essa estratégia",
      "o uso de escassez",
      "a técnica de escassez",
    ],
  },
  {
    file: "escassez-urgencia-consultorio-odontologico.json",
    keyword: "exclusividade territorial",
    maxKeep: 3,
    replacements: [
      "exclusividade regional",
      "proteção de área",
      "reserva de território",
      "essa vantagem competitiva",
    ],
  },
  {
    file: "crm-dentista-gestao-pacientes-leads.json",
    keyword: "CRM dentista gestão pacientes",
    maxKeep: 2,
    replacements: [
      "um sistema de CRM odontológico",
      "o CRM",
      "essa ferramenta de gestão",
      "o sistema",
    ],
  },
  {
    file: "financiamento-tratamento-dentario-como-oferecer.json",
    keyword: "financiamento tratamento dentário",
    maxKeep: 2,
    replacements: [
      "opções de parcelamento",
      "facilidades de pagamento",
      "financiamento odontológico",
      "plano de pagamento",
    ],
  },
  {
    file: "google-ads-vs-seo-dentista-qual-melhor.json",
    keyword: "Google Ads vs SEO dentista",
    maxKeep: 2,
    replacements: [
      "tráfego pago versus orgânico",
      "essa comparação",
      "a escolha entre mídia paga e SEO",
      "as duas estratégias",
      "Ads e SEO",
    ],
  },
];

for (const fix of fixes) {
  const fp = path.join(CONTENT_DIR, fix.file);
  const post = JSON.parse(fs.readFileSync(fp, "utf-8"));

  const beforeCount =
    post.content.toLowerCase().split(fix.keyword.toLowerCase()).length - 1;

  post.content = destuff(
    post.content,
    fix.keyword,
    fix.maxKeep,
    fix.replacements
  );

  const afterCount =
    post.content.toLowerCase().split(fix.keyword.toLowerCase()).length - 1;

  fs.writeFileSync(fp, JSON.stringify(post, null, 2) + "\n");
  console.log(
    `${fix.file}: "${fix.keyword}" ${beforeCount} → ${afterCount}`
  );
}

console.log("\nDone.");
