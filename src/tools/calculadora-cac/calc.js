// Unit economics for a dental clinic (lead-magnet spec, section 7). Pure functions, no DOM.
// Used by the calculator page (page.js), the backbone adapter (re-computes the numbers) and the
// offline generator's spreadsheet test (lead-magnets/), which checks the xlsx gives the same numbers.
// Every division is guarded: a result that can't be computed is null (shown as "–").
/* eslint-disable no-var */

// Share of the people lost at a funnel step that the "Onde está o dinheiro" panel recovers.
// Note: raising every rate by the same *relative* 20% always gives the same CAC (closes are the
// product of the rates), so steps are compared by recovering 20% of each step's drop-off instead.
var RECOVER = 0.2;
var ADS_UP = 0.2;

function num(v) {
  var n = typeof v === 'number' ? v : parseFloat(String(v == null ? '' : v).replace(',', '.'));
  return isFinite(n) ? n : 0;
}
function div(a, b) { return b ? a / b : null; }

var STEPS = [
  { key: 'qualificacao', label: 'Lead → qualificado', from: 'leads', to: 'qual' },
  { key: 'agendamento', label: 'Qualificado → agendado', from: 'qual', to: 'agend' },
  { key: 'comparecimento', label: 'Agendado → compareceu', from: 'agend', to: 'comp' },
  { key: 'fechamento', label: 'Compareceu → fechou', from: 'comp', to: 'fech' }
];

function compute(input) {
  var i = {
    invest: num(input.invest), fixos: num(input.fixos),
    salario: num(input.salario), pctSec: num(input.pctSec) / 100,
    leads: num(input.leads), qual: num(input.qual), agend: num(input.agend),
    comp: num(input.comp), fech: num(input.fech),
    volta: num(input.volta) / 100, retorno: num(input.retorno), anos: num(input.anos)
  };
  var procs = (input.procs || []).map(function (p) {
    return { nome: String(p.nome || '').trim(), fech: num(p.fech), ticket: num(p.ticket), margem: num(p.margem) / 100 };
  }).filter(function (p) { return p.nome || p.fech || p.ticket; });

  var r = {};
  r.custoSec = i.salario * i.pctSec;
  r.custoTotal = i.invest + i.fixos + r.custoSec;

  // Cost per funnel stage (ads only).
  r.cpl = div(i.invest, i.leads);
  r.custoQual = div(i.invest, i.qual);
  r.custoAgend = div(i.invest, i.agend);
  r.custoComp = div(i.invest, i.comp);

  // CAC.
  r.cacAds = div(i.invest, i.fech);
  r.cacReal = div(r.custoTotal, i.fech);
  r.cacGap = r.cacAds != null && r.cacReal != null ? r.cacReal - r.cacAds : null;
  r.cacGapPct = r.cacGap != null ? div(r.cacGap, r.cacAds) : null;

  // Funnel conversions.
  r.conv = STEPS.map(function (s) { return { key: s.key, label: s.label, rate: div(i[s.to], i[s.from]) }; });
  r.convTotal = div(i.fech, i.leads);
  r.umEmCada = div(i.leads, i.fech);

  // Money.
  r.receita = procs.reduce(function (t, p) { return t + p.fech * p.ticket; }, 0);
  r.lucro = procs.reduce(function (t, p) { return t + p.fech * p.ticket * p.margem; }, 0);
  r.roi = r.custoTotal ? (r.lucro - r.custoTotal) / r.custoTotal : null;
  r.roas = div(r.receita, i.invest);

  // CAC by procedure: total cost allocated by share of closes.
  var procFech = procs.reduce(function (t, p) { return t + p.fech; }, 0);
  r.procFech = procFech;
  r.procs = procs.map(function (p) {
    var custo = procFech ? r.custoTotal * p.fech / procFech : null;
    var lucro = p.fech * p.ticket * p.margem;
    return {
      nome: p.nome, fech: p.fech, ticket: p.ticket, margem: p.margem,
      custoAlocado: custo,
      cac: custo != null ? div(custo, p.fech) : null,
      receita: p.fech * p.ticket,
      lucro: lucro,
      lucroAposCac: custo != null ? lucro - custo : null,
      cacSobreTicket: custo != null && p.fech ? div(custo / p.fech, p.ticket) : null
    };
  });

  // LTV.
  r.ticketMedio = div(r.receita, procFech);
  r.margemMedia = div(r.lucro, r.receita);
  r.ltv = r.ticketMedio != null && r.margemMedia != null
    ? r.ticketMedio * r.margemMedia + i.retorno * r.margemMedia * i.volta * i.anos
    : null;
  r.ltvCac = r.ltv != null && r.cacReal ? r.ltv / r.cacReal : null;

  // Where the money is: improve one step at a time, compare CAC real.
  r.onde = STEPS.map(function (s, k) {
    var rate = r.conv[k].rate;
    var better = rate == null ? null : Math.min(1, rate + RECOVER * (1 - rate));
    var fech2 = rate ? i.fech * better / rate : null;
    var cac2 = fech2 ? r.custoTotal / fech2 : null;
    return {
      key: s.key, label: s.label, rate: rate, rateNova: better,
      fech: fech2, cac: cac2,
      reducao: cac2 != null && r.cacReal != null ? r.cacReal - cac2 : null
    };
  });
  var ranked = r.onde.filter(function (o) { return o.reducao != null; })
    .sort(function (a, b) { return b.reducao - a.reducao; });
  r.maiorAlavanca = ranked.length ? ranked[0].key : null;
  var fechAds = i.fech * (1 + ADS_UP);
  r.maisAnuncios = {
    custo: i.invest * (1 + ADS_UP) + i.fixos + r.custoSec,
    fech: fechAds,
    cac: fechAds ? (i.invest * (1 + ADS_UP) + i.fixos + r.custoSec) / fechAds : null
  };

  // Warnings (never block).
  r.avisos = [];
  var order = ['leads', 'qual', 'agend', 'comp', 'fech'];
  var names = { leads: 'leads', qual: 'qualificados', agend: 'agendados', comp: 'compareceram', fech: 'fechados' };
  for (var k = 1; k < order.length; k++) {
    if (i[order[k]] > i[order[k - 1]]) {
      r.avisos.push('Há mais ' + names[order[k]] + ' do que ' + names[order[k - 1]] + '. Confira o funil.');
    }
  }
  if (procs.length && i.fech && procFech !== i.fech) {
    r.avisos.push('A soma dos fechamentos por procedimento (' + procFech + ') é diferente dos fechados do funil (' + i.fech + ').');
  }
  return r;
}

export { compute, STEPS, RECOVER, ADS_UP };
