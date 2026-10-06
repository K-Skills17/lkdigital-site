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

const browser = await chromium.launch();
for (const [name, run] of Object.entries(suites)) {
  if (only && name !== only) continue;
  console.log(name);
  try { await run(browser); } catch (e) { failures++; console.log('  ✗ crashed: ' + (e && e.stack || e)); }
}
await browser.close();
console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
