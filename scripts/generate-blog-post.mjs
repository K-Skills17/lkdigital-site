#!/usr/bin/env node
/**
 * LK Digital — Blog Post Generator
 * ─────────────────────────────────
 * Generates research-backed blog posts that read as human-written.
 *
 * Flow:
 *   1. Perplexity API → real web research with citations + stats
 *   2. Claude API     → writes the post using Stephen's voice + the research
 *   3. Saves JSON     → content/blog/[slug].json (ready for the blog engine)
 *
 * Usage:
 *   node scripts/generate-blog-post.mjs "marketing para ortodontia invisalign"
 *   node scripts/generate-blog-post.mjs "SEO local dentista bairro" --keyword="seo local dentista"
 *
 * Env vars required (add to .env.local):
 *   PERPLEXITY_API_KEY=pplx-...
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
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!PERPLEXITY_API_KEY) {
  console.error("Missing PERPLEXITY_API_KEY in environment");
  process.exit(1);
}
if (!ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY in environment");
  process.exit(1);
}

// ─── CLI args ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const topic = args.find((a) => !a.startsWith("--"));
const keywordArg = args.find((a) => a.startsWith("--keyword="));
const targetKeyword = keywordArg ? keywordArg.split("=")[1] : topic;

if (!topic) {
  console.error('Usage: node scripts/generate-blog-post.mjs "topic" [--keyword="target keyword"]');
  process.exit(1);
}

console.log(`\n🔍 Researching: "${topic}"`);
console.log(`🎯 Target keyword: "${targetKeyword}"\n`);

// ─── Step 1: Perplexity research ──────────────────────────────────────────
async function research(topic) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-large-128k-online",
      messages: [
        {
          role: "system",
          content: `Você é um pesquisador especializado em marketing digital para dentistas no Brasil.
Sua tarefa é encontrar dados reais, estatísticas atuais e informações verificáveis sobre o tópico solicitado.
Foco em:
- Dados do mercado odontológico brasileiro (CFO, IBGE, CRO estaduais)
- Estatísticas de comportamento do consumidor ao buscar dentistas
- Dados de Google Trends, volumes de busca reais
- Benchmarks reais de campanhas de marketing odontológico
- Informações sobre regulamentação CFO/CRO relevante
- Exemplos concretos e casos do mercado brasileiro
Cite suas fontes. Prefira dados de 2023, 2024 e 2025.`,
        },
        {
          role: "user",
          content: `Pesquise dados reais e atuais sobre: "${topic}" no contexto de marketing digital para dentistas e consultórios odontológicos no Brasil.

Quero especificamente:
1. Estatísticas e números concretos (volume de buscas, taxas de conversão, preços médios, número de profissionais)
2. Dados do mercado odontológico brasileiro relacionados ao tema
3. Comportamento do paciente brasileiro ao buscar esse tipo de serviço
4. Regulamentações do CFO ou CRO relevantes (se houver)
5. Dados comparativos (antes/depois, com/sem estratégia, por região)
6. Tendências recentes (2024-2025)

Seja específico. Cite percentuais, valores em reais, cidades, anos. Dados vagos não servem.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
      return_citations: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Perplexity error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const citations = data.citations ?? [];

  return { content, citations };
}

// ─── Step 2: Generate slug ─────────────────────────────────────────────────
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

// ─── Step 3: Claude writing ────────────────────────────────────────────────
async function writePost(topic, keyword, researchData) {
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const systemPrompt = `Você é Stephen Domingos Komando, fundador da LK Digital, agência de marketing digital especializada exclusivamente em dentistas no Brasil.

QUEM É STEPHEN:
- Trabalha exclusivamente com dentistas há anos
- Tem opiniões fortes baseadas em experiência real com consultórios
- Fala de igual para igual com o dentista — sem condescendência
- É direto, honesto, às vezes provocativo ("a maioria das agências mente sobre isso")
- Usa exemplos concretos de casos reais (sem citar nomes de clientes)
- Conhece as regulações do CFO de cabeça
- Não tem medo de criticar o que não funciona

ESTILO DE ESCRITA (REGRAS ABSOLUTAS):
1. NUNCA use travessão (—) para conectar frases. Use ponto final ou vírgula.
2. NUNCA comece com "No cenário atual", "Em um mundo", "Com a evolução de"
3. NUNCA use: "delve", "harness", "tapestry", "multifaceted", "dive into", "in conclusion", "in summary"
4. NUNCA use linguagem corporativa vazia: "alavancar sinergias", "otimizar sua presença", "maximizar resultados"
5. Use frases curtas quando quiser impacto. Use frases mais longas quando estiver explicando algo técnico.
6. Alterne ritmo: uma frase curta após um parágrafo longo. Isso soa humano.
7. Escreva na primeira pessoa quando der perspectiva pessoal: "Vi isso acontecer em dezenas de consultórios."
8. Seja específico: "34% dos pacientes" é melhor que "muitos pacientes".
9. Inclua os dados da pesquisa com naturalidade no texto, citando a fonte.
10. Adicione uma opinião própria sobre cada dado: o que isso significa na prática.
11. Use linguagem conversacional do português brasileiro — não europeu.
12. Evite listas com 10 itens. Prefira 3-5 itens com explicação real de cada um.

FORMATO DO ARTIGO:
- Abertura que vai direto ao problema real (sem introdução genérica)
- H2s que soam como o que alguém diria em conversa ("Por que 90% dos dentistas erra aqui")
- Parágrafos de 3-5 linhas no máximo
- Dados de pesquisa integrados naturalmente com análise
- FAQ com perguntas que pacientes/dentistas realmente fazem
- CTA final direto e honesto

OUTPUT: Retorne APENAS um JSON válido sem markdown, sem blocos de código. JSON com esta estrutura exata.`;

  const userPrompt = `Escreva um artigo completo sobre: "${topic}"
Keyword principal: "${keyword}"

DADOS DE PESQUISA REAIS (use-os no artigo):
${researchData.content}

${researchData.citations.length > 0 ? `FONTES VERIFICADAS:\n${researchData.citations.slice(0, 5).map((c, i) => `${i + 1}. ${c}`).join("\n")}` : ""}

Gere um JSON com esta estrutura exata:
{
  "title": "Título do artigo (direto, com keyword natural, 50-65 chars)",
  "seoTitle": "Título SEO otimizado (keyword primeiro, até 60 chars)",
  "seoDescription": "Meta description com keyword e proposta de valor, 145-160 chars",
  "slug": "slug-do-artigo-em-portugues",
  "excerpt": "Parágrafo de abertura que resume o valor do artigo (2-3 frases, direto ao ponto, sem clichê)",
  "tldr": "Resumo em 2-3 frases para box de resposta rápida — como se fosse a resposta direta a uma pergunta",
  "content": "HTML completo do artigo. Use <h2> para seções principais, <h3> para sub-seções, <p> para parágrafos, <ul>/<li> para listas quando necessário. Mínimo 1800 palavras. Inclua os dados de pesquisa com análise real.",
  "category": "SEO | Google Ads | Gestão | Conteúdo | Marca | Estratégia | Regulamentação | Especialidade",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["keyword principal", "keyword secundária 1", "keyword secundária 2"],
  "readingTime": 8,
  "faqItems": [
    {
      "question": "Pergunta real que dentistas fazem sobre esse tema",
      "answer": "Resposta direta e prática, 2-4 frases, com dado concreto se possível"
    },
    {
      "question": "Segunda pergunta",
      "answer": "Segunda resposta"
    },
    {
      "question": "Terceira pergunta",
      "answer": "Terceira resposta"
    },
    {
      "question": "Quarta pergunta",
      "answer": "Quarta resposta"
    },
    {
      "question": "Quinta pergunta",
      "answer": "Quinta resposta"
    }
  ],
  "author": {
    "name": "Stephen Domingos Komando",
    "title": "Fundador, LK Digital",
    "bio": "Stephen Domingos Komando é fundador da LK Digital, agência especializada exclusivamente em marketing odontológico. Trabalha com dentistas em todo o Brasil ajudando a lotar agendas e construir marcas premium.",
    "slug": "stephen-domingos-komando"
  },
  "ctaHeading": "Título do CTA relacionado ao tema do artigo",
  "ctaDescription": "Descrição do CTA — o que a LK Digital faz especificamente relacionado a este tema",
  "ctaButton": "Texto do botão CTA"
}

Retorne SOMENTE o JSON. Nenhum texto antes ou depois. Nenhum markdown. Apenas JSON válido.`;

  console.log("✍️  Writing post with Claude...");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  const clean = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

  return JSON.parse(clean);
}

// ─── Step 4: Save ──────────────────────────────────────────────────────────
function savePost(post) {
  const now = new Date().toISOString();
  const slug = post.slug || slugify(post.title);

  const final = {
    ...post,
    slug,
    pillar: "P1",
    datePublished: now,
    dateModified: now,
  };

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const filepath = path.join(CONTENT_DIR, `${slug}.json`);
  fs.writeFileSync(filepath, JSON.stringify(final, null, 2), "utf8");

  return { filepath, slug };
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  try {
    // 1. Research
    console.log("📡 Fetching real data from Perplexity...");
    const researchData = await research(topic);
    console.log(`✅ Research complete. Found ${researchData.citations.length} sources.\n`);

    // Preview research
    console.log("─── RESEARCH PREVIEW ───────────────────────────────────────");
    console.log(researchData.content.substring(0, 500) + "...\n");

    // 2. Write
    const post = await writePost(topic, targetKeyword, researchData);
    console.log(`✅ Article written: "${post.title}"\n`);

    // 3. Save
    const { filepath, slug } = savePost(post);
    console.log(`✅ Saved to: content/blog/${slug}.json`);
    console.log(`\n🎯 View at: https://lkdigital.odo.br/blog/${slug}`);
    console.log(`📝 Remember to add "${slug}" to INDEXED_ENGINE_SLUGS in blog/[slug]/page.tsx when ready to index.\n`);
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    if (err.message.includes("JSON")) {
      console.error("The AI returned invalid JSON. Try running again.");
    }
    process.exit(1);
  }
}

main();
