// Calculadora de CAC (Eps 1, 2, 3). Ported from lk-lead-magnets calculator/calculadora.html.
// `mount(root, cfg)` wires the markup: live results, URL prefill, shareable link, the example clinic
// (fictitious, labelled) and the spreadsheet lead form, which also sends the summary for the analysis.
import * as LKCalc from './calc';
import DEMO from '../shared/demo-clinic.json';
import { mountLeadForm } from '../shared/lead-form';
import { track, installClickTracking } from '../shared/lk-analytics';

export const markup = `<div class="wrap">
<div class="calc-head">
  <p class="kicker">Calculadora gratuita · Clínicas odontológicas</p>
  <h1>Quanto custa, de verdade, cada paciente que fecha tratamento na sua clínica?</h1>
  <p class="lead">Coloque os números de um mês. A calculadora mostra o CAC só de anúncios e o CAC real, o custo de cada etapa do funil e a etapa que mais pesa no seu resultado.</p>
  <div class="bar-actions">
    <button type="button" class="cbtn primary" id="exemplo">Carregar exemplo</button>
    <button type="button" class="cbtn" id="limpar">Limpar</button>
    <button type="button" class="cbtn" id="copiar-link">Copiar link com meus números</button>
  </div>
  <p class="muted" id="link-msg" role="status" style="font-size:.85rem;margin:6px 0 0"></p>
  <p class="demo-flag" id="demo-flag" role="status">Exemplo carregado: Clínica fictícia — dados ilustrativos. Substitua pelos seus números.</p>
</div>

<form id="calc" autocomplete="off">
  <section class="card">
    <h2>Custos do mês</h2>
    <p class="hint">Tudo o que você gasta para conseguir pacientes novos.</p>
    <div class="grid">
      <label class="f full"><span>Investimento em anúncios / mês</span><div class="in"><b>R$</b><input class="n money" id="invest" inputmode="decimal"></div></label>
      <label class="f full"><span>Custos fixos de marketing / mês <small>(agência, ferramentas, freelancers)</small></span><div class="in"><b>R$</b><input class="n money" id="fixos" inputmode="decimal"></div></label>
      <label class="f"><span>Salário da secretária <small>(opcional)</small></span><div class="in"><b>R$</b><input class="n money" id="salario" inputmode="decimal"></div></label>
      <label class="f"><span>% do tempo com leads</span><div class="in"><input class="n pct" id="pct_sec" inputmode="decimal"><b class="suf">%</b></div></label>
    </div>
  </section>

  <section class="card">
    <h2>Funil do mês</h2>
    <p class="hint">Quantas pessoas passaram por cada etapa no mesmo mês.</p>
    <div class="grid">
      <label class="f"><span>Leads</span><input class="n" id="leads" inputmode="numeric"></label>
      <label class="f"><span>Qualificados</span><input class="n" id="qual" inputmode="numeric"></label>
      <label class="f"><span>Agendados</span><input class="n" id="agend" inputmode="numeric"></label>
      <label class="f"><span>Compareceram</span><input class="n" id="comp" inputmode="numeric"></label>
      <label class="f full"><span>Fechados <small>(aprovaram o tratamento)</small></span><input class="n" id="fech" inputmode="numeric"></label>
    </div>
    <ul class="avisos" id="avisos" aria-live="polite"></ul>
  </section>

  <section class="card">
    <h2>Procedimentos fechados</h2>
    <p class="hint">Para calcular receita e lucro. Ticket médio é o valor interno do tratamento; ele não aparece em lugar nenhum.</p>
    <div id="procs"></div>
    <button type="button" class="cbtn small" id="add-proc" style="margin-top:12px">+ Adicionar procedimento</button>
  </section>

  <section class="card" id="ltv">
    <details class="opt" id="ltv-box">
      <summary>Retorno e LTV <small class="muted">(opcional)</small></summary>
      <p class="hint" style="margin-top:8px">Quanto o paciente ainda gera depois do primeiro tratamento.</p>
      <div class="grid">
        <label class="f"><span>% de pacientes que voltam por ano</span><div class="in"><input class="n pct" id="volta" inputmode="decimal"><b class="suf">%</b></div></label>
        <label class="f"><span>Receita de retorno / paciente / ano</span><div class="in"><b>R$</b><input class="n money" id="retorno" inputmode="decimal"></div></label>
        <label class="f full"><span>Horizonte</span><select class="n" id="anos"><option value="1">1 ano</option><option value="2">2 anos</option><option value="3">3 anos</option></select></label>
      </div>
    </details>
  </section>
</form>

<section id="resultados" aria-live="polite">
  <h2 class="sec-title">Resultados</h2>
  <p class="demo-flag" id="demo-flag-2">Clínica fictícia — dados ilustrativos</p>

  <section class="card">
    <h2>CAC só anúncios × CAC real</h2>
    <div class="vs">
      <div class="kpi"><div class="l">CAC só anúncios</div><div class="v" data-out="cacAds">–</div><small>anúncios ÷ fechados</small></div>
      <div class="kpi hi"><div class="l">CAC real</div><div class="v" data-out="cacReal">–</div><small>todos os custos ÷ fechados</small></div>
    </div>
    <p class="msg" id="cac-msg"></p>
  </section>

  <section class="card">
    <h2>Custo por etapa <small class="muted">(só anúncios)</small></h2>
    <ul class="rows">
      <li><span>Custo por lead (CPL)</span><b data-out="cpl">–</b></li>
      <li><span>Custo por qualificado</span><b data-out="custoQual">–</b></li>
      <li><span>Custo por agendamento</span><b data-out="custoAgend">–</b></li>
      <li><span>Custo por comparecimento</span><b data-out="custoComp">–</b></li>
    </ul>
  </section>

  <section class="card">
    <h2>Conversão do funil</h2>
    <ul class="rows" id="conv"></ul>
    <p class="big-line">Lead → fechamento: <b data-out="convTotal">–</b> <span class="muted" data-out="umEmCada"></span></p>
  </section>

  <section class="card">
    <h2>Dinheiro</h2>
    <ul class="rows">
      <li><span>Receita</span><b data-out="receita">–</b></li>
      <li><span>Lucro bruto</span><b data-out="lucro">–</b></li>
      <li><span>Custo total de marketing</span><b data-out="custoTotal">–</b></li>
      <li><span>ROI sobre o custo total de marketing</span><b data-out="roi">–</b></li>
      <li><span>ROAS (receita ÷ anúncios)</span><b data-out="roas">–</b></li>
    </ul>
  </section>

  <section class="card">
    <h2>CAC por procedimento</h2>
    <details class="tip"><summary>Como calculamos</summary>O custo total de marketing é dividido entre os procedimentos pela participação de cada um nos fechamentos. Ex.: 4 de 10 fechamentos recebem 40% do custo. “Lucro após CAC” é o lucro bruto do procedimento menos essa parte do custo.</details>
    <div class="table-wrap"><table>
      <thead><tr><th>Procedimento</th><th>CAC</th><th>Lucro após CAC</th><th>CAC ÷ ticket</th><th>Fech.</th><th>Custo alocado</th><th>Lucro bruto</th></tr></thead>
      <tbody id="proc-out"><tr><td colspan="7" class="muted">Preencha os procedimentos.</td></tr></tbody>
    </table></div>
    <p class="msg" id="proc-msg"></p>
  </section>

  <section class="card">
    <h2>LTV</h2>
    <div class="vs">
      <div class="kpi"><div class="l">LTV</div><div class="v" data-out="ltv">–</div><small>lucro por paciente no horizonte</small></div>
      <div class="kpi"><div class="l">LTV : CAC</div><div class="v" data-out="ltvCac">–</div><small>LTV ÷ CAC real</small></div>
    </div>
    <p class="hint" style="margin:10px 0 0">LTV = ticket médio × margem + receita de retorno por ano × margem × % que volta × anos.</p>
  </section>

  <section class="card" id="onde">
      <h2>Onde está o dinheiro</h2>
    <p class="hint">Se você recuperasse 20% das pessoas que se perdem em cada etapa, uma de cada vez, quanto cairia o seu CAC real? Só com os seus números.</p>
    <ul class="rows onde" id="onde-out"></ul>
    <p class="msg" id="onde-msg"></p>
  </section>

  <section class="download" id="baixar">
    <h2>Leve a calculadora em planilha</h2>
    <p class="muted">A mesma lógica em Excel/Google Sheets, com todas as fórmulas, para refazer a conta todo mês.</p>
    <div id="lead"></div>
  </section>
</section>

<p class="note">Os números que você digita ficam no seu navegador. Eles só são enviados à LK se você pedir a planilha com a análise. LK Digital · Ferramentas para clínicas odontológicas.</p>
</div>

<div class="sticky" id="sticky"><span class="s">CAC real <b data-out="cacReal">–</b></span><a href="#resultados">Ver resultados ↓</a></div>`;
export const XLSX_FILE = 'calculadora-cac.xlsx';

