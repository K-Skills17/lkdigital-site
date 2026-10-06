// RAIO-X da clínica: questions, scoring, bands, segment and per-area content (spec v2, section 6).
// Pure data + functions, no DOM. Used by the page (page.js), the backbone adapter
// (src/lib/backbone/tools/raio-x.ts, which re-scores the answers) and the tests.
/* eslint-disable no-var */

var PROFILE = [
  { key: 'especialidade', q: 'Qual é a especialidade principal da sua clínica?',
    options: ['Implantes/Prótese', 'Ortodontia', 'Estética', 'Clínica geral', 'Outra'] },
  { key: 'particular', q: 'Quanto do seu faturamento vem de atendimento particular?',
    options: ['Menos de 30%', '30–50%', '50–80%', 'Mais de 80%'] },
  { key: 'anuncios', q: 'Você investe em anúncios hoje?',
    options: ['Não', 'Até 2 mil reais/mês', '2 a 5 mil reais/mês', 'Mais de 5 mil reais/mês'] }
];

// 12 scored questions, 2 per area, in the order they are asked.
var QUESTIONS = [
  { area: 'visibilidade', q: 'Quando alguém pesquisa “dentista” + o seu bairro no Google, onde sua clínica aparece?',
    options: [['Entre os 3 primeiros do mapa', 3], ['Aparece, mas abaixo dos 3 primeiros', 1], ['Não aparece', 0], ['Nunca verifiquei', 0]] },
  { area: 'visibilidade', q: 'Quantas avaliações novas no Google sua clínica recebeu nos últimos 30 dias?',
    options: [['5 ou mais', 3], ['2 a 4', 2], ['1', 1], ['Nenhuma / não sei', 0]] },
  { area: 'resposta', q: 'Em horário comercial, quanto tempo um novo contato no WhatsApp espera pela primeira resposta?',
    options: [['Menos de 5 minutos', 3], ['Menos de 1 hora', 2], ['No mesmo dia', 1], ['Não sei', 0]] },
  { area: 'resposta', q: 'O que acontece com ligações perdidas e mensagens fora do horário?',
    options: [['Resposta automática + retorno no próximo horário', 3], ['Alguém retorna no dia seguinte', 2], ['Às vezes alguém retorna', 1], ['Nada / não sei', 0]] },
  { area: 'qualificacao', q: 'Quando o paciente pergunta “quanto custa?” pelo WhatsApp, a equipe:',
    options: [['Explica que o valor é definido na avaliação e oferece 2 horários', 3], ['Depende de quem atende', 1], ['Passa uma faixa de preço', 1], ['Passa o preço', 0]] },
  { area: 'qualificacao', q: 'A equipe segue um roteiro escrito, com perguntas de qualificação, antes de agendar?',
    options: [['Sim, todos usam', 3], ['Existe, mas quase ninguém usa', 1], ['Cada um faz do seu jeito', 0], ['Não sei', 0]] },
  { area: 'comparecimento', q: 'De cada 10 avaliações agendadas, quantas comparecem?',
    options: [['9 ou 10', 3], ['7 ou 8', 2], ['5 ou 6', 1], ['Menos de 5 / não sei', 0]] },
  { area: 'comparecimento', q: 'Como o plano de tratamento é apresentado ao paciente?',
    options: [['Presencialmente, com imagens e opções de plano', 3], ['Presencialmente, com um orçamento único', 2], ['Orçamento enviado por WhatsApp ou e-mail', 1], ['Varia / não há padrão', 0]] },
  { area: 'retencao', q: 'O paciente que não fechou o tratamento recebe acompanhamento?',
    options: [['Sim, uma sequência definida ao longo de semanas', 3], ['1 ou 2 mensagens', 2], ['Só se ele entrar em contato', 1], ['Não', 0]] },
  { area: 'retencao', q: 'Sua clínica tem um sistema de retorno (recall) para pacientes antigos?',
    options: [['Sim, automático', 3], ['Sim, manual e regular', 2], ['De vez em quando', 1], ['Não', 0]] },
  { area: 'numeros', q: 'Você sabe quanto custa conquistar um paciente novo (CAC)?',
    options: [['Sei, por procedimento', 3], ['Sei o número geral', 2], ['Só sei o custo por lead', 1], ['Não sei', 0]] },
  { area: 'numeros', q: 'Com que frequência você olha investimento, agendamentos e faturamento de marketing juntos?',
    options: [['Toda semana', 3], ['Todo mês', 2], ['Raramente', 1], ['Nunca', 0]] }
];

