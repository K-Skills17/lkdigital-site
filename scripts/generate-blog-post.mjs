#!/usr/bin/env node
/**
 * LK Digital — Blog Post Generator
 * ─────────────────────────────────
 * Two-call Claude pipeline. No external APIs needed beyond Anthropic.
 *
 * Call 1 — Research: Claude acts as a market research analyst.
 *   Produces a structured brief with specific stats, market data, CFO rules,
 *   patient behavior patterns, and competitive angles for the topic.
 *
 * Call 2 — Write: Claude writes in Stephen's voice using the research brief.
 *   Strict style rules prevent AI-sounding output.
 *
 * Call 3 — Save: JSON lands in content/blog/[slug].json, live on site.
 *
 * Usage:
 *   node scripts/generate-blog-post.mjs "marketing para ortodontia invisalign"
 *   node scripts/generate-blog-post.mjs "SEO local dentista bairro" --keyword="seo local dentista"
 *
 * Env vars required (.env.local):
 *   ANTHROPIC_API_KEY=sk-ant-...
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "blog");

// ─── Config ───────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in environment");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ─── CLI args ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const topic = args.find((a) => !a.startsWith("--"));
const keywordArg = args.find((a) => a.startsWith("--keyword="));
const targetKeyword = keywordArg ? keywordArg.split("=")[1] : topic;

if (!topic) {
  console.error('Usage: node scripts/generate-blog-post.mjs "topic" [--keyword="target keyword"]');
  process.exit(1);
}

const TODAY = new Date().toLocaleDateString("pt-BR", {
  day: "2-digit", month: "long", year: "numeric"
});

console.log(`\n🔍 Researching: "${topic}"`);
console.log(`🎯 Keyword: "${targetKeyword}" | Date: ${TODAY}\n`);

// ─── Step 1: Research call ─────────────────────────────────────────────────
async function research(topic) {
  console.log("📊 Call 1/2 — Building research brief...");

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    system: `Você é um analista de mercado especializado no setor odontológico brasileiro.
Sua função é produzir briefings de pesquisa densos, com dados específicos e acionáveis.
Hoje é ${TODAY}.

REGRAS:
- Cite números reais: percentuais, valores em reais, volumes de busca, ano dos dados
- Mencione fontes conhecidas: CFO, IBGE, CRO estaduais, Google Trends, Sebrae, ANS
- Inclua variações regionais quando relevante (SP vs interior, Sul vs Norte)
- Mencione regulamentações do CFO que impactam o tema (se houver)
- Inclua comportamento real do paciente brasileiro (como busca, decide, paga)
- Seja específico sobre preços de mercado, ROI típico, benchmarks de campanhas
- Prefira dados de 2023, 2024 e 2025`,

    messages: [{
      role: "user",
      content: `Produza um briefing de pesquisa completo sobre: "${topic}"
Contexto: marketing digital para dentistas e clínicas odontológicas no Brasil.

Estruture assim:

## DADOS DE MERCADO
(números, volumes, tamanho do mercado, crescimento)

## COMPORTAMENTO DO PACIENTE
(como busca, o que digita no Google, como decide, ticket médio)

## DADOS COMPETITIVOS
(quantos dentistas disputam, dificuldade de ranquear, custo por clique típico no Google Ads)

## REGULAMENTAÇÃO CFO/CRO
(o que pode e não pode fazer em marketing para este tema)

## OPORTUNIDADES ESPECÍFICAS
(o que a maioria dos dentistas não está fazendo e deveria)

## DADOS DE PERFORMANCE
(benchmarks reais: taxas de conversão, CPL, ROI típico de campanha)

## TENDÊNCIAS 2024-2025
(mudanças recentes no comportamento ou na tecnologia relevantes para este tema)

Seja específico. Sem generalidades.`
    }],
  });

  return msg.content[0].type === "text" ? msg.content[0].text : "";
}

// ─── Step 2: Writing call ──────────────────────────────────────────────────
async function writePost(topic, keyword, researchBrief) {
  console.log("✍️  Call 2/2 — Writing article as Stephen...");

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: `Você é Stephen Domingos Komando, fundador da LK Digital. Você escreve artigos sobre marketing para dentistas no Brasil.

SOBRE VOCÊ:
- Fundou a LK Digital depois de ver agências genéricas destruindo consultórios com campanhas erradas
- Fala com dentistas de igual para igual. Não condescende, não simplifica demais
- Tem opiniões fortes e não tem medo de dizer que a maioria erra
- Usa exemplos de casos reais (sem citar nomes): "Tive um cliente em Campinas que..."
- Conhece as regulações do CFO de memória e cita quando relevante
- Não gosta de promessas váguas. Prefere números concretos

REGRAS ABSOLUTAS DE ESTILO:
1. Proibido usar travessão (—) para ligar frases. Use ponto ou vírgula.
2. Proibido começar com "No cenário atual", "Em um mundo", "Com a crescente"
3. Proibido: "alavancar", "otimizar sua presença", "maximizar resultados", "no contexto de"
4. Proibido: qualquer frase que pareça de relatório corporativo
5. Frases curtas criam impacto. Use-as estrategicamente após parágrafos longos.
6. Primeira pessoa quando for perspectiva sua: "Vi isso acontecer...", "Quando atendo..."
7. Números específicos são obrigatórios onde existem na pesquisa. "Cerca de 70%" é melhor que "a maioria"
8. Critique abertamente o que não funciona: "A maioria das agências faz X. Isso é um erro."
9. Português do Brasil coloquial, não europeu. "Você" não "tu". "A gente" quando cabível.
10. Máximo 4 linhas por parágrafo.

ESTRUTURA DO ARTIGO:
- Abertura: vai direto ao problema concreto. Sem rodeios.
- H2s conversacionais: "Por que quase ninguém faz isso certo", "O que o Google realmente quer"
- Dados da pesquisa integrados naturalmente com sua análise sobre eles
- FAQ com 5 perguntas que dentistas realmente fazem (não perguntas óbvias)
- CTA honesto e direto ao tema

OUTPUT: JSON válido apenas. Sem markdown. Sem texto antes ou depois.`,

    messages: [{
      role: "user",
      content: `Escreva um artigo completo sobre: "${topic}"
Keyword principal a usar naturalmente: "${keyword}"

BRIEFING DE PESQUISA (use esses dados no artigo):
${researchBrief}

Gere este JSON exato:
{
  "title": "Título direto com keyword natural (50-65 chars)",
  "seoTitle": "Keyword primeiro no título SEO (máx 60 chars)",
  "seoDescription": "Meta description com keyword + proposta clara (145-160 chars)",
  "slug": "slug-em-portugues-sem-acentos",
  "excerpt": "2-3 frases que resumem o valor real do artigo. Direto ao ponto. Sem clichê.",
  "tldr": "Resposta direta à pergunta principal em 2-3 frases. Para leitores rápidos.",
  "content": "HTML completo. <h2> para seções, <h3> para sub-seções, <p> para parágrafos, <ul><li> para listas. Mínimo 1800 palavras. Dados do briefing integrados com sua análise.",
  "category": "SEO",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["keyword principal", "secundária 1", "secundária 2"],
  "readingTime": 9,
  "faqItems": [
    {"question": "Pergunta real que dentistas fazem", "answer": "Resposta direta com dado concreto"},
    {"question": "Segunda pergunta específica", "answer": "Segunda resposta prática"},
    {"question": "Terceira pergunta", "answer": "Terceira resposta"},
    {"question": "Quarta pergunta", "answer": "Quarta resposta"},
    {"question": "Quinta pergunta", "answer": "Quinta resposta"}
  ],
  "author": {
    "name": "Stephen Domingos Komando",
    "title": "Fundador, LK Digital",
    "bio": "Stephen Domingos Komando é fundador da LK Digital, agência especializada exclusivamente em marketing odontológico. Trabalha com dentistas em todo o Brasil ajudando a lotar agendas e construir marcas premium.",
    "slug": "stephen-domingos-komando"
  },
  "ctaHeading": "CTA título relacionado ao tema",
  "ctaDescription": "O que a LK Digital faz especificamente para este problema",
  "ctaButton": "Texto do botão"
}

Apenas JSON. Nada mais.`
    }],
  });

  const raw = msg.content[0].type === "text" ? msg.content[0].text : "";
  const clean = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(clean);
}

// ─── Step 3: Save ──────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function savePost(post) {
  const now = new Date().toISOString();
  const slug = post.slug || slugify(post.title);

  const final = { ...post, slug, pillar: "P1", datePublished: now, dateModified: now };

  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true });

  const filepath = path.join(CONTENT_DIR, `${slug}.json`);
  fs.writeFileSync(filepath, JSON.stringify(final, null, 2), "utf8");
  return { filepath, slug };
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  try {
    const researchBrief = await research(topic);

    console.log("\n─── RESEARCH PREVIEW ─────────────────────────────────────");
    console.log(researchBrief.substring(0, 600) + "...\n");

    const post = await writePost(topic, targetKeyword, researchBrief);
    console.log(`\n✅ Article: "${post.title}"`);

    const { slug } = savePost(post);
    console.log(`✅ Saved:   content/blog/${slug}.json`);
    console.log(`\n🌐 URL:     https://lkdigital.odo.br/blog/${slug}`);
    console.log(`📋 Next:    add "${slug}" to INDEXED_ENGINE_SLUGS in src/app/blog/[slug]/page.tsx\n`);
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    if (err.message.includes("JSON")) {
      console.error("→ AI returned invalid JSON. Run again — it's usually a one-time fluke.");
    }
    process.exit(1);
  }
}

main();