const KEY = 'lk_calc_v1';
const FIELDS = ['invest', 'fixos', 'salario', 'pct_sec', 'leads', 'qual', 'agend', 'comp', 'fech', 'volta', 'retorno', 'anos'];

// ---------- number parsing / formatting (pt-BR) ----------
export function parseBR(v) {
  let s = String(v == null ? '' : v).replace(/[R$\s%]/g, '');
  if (!s) return '';
  if (s.indexOf(',') !== -1) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = parseFloat(s);
  return isFinite(n) ? n : '';
}
const NF = {
  brl2: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  brl0: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
  pct1: new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  pct0: new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 0 }),
  dec1: new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  int: new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }),
};
const fmt = (v, kind) => (v == null || !isFinite(v) ? '–' : NF[kind].format(v).replace(/\u00a0/g, ' '));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function example() {
  const m = DEMO.mes_base, l = DEMO.ltv_exemplo;
  return {
    invest: m.investimento_anuncios, fixos: m.custos_fixos_marketing, salario: '', pct_sec: '',
    leads: m.leads, qual: m.qualificados, agend: m.agendados, comp: m.compareceram, fech: m.fechados,
    volta: l.pct_retorno_ano * 100, retorno: l.receita_retorno_ano, anos: l.horizonte_anos,
    procs: DEMO.procedimentos.map((p) => ({ nome: p.nome, fech: p.fechamentos, ticket: p.ticket_medio, margem: m.margem_bruta * 100 })),
  };
}

