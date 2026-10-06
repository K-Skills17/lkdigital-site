# lead-magnets/

Offline builder and tests for the lead magnets of the series **"O Sistema Operacional da Clínica
Odontológica"**: RAIO-X (`/raio-x`), Checklist do Google, Calculadora de CAC, Dashboard da Clínica
and Scripts de WhatsApp (`/ferramentas/*`). It was moved in from `K-Skills17/lk-lead-magnets`.

The pages themselves are ordinary site pages (`src/app/…`, `src/tools/<slug>/`) and need nothing
from here. This folder only produces the **downloads** (files Vercel serves as-is) and tests them.
It has its own `package.json` so Playwright and Lighthouse never reach the site's deploy.

## Build the downloads

```bash
cd lead-magnets
npm install                     # Playwright (Chromium) + Lighthouse
pip install openpyxl            # spreadsheets; also needs LibreOffice Calc (apt install libreoffice-calc)
npm run build                   # everything
npm run build -- --only=pdf,md  # or a subset: pdf, md, og, exemplos, xlsx
```

Then commit what changed under `public/`.

| Output | From |
|---|---|
| `public/ferramentas/arquivos/checklist-google.pdf` | `src/tools/checklist-google/{content.json,render.mjs}` + `templates/checklist-print.html` |
| `public/ferramentas/arquivos/scripts-whatsapp.pdf`, `cola-rapida.pdf`, `scripts-whatsapp.md` | `src/tools/scripts-whatsapp/{content.json,render.mjs}` + `templates/booklet.html`, `templates/cola.html` |
| `public/ferramentas/arquivos/calculadora-cac.xlsx` | `xlsx/build_calculator.py` (same formulas as `src/tools/calculadora-cac/calc.js`) |
| `public/ferramentas/arquivos/dashboard-clinica.xlsx`, `dashboard-clinica-demo.xlsx`, `dashboard-preview.jpg` | `xlsx/build_dashboard.py`, `xlsx/preview.py` |
| `public/ferramentas/arquivos/og-*.png` (1200×630) | `templates/og/<slug>.html` |
| `public/exemplos/clinica-{antes,depois}.html` (Ep 10 props, noindex) | `templates/exemplos/*.html` |

One source for everything: the config (`src/tools/shared/lead-magnets.ts`), the fictional clinic
(`src/tools/shared/demo-clinic.json`, regenerate with `node gen-demo-data.mjs`), the checklist and
the scripts are the same files the pages use, so a page and its download can't drift. PDFs and OG
images embed Inter and Cormorant Garamond from `shared/fonts/`; colors come from `shared/brand.css`
(the site's tokens). Every calculated spreadsheet cell is a formula; `xlsx/xlsx_cache.py` recalculates
them with LibreOffice so previews show numbers.

## Tests

```bash
npm run test:assets                                    # the built files
BASE_URL=http://localhost:3000 npm run test:e2e        # the pages, on a running site
BASE_URL=http://localhost:3000 npm run test:lighthouse # mobile, ≥ 90 performance and accessibility
```

- **assets**: PDFs (A4, page counts, fonts embedded, every checklist item and every script present),
  the `.md`, compliance on every download (no R$, "a partir de", "garantia", "5 estrelas",
  "desconto", "antes e depois"), the spreadsheets' structure, and spreadsheet = web calculator on
  9 scenarios.
- **e2e** (Playwright, 390 px): each lead-magnet flow, the lead payload, the downloads, analytics
  events, returning visitors, redirects of the retired pages, the `/ferramentas` index and the
  shared shell on every tool page. The lead API is intercepted, so nothing reaches Neon or WhatsApp.
- The logic (calculator math, RAIO-X scoring, content rules) and the backbone adapters are covered by
  the site's own `npm test` (vitest).

## Compliance rules

- No prices in patient-facing text; R$ only in the calculator and dashboard (the clinic's own numbers).
- No promises of clinical results, no before/after images, no "garantia".
- Google reviews: ask every patient, no incentives, never ask for a star rating.
- LGPD: explicit unchecked consent on every form, with the privacy link. No personal data in URLs.
- Every fictional number or clinic is labelled "Clínica fictícia — dados ilustrativos".
