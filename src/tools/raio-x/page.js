// RAIO-X page: intro → 3 profile + 12 scored questions → free result → lead gate → full report.
// Ported from lk-lead-magnets raio-x/raio-x.html. `mount(root, cfg)` wires the markup below.
import * as RX from './raiox';
import { mountLeadForm } from '../shared/lead-form';
import { track, installClickTracking } from '../shared/lk-analytics';

export const markup = `<div class="wrap">

<section class="screen on" id="intro" aria-labelledby="intro-h">
  <p class="kicker">RAIO-X da clínica</p>
  <h1 id="intro-h">Onde sua clínica está perdendo pacientes?</h1>
  <p class="sub">12 perguntas. 3 minutos. Um raio-x do caminho entre o primeiro contato e a cadeira.</p>
  <button type="button" class="btn" id="start">Começar o RAIO-X</button>
  <p class="small">Leva cerca de 3 minutos. Suas respostas são confidenciais.</p>
  <ul class="steps-preview" aria-label="O que o RAIO-X avalia">
    <li>Visibilidade</li><li>Resposta</li><li>Qualificação</li><li>Comparecimento</li><li>Retenção</li><li>Números</li>
  </ul>
</section>

<section class="screen" id="quiz" aria-live="polite">
  <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="15" aria-valuenow="0" aria-label="Progresso"><div id="bar"></div></div>
  <div class="qhead"><button type="button" class="back" id="back">← Voltar</button><span id="count"></span></div>
  <p class="area-tag" id="q-area"></p>
  <h2 id="q-text" tabindex="-1"></h2>
  <div class="opts" id="opts"></div>
</section>

<section class="screen" id="result">
  <p class="kicker">Seu RAIO-X</p>
  <div class="score-card">
    <div class="score" id="r-score">0<small>/100</small></div>
    <h2 class="band" id="r-band"></h2>
    <p class="band-desc" id="r-desc"></p>
  </div>
  <div class="weak"><b>Ponto mais fraco: <span id="r-weak-name"></span></b><p id="r-weak-diag"></p></div>

  <div id="gate"></div>

  <div id="full" hidden>
    <h2 style="font-size:2rem;margin:30px 0 0">Relatório completo</h2>
    <div class="areas" id="areas"></div>
    <div class="eps" id="eps"></div>
    <div class="cta" id="cta"></div>
  </div>
  <button type="button" class="restart" id="restart">Refazer o RAIO-X</button>
</section>

<p class="note">LK Digital · O Sistema Operacional da Clínica Odontológica. Resultado indicativo, baseado nas suas respostas.</p>
</div>`;