export function toCalc(s) {
  return {
    invest: s.invest, fixos: s.fixos, salario: s.salario, pctSec: s.pct_sec,
    leads: s.leads, qual: s.qual, agend: s.agend, comp: s.comp, fech: s.fech,
    volta: s.volta, retorno: s.retorno, anos: s.anos, procs: s.procs,
  };
}

const KINDS = {
  cacAds: 'brl2', cacReal: 'brl2', cpl: 'brl2', custoQual: 'brl2', custoAgend: 'brl2', custoComp: 'brl2',
  convTotal: 'pct1', receita: 'brl2', lucro: 'brl2', custoTotal: 'brl2', roi: 'pct0', roas: 'dec1',
  ltv: 'brl2', ltvCac: 'dec1',
};

export function mount(root, cfg) {
  installClickTracking();
  const $ = (id) => root.querySelector('#' + id);
  const procsEl = $('procs');
  let isExample = false;
  let last = null;

  // ---------- procedures table ----------
  function addProc(p = {}) {
    const row = document.createElement('div');
    row.className = 'proc';
    row.innerHTML =
      '<label class="f nome"><span>Procedimento</span><input class="t" data-k="nome" maxlength="60"></label>' +
      '<label class="f"><span>Fechamentos</span><input class="n" data-k="fech" inputmode="numeric"></label>' +
      '<label class="f"><span>Ticket médio</span><div class="in"><b>R$</b><input class="n money" data-k="ticket" inputmode="decimal"></div></label>' +
      '<label class="f"><span>Margem</span><div class="in"><input class="n pct" data-k="margem" inputmode="decimal"><b class="suf">%</b></div></label>' +
      '<button type="button" aria-label="Remover procedimento" data-remove>×</button>';
    ['nome', 'fech', 'ticket', 'margem'].forEach((k) => {
      if (p[k] != null && p[k] !== '') row.querySelector('[data-k="' + k + '"]').value = p[k];
    });
    procsEl.appendChild(row);
  }
  procsEl.addEventListener('click', (e) => {
    if (!e.target.hasAttribute('data-remove')) return;
    e.target.closest('.proc').remove();
    if (!procsEl.children.length) addProc();
    update();
  });
  $('add-proc').addEventListener('click', () => { addProc({ margem: 40 }); update(); });

  // ---------- read / write state ----------
  function read() {
    const s = {};
    FIELDS.forEach((f) => { s[f] = f === 'anos' ? +$(f).value : parseBR($(f).value); });
    s.procs = Array.from(procsEl.querySelectorAll('.proc')).map((row) => {
      const g = (k) => row.querySelector('[data-k="' + k + '"]').value;
      return { nome: g('nome'), fech: parseBR(g('fech')), ticket: parseBR(g('ticket')), margem: parseBR(g('margem')) };
    });
    return s;
  }
  function write(s) {
    FIELDS.forEach((f) => {
      if (f === 'anos') $(f).value = String(s.anos || 1);
      else $(f).value = s[f] === '' || s[f] == null ? '' : String(s[f]).replace('.', ',');
    });
    procsEl.innerHTML = '';
    (s.procs && s.procs.length ? s.procs : [{}]).forEach((p) => {
      addProc({ nome: p.nome, fech: p.fech, ticket: p.ticket === '' || p.ticket == null ? '' : String(p.ticket).replace('.', ','), margem: p.margem });
    });
    if (s.volta || s.retorno) $('ltv-box').open = true;
  }

  // ?invest=3000&leads=300&proc=Implante:4:5000:40;Protocolo:1:25000:40&exemplo=1
  function fromUrl() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('exemplo') === '1') return { state: example(), example: true };
    const s = {};
    let any = false;
    FIELDS.forEach((f) => {
      const v = p.get(f);
      if (v != null) { s[f] = f === 'anos' ? Math.min(3, Math.max(1, parseInt(v, 10) || 1)) : parseBR(v); any = true; }
      else s[f] = f === 'anos' ? 1 : '';
    });
    const proc = p.get('proc');
    s.procs = proc ? proc.split(';').map((x) => {
      const a = x.split(':');
      return { nome: a[0] || '', fech: parseBR(a[1]), ticket: parseBR(a[2]), margem: a[3] != null ? parseBR(a[3]) : 40 };
    }) : [];
    if (proc) any = true;
    return any ? { state: s, example: false } : null;
  }

  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify({ s, ex: isExample })); } catch { /* storage blocked */ } };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };

  // ---------- render ----------
  function render(r) {
    Object.keys(KINDS).forEach((k) => {
      let txt = fmt(r[k], KINDS[k]);
      if (k === 'ltvCac' && txt !== '–') txt += ' : 1';
      root.querySelectorAll('[data-out="' + k + '"]').forEach((el) => { el.textContent = txt; });
    });
    root.querySelector('[data-out="umEmCada"]').textContent =
      r.umEmCada != null ? '(1 em cada ' + fmt(r.umEmCada, 'int') + ' leads vira paciente)' : '';

    $('cac-msg').innerHTML = r.cacGap != null && r.cacGap > 0
      ? 'Cada paciente custa <b>' + fmt(r.cacGap, 'brl2') + ' a mais</b> do que o painel de anúncios mostra (' + fmt(r.cacGapPct, 'pct0') + ' a mais). É essa diferença que decide se o marketing se paga.'
      : '';

    $('conv').innerHTML = r.conv.map((c) => '<li><span>' + c.label + '</span><b>' + fmt(c.rate, 'pct1') + '</b></li>').join('');

    const rows = r.procs.filter((p) => p.nome || p.fech);
    $('proc-out').innerHTML = rows.length ? rows.map((p) => {
      const neg = p.lucroAposCac != null && p.lucroAposCac < 0;
      return '<tr><td>' + esc(p.nome || '—') + '</td><td>' + fmt(p.cac, 'brl2') + '</td><td' + (neg ? ' class="neg"' : '') + '>' +
        fmt(p.lucroAposCac, 'brl0') + '</td><td>' + fmt(p.cacSobreTicket, 'pct0') + '</td><td>' + fmt(p.fech, 'int') + '</td><td>' +
        fmt(p.custoAlocado, 'brl0') + '</td><td>' + fmt(p.lucro, 'brl0') + '</td></tr>';
    }).join('') : '<tr><td colspan="7" class="muted">Preencha os procedimentos.</td></tr>';
    const losers = rows.filter((p) => p.lucroAposCac != null && p.lucroAposCac < 0);
    $('proc-msg').innerHTML = losers.length
      ? losers.map((p) => '<b>' + esc(p.nome || 'Um procedimento') + '</b> dá prejuízo de ' + fmt(-p.lucroAposCac, 'brl0') + ' depois do CAC').join('; ') +
        '. Vale como porta de entrada só se levar a tratamentos maiores.'
      : '';

    const max = Math.max(...r.onde.map((o) => o.reducao || 0), 0);
    const ranked = r.onde.slice().sort((a, b) => (b.reducao == null ? -1 : b.reducao) - (a.reducao == null ? -1 : a.reducao));
    let ondeHtml = ranked.map((o) => {
      const w = o.reducao && max ? Math.max(4, (o.reducao / max) * 100) : 0;
      return '<li class="' + (o.key === r.maiorAlavanca ? 'best' : '') + '" data-step="' + o.key + '"><div class="top"><b>' + o.label + '</b><b>' +
        (o.cac != null ? fmt(o.cac, 'brl2') : '–') + '</b></div><div class="track"><div class="fill" style="width:' + w + '%"></div></div>' +
        '<small>' + (o.rate != null ? fmt(o.rate, 'pct1') + ' → ' + fmt(o.rateNova, 'pct1') + ' · CAC real cai ' + fmt(o.reducao, 'brl2') : 'Preencha o funil') + '</small></li>';
    }).join('');
    const ads = r.maisAnuncios;
    ondeHtml += '<li class="ads" data-step="anuncios"><div class="top"><b>Comparação: +20% em anúncios</b><b>' + fmt(ads.cac, 'brl2') + '</b></div>' +
      '<small>Mais leads na mesma proporção, com o mesmo funil.</small></li>';
    $('onde-out').innerHTML = ondeHtml;
    const best = r.onde.find((o) => o.key === r.maiorAlavanca);
    $('onde-msg').innerHTML = best && r.cacReal != null
      ? 'Maior alavanca: <b>' + best.label + '</b>. Arrume o funil antes de comprar mais anúncios' +
        (ads.cac != null && best.cac != null && best.cac < ads.cac ? ': melhorar essa etapa derruba o CAC real para ' + fmt(best.cac, 'brl2') + ', contra ' + fmt(ads.cac, 'brl2') + ' com 20% a mais de anúncios.' : '.')
      : '';

    $('avisos').innerHTML = r.avisos.map((a) => '<li>' + esc(a) + '</li>').join('');
  }

  function setExample(on) {
    isExample = on;
    $('demo-flag').classList.toggle('on', on);
    $('demo-flag-2').classList.toggle('on', on);
  }

  function update() {
    const s = read();
    last = { state: s, result: LKCalc.compute(toCalc(s)) };
    render(last.result);
    save(s);
  }

  // ---------- wire up ----------
  $('calc').addEventListener('submit', (e) => e.preventDefault());
  $('calc').addEventListener('input', update);
  $('calc').addEventListener('change', update);
  $('exemplo').addEventListener('click', () => { write(example()); setExample(true); update(); track('calc_example', {}); });
  $('limpar').addEventListener('click', () => { write({ anos: 1, procs: [] }); setExample(false); update(); });

  const url = fromUrl(), saved = load();
  if (url) { write(url.state); setExample(url.example); }
  else if (saved && saved.s) { write(saved.s); setExample(!!saved.ex); }
  else write({ anos: 1, procs: [] });
  update();

  // Shareable link with the visitor's own numbers (no personal data: only clinic economics).
  function shareUrl() {
    const s = read(), p = new URLSearchParams();
    FIELDS.forEach((f) => { if (s[f] !== '' && s[f] != null && !(f === 'anos' && s[f] === 1)) p.set(f, s[f]); });
    const procs = s.procs.filter((x) => x.nome || x.fech || x.ticket)
      .map((x) => [String(x.nome || '').replace(/[:;]/g, ' '), x.fech, x.ticket, x.margem].join(':'));
    if (procs.length) p.set('proc', procs.join(';'));
    return window.location.origin + window.location.pathname + (p.toString() ? '?' + p.toString() : '');
  }
  $('copiar-link').addEventListener('click', () => {
    const u = shareUrl();
    const ok = () => { $('link-msg').textContent = 'Link copiado. Quem abrir verá os mesmos números.'; };
    track('calc_copy_link', { asset: 'calculadora-cac' });
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(u).then(ok, () => { $('link-msg').textContent = u; });
    else $('link-msg').textContent = u;
  });
  if (window.location.hash === '#ltv') $('ltv-box').open = true;
  track('asset_view', { asset: 'calculadora-cac' });

  window.LKCalcPage = { read, write, update, example, parseBR, shareUrl, last: () => last };

  mountLeadForm($('lead'), {
    cfg,
    asset: 'calculadora-cac',
    assetName: 'a Calculadora de CAC',
    title: 'Baixe a planilha',
    subtitle: 'A planilha libera na hora. Pelo WhatsApp, você recebe também uma análise curta dos números que preencheu acima.',
    submitLabel: 'Baixar a planilha + receber a análise',
    thanks: 'A planilha está liberada. Troque o exemplo pelos números da sua clínica.',
    download: { href: cfg.FILES_BASE_URL + XLSX_FILE, label: 'Baixar a planilha (.xlsx)' },
    // The inputs (not personal data) go with the lead; the adapter re-computes every number from them.
    extra: () => (isExample ? { example: true } : { inputs: toCalc(read()) }),
  });
}
