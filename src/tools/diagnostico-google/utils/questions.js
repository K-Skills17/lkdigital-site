export const sections = [
  {
    id: 'basico',
    title: 'Informações Básicas',
    maxPoints: 20,
    questions: [
      {
        id: 'verificado',
        text: 'Seu perfil no Google Meu Negócio está verificado?',
        type: 'yesno',
        points: { sim: 8, nao: 0 },
      },
      {
        id: 'completo',
        text: 'Todas as informações estão preenchidas? (endereço, telefone, horário, site)',
        type: 'choice',
        options: [
          { label: 'Sim, tudo preenchido', value: 'sim', points: 7 },
          { label: 'Parcialmente', value: 'parcial', points: 3 },
          { label: 'Não', value: 'nao', points: 0 },
        ],
      },
      {
        id: 'categorias',
        text: 'Você escolheu as categorias corretas? (Ex: Dentista, Clínica Odontológica)',
        type: 'choice',
        options: [
          { label: 'Sim', value: 'sim', points: 5 },
          { label: 'Não tenho certeza', value: 'talvez', points: 2 },
          { label: 'Não', value: 'nao', points: 0 },
        ],
      },
    ],
  },
  {
    id: 'fotos',
    title: 'Fotos e Visual',
    maxPoints: 20,
    questions: [
      {
        id: 'qtdFotos',
        text: 'Quantas fotos seu perfil tem?',
        type: 'choice',
        options: [
          { label: 'Nenhuma', value: '0', points: 0 },
          { label: '1 a 5', value: '1-5', points: 2 },
          { label: '6 a 15', value: '6-15', points: 5 },
          { label: '16 ou mais', value: '16+', points: 7 },
        ],
      },
      {
        id: 'fotosProfissionais',
        text: 'Você tem fotos profissionais do consultório?',
        type: 'yesno',
        points: { sim: 5, nao: 0 },
      },
      {
        id: 'fotoEquipe',
        text: 'Você tem foto da equipe/dentista?',
        type: 'yesno',
        points: { sim: 4, nao: 0 },
      },
      {
        id: 'fotoCapa',
        text: 'Sua foto de capa é profissional e atualizada?',
        type: 'yesno',
        points: { sim: 4, nao: 0 },
      },
    ],
  },
  {
    id: 'avaliacoes',
    title: 'Avaliações',
    maxPoints: 30,
    questions: [
      {
        id: 'qtdAvaliacoes',
        text: 'Quantas avaliações você tem?',
        type: 'choice',
        options: [
          { label: '0 a 5', value: '0-5', points: 1 },
          { label: '6 a 20', value: '6-20', points: 4 },
          { label: '21 a 50', value: '21-50', points: 7 },
          { label: '51 a 100', value: '51-100', points: 9 },
          { label: 'Mais de 100', value: '100+', points: 10 },
        ],
      },
      {
        id: 'notaMedia',
        text: 'Qual sua nota média?',
        type: 'choice',
        options: [
          { label: 'Abaixo de 4.0', value: '<4', points: 1 },
          { label: '4.0 a 4.4', value: '4.0-4.4', points: 4 },
          { label: '4.5 a 4.7', value: '4.5-4.7', points: 7 },
          { label: '4.8 a 5.0', value: '4.8-5.0', points: 8 },
        ],
      },
      {
        id: 'respondeAvaliacoes',
        text: 'Você responde todas as avaliações?',
        type: 'choice',
        options: [
          { label: 'Nunca', value: 'nunca', points: 0 },
          { label: 'Às vezes', value: 'as-vezes', points: 3 },
          { label: 'Sempre', value: 'sempre', points: 6 },
        ],
      },
      {
        id: 'sistemaAvaliacoes',
        text: 'Você tem um sistema para pedir avaliações aos pacientes?',
        type: 'yesno',
        points: { sim: 6, nao: 0 },
      },
    ],
  },
  {
    id: 'postagens',
    title: 'Postagens e Atividade',
    maxPoints: 15,
    questions: [
      {
        id: 'frequenciaPost',
        text: 'Você faz postagens no Google Meu Negócio?',
        type: 'choice',
        options: [
          { label: 'Nunca', value: 'nunca', points: 0 },
          { label: 'Raramente', value: 'raramente', points: 2 },
          { label: 'Mensalmente', value: 'mensal', points: 4 },
          { label: 'Semanalmente', value: 'semanal', points: 6 },
        ],
      },
      {
        id: 'ofertas',
        text: 'Você publica ofertas ou novidades?',
        type: 'yesno',
        points: { sim: 4, nao: 0 },
      },
      {
        id: 'descricaoServicos',
        text: 'Seu perfil tem descrição dos serviços oferecidos?',
        type: 'yesno',
        points: { sim: 5, nao: 0 },
      },
    ],
  },
  {
    id: 'competitividade',
    title: 'Competitividade',
    maxPoints: 15,
    questions: [
      {
        id: 'pesquisou',
        text: 'Você já pesquisou "dentista + sua cidade" no Google?',
        type: 'yesno',
        points: { sim: 5, nao: 0 },
      },
      {
        id: 'topResultados',
        text: 'Você aparece nos primeiros 3 resultados do Google Maps?',
        type: 'choice',
        options: [
          { label: 'Sim', value: 'sim', points: 10 },
          { label: 'Não', value: 'nao', points: 0 },
          { label: 'Não sei', value: 'nao-sei', points: 2 },
        ],
      },
    ],
  },
];

