#!/usr/bin/env node
/**
 * LK Digital — Leonardo AI Image Generator
 *
 * Generates all site images via the Leonardo AI API and saves them to
 * public/images/ so Next.js can serve them statically.
 *
 * Usage:
 *   pnpm generate:images                         # generate all images
 *   pnpm generate:images hero.jpg                # generate one specific image
 *   pnpm generate:images hero.jpg sobre-team.jpg # generate several
 *
 * Requires:
 *   LEONARDO_API_KEY in .env.local
 *
 * Optional env vars:
 *   LEONARDO_MODEL_ID  — override the default model (Leonardo Kino XL)
 *
 * Popular model IDs (as of early 2025):
 *   aa77f04e-3eec-4034-9c07-d0f619684628  Leonardo Kino XL      (cinematic, default)
 *   b24e16ff-06e3-43eb-8d33-4416c2d75876  Leonardo Phoenix      (photorealistic)
 *   6bef9f1b-29cb-40c7-b9df-32b51c1f67d3  Leonardo Diffusion XL (stylised)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local absent — env vars must already be set externally
  }
}
loadEnv();

// ── Validate config ──────────────────────────────────────────────────────────
const API_KEY = process.env.LEONARDO_API_KEY;
const MODEL_ID =
  process.env.LEONARDO_MODEL_ID ||
  "aa77f04e-3eec-4034-9c07-d0f619684628"; // Leonardo Kino XL

if (!API_KEY) {
  console.error("\n❌  LEONARDO_API_KEY is not set in .env.local\n");
  console.error(
    "    Get your key at: https://app.leonardo.ai → Settings → API\n"
  );
  process.exit(1);
}

const BASE = "https://cloud.leonardo.ai/api/rest/v1";
const HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// ── Shared brand style suffix ────────────────────────────────────────────────
// Appended to every prompt to enforce visual consistency across all images.
const STYLE =
  "cinematic editorial photography, dark sophisticated background, warm gold accent lighting, ultra realistic, sharp focus, 4k, award winning photograph";

const NEGATIVE =
  "cartoon, illustration, text, watermark, logo, nsfw, low quality, blurry, deformed, extra limbs, bad anatomy, duplicate, signature";

// ── Image catalogue ──────────────────────────────────────────────────────────
// All dimensions must be multiples of 8 and within Leonardo's limits (≤1472px).
//
// Filename          → saved to public/images/<filename>
// Used in page      → which Next.js page references this image
const IMAGES = [
  // ── Home page ──────────────────────────────────────────────────────────────
  {
    filename: "hero.jpg",
    w: 1024,
    h: 768,
    usedIn: "src/components/site/home/hero.tsx",
    prompt: `Premium Brazilian health specialist — doctor in a modern private consultation room, confident and calm expression, clean clinical environment, warm golden window light, dark wall accents, ${STYLE}`,
  },

  // ── Sobre (About) page ────────────────────────────────────────────────────
  {
    filename: "sobre-team.jpg",
    w: 1344,
    h: 576,
    usedIn: "src/app/(site)/sobre/page.tsx — wide banner",
    prompt: `Two marketing professionals collaborating in a premium dark office, analyzing digital analytics dashboards on large screens, data charts visible, focused teamwork, warm gold desk lamp, wide cinematic shot, ${STYLE}`,
  },
  {
    filename: "sobre-step-1.jpg",
    w: 1024,
    h: 576,
    usedIn: "src/app/(site)/sobre/page.tsx — timeline step 1 (Antes)",
    prompt: `Stressed Brazilian doctor overwhelmed at a desk piled with papers and phone notifications, fluorescent clinic lighting, tired expression, candid documentary style, muted desaturated tones, ${STYLE}`,
  },
  {
    filename: "sobre-step-2.jpg",
    w: 1024,
    h: 576,
    usedIn: "src/app/(site)/sobre/page.tsx — timeline step 2 (Parceria LK)",
    prompt: `Brazilian medical professional holding a sleek tablet showing a clean patient analytics dashboard, calm focused expression, modern private clinic background, warm ambient lighting, ${STYLE}`,
  },
  {
    filename: "sobre-step-3.jpg",
    w: 1024,
    h: 576,
    usedIn: "src/app/(site)/sobre/page.tsx — timeline step 3 (Depois) + result section",
    prompt: `Confident successful Brazilian specialist standing in a premium multi-unit modern clinic, relaxed posture, upward growth trend on background screen, professional attire, ${STYLE}`,
  },

  // ── Soluções (Solutions) page ─────────────────────────────────────────────
  {
    filename: "solucoes-geo.jpg",
    w: 768,
    h: 768,
    usedIn: "src/app/(site)/solucoes/page.tsx — GEO & SEO service",
    prompt: `Abstract digital network visualization with glowing nodes and search engine iconography, medical cross motif integrated, dark background, gold and white light trails, premium tech macro photography, depth of field, ${STYLE}`,
  },
  {
    filename: "solucoes-branding.jpg",
    w: 768,
    h: 768,
    usedIn: "src/app/(site)/solucoes/page.tsx — Branding service",
    prompt: `Luxury medical brand identity materials arranged on a dark textured surface — elegant business cards with gold foil, letterhead, and a tablet — minimal editorial still life photography, ${STYLE}`,
  },
  {
    filename: "solucoes-automacao.jpg",
    w: 768,
    h: 768,
    usedIn: "src/app/(site)/solucoes/page.tsx — Automação service",
    prompt: `Sleek CRM and analytics dashboard rendered as a holographic display floating in dark space, patient flow metrics, gold accent UI elements, minimal futuristic interface, macro close-up, ${STYLE}`,
  },
];

// ── API helpers ───────────────────────────────────────────────────────────────
async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} → HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} → HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Generate one image ────────────────────────────────────────────────────────
async function generateImage(slot) {
  console.log(`\n⏳  ${slot.filename}  (${slot.w}×${slot.h})`);
  console.log(`    ${slot.usedIn}`);

  // 1. Start generation
  const { sdGenerationJob } = await apiPost("/generations", {
    prompt: slot.prompt,
    negative_prompt: NEGATIVE,
    width: slot.w,
    height: slot.h,
    num_images: 1,
    modelId: MODEL_ID,
    alchemy: true,
    photoReal: false,
    highResolution: false,
    contrastRatio: 0.5,
  });

  const id = sdGenerationJob.generationId;
  console.log(`    generation id: ${id}`);

  // 2. Poll until COMPLETE (max ~2 min at 4 s intervals)
  const MAX_ATTEMPTS = 30;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    await sleep(4000);

    const { generations_by_pk: gen } = await apiGet(`/generations/${id}`);
    process.stdout.write(
      `    attempt ${String(attempt).padStart(2, " ")}/${MAX_ATTEMPTS} — ${gen.status}   \r`
    );

    if (gen.status === "COMPLETE") {
      process.stdout.write("\n");
      const imageUrl = gen.generated_images[0].url;

      // 3. Download image
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());

      // 4. Save to public/images/
      const outDir = join(ROOT, "public", "images");
      mkdirSync(outDir, { recursive: true });
      const outPath = join(outDir, slot.filename);
      writeFileSync(outPath, buffer);

      console.log(`    ✅  saved → public/images/${slot.filename}`);
      return;
    }

    if (gen.status === "FAILED") {
      throw new Error("Leonardo reported generation FAILED");
    }
  }

  throw new Error(`Timed out after ${MAX_ATTEMPTS} attempts`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Filter to specific filenames if provided as CLI args
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const targets = args.length
    ? IMAGES.filter((img) => args.includes(img.filename))
    : IMAGES;

  if (!targets.length) {
    console.error("\n❌  No matching image slots found.");
    console.error(
      "    Available:\n  " + IMAGES.map((i) => i.filename).join("\n  ") + "\n"
    );
    process.exit(1);
  }

  console.log("\n🎨  LK Digital — Leonardo AI Image Generator");
  console.log(`    Model : ${MODEL_ID}`);
  console.log(`    Queued: ${targets.length} image(s)\n`);

  let ok = 0;
  let fail = 0;

  for (const slot of targets) {
    try {
      await generateImage(slot);
      ok++;
    } catch (err) {
      process.stdout.write("\n");
      console.error(`    ❌  ${slot.filename}: ${err.message}`);
      fail++;
    }
  }

  console.log(
    `\n✨  Finished — ${ok} generated${fail ? `, ${fail} failed` : ""}.\n`
  );
  if (ok > 0) {
    console.log("    Images saved to public/images/");
    console.log("    Restart the dev server to see them: pnpm dev\n");
  }
  if (fail) process.exit(1);
}

main().catch((err) => {
  console.error("\n❌ Unexpected error:", err.message);
  process.exit(1);
});