const STEPS = RX.PROFILE.length + RX.QUESTIONS.length; // 15 screens

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export function mount(root, C) {
  const $ = (id) => root.querySelector('#' + id);
  let profile = {}, answers = [], labels = [], step = 0, result = null, timer = 0;
  installClickTracking();

  const show = (id) => {
    ['intro', 'quiz', 'result'].forEach((s) => $(s).classList.toggle('on', s === id));
    window.scrollTo(0, 0);
  };
  const waUrl = (text) => {
    const n = String(C.LK_WHATSAPP || '').replace(/\D/g, '');
    return n ? 'https://wa.me/' + n + '?text=' + encodeURIComponent(text) : '';
  };

  function renderStep() {
    const isProfile = step < RX.PROFILE.length;
    const qi = step - RX.PROFILE.length;
    const item = isProfile ? RX.PROFILE[step] : RX.QUESTIONS[qi];
    $('bar').style.width = (step / STEPS) * 100 + '%';
    root.querySelector('.progress').setAttribute('aria-valuenow', String(step));
    $('count').textContent = isProfile ? 'Perfil ' + (step + 1) + ' de ' + RX.PROFILE.length : 'Pergunta ' + (qi + 1) + ' de ' + RX.QUESTIONS.length;
    $('q-area').textContent = isProfile ? 'Sobre a clínica' : RX.areaByKey(item.area).label;
    $('q-text').textContent = item.q;
    $('back').hidden = step === 0;
    const current = isProfile ? profile[item.key] : labels[qi];
    $('opts').innerHTML = item.options.map((o, i) => {
      const label = isProfile ? o : o[0];
      return '<button type="button" class="rx-opt" data-i="' + i + '" aria-pressed="' + (label === current) + '">' + esc(label) + '</button>';
    }).join('');
    $('q-text').focus({ preventScroll: true });
  }

  function choose(i) {
    if (step < RX.PROFILE.length) {
      const p = RX.PROFILE[step];
      profile[p.key] = p.options[i];
      if (step === RX.PROFILE.length - 1) track('raiox_profile_done', { ...profile });
    } else {
      const qi = step - RX.PROFILE.length, opt = RX.QUESTIONS[qi].options[i];
      answers[qi] = opt[1];
      labels[qi] = opt[0];
      track('raiox_question', { index: qi + 1 });
    }
    Array.from($('opts').children).forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    clearTimeout(timer);
    timer = setTimeout(() => {
      step++;
      if (step < STEPS) renderStep(); else finish();
    }, 180);
  }

  function finish() {
    result = RX.score(answers);
    result.segment = RX.segment(profile, result.total);
    track('raiox_complete', { total: result.total, band: result.band.label, weakest: result.weakest, segment: result.segment });
    $('r-score').innerHTML = result.total + '<small>/100</small>';
    $('r-band').textContent = result.band.label;
    $('r-desc').textContent = result.band.desc;
    const weak = RX.areaByKey(result.weakest);
    $('r-weak-name').textContent = weak.label;
    $('r-weak-diag').textContent = RX.diagnosis(weak.key, result.areas[weak.key]);
    $('full').hidden = true;
    show('result');
    mountGate();
  }

  // Sent as the lead's `data`; the adapter re-scores `answers` server-side.
  function extra() {
    const ans = { especialidade: profile.especialidade, particular: profile.particular, anuncios: profile.anuncios };
    const lab = {};
    answers.forEach((v, i) => { ans['q' + (i + 1)] = v; lab['q' + (i + 1)] = labels[i]; });
    return {
      total: result.total, band: result.band.label, weakest: result.weakest, weakest_label: RX.areaByKey(result.weakest).label,
      segment: result.segment, areas: result.areas, answers: ans, answer_labels: lab,
    };
  }

  const waMessage = (lead) =>
    'Olá, Komando! Fiz o RAIO-X da ' + ((lead && lead.clinica) || 'minha clínica') + ': ' + result.total + '/100, ponto mais fraco: ' +
    RX.areaByKey(result.weakest).label + '. Quero entender o próximo passo.';

  function mountGate() {
    mountLeadForm($('gate'), {
      cfg: C,
      asset: 'raio-x',
      assetName: 'o RAIO-X da clínica',
      title: 'Receba o relatório completo com o plano de ação por área.',
      subtitle: 'Diagnóstico das 6 áreas, 2 ações para cada uma e os episódios recomendados.',
      submitLabel: 'Ver meu relatório completo',
      thanks: 'Seu relatório completo está logo abaixo.',
      prefill: { especialidade: profile.especialidade },
      extra,
      hideRaioX: true,
      alwaysSend: true,
      whatsappMessage: waMessage,
      onUnlock(lead, returning) {
        if (!returning) track('raiox_gate_submit', { total: result.total, segment: result.segment });
        renderFull(lead);
      },
    });
  }

  function renderFull(lead) {
    $('areas').innerHTML = RX.AREAS.map((a) => {
      const pct = result.areas[a.key];
      const weakest = a.key === result.weakest;
      return '<article class="area' + (weakest ? ' weakest' : '') + '" data-area="' + a.key + '">' +
        '<div class="area-top"><h3>' + esc(a.label) + (weakest ? '<span class="flag">mais fraca</span>' : '') + '</h3><span class="pct">' + pct + '%</span></div>' +
        '<div class="bar" aria-hidden="true"><div style="width:' + pct + '%"></div></div>' +
        '<p>' + esc(RX.diagnosis(a.key, pct)) + '</p>' +
        '<ol>' + a.acoes.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol></article>';
    }).join('');

    const two = result.ranked.slice(0, 2).map(RX.areaByKey);
    $('eps').innerHTML = '<h3>Episódios recomendados</h3><ul>' + two.map((a) => {
      const key = 'ep' + (a.ep < 10 ? '0' : '') + a.ep, url = (C.YOUTUBE_EPISODE_URLS || {})[key];
      const label = 'Episódio ' + a.ep + ' da série: ' + a.label;
      return '<li>' + (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener" data-lk-event="raiox_episode_click" data-lk-episode="' + key + '">' + esc(label) + '</a>' : esc(label)) + '</li>';
    }).join('') + '</ul>';

    const weak = RX.areaByKey(result.weakest);
    const wa = waUrl(waMessage(lead));
    let primary;
    if (result.segment === 'oferta') {
      const offer = C.IMPLANT_OFFER_URL || wa;
      primary = offer ? '<a class="btn" href="' + esc(offer) + '"' + (offer === wa ? ' target="_blank" rel="noopener"' : '') +
        ' data-lk-event="raiox_cta_click" data-lk-segment="oferta" data-lk-cta="' + (C.IMPLANT_OFFER_URL ? 'offer' : 'whatsapp') + '">Quero esse sistema instalado na minha clínica</a>' : '';
    } else {
      const assetUrl = (C.ASSET_URLS || {})[weak.asset] || '';
      primary = assetUrl ? '<a class="btn" href="' + esc(assetUrl + (weak.assetHash || '')) + '" data-lk-event="raiox_cta_click" data-lk-segment="nutrir" data-lk-cta="' + weak.asset + '">Abrir ' + esc(weak.assetName) + '</a>' : '';
    }
    const secondary = wa && !(result.segment === 'oferta' && !C.IMPLANT_OFFER_URL)
      ? '<a class="btn sec" href="' + esc(wa) + '" target="_blank" rel="noopener" data-lk-event="raiox_cta_click" data-lk-segment="' + result.segment + '" data-lk-cta="whatsapp">Falar com o Komando no WhatsApp</a>' : '';
    $('cta').innerHTML = result.segment === 'oferta'
      ? '<h3>Você já sabe o que fazer. Eu instalo.</h3><p>A LK instala o sistema entre o lead e a cadeira: resposta, qualificação, agendamento, comparecimento e retorno.</p>' + primary + secondary
      : '<h3>Comece pelo ponto mais fraco: ' + esc(weak.label) + '</h3><p>Material gratuito para corrigir essa etapa ainda esta semana.</p>' + primary + secondary;
    $('cta').hidden = !primary && !secondary;
    $('cta').setAttribute('data-segment', result.segment);
    $('full').hidden = false;
  }

  $('start').addEventListener('click', () => {
    step = 0; profile = {}; answers = []; labels = [];
    track('raiox_start');
    show('quiz');
    renderStep();
  });
  $('opts').addEventListener('click', (e) => {
    const b = e.target.closest('.rx-opt');
    if (b) choose(+b.getAttribute('data-i'));
  });
  $('back').addEventListener('click', () => { if (step > 0) { step--; renderStep(); } });
  $('restart').addEventListener('click', () => show('intro'));
  track('asset_view', { asset: 'raio-x' });

  window.LKRaioXPage = { state: () => ({ profile, answers, result }) };
  return () => clearTimeout(timer);
}
