// Renders content.json into the landing-page preview (page.js) and, in the offline generator
// (lead-magnets/build.mjs), the A5 booklet (PDF), the one-page cheat sheet (PDF) and the plain
// copy-paste markdown. One source, no drift. Pure functions: `c` is the parsed content.json.
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ph = s => esc(s).replace(/\{\{(\w+)\}\}/g, '<span class="ph">{{$1}}</span>');
const lines = s => ph(s).replace(/\n/g, '<br>');

// Every script with its section, flattened (used by renderers and tests).
export function allScripts(c) {
  const out = [];
  for (const s of c.secoes) {
    for (const sc of s.scripts || []) out.push({ ...sc, secao: s.id });
    for (const g of s.grupos || []) for (const sc of g.scripts) out.push({ ...sc, secao: s.id, grupo: g.titulo });
    for (const o of s.objecoes || []) o.scripts.forEach((sc, i) => out.push({ ...sc, secao: s.id, titulo: `${o.objecao} (${i + 1})` }));
  }
  return out;
}

const bubble = sc => `
      <div class="sc">${sc.titulo ? `<p class="st">${esc(sc.titulo)}</p>` : ''}
        <div class="bb${sc.audio ? ' audio' : ''}">${lines(sc.texto)}</div></div>`;

// Returns the section body as chunks; the booklet keeps the heading with the first chunk.
function sectionChunks(s) {
  const chunks = [];
  let first = `<p class="intro">${esc(s.intro)}</p>`;
  if (s.quando) first += `<ul class="quando">${s.quando.map(q => `<li>${esc(q)}</li>`).join('')}</ul>`;
  chunks.push(first);
  for (const sc of s.scripts || []) chunks.push(bubble(sc));
  for (const g of s.grupos || []) g.scripts.forEach((sc, i) => chunks.push((i ? '' : `<h3>${esc(g.titulo)}</h3>`) + bubble(sc)));
  for (const o of s.objecoes || []) {
    o.scripts.forEach((sc, i) => chunks.push(
      (i ? '' : `<h3>${esc(o.objecao)}</h3>${o.nota ? `<p class="nota">${esc(o.nota)}</p>` : ''}`) + bubble({ ...sc, titulo: `Resposta ${i + 1}` })));
  }
  // Intro and the first script travel together.
  if (chunks.length > 1) chunks.splice(0, 2, chunks[0] + chunks[1]);
  return chunks;
}

function pipeline(crm, compact = false) {
  const steps = crm.etapas.map((e, i) => `
    <div class="stage"><b>${esc(e.nome)}</b>${e.sla ? `<span class="sla">${esc(e.sla)}</span>` : ''}${compact ? '' : `<small>${esc(e.criterio)}</small>`}</div>${i < crm.etapas.length - 1 ? '<span class="arrow">→</span>' : ''}`).join('');
  const lost = `<div class="stage lost"><b>${esc(crm.perdido.nome)}</b><small>${esc(crm.perdido.criterio)} ${crm.perdido.motivos.map(esc).join(' · ')}</small></div>`;
  return `<div class="pipe">${steps}</div>${lost}`;
}

