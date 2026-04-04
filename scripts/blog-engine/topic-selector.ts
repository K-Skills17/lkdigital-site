// ═══════════════════════════════════════════════════════════════
// LK Digital Blog Engine — Topic Selector
// Selects next topics from calendar + addon topics
// ═══════════════════════════════════════════════════════════════

import * as fs from "fs";
import * as path from "path";
import { ADDON_TOPICS_FILE, type TopicSeed, type Pillar } from "./config";
import { getPublishedList, getPublishedSlugs } from "./publisher";
import { SEED_TOPICS } from "./topics";

// ─── Load addon topics ───
function loadAddonTopics(): TopicSeed[] {
  const filePath = path.resolve(ADDON_TOPICS_FILE);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

// ─── Get all available topics ───
function getAllTopics(): TopicSeed[] {
  const seeds = SEED_TOPICS;
  const addons = loadAddonTopics();
  return [...seeds, ...addons];
}

// ─── Score a topic ───
function scoreTopic(
  topic: TopicSeed,
  publishedSlugs: string[],
  publishedCategories: Record<string, number>
): number {
  let score = 0;

  // Priority score
  score += topic.priority === 1 ? 30 : topic.priority === 2 ? 20 : 10;

  // Search intent
  if (topic.searchIntent === "commercial") score += 10;
  else if (topic.searchIntent === "transactional") score += 12;
  else score += 8;

  // Secondary keywords bonus
  score += Math.min(topic.secondaryKeywords.length * 2, 10);

  // Category diversity — fewer published = higher score
  const catCount = publishedCategories[topic.category] || 0;
  score += Math.max(15 - catCount * 2, 0);

  // Pillar diversity
  const pillarWeights: Record<Pillar, number> = {
    P1: 5,
    P2: 8, // Problems get slight boost (high resonance)
    P3: 5,
    P4: 6,
    P5: 7, // Expert frameworks get boost (unique value)
  };
  score += pillarWeights[topic.pillar] || 5;

  // Problem/framework reference bonus
  if (topic.problemRef) score += 5;
  if (topic.frameworkRef) score += 5;

  // Random factor for variety
  score += Math.floor(Math.random() * 6);

  return score;
}

// ─── Select topics ───
export function selectTopics(count: number): TopicSeed[] {
  const allTopics = getAllTopics();
  const publishedSlugs = getPublishedSlugs();
  const publishedTitles = getPublishedList();

  // Filter out published
  const available = allTopics.filter(
    (t) =>
      !publishedSlugs.includes(t.slug) &&
      !publishedTitles.includes(t.title)
  );

  if (available.length === 0) {
    console.log("⚠️  No available topics remaining. Run topic research.");
    return [];
  }

  // Count published per category
  const publishedCategories: Record<string, number> = {};
  // We'd need to read articles to get categories, but for now use slug patterns
  for (const slug of publishedSlugs) {
    // Simple heuristic — will be refined when more articles exist
    publishedCategories["general"] = (publishedCategories["general"] || 0) + 1;
  }

  // Score and sort
  const scored = available
    .map((topic) => ({
      topic,
      score: scoreTopic(topic, publishedSlugs, publishedCategories),
    }))
    .sort((a, b) => b.score - a.score);

  // Pick top N, max 2 per category per run
  const selected: TopicSeed[] = [];
  const categoryCount: Record<string, number> = {};

  for (const { topic } of scored) {
    if (selected.length >= count) break;
    const catCount = categoryCount[topic.category] || 0;
    if (catCount >= 2) continue;
    selected.push(topic);
    categoryCount[topic.category] = catCount + 1;
  }

  return selected;
}

// ─── Stats ───
export function getStats(): {
  total: number;
  published: number;
  remaining: number;
  byPillar: Record<string, number>;
  byCategory: Record<string, number>;
} {
  const allTopics = getAllTopics();
  const publishedSlugs = getPublishedSlugs();

  const remaining = allTopics.filter(
    (t) => !publishedSlugs.includes(t.slug)
  );

  const byPillar: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const t of remaining) {
    byPillar[t.pillar] = (byPillar[t.pillar] || 0) + 1;
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  }

  return {
    total: allTopics.length,
    published: publishedSlugs.length,
    remaining: remaining.length,
    byPillar,
    byCategory,
  };
}
