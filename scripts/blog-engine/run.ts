// ═══════════════════════════════════════════════════════════════
// LK Digital Blog Engine — Main Runner
// Usage:
//   npx tsx scripts/blog-engine/run.ts                    # Generate 1 article
//   npx tsx scripts/blog-engine/run.ts --count 3          # Generate 3 articles
//   npx tsx scripts/blog-engine/run.ts --stats            # Show pipeline stats
//   npx tsx scripts/blog-engine/run.ts --dry-run          # Preview without generating
// ═══════════════════════════════════════════════════════════════

import { generateArticle } from "./generator";
import { publishArticle, getPublishedSlugs } from "./publisher";
import { selectTopics, getStats } from "./topic-selector";

// ─── Parse args ───
const args = process.argv.slice(2);
const action = args.includes("--stats")
  ? "stats"
  : args.includes("--dry-run")
  ? "dry-run"
  : "generate";

const countIdx = args.indexOf("--count");
const count = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) || 1 : 1;

// ─── Stats ───
function showStats() {
  const stats = getStats();
  console.log("\n📊 LK Digital Blog Engine — Stats");
  console.log("═══════════════════════════════════════");
  console.log(`Total topics:     ${stats.total}`);
  console.log(`Published:        ${stats.published}`);
  console.log(`Remaining:        ${stats.remaining}`);
  console.log("\nBy Pillar:");
  for (const [pillar, count] of Object.entries(stats.byPillar)) {
    console.log(`  ${pillar}: ${count} remaining`);
  }
  console.log("\nTop Categories (remaining):");
  const sorted = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sorted.slice(0, 10)) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log("═══════════════════════════════════════\n");
}

// ─── Main ───
async function main() {
  console.log("\n🦷 LK Digital Blog Engine");
  console.log(`   Action: ${action} | Count: ${count}\n`);

  if (action === "stats") {
    showStats();
    return;
  }

  // Select topics
  const topics = selectTopics(count);
  if (topics.length === 0) {
    console.log("❌ No topics available. Pipeline is empty.");
    process.exit(1);
  }

  console.log(`📋 Selected ${topics.length} topic(s):`);
  for (const t of topics) {
    console.log(`   [${t.pillar}] ${t.title}`);
  }

  if (action === "dry-run") {
    console.log("\n🏃 Dry run — no articles generated.");
    showStats();
    return;
  }

  // Generate and publish
  const publishedSlugs = getPublishedSlugs();
  let generated = 0;

  for (const topic of topics) {
    try {
      const article = await generateArticle(topic, publishedSlugs);
      const slug = publishArticle(article);
      publishedSlugs.push(slug);
      generated++;
    } catch (error) {
      console.error(`\n❌ Failed to generate "${topic.title}":`, error);
    }
  }

  console.log(`\n✅ Generated ${generated}/${topics.length} article(s)`);
  showStats();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
