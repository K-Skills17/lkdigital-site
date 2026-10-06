// Checks the built downloads (run after `npm run build`):
//   npm run test:assets
// PDFs (A4, page counts, fonts embedded, full content), the .md, compliance on every deliverable,
// the spreadsheets' structure (python tests) and spreadsheet = web calculator on 9 scenarios.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { EXEMPLOS, LM, OUT, SITE, loadSources } from '../build.mjs';

let failures = 0, passes = 0;
function check(name, cond, detail) {
  if (cond) { passes++; console.log('  ✓ ' + name); }
  else { failures++; console.log('  ✗ ' + name + (detail !== undefined ? ' — ' + JSON.stringify(detail).slice(0, 400) : '')); }
}
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 << 20, ...opts });
const pdfText = (f) => sh('pdftotext', ['-layout', join(OUT, f), '-']);
const pdfPages = (f) => +sh('pdfinfo', [join(OUT, f)]).match(/Pages:\s+(\d+)/)[1];
const isA4 = (f) => /594\.96 x 841\.92|595(\.\d+)? x 842/.test(sh('pdfinfo', [join(OUT, f)]));
const fontsEmbedded = (f) => {
  const rows = sh('pdffonts', [join(OUT, f)]).split('\n').slice(2).filter(Boolean);
  return rows.length > 0 && rows.every((l) => / yes /.test(l)) && rows.some((l) => /Inter/.test(l));
};
const squash = (s) => s.replace(/\s+/g, ' ').trim();

const src = await loadSources();
const FILES = ['checklist-google.pdf', 'scripts-whatsapp.pdf', 'cola-rapida.pdf', 'scripts-whatsapp.md', 'calculadora-cac.xlsx',
  'dashboard-clinica.xlsx', 'dashboard-clinica-demo.xlsx', 'dashboard-preview.jpg',
  ...['raio-x', 'checklist-google', 'calculadora-cac', 'dashboard-clinica', 'scripts-whatsapp'].map((s) => `og-${s}.png`)];

console.log('files');
for (const f of FILES) check(f, existsSync(join(OUT, f)));
for (const f of ['clinica-antes.html', 'clinica-depois.html']) check('exemplos/' + f, existsSync(join(EXEMPLOS, f)));

console.log('pdf');
const cl = pdfText('checklist-google.pdf');
check('checklist: A4, 5–7 pages, fonts embedded', isA4('checklist-google.pdf') && pdfPages('checklist-google.pdf') >= 5 && pdfPages('checklist-google.pdf') <= 7 && fontsEmbedded('checklist-google.pdf'));
check('checklist: kit + copy page + site link', /Página de copiar e colar/i.test(cl) && /Rotina semanal/.test(cl) && cl.includes('lkdigital.odo.br/ferramentas/dashboard-clinica'));
const items = src.content['checklist-google'].secoes.flatMap((s) => s.itens);
const clFlat = squash(cl);
const missingItems = items.filter((i) => !clFlat.includes(squash(i.t).slice(0, 40)));
check(`checklist: all ${items.length} items in the PDF`, missingItems.length === 0, missingItems.map((i) => i.id));
const bk = 'scripts-whatsapp.pdf';
check('booklet: A4, 12–16 pages, fonts embedded', isA4(bk) && pdfPages(bk) >= 12 && pdfPages(bk) <= 16 && fontsEmbedded(bk), pdfPages(bk));
const scripts = src.render['scripts-whatsapp'].allScripts(src.content['scripts-whatsapp']);
const flat = (t) => t.replace(/\s+/g, '');
const bkFlat = flat(sh('pdftotext', [join(OUT, bk), '-']));
const missing = scripts.filter((s) => !bkFlat.includes(flat(s.texto)));
check(`booklet: every script (${scripts.length}) in the PDF`, missing.length === 0, missing.map((s) => s.texto.slice(0, 40)));
check('cola rápida: 1 A4 page, fonts embedded', pdfPages('cola-rapida.pdf') === 1 && isA4('cola-rapida.pdf') && fontsEmbedded('cola-rapida.pdf'));

console.log('md');
const md = readFileSync(join(OUT, 'scripts-whatsapp.md'), 'utf8');
const blocks = [...md.matchAll(/```text\n([\s\S]*?)\n```/g)].map((m) => m[1]);
check('md: one copy block per script, verbatim', blocks.length === scripts.length && scripts.every((s) => blocks.includes(s.texto)), [blocks.length, scripts.length]);
check('md: same as the generator output', md === src.render['scripts-whatsapp'].markdown(src.content['scripts-whatsapp']));

console.log('compliance');
const texts = {
  'checklist-google.pdf': cl, 'scripts-whatsapp.pdf': pdfText(bk), 'cola-rapida.pdf': pdfText('cola-rapida.pdf'), 'scripts-whatsapp.md': md,
  'clinica-antes.html': readFileSync(join(EXEMPLOS, 'clinica-antes.html'), 'utf8'), 'clinica-depois.html': readFileSync(join(EXEMPLOS, 'clinica-depois.html'), 'utf8'),
};
const RULES = [[/R\$/, 'no "R$"'], [/a partir de/i, 'no "a partir de"'], [/garantia/i, 'no "garantia"'], [/5 estrelas/i, 'no "5 estrelas"'],
  [/desconto/i, 'no "desconto"'], [/antes e depois/i, 'no "antes e depois"']];
