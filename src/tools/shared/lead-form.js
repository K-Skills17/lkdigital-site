// Lead form shared by the lead magnets (spec v2: nome, clínica, cidade, WhatsApp, e-mail,
// especialidade + unchecked LGPD consent). Submits through the backbone (submitLead → tool_leads,
// AI plan, CAPI, WhatsApp, Telegram). A returning visitor (lead kept in localStorage "lk_lead")
// skips the form; the lead is still recorded for the new asset. Never blocks the visitor.
import { submitLead } from './backbone-client';
import { track } from './lk-analytics';

const ESPECIALIDADES = ['Implantes/Prótese', 'Ortodontia', 'Estética', 'Clínica geral', 'Outra'];
const CONSENT = 'Concordo em receber este material e contatos da LK Digital pelo WhatsApp e e-mail. Posso cancelar a qualquer momento.';
const KEY = 'lk_lead';
const KEY_SENT = 'lk_lead_assets';

const storeGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const storeSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* blocked */ } };
const digits = (v) => String(v || '').replace(/\D/g, '');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function maskWhatsApp(v) {
  const d = digits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? '(' + d : '';
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

function waHref(cfg, text) {
  const n = digits(cfg.LK_WHATSAPP);
  return n ? 'https://wa.me/' + n + '?text=' + encodeURIComponent(text) : '';
}

function field(id, label, type, req, attrs) {
  return '<div class="f"><label for="' + id + '">' + label + (req ? '' : ' <span class="opt">(opcional)</span>') + '</label>' +
    '<input id="' + id + '" name="' + id + '" type="' + type + '"' + (req ? ' required' : '') + ' ' + (attrs || '') + '>' +
    '<div class="err" id="' + id + '-err" aria-live="polite"></div></div>';
}

/**
 * @param {HTMLElement} el
 * @param {object} o  { asset, assetName, title, subtitle, submitLabel, thanks, download, downloads,
 *                      prefill, extra (obj|fn), hideRaioX, alwaysSend, whatsappMessage(lead), onUnlock(lead, returning), cfg }
 */
export function mountLeadForm(el, o) {
  const cfg = o.cfg || {};

  function payloadFor(lead, returning) {
    const extra = typeof o.extra === 'function' ? o.extra() : (o.extra || {});
    const ep = new URLSearchParams(window.location.search).get('ep') || '';
    return {
      name: lead.nome, phone: lead.whatsapp, clinicName: lead.clinica, city: lead.cidade,
      email: lead.email || '', especialidade: lead.especialidade, consent: true,
      episode: ep, returning: !!returning, data: extra,
    };
  }

  async function send(lead, returning) {
    const sent = storeGet(KEY_SENT) || [];
    if (!sent.includes(o.asset)) { sent.push(o.asset); storeSet(KEY_SENT, sent); }
    const res = await submitLead(o.asset, payloadFor(lead, returning), { content_category: 'lead-magnet' });
    return res || {};
  }

  function unlock(lead, returning, res) {
    const dls = (o.downloads || []).concat(o.download ? [o.download] : []);
    const wa = waHref(cfg, o.whatsappMessage ? o.whatsappMessage(lead) : 'Olá! Baixei ' + (o.assetName || 'o material') + ' da LK Digital e quero conversar sobre a minha clínica.');
    const rx = o.hideRaioX ? '' : (cfg.ASSET_URLS || {})['raio-x'] || '';
    el.innerHTML =
      '<div class="lkl done" role="status">' +
      '<h3>' + (returning ? 'Bem-vindo de volta, ' : 'Pronto, ') + esc(String(lead.nome || '').split(' ')[0]) + '!</h3>' +
      '<p>' + esc(o.thanks || 'Material liberado.') + '</p>' +
      dls.map((dl, i) => '<a class="btn' + (i ? ' sec' : '') + '" href="' + esc(dl.href) + '" download data-lk-event="download" data-lk-asset="' + esc(o.asset) +
        '" data-lk-file="' + esc(dl.href.split('/').pop()) + '">' + esc(dl.label || 'Baixar') + '</a>').join('') +
      (wa ? '<a class="btn sec" href="' + esc(wa) + '" target="_blank" rel="noopener" data-lk-event="cta_whatsapp_click" data-lk-asset="' + esc(o.asset) + '">Falar com a LK no WhatsApp</a>' : '') +
      (rx ? '<a class="btn sec" href="' + esc(rx) + '" data-lk-event="cta_raiox_click" data-lk-asset="' + esc(o.asset) + '">Faça o RAIO-X da sua clínica</a>' : '') +
      '<p class="wa-note" data-wa-note hidden>Também enviamos no seu WhatsApp.</p>' +
      (returning ? '<button type="button" class="again">Não é você? Preencher de novo</button>' : '') +
      '</div>';
    const again = el.querySelector('.again');
    if (again) again.addEventListener('click', () => renderForm(lead));
    if (res) res.then((r) => { if (r && r.messageSent) { const n = el.querySelector('[data-wa-note]'); if (n) n.hidden = false; } }).catch(() => {});
    if (typeof o.onUnlock === 'function') o.onUnlock(lead, returning);
  }

  function renderForm(pre = {}) {
    const opts = '<option value="">Selecione</option>' + ESPECIALIDADES.map((e) => '<option>' + e + '</option>').join('');
    el.innerHTML =
      '<form class="lkl" novalidate>' +
      '<h3>' + esc(o.title || 'Receba o material') + '</h3>' +
      '<p>' + esc(o.subtitle || 'Preencha para liberar. Leva 30 segundos.') + '</p>' +
      field('lk_nome', 'Nome', 'text', true, 'autocomplete="name" maxlength="80"') +
      field('lk_clinica', 'Nome da clínica', 'text', true, 'autocomplete="organization" maxlength="100"') +
      field('lk_cidade', 'Cidade', 'text', true, 'autocomplete="address-level2" maxlength="60"') +
      field('lk_whatsapp', 'WhatsApp', 'tel', true, 'autocomplete="tel-national" inputmode="numeric" placeholder="(11) 91234-5678" maxlength="15"') +
      field('lk_email', 'E-mail', 'email', false, 'autocomplete="email" maxlength="120"') +
      '<div class="f"><label for="lk_esp">Especialidade principal</label><select id="lk_esp" name="lk_esp" required>' + opts + '</select>' +
      '<div class="err" id="lk_esp-err" aria-live="polite"></div></div>' +
      '<div class="hp" aria-hidden="true"><label for="lk_site">Site</label><input id="lk_site" name="lk_site" tabindex="-1" autocomplete="off"></div>' +
      '<label class="consent"><input type="checkbox" id="lk_consent" required> <span>' + CONSENT +
      (cfg.PRIVACY_URL ? ' <a href="' + esc(cfg.PRIVACY_URL) + '" target="_blank" rel="noopener">Política de privacidade</a>.' : '') + '</span></label>' +
      '<div class="err" id="lk_consent-err" aria-live="polite"></div>' +
      '<button class="btn" type="submit">' + esc(o.submitLabel || 'Liberar') + '</button>' +
      '</form>';

    const f = el.querySelector('form');
    const set = (id, v) => { if (v) f.querySelector('#' + id).value = v; };
    set('lk_nome', pre.nome); set('lk_clinica', pre.clinica); set('lk_cidade', pre.cidade);
    set('lk_whatsapp', pre.whatsapp ? maskWhatsApp(pre.whatsapp) : ''); set('lk_email', pre.email);
    if (pre.especialidade && ESPECIALIDADES.includes(pre.especialidade)) f.querySelector('#lk_esp').value = pre.especialidade;
    const wa = f.querySelector('#lk_whatsapp');
    wa.addEventListener('input', () => { wa.value = maskWhatsApp(wa.value); });
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const lead = validate(f);
      if (!lead) return;
      if (f.querySelector('#lk_site').value) { unlock(lead, false, null); return; } // spam trap: show, don't send
      storeSet(KEY, lead);
      track('lead_submitted', { asset: o.asset });
      unlock(lead, false, send(lead, false));
    });
    track('lead_form_view', { asset: o.asset });
  }

  function validate(f) {
    const v = (id) => f.querySelector('#' + id).value.trim();
    const errs = {};
    if (v('lk_nome').length < 2) errs.lk_nome = 'Informe seu nome.';
    if (v('lk_clinica').length < 2) errs.lk_clinica = 'Informe o nome da clínica.';
    if (v('lk_cidade').length < 2) errs.lk_cidade = 'Informe a cidade.';
    const d = digits(v('lk_whatsapp'));
    if (d.length < 10 || d.length > 11) errs.lk_whatsapp = 'WhatsApp com DDD, ex.: (11) 91234-5678.';
    const email = v('lk_email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.lk_email = 'E-mail inválido.';
    if (!v('lk_esp')) errs.lk_esp = 'Escolha a especialidade.';
    if (!f.querySelector('#lk_consent').checked) errs.lk_consent = 'Marque o consentimento para continuar.';
    ['lk_nome', 'lk_clinica', 'lk_cidade', 'lk_whatsapp', 'lk_email', 'lk_esp', 'lk_consent'].forEach((id) => {
      f.querySelector('#' + id + '-err').textContent = errs[id] || '';
      f.querySelector('#' + id).setAttribute('aria-invalid', errs[id] ? 'true' : 'false');
    });
    const first = Object.keys(errs)[0];
    if (first) { f.querySelector('#' + first).focus(); return null; }
    return { nome: v('lk_nome'), clinica: v('lk_clinica'), cidade: v('lk_cidade'), whatsapp: v('lk_whatsapp'), email, especialidade: v('lk_esp') };
  }

  const stored = storeGet(KEY);
  if (stored && digits(stored.whatsapp).length >= 10) {
    const sent = storeGet(KEY_SENT) || [];
    const res = o.alwaysSend || !sent.includes(o.asset) ? send(stored, true) : null;
    unlock(stored, true, res);
    return;
  }
  renderForm(Object.assign({}, stored || {}, o.prefill || {}));
}
