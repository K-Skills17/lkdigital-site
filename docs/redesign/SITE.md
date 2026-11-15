# Site-wide refine and fixes — 2026-11

Follows the homepage refine (HOMEPAGE.md) in the same refine mode: brand and copy kept, composition and components changed. Exceptions to "copy kept" are listed under "Content removed".

## Lead form (homepage and /contato)

The diagnostic form only simulated a submission. It now goes through the backbone as tool `diagnostico-gratuito` (`src/lib/backbone/tools/diagnostico-gratuito.ts`): stored in `tool_leads`, shown on the /painel dashboard, alerted on Telegram. The form has no phone field, so no AI plan or WhatsApp report is sent; the team replies by e-mail as the form promises.

- "Diagnóstico Solicitado" and the `generate_lead` event only follow a stored lead id. Otherwise the visitor sees an error with a WhatsApp link (the API route answers `success: true` even when the pipeline throws, so the form checks `leadId`).
- Added: unchecked LGPD consent (same wording as the lead magnets), a hidden honeypot field.
- Tests: generic adapter tests plus consent, e-mail, challenge and honeypot rejection (`backbone.test.ts`).

## Content removed

- Homepage testimonials (`SocialProof`) and the /casos case studies: not from real clients. /casos redirects (temporary) to /solucoes; links, sitemap and IndexNow entries removed.
- /termos, clause 11: removed the sentence stating the site's case studies and testimonials were based on real results.
- /cidades/[slug]: the pulsing "Verificar" badge on each specialty (it repeated the link below it).

## Mobile contact

Below `md` on marketing pages, one bottom bar (WhatsApp · Assistente IA) replaces the two floating bubbles and reserves its height. Tools, /raio-x, /painel and /demo keep the bubbles (`src/components/mobileBar.ts`).

## Shared components

- `ui/primitives.tsx` (moved from `home/`): the one button (`buttonClass`, now with `size`), container, section label, spec grid.
- `ui/PageHero.tsx`: same props and variants. Derived gold on light variants, no gradients, shared buttons, small text on dark at 70% white (was 40–45%, ~3.8:1). Now a Server Component.
- `layout/Navbar.tsx`: solid brand black (no blur or shadow), dark-on-gold CTA, mobile menu as a ruled list with Escape to close and focus moved in.

## Tailwind opacity fix (site-wide)

Brand colours are CSS variables, which Tailwind 3 cannot add opacity to: every class such as `border-border/60`, `bg-accent/10` or `border-foreground/15` (~150 uses) generated **no CSS**. Colours are now functions that emit `color-mix()` when an opacity is used (`tailwind.config.ts`), so those classes work as written.

## Pages

| Page | Changes |
|---|---|
| /cidades/[slug] (15 pages) | Full markup refine: left-aligned hero with ruled stats, spec-grid sections, ruled lists instead of check-icon boxes and pills, numbered steps, ruled FAQ, dark closing CTA. Competition colours (red/yellow/green) replaced by text. |
| /sobre, /solucoes, /segmentos, /cidades, /faq, /ferramentas, /blog, article view | Class-level refine: derived gold for text on light, dark labels on gold, shared button, no rounding, shadows, hover-lift, gradients or pulsing dots. |
| /blog | Pagination wraps on mobile (was 25px past the right edge at 390px). |

## Verification (actual runs)

- `tsc`, lint, 128/128 tests, `next build`: pass.
- Browser checks: form blocks submit without consent; POST reaches the backbone; with no database the error is shown, not "received"; /casos redirects; mobile bar shown and bubbles hidden on /, /sobre, /contato at 390px; footer not covered; bar opens the chat; tool page and desktop keep the bubbles.
- /sobre, /solucoes, /segmentos, /cidades, /cidades/curitiba, /blog, /ferramentas, /faq, /contato at 1440 and 390: HTTP 200, no element past the right edge, no console errors.
- Screenshots kept in `pages/`: city page before/after. Not run: Lighthouse, a real lead submission against the production database.

## Still open

- Some final CTA sections on inner pages stay centred.
- /sobre team cards and the article view keep their structure (only classes changed).
- Homepage FAQ: "A maioria dos nossos clientes… 2 a 4 semanas" is a results claim; keep only if it holds for real clients.
