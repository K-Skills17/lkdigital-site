// End-to-end tests of the lead-magnet pages, run against a running site (next dev or next start):
//   BASE_URL=http://localhost:3000 npm run test:e2e        (from lead-magnets/)
// The lead API is intercepted, so nothing reaches Neon, WhatsApp or Meta.
import { chromium } from 'playwright';

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const only = process.argv[2] || '';
let failures = 0, passes = 0;

function check(name, cond, detail) {
  if (cond) { passes++; console.log('  ✓ ' + name); }
  else { failures++; console.log('  ✗ ' + name + (detail !== undefined ? ' — ' + JSON.stringify(detail) : '')); }
}

async function newPage(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, ...opts });
  const page = await ctx.newPage();
  const posts = [];
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/api/ferramentas/*/lead', async (route) => {
    const req = route.request();
    posts.push({ url: req.url(), body: JSON.parse(req.postData() || '{}') });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, leadId: 'x', messageSent: true }) });
  });
  return { ctx, page, posts, errors };
}

async function fillLead(page, scope = '') {
  const s = (sel) => page.locator(scope + ' ' + sel).first();
  await s('#lk_nome').fill('Ana Teste');
  await s('#lk_clinica').fill('Clínica Teste');
  await s('#lk_cidade').fill('Campinas');
  await s('#lk_whatsapp').fill('11946851028');
  const esp = s('#lk_esp');
  if (!(await esp.inputValue())) await esp.selectOption({ index: 1 });
  await s('#lk_consent').check();
}

const suites = {};

suites['raio-x'] = async (browser) => {
  const { ctx, page, posts, errors } = await newPage(browser);
  await page.goto(BASE + '/raio-x', { waitUntil: 'networkidle' });
  check('uses the site shell (navbar + footer)', (await page.locator('header, nav').count()) > 0 && (await page.locator('footer').count()) > 0);
  check('title', (await page.title()).startsWith('RAIO-X da clínica odontológica'));
  await page.click('#start');
  // Profile: implant, 50–80%, no ads → oferta when total ≤ 70.
  for (const i of [0, 2, 0]) { await page.locator('.rx-opt').nth(i).click(); await page.waitForTimeout(260); }
  check('first scored question shows', (await page.textContent('#count')).includes('Pergunta 1 de 12'));
  // Back button returns to profile 3.
  await page.click('#back');
  check('back goes to the previous screen', (await page.textContent('#count')).includes('Perfil 3 de 3'));
  await page.locator('.rx-opt').nth(0).click(); await page.waitForTimeout(260);
  for (let q = 0; q < 12; q++) { await page.locator('.rx-opt').nth(q < 2 ? 3 : 1).click(); await page.waitForTimeout(260); }
  await page.waitForSelector('#result.on');
  const score = await page.textContent('#r-score');
  check('free result shows score and band', /\/100/.test(score) && (await page.textContent('#r-band')).length > 3, score);
  check('weakest area shown', (await page.textContent('#r-weak-name')) === 'Visibilidade');
  check('full report hidden before the form', await page.locator('#full').isHidden());
  check('consent unchecked by default', !(await page.locator('#gate #lk_consent').isChecked()));
  check('especialidade prefilled from the profile', (await page.locator('#gate #lk_esp').inputValue()) === 'Implantes/Prótese');
  check('privacy link', (await page.locator('#gate a[href="/privacidade"]').count()) === 1);
  await fillLead(page, '#gate');
  await page.locator('#gate button[type=submit]').click();
  await page.waitForSelector('#full:not([hidden])');
  check('one lead POST to /api/ferramentas/raio-x/lead', posts.length === 1 && posts[0].url.endsWith('/api/ferramentas/raio-x/lead'), posts.map((p) => p.url));
  const b = posts[0] ? posts[0].body : {};
  check('payload has contact + consent', b.name === 'Ana Teste' && b.clinicName === 'Clínica Teste' && b.consent === true && String(b.phone).replace(/\D/g, '') === '11946851028', b);
  check('payload has all 12 answers + profile', b.data && b.data.answers && Object.keys(b.data.answers).filter((k) => /^q\d+$/.test(k)).length === 12 && b.data.answers.particular === '50–80%');
  check('payload has meta (event id) for CAPI dedupe', b._meta && !!b._meta.eventId);
  check('6 area bars', (await page.locator('#areas .area').count()) === 6);
  check('oferta CTA → /pre-temporada', (await page.locator('#cta[data-segment=oferta] a[href="/pre-temporada"]').count()) === 1);
  check('WhatsApp CTA with the spec message', decodeURIComponent((await page.locator('#cta a[href*="wa.me/5511946851028"]').getAttribute('href')) || '').includes('Fiz o RAIO-X da Clínica Teste'));
  const events = await page.evaluate(() => (window.dataLayer || []).map((e) => e.event));
  for (const ev of ['asset_view', 'raiox_start', 'raiox_profile_done', 'raiox_question', 'raiox_complete', 'lead_submitted', 'raiox_gate_submit']) {
    check('dataLayer event ' + ev, events.includes(ev), events);
  }
  check('no page errors', errors.length === 0, errors);

  // Returning visitor: skips the form, the lead is sent again (alwaysSend), report shows.
  await page.click('#restart');
  await page.click('#start');
  for (const i of [1, 3, 0]) { await page.locator('.rx-opt').nth(i).click(); await page.waitForTimeout(260); }
  for (let q = 0; q < 12; q++) { await page.locator('.rx-opt').nth(0).click(); await page.waitForTimeout(260); }
  await page.waitForSelector('#full:not([hidden])');
  check('returning visitor skips the form and gets the report', (await page.locator('#gate #lk_nome').count()) === 0);
  check('returning visitor lead sent again', posts.length === 2 && posts[1].body.returning === true);
  check('nutrir CTA → free material for the weakest area', (await page.locator('#cta[data-segment=nutrir] a.btn').first().getAttribute('href')) !== null);
  await ctx.close();
};

suites['checklist-google'] = async (browser) => {
  const { ctx, page, posts, errors } = await newPage(browser);
  await page.goto(BASE + '/ferramentas/checklist-google', { waitUntil: 'networkidle' });
  check('title', (await page.title()).startsWith('Checklist do Perfil da Empresa no Google'));
  const items = await page.locator('.cl-main input[data-id]').count();
  check('27 items in 9 sections', items === 27 && (await page.locator('.cl-main .sec').count()) === 9, items);
  check('every item has por quê + como', (await page.locator('.cl-main .item').evaluateAll((els) => els.every((e) => e.querySelectorAll('p').length >= 2))));
  await page.locator('.cl-main .item label').nth(0).click();
  await page.locator('.cl-main .item label').nth(1).click();
  check('live score', (await page.textContent('#done')) === '2' && (await page.textContent('#pct')) === '7');
  await page.reload({ waitUntil: 'networkidle' });
  check('ticks saved across reloads', (await page.textContent('#done')) === '2');
  check('progress bar sticks below the navbar', (await page.locator('.progress').evaluate((e) => getComputedStyle(e).top)) === '64px');
  check('templates have copy buttons', (await page.locator('.copy').count()) >= 4);
  const tplText = (await page.locator('.tpl pre').allTextContents()).join('\n');
  check('templates: no star request, no incentive', !/5 estrelas|cinco estrelas|desconto|brinde|sorteio/i.test(tplText));
  check('PDF link not shown before the form', (await page.locator('a[href$="checklist-google.pdf"]').count()) === 0);
  await fillLead(page, '#lead');
  await page.locator('#lead button[type=submit]').click();
  await page.waitForSelector('#lead a[href$="checklist-google.pdf"]');
  check('lead POST to checklist-google with progress', posts.length === 1 && posts[0].url.endsWith('/api/ferramentas/checklist-google/lead') && posts[0].body.data.done === 2, posts.map((p) => p.body.data));
  check('PDF link → /ferramentas/arquivos/', (await page.locator('#lead a[download]').getAttribute('href')) === '/ferramentas/arquivos/checklist-google.pdf');
  check('RAIO-X CTA on thank-you', (await page.locator('#lead a[href="/raio-x"]').count()) === 1);
  check('WhatsApp sent note', await page.locator('#lead [data-wa-note]').isVisible());
  check('no page errors', errors.length === 0, errors);
  await ctx.close();
};

suites['calculadora-cac'] = async (browser) => {
  const { ctx, page, posts, errors } = await newPage(browser);
  const txt = (sel) => page.locator(sel).first().textContent();
  await page.goto(BASE + '/ferramentas/calculadora-cac', { waitUntil: 'networkidle' });
  check('title', (await page.title()).startsWith('Calculadora de CAC'));
  check('empty calculator shows "–" (results not gated)', (await txt('[data-out="cacReal"]')) === '–');
  await page.click('#exemplo');
  const want = { cpl: 'R$ 10,00', custoQual: 'R$ 25,00', custoAgend: 'R$ 66,67', custoComp: 'R$ 100,00', cacAds: 'R$ 300,00', cacReal: 'R$ 500,00',
    receita: 'R$ 46.750,00', lucro: 'R$ 18.700,00', roi: '274%', roas: '15,6' };
  for (const [k, v] of Object.entries(want)) check('acceptance ' + k + ' = ' + v, (await txt('[data-out="' + k + '"]')) === v, await txt('[data-out="' + k + '"]'));
  check('"1 em cada 30"', (await txt('[data-out="umEmCada"]')).includes('1 em cada 30'));
  check('example labelled fictitious', await page.isVisible('#demo-flag') && await page.isVisible('#demo-flag-2'));
  check('gap explained', (await txt('#cac-msg')).includes('R$ 200,00 a mais'));
  check('biggest lever: fechamento', (await page.locator('#onde-out li.best').getAttribute('data-step')) === 'fechamento');
  // Live recalculation.
  await page.fill('#invest', '6000');
  check('live recalculation', (await txt('[data-out="cacAds"]')) === 'R$ 600,00');
  // URL prefill.
  await page.goto(BASE + '/ferramentas/calculadora-cac?invest=3000&fixos=2000&leads=300&qual=120&agend=45&comp=30&fech=10&proc=Implante:4:5000:40', { waitUntil: 'networkidle' });
  check('URL prefill', (await txt('[data-out="cacReal"]')) === 'R$ 500,00' && !(await page.isVisible('#demo-flag')));
  await page.goto(BASE + '/ferramentas/calculadora-cac#ltv', { waitUntil: 'networkidle' });
  check('#ltv opens the LTV section', await page.locator('#ltv-box').evaluate((e) => e.open));
  check('sticky CAC bar', await page.isVisible('.sticky'));
  // Lead: real numbers are sent as inputs.
  await fillLead(page, '#lead');
  await page.locator('#lead button[type=submit]').click();
  await page.waitForSelector('#lead a[download]');
  const b = posts[0] ? posts[0].body : {};
  check('lead POST to calculadora-cac with the inputs', posts.length === 1 && posts[0].url.endsWith('/api/ferramentas/calculadora-cac/lead') && b.data.inputs && b.data.inputs.fech === 10, b.data);
  check('xlsx link', (await page.locator('#lead a[download]').getAttribute('href')) === '/ferramentas/arquivos/calculadora-cac.xlsx');
  check('no page errors', errors.length === 0, errors);
  await ctx.close();
};

suites['dashboard-clinica'] = async (browser) => {
  const { ctx, page, posts, errors } = await newPage(browser);
  await page.goto(BASE + '/ferramentas/dashboard-clinica', { waitUntil: 'networkidle' });
  check('title', (await page.title()).startsWith('Dashboard da clínica odontológica'));
  check('one screenshot, labelled fictitious', (await page.locator('.shot img').count()) === 1 && (await page.textContent('.shot figcaption')).includes('Clínica fictícia'));
  check('screenshot loads', await page.locator('.shot img').evaluate((i) => i.complete && i.naturalWidth > 0));
  await fillLead(page, '#lead');
  await page.locator('#lead button[type=submit]').click();
  await page.waitForSelector('#lead a[download]');
  const hrefs = await page.locator('#lead a[download]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  check('both files unlocked', hrefs.join() === '/ferramentas/arquivos/dashboard-clinica.xlsx,/ferramentas/arquivos/dashboard-clinica-demo.xlsx', hrefs);
  check('lead POST to dashboard-clinica', posts.length === 1 && posts[0].url.endsWith('/api/ferramentas/dashboard-clinica/lead'));
  for (const h of hrefs) {
    const res = await page.request.get(BASE + h);
    check('file served: ' + h, res.ok() && (await res.body()).length > 10000);
  }
  check('no page errors', errors.length === 0, errors);
  await ctx.close();
};

suites['scripts-whatsapp'] = async (browser) => {
  const { ctx, page, posts, errors } = await newPage(browser);
  await page.goto(BASE + '/ferramentas/scripts-whatsapp', { waitUntil: 'networkidle' });
  check('title', (await page.title()).startsWith('Scripts de WhatsApp'));
  check('5 rules + sample script', (await page.locator('.wrap > .rules li').count()) === 5 && (await page.locator('.bb').count()) === 1);
  check('no R$/desconto/garantia on the page', !/R\$|desconto|garantia/i.test(await page.textContent('main')));
  await fillLead(page, '#lead');
  await page.locator('#lead button[type=submit]').click();
  await page.waitForSelector('#lead a[download]');
  const hrefs = await page.locator('#lead a[download]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  check('three files unlocked', hrefs.length === 3, hrefs);
  for (const h of hrefs) check('file served: ' + h, (await page.request.get(BASE + h)).ok());
  check('lead POST to scripts-whatsapp', posts.length === 1 && posts[0].url.endsWith('/api/ferramentas/scripts-whatsapp/lead'));
  check('no page errors', errors.length === 0, errors);
  await ctx.close();
};

suites['site'] = async (browser) => {
  const { ctx, page, errors } = await newPage(browser);
  const redirects = {
    '/unicornio': '/raio-x', '/raio-x/resultado': '/raio-x', '/raio-x/privacidade': '/privacidade',
    '/ferramentas/diagnostico-google': '/ferramentas/checklist-google', '/ferramentas/diagnostico-clinica': '/raio-x', '/diagnostico': '/raio-x',
  };
  for (const [from, to] of Object.entries(redirects)) {
    const res = await page.request.get(BASE + from, { maxRedirects: 0 });
    check('redirect ' + from + ' → ' + to, [307, 308].includes(res.status()) && new URL(res.headers().location, BASE).pathname === to, [res.status(), res.headers().location]);
  }
  for (const [path, marker] of [['/exemplos/clinica-antes', 'Clínica fictícia'], ['/exemplos/clinica-depois', 'Clínica fictícia']]) {
    const res = await page.request.get(BASE + path);
    const html = await res.text();
    check('Ep 10 prop ' + path + ' (noindex, labelled fictitious)', res.ok() && html.includes(marker) && html.includes('noindex'));
  }
  await page.goto(BASE + '/ferramentas', { waitUntil: 'networkidle' });
  const links = await page.locator('main article a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  check('/ferramentas lists 9 tools, RAIO-X first, no retired tools', links.length === 9 && links[0] === '/raio-x' && !links.some((l) => /diagnostico/.test(l)), links);
  // Every tool page renders inside the same shell: one navbar, one footer, one <main>, no tool-specific brand bar.
  for (const path of ['/raio-x', ...links.slice(1)]) {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    const shell = await page.evaluate(() => ({
      main: document.querySelectorAll('main').length,
      footer: document.querySelectorAll('footer').length,
      cta: !!document.querySelector('nav a[href="/raio-x"], header a[href="/raio-x"]'),
      logos: document.querySelectorAll('main img[alt="LK Digital"], main .landing-logo').length,
    }));
    check('uniform shell ' + path, shell.main === 1 && shell.footer === 1 && shell.cta && shell.logos === 0, shell);
  }
  const sitemap = await (await page.request.get(BASE + '/sitemap.xml')).text();
  check('sitemap lists the lead magnets, not retired tools', sitemap.includes('/raio-x<') && sitemap.includes('/ferramentas/scripts-whatsapp<') && !sitemap.includes('diagnostico'));
  check('no page errors', errors.length === 0, errors);
  await ctx.close();
};

const browser = await chromium.launch();
for (const [name, run] of Object.entries(suites)) {
  if (only && name !== only) continue;
  console.log(name);
  try { await run(browser); } catch (e) { failures++; console.log('  ✗ crashed: ' + (e && e.stack || e)); }
}
await browser.close();
console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
