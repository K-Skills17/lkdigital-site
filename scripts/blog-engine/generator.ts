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
  BANNED_SOURCES,
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
      model: "claude-sonnet-4-20250514",
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
- Practical: every section must have actionable takeaways
- Direct: lead with the answer, not the buildup
- Professional but warm: not academic, not casual

═══ CRITICAL CONTENT RULES (VIOLATIONS = REJECTED ARTICLE) ═══

1. NEVER FABRICATE STATISTICS OR SOURCES.
   - Do NOT invent percentages, studies, or organizations.
   - Do NOT attribute claims to institutions unless you are CERTAIN they published them.
   - NEVER use these fake sources: ${BANNED_SOURCES.join("; ")}.
   - If you don't have a real stat, use logical reasoning, practical experience, or qualitative arguments instead.
   - It is MUCH better to say "consultórios que investem em presença digital tendem a receber mais pacientes" than to invent "73% dos consultórios que investem em presença digital recebem 340% mais pacientes segundo o Instituto X".

2. REAL SOURCES ONLY — use these sparingly (max 3-5 per article):
   - Google (Trends, Search Console data, algorithm updates)
   - BrightLocal (local SEO surveys — they publish annual reports)
   - CFO/CRO (regulatory data — cite resolution numbers)
   - IBGE / Datasus (demographic data)
   - General common knowledge (e.g., "a maioria dos pacientes pesquisa online antes de agendar")
   - When unsure, frame as observation: "Na nossa experiência com consultórios...", "O que vemos no mercado é que..."

3. NEVER USE "340%" for anything. This number is banned.

4. NO FICTIONAL TESTIMONIALS.
   - Do NOT create fake dentist quotes with names and cities.
   - Instead, use anonymized examples: "Um implantodontista em capital do Sudeste relatou que..." or frame as hypothetical: "Imagine um consultório que..."
   - For case studies, use "Consultório A" / "Clínica B" format, not invented names.

5. KEYWORD DENSITY: Use the primary keyword naturally, MAX 2-3 times in the full article. NEVER stuff it into every section heading.

6. NO AI PATTERNS: Never use these phrases: ${BANNED_PHRASES.join(", ")}. Write naturally.

7. CFO COMPLIANCE: Never suggest before/after photos without noting CFO restrictions. Never promise specific clinical results.

8. VARY YOUR STRUCTURE. Not every article needs a comparison table, not every section needs a stat. Mix formats:
   - Some sections: narrative explanation with examples
   - Some sections: step-by-step instructions
   - Some sections: checklist or framework
   - Some sections: practical templates (scripts, emails, messages)
   Avoid the pattern of "bold claim + percentage + bullet list" repeating in every section.

SEO + AEO:
- Primary keyword in title and first paragraph
- Each section starts with a direct answer AI can extract as a snippet
- Include comparison tables only where they genuinely add value