for (const [re, label] of RULES) {
  const hits = Object.entries(texts).filter(([, t]) => re.test(t)).map(([f]) => f);
  check(label + ' in the PDFs, .md and Ep 10 props', hits.length === 0, hits);
}
for (const f of ['clinica-antes.html', 'clinica-depois.html']) {
  check(f + ': noindex + "Clínica fictícia"', /name="robots" content="noindex"/.test(texts[f]) && texts[f].includes('Clínica fictícia — dados ilustrativos'));
}

console.log('xlsx');
for (const t of ['dashboard_test.py', 'calculator_xlsx_test.py']) {
  try { sh('python3', [join(LM, 'tests/xlsx', t)], { timeout: 900000 }); check(t, true); }
  catch (e) { check(t, false, String(e.stdout || e.message).split('\n').filter((l) => /FAIL|Error/.test(l)).slice(0, 5)); }
}

// Spreadsheet = web calculator (src/tools/calculadora-cac/calc.js) on fixed + pseudo-random scenarios.
const C = await import(pathToFileURL(join(SITE, 'src/tools/calculadora-cac/calc.js')).href);
const m = src.demo.mes_base;
const EXAMPLE = {
  invest: m.investimento_anuncios, fixos: m.custos_fixos_marketing, salario: '', pctSec: '',
  leads: m.leads, qual: m.qualificados, agend: m.agendados, comp: m.compareceram, fech: m.fechados,
  volta: src.demo.ltv_exemplo.pct_retorno_ano * 100, retorno: src.demo.ltv_exemplo.receita_retorno_ano, anos: src.demo.ltv_exemplo.horizonte_anos,
  procs: src.demo.procedimentos.map((p) => ({ nome: p.nome, fech: p.fechamentos, ticket: p.ticket_medio, margem: m.margem_bruta * 100 })),
};
let seed = 42;
const rnd = (a, b) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + Math.floor((seed / 2147483648) * (b - a + 1)); };
function randomScenario() {
  const leads = rnd(50, 900), qual = rnd(10, leads), agend = rnd(3, qual), comp = rnd(1, agend), fech = rnd(0, comp);
  const n = rnd(1, 4), procs = [];
  let left = fech;
  for (let k = 0; k < n; k++) {
    const f = k === n - 1 ? left : rnd(0, left);
    left -= f;
    procs.push({ nome: 'P' + k, fech: f, ticket: rnd(2, 400) * 100, margem: rnd(15, 70) });
  }
  return { invest: rnd(5, 200) * 100, fixos: rnd(0, 80) * 100, salario: rnd(0, 1) ? rnd(15, 60) * 100 : '', pctSec: rnd(0, 100),
    leads, qual, agend, comp, fech, volta: rnd(0, 90), retorno: rnd(0, 20) * 50, anos: rnd(1, 3), procs };
}
const SCENARIOS = [
  ['exemplo (clínica fictícia)', EXAMPLE],
  ['exemplo + secretária 50% de R$ 3.000', { ...EXAMPLE, salario: 3000, pctSec: 50 }],
  ['zero fechados', { ...EXAMPLE, fech: 0, procs: [] }],
  ['tudo vazio', { anos: 1, procs: [] }],
  ['funil não monotônico', { ...EXAMPLE, comp: 50, fech: 12 }],
  ['etapa zerada (0 agendados)', { ...EXAMPLE, agend: 0 }],
  ['aleatório 1', randomScenario()], ['aleatório 2', randomScenario()], ['aleatório 3', randomScenario()],
];
const MAP = { cpl: 'cpl', custo_qual: 'custoQual', custo_agend: 'custoAgend', custo_comp: 'custoComp', cac_ads: 'cacAds',
  cac_real: 'cacReal', conv_total: 'convTotal', um_em_cada: 'umEmCada', receita: 'receita', lucro: 'lucro',
  custo_total: 'custoTotal', roi: 'roi', roas: 'roas', ltv: 'ltv', ltv_cac: 'ltvCac',
  conv1: 'conv1', conv2: 'conv2', conv3: 'conv3', conv4: 'conv4', onde1: 'onde1', onde2: 'onde2', onde3: 'onde3', onde4: 'onde4', mais_anuncios: 'maisAnuncios' };
const near = (a, b, tol = 1e-6) => (a == null && b == null) || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)));
const web = SCENARIOS.map(([, s]) => {
  const r = C.compute(s);
  return { ...r, conv1: r.conv[0].rate, conv2: r.conv[1].rate, conv3: r.conv[2].rate, conv4: r.conv[3].rate,
    onde1: r.onde[0].cac, onde2: r.onde[1].cac, onde3: r.onde[2].cac, onde4: r.onde[3].cac,
    maisAnuncios: r.maisAnuncios.cac, maior: r.maiorAlavanca ? C.STEPS.find((x) => x.key === r.maiorAlavanca).label : null };
});
const xlsx = JSON.parse(sh('python3', [join(LM, 'tests/xlsx/calc_xlsx_eval.py')], { input: JSON.stringify(SCENARIOS.map((x) => x[1])), timeout: 900000 }));
SCENARIOS.forEach(([name], i) => {
  const w = web[i], x = xlsx[i], bad = [];
  for (const [xk, wk] of Object.entries(MAP)) {
    const wv = w[wk], xv = x[xk];
    if (typeof xv === 'string' && xv.startsWith('ERROR')) bad.push(`${xk}=${xv}`);
    else if (!near(wv, xv) && !(wv == null && xv === 0) && !(xv == null && wv === 0)) bad.push(`${xk}: web ${wv} xlsx ${xv}`);
  }
  if ((w.maior || null) !== (x.maior || null)) bad.push(`maior: web ${w.maior} xlsx ${x.maior}`);
  check(`xlsx = web calculator: ${name}`, bad.length === 0, bad.slice(0, 4));
});

console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
