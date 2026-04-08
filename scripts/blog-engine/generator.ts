// ═══════════════════════════════════════════════════════════════
// LK Digital Blog Engine — Article Generator
// Quality-first generation with fact-checking and CFO compliance
// ═══════════════════════════════════════════════════════════════

import {
  SITE_URL,
  GENERATION_CONFIG,
  AUTHORS,
  DENTIST_PROBLEMS_CONTEXT,
  PERSUASION_PRINCIPLES,
  FRAMEWORK_CONTEXTS,
  BANNED_PHRASES,
  type TopicSeed,
  type Author,
} from "./config";

// ─── Output Interface ───
export interface GeneratedArticle {
  title: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  excerpt: string;
  content: string; // Full HTML
  tags: string[];
  keywords: string[];
  category: string;
  pillar: string;
  readingTime: number;
  tldr: string;
  faqItems: { question: string; answer: string }[];
  author: Author;
  datePublished: string;
  dateModified: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButton: string;
}

// ─── AI Provider ───
async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20241022",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

// ─── System Prompt ───
function buildSystemPrompt(): string {
  return `You are the senior content strategist at LK Digital, a dental marketing agency in Brazil specialized EXCLUSIVELY in odontologia. You write in Portuguese (pt-BR).

VOICE & TONE:
- Authoritative: you know this market deeply
- Empathetic: you understand dentists' struggles and fears
- Data-driven: always include specific statistics with source attribution
- Practical: every section must have actionable takeaways
- Direct: lead with the answer, not the buildup
- Professional but warm: not academic, not casual
- Write like a senior consultant talking to a dentist colleague

CONTENT QUALITY RULES (NON-NEGOTIABLE):
1. ACCURACY: Only cite statistics that are realistic and verifiable. Attribute sources (e.g., "Segundo pesquisa do CRO-SP...", "Dados do Google Trends indicam..."). If you're not sure of an exact number, use ranges or say "estimativas do mercado sugerem".
2. CFO COMPLIANCE: NEVER suggest before/after photos without noting CFO restrictions. NEVER promise specific clinical results. Always mention when a marketing practice needs CFO compliance review. Reference CFO resolutions when discussing advertising rules.
3. SPECIFICITY: Use exact numbers, city names, procedure names, tool names. "Aumente suas avaliações" is bad. "Vá de 12 para 50+ avaliações em 90 dias usando solicitação pós-consulta via WhatsApp" is good.
4. NO AI-DETECTABLE PATTERNS: Never use these phrases: ${BANNED_PHRASES.join(", ")}. Write naturally, as a real marketing professional would. Vary sentence length. Use occasional rhetorical questions.
5. ORIGINAL INSIGHT: Every article must contain at least one insight that is NOT generic marketing advice — something specific to Brazilian dentistry.
6. INTERNAL LINKS: Reference 2-3 other LK Digital blog articles naturally in the text using relative URLs (/blog/[slug]).

SEO + AEO + GEO OPTIMIZATION:
- SEO: Primary keyword in title, first paragraph, at least 2 H2 headings, and meta description
- AEO (Answer Engine): Each section starts with a direct answer (40-60 words) that AI can extract as a snippet. Use question-based H2s when natural. Include FAQ section (5 items).
- GEO (Generative Engine): Include comparison tables where relevant. Cite specific statistics. Use authoritative tone. Make claims verifiable.

HTML STRUCTURE:
- Use semantic HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <blockquote>, <strong>, <em>
- NO <h1> (that's in the page template)
- Keep paragraphs to 2-3 sentences max
- Use lists for processes and features
- Use tables for comparisons

CURRENT YEAR: ${GENERATION_CONFIG.currentYear}

${PERSUASION_PRINCIPLES}

OUTPUT: Return ONLY valid JSON (no markdown wrappers, no \`\`\`json). The JSON must match this exact structure:
{
  "title": "string",
  "seoTitle": "string (50-60 chars, keyword front-loaded)",
  "seoDescription": "string (140-160 chars, keyword + value prop + CTA)",
  "excerpt": "string (2-3 sentences, compelling hook)",
  "content": "string (full HTML, ${GENERATION_CONFIG.minWordCount}-${GENERATION_CONFIG.maxWordCount} words)",
  "tags": ["string", "string", ...],
  "keywords": ["primary keyword", "secondary 1", "secondary 2"],
  "readingTime": number,
  "tldr": "string (2-3 key takeaways in one paragraph)",
  "faqItems": [{"question": "string", "answer": "string"}, ...5 items]
}`;
}

