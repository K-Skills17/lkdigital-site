const TAX_RATES = {
  simples: 0.11,
  presumido: 0.1633,
  mei: 0,
};

export const PROCEDURE_PRESETS = [
  'Resina Composta',
  'Tratamento de Canal',
  'Extração Simples',
  'Limpeza/Profilaxia',
  'Clareamento',
  'Coroa/Prótese',
  'Implante',
  'Ortodontia Mensal',
  'Faceta',
  'Restauração',
];

export function calculatePricing(inputs) {
  const { clinica, procedimentos } = inputs;
  const custoFixoTotal = clinica.aluguel + clinica.folha + clinica.contasFixas + clinica.outrosCustos;
  const horasMensais = clinica.horasPorDia * clinica.diasPorMes;
  const custoPorHora = custoFixoTotal / horasMensais;
  const taxRate = TAX_RATES[clinica.regimeTributario] || 0;

  const results = procedimentos.map((proc) => {
    const custoTempo = (custoPorHora * proc.tempoMinutos) / 60;
    const custoBase = proc.custoMaterial + proc.custoLab + custoTempo;

    // Price needs to cover cost + tax on the price itself
    // price = custoBase / (1 - taxRate - marginRate)
    const precoMinimo = custoBase / (1 - taxRate);
    const precoRecomendado = custoBase / (1 - taxRate - 0.30);
    const precoPremium = custoBase / (1 - taxRate - 0.50);

    const impostoAtual = proc.precoAtual * taxRate;
    const lucroAtual = proc.precoAtual - custoBase - impostoAtual;
    const lucroHoraAtual = proc.tempoMinutos > 0
      ? (lucroAtual / proc.tempoMinutos) * 60
      : 0;

    const receitaMensalAtual = proc.precoAtual * proc.quantidadeMensal;
    const receitaMensalRecomendada = precoRecomendado * proc.quantidadeMensal;

    const abaixoCusto = proc.precoAtual < precoMinimo;

    return {
      nome: proc.nome,
      custoMaterial: proc.custoMaterial,
      custoLab: proc.custoLab,
      custoTempo,
      custoBase,
      imposto: proc.precoAtual * taxRate,
      precoAtual: proc.precoAtual,
      precoMinimo,
      precoRecomendado,
      precoPremium,
      lucroAtual,
      lucroHoraAtual,
      receitaMensalAtual,
      receitaMensalRecomendada,
      quantidadeMensal: proc.quantidadeMensal,
      tempoMinutos: proc.tempoMinutos,
      abaixoCusto,
    };
  });

  const totalReceitaAtual = results.reduce((s, r) => s + r.receitaMensalAtual, 0);
  const totalReceitaRecomendada = results.reduce((s, r) => s + r.receitaMensalRecomendada, 0);
  const totalHorasMensal = results.reduce((s, r) => s + (r.tempoMinutos * r.quantidadeMensal) / 60, 0);
  const totalLucroAtual = results.reduce((s, r) => s + r.lucroAtual * r.quantidadeMensal, 0);
  const lucroHoraReal = totalHorasMensal > 0 ? totalLucroAtual / totalHorasMensal : 0;
  const procedimentosAbaixoCusto = results.filter((r) => r.abaixoCusto);

  return {
    results,
    custoFixoTotal,
    custoPorHora,
    taxRate,
    regimeName: clinica.regimeTributario === 'simples' ? 'Simples Nacional (~11%)' :
      clinica.regimeTributario === 'presumido' ? 'Lucro Presumido (~16.33%)' : 'MEI',
    totalReceitaAtual,
    totalReceitaRecomendada,
    lucroHoraReal,
    procedimentosAbaixoCusto,
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
