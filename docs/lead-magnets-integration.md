# Lead magnets → lkdigital-site integration (progress file)

Moves the `K-Skills17/lk-lead-magnets` build (spec v2) into this site so every lead magnet is a page on
lkdigital.odo.br, shares the site shell, and sends leads through the backbone (`tool_leads` in Neon).
Owner instruction: do every move now, unify overlapping tools/data (keep the most important, discard the
rest), make the site uniform, reuse the site's GTM. **If a session stops midway, resume from the first
unchecked phase below.** Branch: `claude/kskillz-17-github-cloud-ldooi3`.

## Decisions (made without asking, per the owner's instruction)

| Topic | Decision |
|---|---|
| `/raio-x` | The new RAIO-X (lead-to-chair, 6 areas, 12 questions, oferta/nutrir CTA) **replaces** the LK × Biodonte scorecard (2 domains, Marcos routing). Spec v2: "Default: no Marcos routing". |
| `/unicornio` | Retired (spec v2 says the new RAIO-X replaces the Unicórnio brief). Permanent redirect → `/raio-x`. |
| RAIO-X Digital 2026 (`raiox_leads`, `components/raiox`) | Orphaned (no page uses it). Code removed; rows kept (see data). |
| `/ferramentas/diagnostico-google` | Replaced by the richer GBP checklist + review kit at `/ferramentas/checklist-google` (27 items, live score, PDF, review templates). Permanent redirect. |
| `/ferramentas/diagnostico-clinica` | Retired: its losses (faltas, orçamentos, evasão, marketing) are covered by the RAIO-X areas + the CAC calculator. Permanent redirect → `/raio-x`. |
| Kept tools | auditoria-site, simulador-convenios, calculadora-precificacao, calculadora-agenda (no overlap). |
| New tools | `/raio-x`, `/ferramentas/checklist-google`, `/ferramentas/calculadora-cac`, `/ferramentas/dashboard-clinica`, `/ferramentas/scripts-whatsapp`. |
| Ep 10 props | Static `public/exemplos/clinica-{antes,depois}.html`, served at `/exemplos/clinica-antes` and `/exemplos/clinica-depois`, not in nav/sitemap. |
| Look | Every tool page renders inside the same shell: site `Navbar` + light page + `Footer`, Cormorant/Inter, gold accent. Tools no longer carry their own brand headers. |
| Lead data | One table: `tool_leads`. Legacy rows from `raiox_leads`, `unicornio_leads`, `raio_x_scorecard_leads` are copied into `tool_leads` (tool = `raio-x-2026`, `unicornio`, `raio-x-scorecard`, full row kept in `payload`); `all_leads` reads `tool_leads` only. Legacy tables are no longer created or written; dropping them is a manual step (`db/drop-legacy-lead-tables.sql`) after checking the copy. |
| Config | WhatsApp 5511946851028 (site), privacy `/privacidade`, implant offer `/pre-temporada`, GTM `GTM-P9RPPHD9` (root layout), files under `/ferramentas/arquivos/`. YouTube episode URLs: `src/tools/shared/lead-magnets.ts` (empty until each episode is published; the name shows without a link). |
| Generator | PDFs/xlsx/md/OG images are built offline by `lead-magnets/` (Playwright + LibreOffice) into `public/ferramentas/arquivos/`; Vercel only serves them. |

## Architecture

- `src/tools/<slug>/` — tool frontend: `App.jsx` (client island), `index.css` (auto-scoped to `.tool-<slug>`),
  page logic modules and content (shared with the offline generator).
- `src/components/tools/ToolShell.tsx` — Navbar + `<main>` + Footer wrapper used by every tool page.
- `src/tools/shared/lead-form.js` — the lead form for the lead magnets; submits through `submitLead()`.
- `src/lib/backbone/tools/<slug>.ts` — adapters (parse, AI prompt, WhatsApp message) for the new tools.

## Phases

- [x] 1. Shared: ToolShell, lead-magnet config, lead form on the backbone, analytics helper
- [x] 2. RAIO-X at `/raio-x` + adapter; remove scorecard/Unicórnio/RAIO-X 2026 code; redirects
- [x] 3. GBP checklist at `/ferramentas/checklist-google` + adapter; remove diagnostico-google
- [x] 4. Calculadora de CAC + adapter
- [x] 5. Dashboard da Clínica + adapter
- [ ] 6. Scripts de WhatsApp + adapter
- [ ] 7. Uniform shell on kept tools; remove diagnostico-clinica; `/ferramentas` index, sitemap, robots, Ep 10 props
- [x] 8. Data: legacy rows → `tool_leads`, `all_leads` view, painel labels, drop script (done with phase 2)
- [ ] 9. Generator in `lead-magnets/`, assets in `public/ferramentas/arquivos/`, tests, Lighthouse, docs, PR
