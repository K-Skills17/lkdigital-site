// Renders content.json into the interactive page (page.js) and the print layout the offline generator
// turns into the PDF (lead-magnets/build.mjs). Both come from the same content, so they never drift.
// Pure functions: `c` is the parsed content.json, `cfg` the lead-magnet config.
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Highlights {{chaves}} placeholders in escaped text.
const ph = s => esc(s).replace(/\{\{(\w+)\}\}/g, '<span class="ph">{{$1}}</span>');

export const itemCount = c => c.secoes.reduce((n, s) => n + s.itens.length, 0);

function itemLink(item, cfg) {
  if (!item.link) return '';
  const href = (cfg.SITE_BASE_URL || '') + item.link.caminho;
  return ` <a href="${esc(href)}" target="_blank" rel="noopener">${esc(item.link.texto)} →</a>`;
}

// ---------- Interactive page ----------

export function interactive(c, cfg) {
  const total = itemCount(c);
  const sections = c.secoes.map((s, i) => `
    <section class="sec" id="sec-${s.id}" data-sec="${s.id}">
      <div class="sec-h"><h2><span class="n">${i + 1}</span>${esc(s.titulo)}</h2><span class="sec-count" data-count="${s.id}">0/${s.itens.length}</span></div>
      ${s.itens.map(it => `
      <div class="item">
        <label><input type="checkbox" data-id="${it.id}"><span class="t">${esc(it.t)}</span></label>
        <p><b>Por quê:</b> ${esc(it.por)}</p>
        <p><b>Como:</b> ${esc(it.como)}${itemLink(it, cfg)}</p>
      </div>`).join('')}
      ${s.nota ? `<p class="nota">${esc(s.nota)}</p>` : ''}
    </section>`).join('');

  const k = c.kit;
  const tpl = m => `
      <div class="tpl">
        <div class="tpl-h"><b>${esc(m.quando)}</b><button type="button" class="copy" data-copy="${m.id}">Copiar</button></div>
        <pre id="tpl-${m.id}">${esc(m.texto)}</pre>
      </div>`;

  const kit = `
    <section class="kit" id="kit">
      <h2 class="kit-title">${esc(k.titulo)}</h2>
      <p class="muted">${esc(k.abertura)}</p>

      <h3>${esc(k.link.titulo)}</h3>
      <ol class="steps">${k.link.passos.map(p => `<li>${ph(p)}</li>`).join('')}</ol>

      <h3>${esc(k.pedidos.titulo)}</h3>
      <ul class="rules">${k.pedidos.regras.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      ${k.pedidos.modelos.map(tpl).join('')}

      <h3>${esc(k.respostas.titulo)}</h3>
      <ul class="rules">${k.respostas.regras.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      ${k.respostas.modelos.map(tpl).join('')}

      <p class="muted small">${ph(k.chaves)}</p>

      <h3>${esc(k.rotina.titulo)}</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Quando</th><th>Quem</th><th>O quê</th><th>Tempo</th></tr></thead>
        <tbody>${k.rotina.linhas.map(l => `<tr><td>${esc(l.quando)}</td><td>${esc(l.quem)}</td><td>${esc(l.oque)}</td><td>${esc(l.tempo)}</td></tr>`).join('')}</tbody>
      </table></div>
    </section>`;

  return `
  <header class="hero">
    <p class="kicker">Checklist gratuito · Perfil da Empresa no Google</p>
    <h1>${esc(c.titulo)}</h1>
    <p class="lead">${esc(c.abertura)}</p>
    <ol class="how">${c.como_usar.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
    <a class="pdf-jump" href="#baixar">Baixar a versão em PDF para imprimir</a>
  </header>

  <div class="progress" role="status" aria-live="polite">
    <div class="progress-row"><span><b id="done">0</b> de ${total} itens</span><span class="score"><b id="pct">0</b>%</span></div>
    <div class="bar"><div class="fill" id="fill"></div></div>
    <p class="verdict" id="verdict"></p>
  </div>

  <div class="cl-main" data-total="${total}">
    ${sections}
    <div class="actions"><button type="button" id="reset" class="link-btn">Limpar marcações</button></div>
    ${kit}
  </div>`;
}

