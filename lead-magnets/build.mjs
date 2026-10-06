// Offline builder for the lead-magnet downloads. Run it when content, demo data or design change,
// then commit the outputs (Vercel only serves them):
//
//   cd lead-magnets && npm install && npm run build            # everything
//   npm run build -- --only=pdf,md,og,exemplos,xlsx             # a subset
//
// Sources are the site's own modules, so pages and downloads never drift:
//   src/tools/shared/lead-magnets.ts           config (site URL, WhatsApp, file paths)
//   src/tools/shared/demo-clinic.json          fictional clinic (example data, Ep 10 props)
//   src/tools/checklist-google/{content.json,render.mjs}   checklist page + PDF
//   src/tools/scripts-whatsapp/{content.json,render.mjs}   booklet PDF, cheat sheet PDF, .md
//
// Outputs:
//   public/ferramentas/arquivos/  checklist-google.pdf, scripts-whatsapp.pdf, cola-rapida.pdf,
//                                 scripts-whatsapp.md, og-*.png, calculadora-cac.xlsx,
//                                 dashboard-clinica.xlsx, dashboard-clinica-demo.xlsx, dashboard-preview.jpg
//   public/exemplos/              clinica-antes.html, clinica-depois.html (Ep 10 props)
//
// Needs Playwright (npm install here) for PDFs/PNGs, and python3 + openpyxl + LibreOffice Calc for the xlsx.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const LM = dirname(fileURLToPath(import.meta.url));
export const SITE = join(LM, '..');
export const OUT = join(SITE, 'public/ferramentas/arquivos');
export const EXEMPLOS = join(SITE, 'public/exemplos');
const readJson = (p) => JSON.parse(readFileSync(join(SITE, p), 'utf8'));

export const PDFS = {
  'checklist-print.html': { out: 'checklist-google.pdf', footer: 'LK Digital · Checklist do Perfil da Empresa no Google' },
  'booklet.html': { out: 'scripts-whatsapp.pdf', footer: 'LK Digital · Scripts de WhatsApp' },
  'cola.html': { out: 'cola-rapida.pdf' },
};
export const OG = ['raio-x', 'checklist-google', 'calculadora-cac', 'dashboard-clinica', 'scripts-whatsapp'];
export const EXEMPLO_PAGES = ['clinica-antes', 'clinica-depois'];

const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function loadSources() {
  const { LEAD_MAGNET_CONFIG } = await import(pathToFileURL(join(SITE, 'src/tools/shared/lead-magnets.ts')).href);
  return {
    cfg: LEAD_MAGNET_CONFIG,
    demo: readJson('src/tools/shared/demo-clinic.json'),
    content: {
      'checklist-google': readJson('src/tools/checklist-google/content.json'),
      'scripts-whatsapp': readJson('src/tools/scripts-whatsapp/content.json'),
    },
    render: {
      'checklist-google': await import(pathToFileURL(join(SITE, 'src/tools/checklist-google/render.mjs')).href),
      'scripts-whatsapp': await import(pathToFileURL(join(SITE, 'src/tools/scripts-whatsapp/render.mjs')).href),
    },
  };
}

function fontFace(family, file, weights) {
  const b64 = readFileSync(join(LM, 'shared/fonts', file)).toString('base64');
  return `@font-face{font-family:"${family}";font-weight:${weights};font-style:normal;src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
}

/** Fill a template: fonts, tokens, rendered content, demo values. */
export function fill(template, src) {
  let html = readFileSync(join(LM, 'templates', template), 'utf8');
  html = html.replace(/<!--@render:([\w-]+)#(\w+)-->/g, (m, tool, fn) => {
    const mod = src.render[tool];
    if (!mod || typeof mod[fn] !== 'function') throw new Error(`${template}: unknown render ${tool}#${fn}`);
    return mod[fn](src.content[tool], src.cfg);
  });
  html = html.split('/*@font-inter*/').join(fontFace('Inter', 'inter-latin-var.woff2', '400 800') + fontFace('Cormorant Garamond', 'cormorant-latin-var.woff2', '500 700'));
  html = html.split('/*@brand*/').join(readFileSync(join(LM, 'shared/brand.css'), 'utf8'));
  html = html.replace(/\{\{demo\.([\w.]+)\}\}/g, (m, p) => {
    const v = p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), src.demo);
    if (v === undefined) throw new Error(`${template}: unknown ${m}`);
    return escHtml(v);
  });
  const left = html.match(/\/\*@[a-z-]+\*\/|<!--@[a-z]+[^>]*-->|\{\{(demo|config)\.[\w.]+\}\}/);
  if (left) throw new Error(`${template}: unresolved marker ${left[0]}`);
  return html;
}

async function withBrowser(fn) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  try { await fn(browser); } finally { await browser.close(); }
}

async function renderPage(browser, html, viewport) {
  const tmp = join(LM, '.build');
  mkdirSync(tmp, { recursive: true });
  const file = join(tmp, `page-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(file, html);
  const page = await browser.newPage(viewport ? { viewport } : {});
  await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

const STEPS = {
  async pdf(src) {
    await withBrowser(async (browser) => {
      for (const [template, { out, footer }] of Object.entries(PDFS)) {
        const page = await renderPage(browser, fill(template, src));
        await page.pdf({
          path: join(OUT, out), format: 'A4', printBackground: true, preferCSSPageSize: true,
          displayHeaderFooter: !!footer,
          headerTemplate: '<span></span>',
          footerTemplate: footer
            ? `<div style="width:100%;font:7px Helvetica,Arial,sans-serif;color:#888;padding:0 15mm;display:flex;justify-content:space-between"><span>${escHtml(footer)}</span><span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>`
            : '<span></span>',
        });
        await page.close();
        console.log('public/ferramentas/arquivos/' + out);
      }
    });
  },
  async md(src) {
    writeFileSync(join(OUT, 'scripts-whatsapp.md'), src.render['scripts-whatsapp'].markdown(src.content['scripts-whatsapp']));
    console.log('public/ferramentas/arquivos/scripts-whatsapp.md');
  },
  async og(src) {
    await withBrowser(async (browser) => {
      for (const slug of OG) {
        const page = await renderPage(browser, fill(`og/${slug}.html`, src), { width: 1200, height: 630 });
        await page.screenshot({ path: join(OUT, `og-${slug}.png`) });
        await page.close();
        console.log(`public/ferramentas/arquivos/og-${slug}.png`);
      }
    });
  },
  async exemplos(src) {
    mkdirSync(EXEMPLOS, { recursive: true });
    for (const name of EXEMPLO_PAGES) {
      writeFileSync(join(EXEMPLOS, `${name}.html`), fill(`exemplos/${name}.html`, src));
      console.log(`public/exemplos/${name}.html`);
    }
  },
  async xlsx() {
    for (const script of ['build_calculator.py', 'build_dashboard.py', 'preview.py']) {
      execFileSync('python3', [join(LM, 'xlsx', script)], { stdio: 'inherit', timeout: 900000 });
    }
  },
};

async function main() {
  const arg = process.argv.find((a) => a.startsWith('--only='));
  const only = arg ? arg.slice(7).split(',') : Object.keys(STEPS);
  for (const s of only) if (!STEPS[s]) throw new Error(`unknown step ${s} (steps: ${Object.keys(STEPS).join(', ')})`);
  mkdirSync(OUT, { recursive: true });
  const src = await loadSources();
  for (const s of only) await STEPS[s](src);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
