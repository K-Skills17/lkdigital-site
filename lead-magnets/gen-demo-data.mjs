// Generates src/tools/shared/demo-clinic.json: the single source of fictional data (calculator example,
// dashboard demo workbook, Ep 10 props). Run: node lead-magnets/gen-demo-data.mjs, then npm run build.
// Every 4-week block sums exactly to the baseline month, per channel.
import { writeFileSync } from 'node:fs';

const TICKETS = { implante: 5000, protocolo: 25000, geral: 350 };

// Baseline month (weeks 5-8). Row: [investimento, leads, qualificados, agendados, compareceram, fechados, procedimentos fechados]
const BASE = {
  'Meta': [
    [450, 42, 14, 5, 3, 1, ['geral']],
    [450, 48, 16, 5, 3, 0, []],
    [450, 44, 15, 5, 3, 1, ['implante']],
    [450, 46, 15, 5, 3, 1, ['geral']],
  ],
  'Google': [
    [300, 17, 8, 3, 2, 1, ['implante']],
    [300, 18, 8, 3, 2, 0, []],
    [300, 16, 7, 3, 2, 1, ['geral']],
    [300, 19, 9, 3, 3, 1, ['implante']],
  ],
  'GBP/orgânico': [
    [0, 6, 3, 2, 1, 0, []],
    [0, 7, 4, 2, 2, 1, ['geral']],
    [0, 5, 3, 1, 1, 0, []],
    [0, 7, 3, 2, 1, 1, ['implante']],
  ],
  'Indicação': [
    [0, 3, 3, 1, 1, 1, ['geral']],
    [0, 2, 2, 1, 1, 0, []],
    [0, 3, 2, 1, 0, 0, []],
    [0, 2, 2, 1, 1, 1, ['protocolo']],
  ],
  'Instagram orgânico': [
    [0, 4, 2, 1, 0, 0, []],
    [0, 3, 1, 0, 0, 0, []],
    [0, 4, 1, 0, 0, 0, []],
    [0, 4, 2, 1, 1, 0, []],
  ],
};
// Weeks 1-4 repeat weeks 5-8 row for row, so ANY 4 consecutive weeks (rolling window) total exactly
// the baseline month, per channel (spec v2, section 3).
// Mondays. September 2026 has exactly four Mondays, so month-to-date = baseline month.
const WEEKS = ['2026-08-10', '2026-08-17', '2026-08-24', '2026-08-31',
               '2026-09-07', '2026-09-14', '2026-09-21', '2026-09-28'];

const weekly = [];
WEEKS.forEach((semana, i) => {
  for (const canal of Object.keys(BASE)) {
    const row = BASE[canal][i % 4];
    const [investimento, leads, qualificados, agendados, compareceram, fechados, procs] = row;
    if (procs.length !== fechados) throw new Error(`closes mismatch ${canal} ${semana}`);
    if (!(leads >= qualificados && qualificados >= agendados && agendados >= compareceram && compareceram >= fechados))
      throw new Error(`non-monotonic funnel ${canal} ${semana}`);
    weekly.push({
      semana, canal, investimento, leads, qualificados, agendados, compareceram, fechados,
      procedimentos: procs,
      receita_fechada: procs.reduce((s, p) => s + TICKETS[p], 0),
    });
  }
});

const month = {
  investimento_anuncios: 3000, custos_fixos_marketing: 2000,
  leads: 300, qualificados: 120, agendados: 45, compareceram: 30, fechados: 10,
  margem_bruta: 0.40,
};

// Verify every rolling 4-week window against the baseline month.
for (let w = 0; w + 4 <= WEEKS.length; w++) {
  const block = weekly.filter(r => WEEKS.indexOf(r.semana) >= w && WEEKS.indexOf(r.semana) < w + 4);
  const sum = k => block.reduce((s, r) => s + r[k], 0);
  const checks = { investimento: 3000, leads: 300, qualificados: 120, agendados: 45, compareceram: 30, fechados: 10, receita_fechada: 46750 };
  for (const [k, v] of Object.entries(checks)) if (sum(k) !== v) throw new Error(`${k}: ${sum(k)} != ${v}`);
}

const data = {
  _aviso: 'Clínica fictícia — dados ilustrativos',
  clinica: {
    nome: 'Clínica Modelo Odonto',
    cidade: 'São Paulo', uf: 'SP', bairro: 'Vila Mariana',
    endereco: 'Rua Exemplo, 123 — Vila Mariana, São Paulo – SP (endereço fictício)',
    foco: 'Implantes e reabilitação oral',
    responsavel_tecnica: 'Dra. Ana Modelo',
    cro: 'CRO-SP 00000 (fictício)',
    whatsapp: '',
    horarios: 'Seg a sex, 8h–19h · Sáb, 8h–12h',
  },
  mes_base: month,
  // Internal economics only. Never show tickets as patient-facing prices.
  procedimentos: [
    { nome: 'Implante unitário', chave: 'implante', fechamentos: 4, ticket_medio: 5000 },
    { nome: 'Protocolo', chave: 'protocolo', fechamentos: 1, ticket_medio: 25000 },
    { nome: 'Clínica geral', chave: 'geral', fechamentos: 5, ticket_medio: 350 },
  ],
  canais: Object.keys(BASE),
  semanas: WEEKS,
  semanal: weekly,
  // Optional LTV inputs for the calculator's "Carregar exemplo" (fictional).
  ltv_exemplo: { pct_retorno_ano: 0.5, receita_retorno_ano: 350, horizonte_anos: 3 },
  campanhas_ep5: [
    { nome: 'Campanha A', cliques: 1000, cpc: 2, fechados: 0, procedimento: 'implante', receita_fechada: 0 },
    { nome: 'Campanha B', cliques: 100, cpc: 12, fechados: 3, procedimento: 'protocolo', receita_fechada: 3 * TICKETS.protocolo },
  ],
};

writeFileSync(new URL('../src/tools/shared/demo-clinic.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log(`demo-clinic.json: ${weekly.length} weekly rows, all ${WEEKS.length - 3} rolling 4-week windows verified.`);