// Areas in display order. `asset` = free material for the "nutrir" CTA; `ep` = recommended episode.
var AREAS = [
  { key: 'visibilidade', label: 'Visibilidade', eps: [9, 10], ep: 9, asset: 'checklist-google', assetName: 'o Checklist do Perfil do Google',
    diagnosticos: [
      'Quem procura dentista no seu bairro quase não encontra a sua clínica no Google.',
      'Sua clínica aparece, mas perde pacientes para quem está no topo do mapa com avaliações mais recentes.',
      'Sua clínica é encontrada. O trabalho agora é manter o ritmo de avaliações e atualizações.'],
    acoes: [
      'Revise o Perfil da Empresa no Google item por item: nome, categoria, serviços, fotos e horários.',
      'Peça avaliação a todos os pacientes, toda semana, com o link direto e uma mensagem padrão.'] },
  { key: 'resposta', label: 'Resposta', eps: [2, 13], ep: 2, asset: 'scripts-whatsapp', assetName: 'os Scripts de WhatsApp',
    diagnosticos: [
      'O lead espera demais pela primeira resposta e procura outra clínica nesse intervalo.',
      'A resposta acontece, mas sem padrão: depende do dia e de quem está na recepção.',
      'Sua clínica responde rápido. Mantenha a meta também nos dias mais cheios.'],
    acoes: [
      'Defina a meta de primeira resposta em menos de 5 minutos no horário de atendimento e acompanhe toda semana.',
      'Ative resposta automática para ligações perdidas e mensagens fora do horário, com retorno no primeiro horário do dia.'] },
  { key: 'qualificacao', label: 'Qualificação e agendamento', eps: [12, 13], ep: 12, asset: 'scripts-whatsapp', assetName: 'os Scripts de WhatsApp',
    diagnosticos: [
      'A conversa no WhatsApp não leva à avaliação: o valor vira assunto antes do caso do paciente.',
      'Existe um caminho para agendar, mas cada pessoa da equipe conduz de um jeito.',
      'A equipe qualifica e agenda com método. O próximo passo é medir o agendamento por canal.'],
    acoes: [
      'Use um roteiro escrito com 3 perguntas de qualificação e ofereça sempre dois horários.',
      'Treine a resposta para “quanto custa?”: o valor é definido na avaliação, e a conversa termina com um horário marcado.'] },
  { key: 'comparecimento', label: 'Comparecimento e fechamento', eps: [4, 12], ep: 4, asset: 'scripts-whatsapp', assetName: 'os Scripts de WhatsApp',
    diagnosticos: [
      'Pacientes agendados faltam, e quem vem sai sem entender bem o plano.',
      'Parte dos agendados falta, e a apresentação do plano muda de caso para caso.',
      'Comparecimento e apresentação do plano estão bem estruturados.'],
    acoes: [
      'Envie confirmação ao agendar, na véspera e na manhã da consulta, sempre pedindo uma resposta.',
      'Apresente o plano pessoalmente, com os exames do paciente e mais de uma opção, e combine o próximo passo antes de ele sair.'] },
  { key: 'retencao', label: 'Retenção', eps: [3], ep: 3, asset: 'calculadora-cac', assetHash: '#ltv', assetName: 'a Calculadora de CAC (seção LTV)',
    diagnosticos: [
      'Quem não fechou, ou já foi paciente, é esquecido, e esse faturamento fica na mesa.',
      'Existe algum acompanhamento, mas ele depende de alguém lembrar.',
      'Sua clínica acompanha e traz pacientes de volta com regularidade.'],
    acoes: [
      'Crie uma sequência para quem não fechou: mensagens 2, 7 e 21 dias depois da avaliação, para tirar dúvidas.',
      'Monte um sistema de retorno para pacientes antigos, com lembrete periódico e uma pessoa responsável.'] },
  { key: 'numeros', label: 'Números', eps: [1, 5], ep: 1, asset: 'dashboard-clinica', assetName: 'o Dashboard da Clínica',
    diagnosticos: [
      'Sem números, não dá para saber quais anúncios trazem pacientes e quais trazem só cliques.',
      'Você acompanha alguns números, mas ainda não liga investimento a pacientes fechados.',
      'Você conhece seus números. Use-os para decidir onde colocar cada próximo investimento.'],
    acoes: [
      'Calcule o seu CAC real: todos os custos de marketing divididos pelos pacientes que fecharam.',
      'Reserve 10 minutos toda segunda para lançar investimento, agendamentos e receita em um painel só.'] }
];

// Tie-break for the weakest area: earliest in the funnel wins.
var TIE_ORDER = ['resposta', 'qualificacao', 'comparecimento', 'visibilidade', 'retencao', 'numeros'];

var BANDS = [
  { key: 'critico', min: 0, max: 40, label: 'Vazamento crítico', desc: 'Pacientes estão escapando em várias etapas.' },
  { key: 'parcial', min: 41, max: 70, label: 'Sistema parcial', desc: 'Algumas etapas funcionam, outras deixam dinheiro na mesa.' },
  { key: 'instalado', min: 71, max: 100, label: 'Sistema instalado', desc: 'O foco agora é escala.' }
];

function band(total) {
  for (var i = 0; i < BANDS.length; i++) if (total >= BANDS[i].min && total <= BANDS[i].max) return BANDS[i];
  return BANDS[0];
}

function areaByKey(k) { for (var i = 0; i < AREAS.length; i++) if (AREAS[i].key === k) return AREAS[i]; return null; }
function level(pct) { return pct <= 33 ? 0 : pct <= 66 ? 1 : 2; }

// answers: 12 scores (0–3), in QUESTIONS order.
function score(answers) {
  var pts = {}, sum = 0;
  AREAS.forEach(function (a) { pts[a.key] = 0; });
  QUESTIONS.forEach(function (q, i) { var v = +answers[i] || 0; pts[q.area] += v; sum += v; });
  var areas = {};
  AREAS.forEach(function (a) { areas[a.key] = Math.round(pts[a.key] / 6 * 100); });
  var ranked = TIE_ORDER.slice().sort(function (x, y) {
    return (pts[x] - pts[y]) || (TIE_ORDER.indexOf(x) - TIE_ORDER.indexOf(y));
  });
  var total = Math.round(sum / 36 * 100);
  return { raw: sum, total: total, band: band(total), areas: areas, points: pts, ranked: ranked, weakest: ranked[0] };
}

// oferta: implant clinic, ≥ 50% particular, total ≤ 70.
function segment(profile, total) {
  var particularOk = profile.particular === '50–80%' || profile.particular === 'Mais de 80%';
  return profile.especialidade === 'Implantes/Prótese' && particularOk && total <= 70 ? 'oferta' : 'nutrir';
}

function diagnosis(areaKey, pct) { return areaByKey(areaKey).diagnosticos[level(pct)]; }

export { PROFILE, QUESTIONS, AREAS, BANDS, TIE_ORDER, score, band, segment, diagnosis, level, areaByKey };
