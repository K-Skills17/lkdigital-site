# LK Digital — Blog Content Automation System

## Overview
Daily blog posting for 90 days (then 3x/week) using AI-assisted content generation
informed by proprietary problem research and mentor frameworks.

## Architecture
```
Content Calendar (Google Sheets) → Make.com Scenario → Claude API → Draft Queue → Review → Publish
```

## Content Sources
1. Master Problems List (dentist pain points — 90+ topics)
2. Alex Hormozi frameworks ($100M Offers, $100M Leads, Money Models)
3. Dan Kennedy principles (No B.S. Wealth Attraction)
4. Donella Meadows (Thinking in Systems — applied to dental practice)
5. Industry data and CFO regulations

## Files in This Directory
- `content-calendar-90-days.ts` — Full 90-day content calendar with titles, keywords, outlines
- `content-prompts.md` — AI generation prompts for each content pillar
- `make-automation-blueprint.md` — Step-by-step Make.com setup guide
- `quality-checklist.md` — Pre-publish quality gates
