# Make.com Blog Automation Blueprint

## Architecture

```
Google Sheets (Calendar) → Make.com (Daily Trigger) → Claude API (Generate) → Google Docs (Draft) → Review → Publish to Site
```

## What You Need to Set Up

### 1. Accounts Required
- **Make.com** account (Free tier works for testing, Pro for daily runs)
- **Claude API key** from console.anthropic.com (or OpenAI key as alternative)
- **Google Workspace** (Sheets + Docs for calendar and drafts)
- **GitHub** account (already have — for deploying new posts)

### 2. Google Sheet: Content Calendar
Create a Google Sheet with these columns:

| Column | Description |
|--------|-------------|
| A: Day | Day number (1-90) |
| B: Date | Actual publish date |
| C: Status | `pending` / `generating` / `review` / `approved` / `published` |
| D: Pillar | P1-P5 |
| E: Slug | URL slug |
| F: Title | Article title |
| G: Target Keyword | Primary SEO keyword |
| H: Category | Category tag |
| I: Outline | Section headings (pipe-separated) |
| J: Problem Ref | Reference to Master Problems List |
| K: Framework Ref | Reference to mentor framework |
| L: Draft URL | Link to Google Doc draft |
| M: Published URL | Live URL after publishing |

**I will provide a CSV export of the 90-day calendar to paste into the sheet.**

---

## Make.com Scenario: Daily Blog Generator

### Scenario 1: Generate Draft (runs daily at 6 AM)

```
Module 1: Google Sheets — Search Rows
  → Filter: Status = "pending" AND Date = today
  → Get first matching row

Module 2: HTTP — Claude API Call
  → Method: POST
  → URL: https://api.anthropic.com/v1/messages
  → Headers:
    x-api-key: {{your_api_key}}
    anthropic-version: 2023-06-01
    content-type: application/json
  → Body: See "Content Generation Prompt" below
  → Model: claude-sonnet-4-6-20250514 (best quality/cost ratio)

Module 3: Google Docs — Create Document
  → Title: [Day] — [Title]
  → Content: API response (formatted)
  → Folder: "LK Digital Blog Drafts"

Module 4: Google Sheets — Update Row
  → Set Status = "review"
  → Set Draft URL = Google Doc link

Module 5: Email/Slack — Notify
  → "New blog draft ready for review: [Title]"
```

### Scenario 2: Publish Approved Post (runs every 2 hours)

```
Module 1: Google Sheets — Search Rows
  → Filter: Status = "approved"
  → Get first matching row

Module 2: GitHub API — Create/Update File
  → Repository: K-Skills17/lkdigital-site
  → Path: src/data/blog-posts/[slug].ts
  → Content: Blog post data formatted as TypeScript

Module 3: GitHub API — Trigger Deploy
  → Create commit → triggers Vercel/Netlify auto-deploy

Module 4: Google Sheets — Update Row
  → Set Status = "published"
  → Set Published URL
```

---

## Content Generation Prompt

This is the system prompt for the Claude API call in Make.com:

```
You are the content team of LK Digital, a dental marketing agency
in Brazil specialized exclusively in odontologia. You write blog
articles in Portuguese (pt-BR) for dentists.

VOICE & TONE:
- Authoritative but approachable
- Data-driven: always include specific numbers and statistics
- Practical: every article must have actionable takeaways
- Empathetic: understand the dentist's struggles without being patronizing
- Professional: no slang, no excessive emojis, no fluff

STRUCTURE (every article must follow):
1. Opening paragraph (40-60 words) that directly states the problem/topic
   — optimized for AI snippet extraction
2. 5-8 H2 sections, each with a clear heading matching search queries
3. At least 2 H3 subsections within longer sections
4. Statistics with source attribution (e.g., "Segundo dados do CFO...")
5. Practical checklists or step-by-step instructions
6. 3-5 FAQ items at the end (natural language questions)
7. CTA paragraph linking to /contato

SEO REQUIREMENTS:
- Target keyword in: title, first paragraph, at least 2 H2s, meta description
- Meta description: exactly 150-160 characters
- Internal links: reference 2-3 other blog posts by slug
- Alt text suggestions for any recommended images
- Reading level: accessible to non-marketing professionals

CFO COMPLIANCE:
- Never suggest before/after photos without noting CFO restrictions
- Never promise specific clinical results
- Always note when a marketing practice needs CFO compliance review
- Reference CFO resolutions when discussing advertising rules

CONTENT PILLARS:
- P1 (How-To): Step-by-step, practical, tool-focused
- P2 (Problems): Pain point → cause → solution, empathetic
- P3 (Insights): Data-driven, trend analysis, market context
- P4 (Specialty): Deep dive into specific dental specialty marketing
- P5 (Expert): Framework application, mentor wisdom contextualized for dentists

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "title": "string",
  "metaDescription": "string (150-160 chars)",
  "slug": "string",
  "category": "string",
  "readTime": "string (e.g., '8 min')",
  "sections": [
    {
      "heading": "string (H2)",
      "content": "string (HTML paragraphs)",
      "subsections": [
        { "heading": "string (H3)", "content": "string" }
      ]
    }
  ],
  "faqs": [
    { "question": "string", "answer": "string" }
  ],
  "relatedSlugs": ["string", "string"],
  "internalLinks": ["string (suggested anchor text → /path)"]
}
```

### Per-article user prompt template:

```
Write a blog article for LK Digital with these specifications:

TITLE: {{title}}
TARGET KEYWORD: {{targetKeyword}}
CATEGORY: {{category}}
PILLAR: {{pillar}}
PROBLEM REFERENCE: {{problemRef}}
FRAMEWORK REFERENCE: {{frameworkRef}}

OUTLINE:
{{outline (each item on a new line)}}

CTA: {{cta}}

Additional context for this article:
- This is article #{{day}} of a 90-day content series
- Related articles already published: {{list of recent slugs}}
- Write 1,500-2,000 words
- Include at least 3 statistics with source attribution
- Include at least 1 actionable checklist or step-by-step process
```

---

## Post-Day-90 Schedule

After day 90, switch the Make.com trigger to run 3x/week:
- **Monday**: P1 or P2 article (how-to or problem-solving)
- **Wednesday**: P3 or P4 article (insights or specialty)
- **Friday**: P5 article (expert frameworks)

---

## Quality Checklist (Pre-Publish)

Before changing status from "review" to "approved":

- [ ] Title includes target keyword
- [ ] Meta description is 150-160 characters
- [ ] First paragraph defines the topic clearly (AI-extractable)
- [ ] At least 5 H2 sections
- [ ] At least 2 statistics with sources
- [ ] At least 1 checklist or numbered process
- [ ] 3-5 FAQ items included
- [ ] CTA links to /contato
- [ ] No CFO violations
- [ ] Internal links to 2-3 other articles
- [ ] Reading time is accurate
- [ ] No AI-sounding filler phrases
- [ ] Content provides genuine value (would a dentist share this?)

---

## Cost Estimate

| Component | Monthly Cost |
|-----------|:-:|
| Make.com Pro | ~$10/month |
| Claude API (sonnet, ~90 articles) | ~$15-25/month |
| Google Workspace | Already have |
| GitHub | Free |
| **Total** | **~$25-35/month** |

After day 90 (3x/week = ~12 articles/month):
- Claude API: ~$5-8/month
- **Total: ~$15-18/month**
