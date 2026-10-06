// Checklist do Perfil do Google + kit de avaliações (Ep 9). Ported from lk-lead-magnets gbp-checklist/.
// The markup comes from render.mjs (same source as the PDF); `mount(root, cfg)` adds the live score,
// saved ticks, copy buttons and the PDF lead form.
import content from './content.json';
import { interactive, itemCount } from './render.mjs';
import { mountLeadForm } from '../shared/lead-form';
import { track, installClickTracking } from '../shared/lk-analytics';

export const TOTAL_ITEMS = itemCount(content);
export const PDF_FILE = 'checklist-google.pdf';

export function markup(cfg) {
  return '<div class="wrap">' + interactive(content, cfg) + `
<section class="download" id="baixar">
  <h2>Leve o checklist impresso</h2>
  <p class="muted">PDF em A4 com os ${TOTAL_ITEMS} itens, o kit de avaliações e uma página de modelos para copiar e colar.</p>
  <div id="lead"></div>
</section>
<p class="note">LK Digital · Checklist para clínicas odontológicas. Conteúdo educativo; confira sempre as diretrizes atuais do Google e do CFO.</p>
</div>`;
}

const KEY = 'lk_gbp_checklist_v1';
const VERDICTS = [
  [100, 'Perfil completo. Agora é manter a rotina semanal.'],
  [75, 'Quase lá. Os itens que faltam são a sua lista desta semana.'],
  [40, 'Boa base. Priorize Avaliações e Contato: é onde o paciente decide.'],
  [1, 'Começou. Resolva primeiro a Base do perfil e o Contato.'],
  [0, 'Marque o que já está feito no seu Perfil.'],
];

export function mount(root, cfg) {
  installClickTracking();
  track('asset_view', { asset: 'checklist-google' });
  const main = root.querySelector('.cl-main');
  const total = +main.getAttribute('data-total');
  const boxes = Array.from(main.querySelectorAll('input[type=checkbox][data-id]'));
  const $ = (id) => root.querySelector('#' + id);
  const timers = [];

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
  const save = (ids) => { try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* storage blocked */ } };

  function update() {
    const ids = [], secDone = {};
    for (const b of boxes) {
      const sec = b.closest('.sec').getAttribute('data-sec');
      secDone[sec] = (secDone[sec] || 0) + (b.checked ? 1 : 0);
      b.closest('.item').classList.toggle('done', b.checked);
      if (b.checked) ids.push(b.getAttribute('data-id'));
    }
    const pct = Math.round((ids.length / total) * 100);
    $('done').textContent = String(ids.length);
    $('pct').textContent = String(pct);
    $('fill').style.width = pct + '%';
    $('verdict').textContent = VERDICTS.find((v) => pct >= v[0])[1];
    for (const el of main.querySelectorAll('[data-count]')) {
      const id = el.getAttribute('data-count');
      const n = main.querySelectorAll('[data-sec="' + id + '"] input[data-id]').length;
      el.textContent = (secDone[id] || 0) + '/' + n;
      el.classList.toggle('full', secDone[id] === n);
    }
    return ids;
  }

  const saved = load();
  for (const b of boxes) b.checked = saved.includes(b.getAttribute('data-id'));
  update();
  main.addEventListener('change', (e) => {
    if (e.target.matches('input[data-id]')) {
      save(update());
      if (e.target.checked) track('checklist_item_done', { item: e.target.getAttribute('data-id') });
    }
  });
  $('reset').addEventListener('click', () => {
    if (!window.confirm('Limpar todas as marcações?')) return;
    for (const b of boxes) b.checked = false;
    save(update());
  });

  // Copy buttons for the templates.
  main.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy');
    if (!btn) return;
    const text = $('tpl-' + btn.getAttribute('data-copy')).textContent;
    const done = () => {
      btn.textContent = 'Copiado';
      btn.classList.add('ok');
      track('template_copy', { template: btn.getAttribute('data-copy') });
      timers.push(setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('ok'); }, 1500));
    };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch { /* ignore */ }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });

  mountLeadForm($('lead'), {
    cfg,
    asset: 'checklist-google',
    assetName: 'o Checklist do Perfil do Google',
    title: 'Receba o PDF',
    submitLabel: 'Liberar o PDF',
    thanks: 'O PDF está liberado. Imprima e deixe na recepção.',
    download: { href: cfg.FILES_BASE_URL + PDF_FILE, label: 'Baixar o PDF (A4)' },
    extra: () => ({ done: update().length, total }),
    whatsappMessage: () => 'Olá! Baixei o Checklist do Perfil do Google da LK Digital e quero conversar sobre a minha clínica.',
  });
  return () => timers.forEach(clearTimeout);
}