export function calculateScore(answers) {
  const sectionScores = sections.map((section) => {
    let sectionPoints = 0;
    section.questions.forEach((q) => {
      const answer = answers[q.id];
      if (!answer) return;
      if (q.type === 'yesno') {
        sectionPoints += q.points[answer] || 0;
      } else {
        const opt = q.options.find((o) => o.value === answer);
        sectionPoints += opt ? opt.points : 0;
      }
    });
    return {
      id: section.id,
      title: section.title,
      score: sectionPoints,
      maxPoints: section.maxPoints,
      percent: Math.round((sectionPoints / section.maxPoints) * 100),
    };
  });

  const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0);

  let grade, gradeColor, gradeLabel;
  if (totalScore <= 30) { grade = 'critico'; gradeColor = '#E74C3C'; gradeLabel = 'Crítico'; }
  else if (totalScore <= 50) { grade = 'atencao'; gradeColor = '#E67E22'; gradeLabel = 'Precisa de Atenção'; }
  else if (totalScore <= 70) { grade = 'regular'; gradeColor = '#F39C12'; gradeLabel = 'Regular'; }
  else if (totalScore <= 85) { grade = 'bom'; gradeColor = '#27AE60'; gradeLabel = 'Bom'; }
  else { grade = 'excelente'; gradeColor = '#1E8449'; gradeLabel = 'Excelente'; }

  return { totalScore, sectionScores, grade, gradeColor, gradeLabel };
}

export function getActionItems(answers, sectionScores) {
  const actions = [];

  const sectionMap = {};
  sectionScores.forEach((s) => { sectionMap[s.id] = s; });

  if (answers.verificado === 'nao') {
    actions.push({ priority: 1, text: 'Verifique seu perfil no Google Meu Negócio imediatamente. Sem verificação, você não aparece nas buscas.', impact: 'Alto' });
  }
  if (answers.completo !== 'sim') {
    actions.push({ priority: 2, text: 'Complete TODAS as informações: endereço, telefone, horário de funcionamento e site. Perfis completos recebem 70% mais cliques.', impact: 'Alto' });
  }
  if (!answers.qtdFotos || answers.qtdFotos === '0' || answers.qtdFotos === '1-5') {
    actions.push({ priority: 3, text: 'Adicione pelo menos 15 fotos profissionais: fachada, recepção, consultórios, equipamentos e equipe. Perfis com fotos recebem 42% mais pedidos de rota.', impact: 'Alto' });
  }
  if (answers.sistemaAvaliacoes === 'nao') {
    actions.push({ priority: 4, text: 'Crie um sistema para pedir avaliações: envie um link pelo WhatsApp após cada consulta. Meta: 5 novas avaliações por semana.', impact: 'Alto' });
  }
  if (answers.respondeAvaliacoes !== 'sempre') {
    actions.push({ priority: 5, text: 'Responda TODAS as avaliações (positivas e negativas) em até 24h. Isso mostra profissionalismo e melhora seu ranking.', impact: 'Médio' });
  }
  if (answers.frequenciaPost === 'nunca' || answers.frequenciaPost === 'raramente') {
    actions.push({ priority: 6, text: 'Comece a postar semanalmente: antes/depois, dicas de saúde bucal, bastidores. O Google favorece perfis ativos.', impact: 'Médio' });
  }
  if (answers.descricaoServicos === 'nao') {
    actions.push({ priority: 7, text: 'Adicione descrição de todos os serviços oferecidos. Use palavras-chave que pacientes pesquisam (implante, clareamento, aparelho, etc).', impact: 'Médio' });
  }
  if (answers.fotoCapa === 'nao') {
    actions.push({ priority: 8, text: 'Atualize sua foto de capa com uma imagem profissional da fachada ou do consultório.', impact: 'Baixo' });
  }
  if (answers.pesquisou === 'nao') {
    actions.push({ priority: 9, text: 'Pesquise "dentista + sua cidade" agora. Conheça seus concorrentes e veja como eles se posicionam.', impact: 'Baixo' });
  }

  return actions.sort((a, b) => a.priority - b.priority).slice(0, 5);
}
