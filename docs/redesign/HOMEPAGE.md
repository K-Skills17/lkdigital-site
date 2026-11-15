# Homepage refine — 2026-11

Done in **refine mode** of the editorial-web-build directive (vitrine72 repo, `.claude/skills/editorial-web-build/SKILL.md`): the brand and every word of copy are kept; composition, component patterns, motion, accessibility and code structure change.

## Kept unchanged

- Logo, brand gold `#c5a368`, hero black `#0f0f0f`, Cormorant Garamond + Inter.
- All copy (verified by diffing the rendered text of the old and new homepage; see "Verification").
- URLs, metadata, structured data, GTM, Clarity, Meta pixel, chat widget, floating WhatsApp button.
- Navbar and Footer (shared with every page; not part of this pass).
- The diagnostic form's behaviour in `CTAFinal.tsx` (see "Open issues").
- The WebGL hero canvas.

## Structural idea

*Precisão.* Every section sits on a measured 12-column "spec sheet" grid: a narrow label column on the left (hairline + small caps), content on the right, hairline rules instead of boxes, and the brand's existing Roman numerals and step numbers as the index.

## Changes per section

| Section | Before | After |
|---|---|---|
| Hero | Centred, pill badge with pulsing green dot, scroll indicator, white-on-gold CTA | Left-anchored headline with italic gold line, ruled lower row (lead · CTAs · stats), plain gold eyebrow, no scroll indicator, dark-on-gold CTA |
| Social proof | 3 italic quotes, pulsing dot | Quotes in Cormorant italic in ruled columns |
| Problem | Centred heading, 2×2 grey cards with icons in circles | Label column + numbered ruled list, no icons |
| Pillars | 3 cards, icons in circles, checkmarks, hover line | Stacked spec rows: numeral · title · description + ruled benefits |
| How it works | Zig-zag with circles and rounded cards | Three columns under a gold top rule, CTA beside the heading |
| Services | Continuously scrolling marquee on blue-black `#060810` | Static list on the brand black |
| Manifesto | Centred, oversized decorative quote with bounce-in | Label column holds the quote mark; statement left-aligned; ruled trio |
| Latest posts | Rounded cards with gradient placeholder images | Ruled list under a strong top rule; category, title, excerpt |
| Cities | Scrolling marquee (moving links, each rendered twice) | Static two-column index of the 15 city links |
| FAQ | Rounded cards, centred heading | Heading in label column, ruled accordion, `role="region"` answers |
| Final CTA | Gradient background, green WhatsApp box, rounded inputs, shadowed card | Ruled copy column, outline WhatsApp button, square inputs with `autocomplete`, form under a gold top rule |

## Tokens added (derived, not new brand colours)

| Token | Value | Use |
|---|---|---|
| `--accent-ink` / `text-accent-ink` | `#7a6540` | Gold for **text and fine rules on light surfaces** |
| `spacing.gutter` | `clamp(1.25rem, 0.5rem + 3vw, 3.5rem)` | Page side gutter |
| `spacing.section` | `clamp(5rem, 3rem + 6vw, 9rem)` | Section rhythm |
| `maxWidth.page` | `80rem` | Homepage container |

## Contrast (WCAG 2.x, measured)

| Pair | Before | After |
|---|---|---|
| Brand gold text on `#fafafa` | 2.28 : 1 ✗ | replaced by `accent-ink`: 5.35 : 1 |
| `accent-ink` on white / `#f9f6f0` / `#f5f5f5` | — | 5.58 / 5.17 / 5.12 : 1 |
| Button label: white on gold | 2.38 : 1 ✗ | `#1a1a1a` on gold: 7.30 : 1 |
| Button hover: `#1a1a1a` on `#a8894f` | — | 5.27 : 1 |
| Gold on hero black | 8.04 : 1 | unchanged |
| Hero small text `white/40` | ~3.8 : 1 ✗ | `white/60`: ~7.2 : 1 |

## Bug fixed (affected the whole site)

`globals.css` declared `--font-display: "Cormorant Garamond"` and `--font-body: "Inter"` on `:root`. That overrode the variables next/font sets on `<html>`, so the browser looked for fonts by those plain names, found none installed, and fell back to the system serif (Times) and system sans. Measured before the fix: `document.fonts` had **0** loaded faces. After removing the two lines: Cormorant Garamond and Inter (self-hosted) load on every page. The Cormorant italic style is now loaded too.

## Other fixes

- The skip link ("Pular para o conteúdo") targeted `#main-content`, which was on the final CTA at the bottom of the page. `id="main-content"` is now on `<main>` on `/`, `/contato` and `/faq`.
- Removed the unused marquee CSS and keyframes.
- Scroll animations reduced to pillar rows, steps, the form and the hero canvas fade (previously quotes, problem items, pillars sliding in from the sides, a bouncing quote mark, manifesto and trio as well).
- Old-style figures in Cormorant made "01" read as "oI"; numbers use lining figures.

## Verification (actual runs)

- `npx tsc --noEmit`: pass. `npm run lint`: pass (2 existing `<img>` warnings in `ChatWidget.tsx`). `npm test`: 120/120 pass. `next build`: pass.
- Viewports 1440, 1024, 768, 390, 360 on `/`, `/contato`, `/faq`: no horizontal overflow, no console errors (GTM/Clarity requests are blocked by the build sandbox's network; not a site error).
- Elements extending past the right edge of the homepage: 222 before (marquees, hidden by `overflow-x: hidden`), 0 after.
- Rendered-text diff old vs new homepage: no words changed. Differences: removed "Scroll" label of the scroll indicator, a leading "—" before testimonial roles, the manifesto sentence no longer split by a line break, `/` instead of `·` between services, and new numbering on the problem list.
- `audit.sh` on the changed sections: 0 gradients, blur, rounded cards, pills, shadows, hover-scale, scroll arrows. Remaining: 5 three-column grids (ruled data rows, not card grids) and 1 `text-center` (button labels).
- Screenshots: `before-home-*.png`, `after-home-*.png`, `after-contato-*.png`, `after-faq-*.png` in this folder.
- Not run: Lighthouse.

## Open issues for the owner

1. **The diagnostic form does not send anything.** `handleSubmit` in `CTAFinal.tsx` waits 1.5 s ("Simulate submission — replace with real endpoint"), shows "Recebemos seus dados… entraremos em contato em até 24 horas úteis", and fires `generate_lead` to analytics. Every lead from this form (homepage and `/contato`) is lost, and the lead metric is inflated. Recommended: send it through the existing backbone (`submitLead` → `tool_leads`, Telegram alert), like the tools do.
2. **Testimonials.** The three quotes are anonymous ("Implantodontista — São Paulo, SP"). If they are not from real clients, they must be removed; if they are, consider getting permission to name them.
3. **Floating widgets on mobile.** The WhatsApp button and the chat bubble sit over content on small screens (e.g. over the hero stats at 390px). They are global components, outside this pass.
4. **Inter as body font.** The directive lists Inter as a generic face. It is the brand font, so it was kept.