// ─── User Prompt ───
function buildUserPrompt(topic: TopicSeed, publishedSlugs: string[]): string {
  let prompt = `Write a blog article with these specifications:

TITLE: ${topic.title}
SLUG: ${topic.slug}
PRIMARY KEYWORD: ${topic.primaryKeyword}
SECONDARY KEYWORDS: ${topic.secondaryKeywords.join(", ")}
CATEGORY: ${topic.category}
PILLAR: ${topic.pillar}
SEARCH INTENT: ${topic.searchIntent}

OUTLINE (follow this structure):
${topic.outline.map((item, i) => `${i + 1}. ${item}`).join("\n")}

CTA AT THE END:
- Heading: ${topic.ctaHeading}
- Description: ${topic.ctaDescription}
- Button: ${topic.ctaButton}
- Link: /contato`;

  // Add problem context for P2 articles
  if (topic.problemRef) {
    prompt += `\n\nPROBLEM CONTEXT (use this to write with empathy and precision):
Problem Reference: ${topic.problemRef}
${DENTIST_PROBLEMS_CONTEXT}`;
  }

  // Add framework context for P5 articles
  if (topic.frameworkRef) {
    const frameworkKey = Object.keys(FRAMEWORK_CONTEXTS).find((k) =>
      topic.frameworkRef!.includes(k)
    );
    if (frameworkKey) {
      prompt += `\n\nFRAMEWORK CONTEXT (apply this framework to dentistry):
${FRAMEWORK_CONTEXTS[frameworkKey]}`;
    }
  }

  // Add internal linking context
  const recentSlugs = publishedSlugs.slice(-10);
  if (recentSlugs.length > 0) {
    prompt += `\n\nINTERNAL LINKS — Reference 2-3 of these published articles naturally in the text:
${recentSlugs.map((s) => `- /blog/${s}`).join("\n")}`;
  }

  prompt += `\n\nREMINDERS:
- Write ${GENERATION_CONFIG.minWordCount}-${GENERATION_CONFIG.maxWordCount} words
- Include 3+ statistics with source attribution
- Include at least 1 actionable checklist or step-by-step process
- 5 FAQ items
- All content in Portuguese (pt-BR)
- Return ONLY valid JSON`;

  return prompt;
}

// ─── Quality Validation ───
function validateArticle(raw: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  try {
    const article = JSON.parse(raw);

    if (!article.title) issues.push("Missing title");
    if (!article.content) issues.push("Missing content");
    if (!article.seoDescription) issues.push("Missing seoDescription");
    if (!article.faqItems || article.faqItems.length < 3)
      issues.push("Fewer than 3 FAQ items");

    // Check word count
    const wordCount = article.content
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    if (wordCount < 1500) issues.push(`Word count too low: ${wordCount}`);

    // Check for banned phrases
    const contentLower = article.content.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (contentLower.includes(phrase.toLowerCase())) {
        issues.push(`Contains banned phrase: "${phrase}"`);
      }
    }

    // Check for H2 headings
    const h2Count = (article.content.match(/<h2/g) || []).length;
    if (h2Count < 4) issues.push(`Only ${h2Count} H2 headings (need 4+)`);

    // Check seoDescription length
    if (article.seoDescription.length < 130 || article.seoDescription.length > 170)
      issues.push(`seoDescription length: ${article.seoDescription.length} (need 130-170)`);

    // Check seoTitle length
    if (article.seoTitle && (article.seoTitle.length < 40 || article.seoTitle.length > 70))
      issues.push(`seoTitle length: ${article.seoTitle.length} (need 40-70)`);

  } catch {
    issues.push("Invalid JSON");
  }

  return { valid: issues.length === 0, issues };
}

// ─── CFO Compliance Check ───
async function checkCFOCompliance(content: string): Promise<{ pass: boolean; warnings: string[] }> {
  const warnings: string[] = [];
  const lower = content.toLowerCase();

  // Check for before/after without disclaimer
  if (lower.includes("antes e depois") || lower.includes("before/after") || lower.includes("antes/depois")) {
    if (!lower.includes("cfo") && !lower.includes("conselho federal")) {
      warnings.push("Mentions antes/depois without CFO compliance note");
    }
  }

  // Check for result promises
  const promisePatterns = [
    /garant(imos|e|ir) resultado/i,
    /resultado garantido/i,
    /100% (de )?sucesso/i,
    /cura garantida/i,
    /sem (nenhum )?risco clínico/i,
  ];
  for (const pattern of promisePatterns) {
    if (pattern.test(content)) {
      warnings.push(`Potential CFO violation: result promise matching "${pattern.source}"`);
    }
  }

  // Check for price promises in clinical context
  if (/a partir de R\$.*procedimento/i.test(content) && !lower.includes("verificar")) {
    warnings.push("Price mentioned for clinical procedure without verification note");
  }

  return { pass: warnings.length === 0, warnings };
}