// ---------- Print layout (PDF) ----------

export function print(c, cfg) {
  const total = itemCount(c);
  const k = c.kit;

  const cover = `
  <section class="page cover">
    <p class="kicker">LK Digital · Checklist</p>
    <h1>${esc(c.titulo)}</h1>
    <p class="sub">${esc(c.subtitulo)}</p>
    <p class="lead">${esc(c.abertura)}</p>
    <div class="box">
      <h3>Como usar</h3>
      <ol>${c.como_usar.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
    </div>
    <div class="score">Itens feitos: <span class="blank"></span> de ${total} &nbsp;·&nbsp; Data: <span class="blank"></span></div>
    <div class="toc">
      <h3>Conteúdo</h3>
      <ol>${c.secoes.map(s => `<li>${esc(s.titulo)} <span>${s.itens.length} ${s.itens.length > 1 ? 'itens' : 'item'}</span></li>`).join('')}
      <li class="kit-li">${esc(k.titulo)} <span>modelos prontos</span></li></ol>
    </div>
  </section>`;

  const sections = `
  <section class="page checklist">
    ${c.secoes.map((s, i) => `
    <div class="sec">
      <h2><span class="n">${i + 1}</span>${esc(s.titulo)}</h2>
      ${s.itens.map(it => `
      <div class="item">
        <span class="cb"></span>
        <div>
          <p class="t">${esc(it.t)}</p>
          <p><b>Por quê:</b> ${esc(it.por)}</p>
          <p><b>Como:</b> ${esc(it.como)}${it.link ? ` <b>${esc(it.link.texto)}:</b> ${esc((cfg.SITE_BASE_URL || '').replace(/^https?:\/\//, '') + it.link.caminho)}` : ''}</p>
        </div>
      </div>`).join('')}
      ${s.nota ? `<p class="nota">${esc(s.nota)}</p>` : ''}
    </div>`).join('')}
  </section>`;

  const tpl = m => `
      <div class="tpl"><p class="q">${esc(m.quando)}</p><p class="tx">${ph(m.texto).replace(/\n/g, '<br>')}</p></div>`;

  const kitPages = `
  <section class="page kit">
    <p class="kicker">Kit de avaliações</p>
    <h2 class="big">${esc(k.titulo)}</h2>
    <p class="lead">${esc(k.abertura)}</p>
    <h3>${esc(k.link.titulo)}</h3>
    <ol class="steps">${k.link.passos.map(p => `<li>${ph(p)}</li>`).join('')}</ol>
    <h3>${esc(k.pedidos.titulo)}</h3>
    <ul class="rules">${k.pedidos.regras.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    ${k.pedidos.modelos.map(tpl).join('')}
  </section>
  <section class="page kit">
    <h3>${esc(k.respostas.titulo)}</h3>
    <ul class="rules">${k.respostas.regras.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    ${k.respostas.modelos.map(tpl).join('')}
    <h3>${esc(k.rotina.titulo)}</h3>
    <table>
      <thead><tr><th>Quando</th><th>Quem</th><th>O quê</th><th>Tempo</th></tr></thead>
      <tbody>${k.rotina.linhas.map(l => `<tr><td>${esc(l.quando)}</td><td>${esc(l.quem)}</td><td>${esc(l.oque)}</td><td>${esc(l.tempo)}</td></tr>`).join('')}</tbody>
    </table>
  </section>`;

  const all = [...k.pedidos.modelos, ...k.respostas.modelos];
  const copyPage = `
  <section class="page copy">
    <p class="kicker">Página de copiar e colar</p>
    <h2 class="big">Modelos prontos</h2>
    <p class="small">${ph(k.chaves)}</p>
    ${all.map(m => `<div class="cp"><p class="q">${esc(m.quando)}</p><pre>${esc(m.texto)}</pre></div>`).join('')}
    <p class="close">Você já sabe o que fazer. Se quiser que alguém instale esse processo na sua clínica, fale com a LK Digital: ${esc((cfg.SITE_BASE_URL || '').replace(/^https?:\/\//, ''))}</p>
  </section>`;

  return cover + sections + kitPages + copyPage;
}