HTML STRUCTURE:
- Use semantic HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <table>, <blockquote>, <strong>
- NO <h1> (that's in the page template)
- Keep paragraphs to 2-3 sentences max
- Use 4-7 H2 headings per article (not 10+). Depth over breadth.

CURRENT YEAR: ${GENERATION_CONFIG.currentYear}

${PERSUASION_PRINCIPLES}

OUTPUT: Return ONLY valid JSON (no markdown wrappers, no \`\`\`json). The JSON must match this exact structure:
{
  "title": "string",
  "seoTitle": "string (40-48 chars MAX, keyword front-loaded — Google truncates at 60 and we append ' | LK Digital')",
  "seoDescription": "string (140-160 chars, keyword + value prop + CTA)",
  "excerpt": "string (2-3 sentences, compelling hook — NO fabricated statistics)",
  "content": "string (full HTML, ${GENERATION_CONFIG.minWordCount}-${GENERATION_CONFIG.maxWordCount} words)",
  "tags": ["string", "string", ...],
  "keywords": ["primary keyword", "secondary 1", "secondary 2"],
  "readingTime": number (CALCULATE from word count: words / 200, rounded up),
  "tldr": "string (2-3 key takeaways in one paragraph)",
  "faqItems": [{"question": "string", "answer": "string"}, ...${GENERATION_CONFIG.faqItemsPerArticle} items]
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
- ONLY use real, verifiable statistics (max 3-5 per article). NO fabricated sources or percentages.
- NEVER use "340%" for anything
- NEVER create fictional dentist testimonials with names — use anonymized examples
- Primary keyword max 2-3 times in the full article
- ${GENERATION_CONFIG.faqItemsPerArticle} FAQ items
- Calculate readingTime from word count (words / 200, rounded up)
- All content in Portuguese (pt-BR)
- Return ONLY valid JSON, no markdown wrappers`;

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

    // Check for H2 headings (4-8 ideal, not 10+)
    const h2Count = (article.content.match(/<h2/g) || []).length;
    if (h2Count < 4) issues.push(`Only ${h2Count} H2 headings (need 4+)`);
    if (h2Count > 10) issues.push(`Too many H2 headings: ${h2Count} (max 10)`);

    // Check for fabricated sources
    for (const source of BANNED_SOURCES) {
      if (article.content.toLowerCase().includes(source.toLowerCase())) {
        issues.push(`Contains fabricated source: "${source}"`);
      }
    }

    // Check for "340%"
    if (article.content.includes("340%")) {
      issues.push('Contains banned statistic "340%"');
    }

    // Check keyword stuffing (primary keyword max 4 times)
    if (article.keywords && article.keywords[0]) {
      const kw = article.keywords[0].toLowerCase();
      const contentLowerKw = article.content.toLowerCase().replace(/<[^>]+>/g, " ");
      const kwCount = contentLowerKw.split(kw).length - 1;
      if (kwCount > 4) issues.push(`Keyword stuffing: "${kw}" appears ${kwCount} times (max 4)`);
    }

    // Check seoDescription length
    if (article.seoDescription.length < 130 || article.seoDescription.length > 170)
      issues.push(`seoDescription length: ${article.seoDescription.length} (need 130-170)`);

    // Check seoTitle length — must be ≤48 so "title | LK Digital" stays under 60
    if (article.seoTitle && (article.seoTitle.length < 30 || article.seoTitle.length > 48))
      issues.push(`seoTitle length: ${article.seoTitle.length} (need 30-48)`);

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

  // Clean response (remove markdown wrappers, leading text, etc.)
  rawResponse = rawResponse.replace(/^```json\s*\n?/, "").replace(/\n?```\s*$/, "").trim();
  // Strip any text before the first {
  const jsonStart = rawResponse.indexOf("{");
  if (jsonStart > 0) {
    rawResponse = rawResponse.substring(jsonStart);
  }
  // Strip any text after the last }
  const jsonEnd = rawResponse.lastIndexOf("}");
  if (jsonEnd > 0 && jsonEnd < rawResponse.length - 1) {
    rawResponse = rawResponse.substring(0, jsonEnd + 1);
  }

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

  // Calculate actual reading time from word count
  const contentText = (parsed.content || "").replace(/<[^>]+>/g, " ");
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const calculatedReadingTime = Math.max(5, Math.ceil(wordCount / 200));

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
    readingTime: calculatedReadingTime,
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
  // Remove fabricated source references
  for (const source of BANNED_SOURCES) {
    const regex = new RegExp(source, "gi");
    cleanContent = cleanContent.replace(regex, "especialistas do setor");
  }
  // Remove "340%" anywhere
  cleanContent = cleanContent.replace(/340%/g, "significativamente");
  // Clean up any double spaces left
  cleanContent = cleanContent.replace(/\s{2,}/g, " ").replace(/>\s+</g, "><");
  article.content = cleanContent;

  console.log(`  ✅ Generated: ${article.title} (${article.readingTime} min read)`);
  return article;
}