// ─── Fact-Check Pass ───
async function factCheckArticle(article: GeneratedArticle): Promise<{ pass: boolean; issues: string[] }> {
  const issues: string[] = [];

  // Check that statistics have attribution
  const statsPattern = /(\d+%|\d+\.\d+%|R\$[\d.,]+|\d+ (mil|milhões|bilhões))/g;
  const contentText = article.content.replace(/<[^>]+>/g, "");
  const stats = contentText.match(statsPattern) || [];

  const attributionPatterns = [
    /segundo/i, /de acordo/i, /pesquisa/i, /estudo/i, /dados/i,
    /fonte/i, /relatório/i, /levantamento/i, /ibge/i, /cro/i, /cfo/i,
    /google/i, /brightlocal/i, /semrush/i, /ahrefs/i,
  ];

  if (stats.length > 0) {
    const hasAttributions = attributionPatterns.some((p) => p.test(contentText));
    if (!hasAttributions) {
      issues.push("Statistics found but no source attribution detected");
    }
  }

  // Check that internal links are valid
  const linkPattern = /href="\/blog\/([^"]+)"/g;
  let match;
  while ((match = linkPattern.exec(article.content)) !== null) {
    // Links will be validated against published slugs at publish time
  }

  return { pass: issues.length === 0, issues };
}

// ─── Main Generate Function ───
export async function generateArticle(
  topic: TopicSeed,
  publishedSlugs: string[]
): Promise<GeneratedArticle> {
  console.log(`\n📝 Generating: ${topic.title}`);

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(topic, publishedSlugs);

  // Generate
  console.log("  → Calling Claude API...");
  let rawResponse = await callAI(systemPrompt, userPrompt);

  // Clean response (remove markdown wrappers if any)
  rawResponse = rawResponse.replace(/^```json\s*\n?/, "").replace(/\n?```\s*$/, "").trim();

  // Validate
  console.log("  → Validating article quality...");
  const validation = validateArticle(rawResponse);
  if (!validation.valid) {
    console.log(`  ⚠️  Quality issues: ${validation.issues.join("; ")}`);
    // For non-critical issues, continue but log
    if (validation.issues.includes("Invalid JSON")) {
      throw new Error(`Generation failed: Invalid JSON response`);
    }
  }

  const parsed = JSON.parse(rawResponse);

  // Select author
  const author =
    topic.pillar === "P5" || topic.category === "Estratégia" || topic.category === "Mentalidade"
      ? AUTHORS[1] // Lucas for expert/strategy articles
      : AUTHORS[0]; // Team for how-to/tactical articles

  const now = new Date().toISOString();

  const article: GeneratedArticle = {
    title: parsed.title || topic.title,
    seoTitle: parsed.seoTitle || topic.title,
    seoDescription: parsed.seoDescription || "",
    slug: topic.slug,
    excerpt: parsed.excerpt || "",
    content: parsed.content || "",
    tags: parsed.tags || [topic.category],
    keywords: parsed.keywords || [topic.primaryKeyword, ...topic.secondaryKeywords],
    category: topic.category,
    pillar: topic.pillar,
    readingTime: parsed.readingTime || 8,
    tldr: parsed.tldr || "",
    faqItems: parsed.faqItems || [],
    author,
    datePublished: now,
    dateModified: now,
    ctaHeading: topic.ctaHeading,
    ctaDescription: topic.ctaDescription,
    ctaButton: topic.ctaButton,
  };

  // CFO compliance check
  console.log("  → Checking CFO compliance...");
  const cfoCheck = await checkCFOCompliance(article.content);
  if (!cfoCheck.pass) {
    console.log(`  ⚠️  CFO warnings: ${cfoCheck.warnings.join("; ")}`);
  }

  // Fact-check pass
  console.log("  → Running fact-check...");
  const factCheck = await factCheckArticle(article);
  if (!factCheck.pass) {
    console.log(`  ⚠️  Fact-check issues: ${factCheck.issues.join("; ")}`);
  }

  // Remove banned phrases from content
  let cleanContent = article.content;
  for (const phrase of BANNED_PHRASES) {
    const regex = new RegExp(phrase, "gi");
    cleanContent = cleanContent.replace(regex, "");
  }
  // Clean up any double spaces left
  cleanContent = cleanContent.replace(/\s{2,}/g, " ").replace(/>\s+</g, "><");
  article.content = cleanContent;

  console.log(`  ✅ Generated: ${article.title} (${article.readingTime} min read)`);
  return article;
}
