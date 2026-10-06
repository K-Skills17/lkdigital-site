// Dashboard da Clínica (Eps 5, 8, 14): landing for the weekly spreadsheet (blank + filled example).
// Ported from lk-lead-magnets dashboard/landing.html; the xlsx files are built by lead-magnets/.
import { mountLeadForm } from '../shared/lead-form';
import { track, installClickTracking } from '../shared/lk-analytics';

export const FILES = { blank: 'dashboard-clinica.xlsx', demo: 'dashboard-clinica-demo.xlsx' };

export const markup = (cfg) => `<div class="wrap">
<div class="dash-head">
  <p class="kicker">Planilha gratuita · Excel e Google Sheets</p>
  <h1>Toda segunda, em 10 minutos: quanto custou cada paciente e qual canal trouxe receita.</h1>
  <p class="lead">Você lança os números da semana e o dashboard calcula o resto: custo por consulta, comparecimento, fechamento, CAC e ROAS, por semana e por canal.</p>
</div>

<figure class="shot">
  <img src="${cfg.FILES_BASE_URL}dashboard-preview.jpg" decoding="async" fetchpriority="high" width="1000" height="602" alt="Aba Dashboard da planilha: investimento, leads qualificados, consultas agendadas e receita fechada da última semana, média de 4 semanas e mês, e indicadores coloridos contra as metas.">
  <figcaption><b>Clínica fictícia — dados ilustrativos</b> Aba Dashboard do exemplo preenchido.</figcaption>
</figure>

<h2>O que vem na planilha</h2>
<ul class="list">
  <li><b>Dashboard.</b> <span>Última semana, média de 4 semanas e mês até agora, com gráficos semanais e o funil do mês.</span></li>
  <li><b>Metas em verde, amarelo e vermelho.</b> <span>Você define as metas e vê na hora o que saiu do trilho.</span></li>
  <li><b>Por canal.</b> <span>Meta, Google, Perfil do Google, indicação e Instagram lado a lado: quem traz receita, não só leads.</span></li>
  <li><b>Campanha A vs B.</b> <span>Compare duas campanhas pelo custo por paciente fechado, não pelo custo do clique.</span></li>
  <li><b>Duas versões.</b> <span>Um exemplo preenchido com 8 semanas de uma clínica fictícia e uma versão em branco para a sua.</span></li>
</ul>

<section id="baixar">
  <div id="lead"></div>
  <p class="note">No Google Sheets: Arquivo → Importar → Fazer upload. No Excel: é só abrir.</p>
</section>

<p class="foot">LK Digital · Ferramentas para clínicas odontológicas.</p>
</div>`;

export function mount(root, cfg) {
  installClickTracking();
  track('asset_view', { asset: 'dashboard-clinica' });
  mountLeadForm(root.querySelector('#lead'), {
    cfg,
    asset: 'dashboard-clinica',
    assetName: 'o Dashboard da Clínica',
    title: 'Receba a planilha',
    submitLabel: 'Liberar a planilha',
    thanks: 'Comece pelo exemplo para ver como funciona e use a versão em branco na sua clínica.',
    downloads: [
      { href: cfg.FILES_BASE_URL + FILES.blank, label: 'Baixar a versão em branco' },
      { href: cfg.FILES_BASE_URL + FILES.demo, label: 'Baixar o exemplo preenchido' },
    ],
  });
}
