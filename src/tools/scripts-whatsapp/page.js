// Scripts de WhatsApp para a recepção (Eps 2, 12, 13): landing with the rules and a sample script;
// the booklet PDF, the copy-paste .md and the one-page cheat sheet are built by lead-magnets/.
// Ported from lk-lead-magnets script-booklet/landing.html.
import content from './content.json';
import { landing } from './render.mjs';
import { mountLeadForm } from '../shared/lead-form';
import { track, installClickTracking } from '../shared/lk-analytics';

export const FILES = { booklet: 'scripts-whatsapp.pdf', md: 'scripts-whatsapp.md', cola: 'cola-rapida.pdf' };

export const markup = `<div class="wrap">
<div class="sw-head">
  <p class="kicker">Livreto gratuito · Para a recepção</p>
  <h1>O que a sua recepção responde no WhatsApp decide se o paciente senta na cadeira.</h1>
  <p class="lead">Scripts prontos do primeiro “oi” até a avaliação: resposta por origem, perguntas de qualificação, “quanto custa?”, objeções, lembretes e follow-up.</p>
</div>
${landing(content)}
<section id="baixar"><div id="lead"></div></section>
<p class="foot">LK Digital · Ferramentas para clínicas odontológicas.</p>
</div>`;

export function mount(root, cfg) {
  installClickTracking();
  track('asset_view', { asset: 'scripts-whatsapp' });
  mountLeadForm(root.querySelector('#lead'), {
    cfg,
    asset: 'scripts-whatsapp',
    assetName: 'os Scripts de WhatsApp',
    title: 'Receba os scripts',
    submitLabel: 'Liberar os scripts',
    thanks: 'Os scripts estão liberados. Imprima a cola rápida e deixe na recepção.',
    downloads: [
      { href: cfg.FILES_BASE_URL + FILES.booklet, label: 'Baixar o livreto (PDF)' },
      { href: cfg.FILES_BASE_URL + FILES.md, label: 'Textos para copiar e colar (.md)' },
      { href: cfg.FILES_BASE_URL + FILES.cola, label: 'Cola rápida da recepção (PDF, 1 página)' },
    ],
  });
}