// ---------- A5 booklet ----------
export function booklet(c, cfg) {
  const site = (cfg.SITE_BASE_URL || '').replace(/^https?:\/\//, '');
  const cover = `
  <section class="page cover">
    <p class="kicker">LK Digital · Scripts</p>
    <h1>${esc(c.titulo)}</h1>
    <p class="sub">${esc(c.subtitulo)}</p>
    <ol class="toc">${c.secoes.map(s => `<li>${esc(s.titulo)}</li>`).join('')}<li>${esc(c.crm.titulo)}</li></ol>
  </section>`;
  const how = `
  <section class="page">
    <h2>Como usar</h2>
    <p class="intro">${esc(c.abertura)}</p>
    <p>Copie o script, troque as {{chaves}} e envie. A versão .md que acompanha este livreto tem todos os textos prontos para colar no WhatsApp.</p>
    <table class="keys"><thead><tr><th>Chave</th><th>Exemplo</th></tr></thead><tbody>
      ${c.chaves.map(k => `<tr><td><span class="ph">${esc(k.chave)}</span></td><td>${esc(k.exemplo)}</td></tr>`).join('')}
    </tbody></table>
    <h3>Tom</h3>
    <ul class="quando">${c.tom.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  </section>`;
  const rules = `
  <section class="page rules">
    <h2>As 5 regras</h2>
    <ol class="big">${c.regras.map(r => `<li><b>${esc(r.t)}</b><span>${esc(r.d)}</span></li>`).join('')}</ol>
  </section>`;
  const sections = c.secoes.map((s, i) => `
  <section class="sec${['primeira-resposta', 'objecoes', 'ligar'].includes(s.id) ? ' newpage' : ''}">
    ${sectionChunks(s).map((ch, k) => k ? `<div class="keep">${ch}</div>` : `<div class="keep"><h2><span class="n">${i + 1}</span>${esc(s.titulo)}</h2>${ch}</div>`).join('')}
  </section>`).join('');
  const crm = `
  <section class="sec newpage">
    <h2><span class="n">${c.secoes.length + 1}</span>${esc(c.crm.titulo)}</h2>
    <p class="intro">${esc(c.crm.intro)}</p>
    ${pipeline(c.crm)}
    <p class="close">${esc(c.fechamento)} ${esc(site)}</p>
  </section>`;
  return cover + how + rules + sections + crm;
}

// ---------- one-page cheat sheet (A4) ----------
export function cola(c) {
  const sec = id => c.secoes.find(s => s.id === id);
  const q = sec('qualificacao').grupos;
  const cadence = [
    ['Confirmação', 'ao agendar · D-1 · manhã do dia'],
    ['Falta', 'mesmo dia · D+1 · D+7'],
    ['Parou de responder', 'D+1 · D+3 · D+7 · D+30 (encerra)'],
    ['Pós-avaliação sem fechar', 'D+2 · D+7 · D+21'],
  ];
  const obj = sec('objecoes').objecoes.map(o => `<li><b>${esc(o.objecao)}</b> ${lines(o.scripts[0].texto.split('\n')[0])}</li>`).join('');
  return `
  <header>
    <p class="kicker">Cola rápida da recepção · imprima e deixe à vista</p>
    <h1>WhatsApp: do primeiro “oi” à avaliação</h1>
  </header>
  <div class="cols">
    <div>
      <h2>As 5 regras</h2>
      <ol class="rules">${c.regras.map(r => `<li><b>${esc(r.t)}</b> ${esc(r.d)}</li>`).join('')}</ol>
      <h2>3 perguntas (uma por mensagem)</h2>
      <ol class="qs">${q[0].scripts.map(s => `<li>${lines(s.texto)}</li>`).join('')}</ol>
      <p class="tip">Depois: ${lines(q[2].scripts[0].texto.split('\n').slice(1).join(' '))}</p>
      <h2>“Quanto custa?”</h2>
      <div class="bb">${lines(sec('quanto-custa').scripts[0].texto)}</div>
    </div>
    <div>
      <h2>Prazos</h2>
      <table><tbody>
        <tr><td>Primeira resposta</td><td><b>até 5 min</b> no horário de atendimento</td></tr>
        ${cadence.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}
      </tbody></table>
      <h2>Objeções: comece assim</h2>
      <ul class="obj">${obj}</ul>
      <h2>Etapas do CRM</h2>
      ${pipeline(c.crm, true)}
    </div>
  </div>
  <footer>Chaves: ${c.chaves.map(k => `<span class="ph">${esc(k.chave)}</span>`).join(' ')} · Scripts completos no livreto e na versão .md.</footer>`;
}

// ---------- plain copy-paste markdown ----------
// Scripts go inside ```text fences, so line breaks survive and no markdown syntax is inside a script.
export function markdown(c) {
  const fence = t => '```text\n' + t + '\n```';
  const out = [];
  out.push(`# ${c.titulo}`, '', c.abertura, '');
  out.push('## Como usar', '', 'Copie o texto dentro de cada bloco, troque as {{chaves}} e envie no WhatsApp.', '');
  for (const k of c.chaves) out.push(`- ${k.chave}: ${k.exemplo}`);
  out.push('', '## As 5 regras', '');
  c.regras.forEach((r, i) => out.push(`${i + 1}. ${r.t} ${r.d}`));
  out.push('');
  c.secoes.forEach((s, i) => {
    out.push(`## ${i + 1}. ${s.titulo}`, '', s.intro, '');
    if (s.quando) { for (const q of s.quando) out.push(`- ${q}`); out.push(''); }
    for (const sc of s.scripts || []) out.push(`### ${sc.titulo}`, '', fence(sc.texto), '');
    for (const g of s.grupos || []) {
      out.push(`### ${g.titulo}`, '');
      for (const sc of g.scripts) out.push(`${sc.titulo}`, '', fence(sc.texto), '');
    }
    for (const o of s.objecoes || []) {
      out.push(`### ${o.objecao}`, '');
      if (o.nota) out.push(o.nota, '');
      o.scripts.forEach((sc, k) => out.push(`Resposta ${k + 1}`, '', fence(sc.texto), ''));
    }
  });
  out.push(`## ${c.secoes.length + 1}. ${c.crm.titulo}`, '', c.crm.intro, '');
  out.push(c.crm.etapas.map(e => e.nome + (e.sla ? ` (${e.sla})` : '')).join(' → '), '');
  for (const e of c.crm.etapas) out.push(`- ${e.nome}: ${e.criterio}`);
  out.push(`- ${c.crm.perdido.nome}: ${c.crm.perdido.criterio} ${c.crm.perdido.motivos.join(', ')}.`, '');
  return out.join('\n');
}

// ---------- landing preview ----------
export function landing(c) {
  const sample = c.secoes.find(s => s.id === 'quanto-custa').scripts[0];
  const count = allScripts(c).length;
  return `
    <h2>As 5 regras</h2>
    <ol class="rules">${c.regras.map(r => `<li><b>${esc(r.t)}</b> <span>${esc(r.d)}</span></li>`).join('')}</ol>
    <h2>Um exemplo: “Quanto custa?”</h2>
    <div class="bb">${lines(sample.texto)}</div>
    <h2>O que vem no material</h2>
    <ul class="list">
      <li><b>${count} scripts prontos</b> <span>para ${c.secoes.map(s => s.titulo.replace(/[“”]/g, '').toLowerCase()).slice(0, 4).join(', ')} e mais.</span></li>
      <li><b>Matriz de objeções.</b> <span>Duas respostas para “só quero o valor”, “vou pensar”, “sou de convênio” e outras.</span></li>
      <li><b>Cadências prontas.</b> <span>Confirmação, falta, lead que sumiu e pós-avaliação.</span></li>
      <li><b>Etapas do CRM com prazos.</b> <span>Da primeira resposta em 5 minutos até o fechamento.</span></li>
      <li><b>Três formatos.</b> <span>Livreto em PDF, textos para copiar e colar (.md) e uma cola de uma página para a recepção.</span></li>
    </ul>`;
}
