// ═══════════════════════════════════════════════════════════════
// LK Digital Blog Engine — Configuration
// ═══════════════════════════════════════════════════════════════

export const SITE_URL = "https://lkdigital.odo.br";
export const SITE_NAME = "LK Digital";
export const CONTENT_DIR = "content/blog";
export const PUBLISHED_FILE = "scripts/blog-engine/published.json";
export const ADDON_TOPICS_FILE = "scripts/blog-engine/addon-topics.json";
export const PENDING_TOPICS_FILE = "scripts/blog-engine/pending-topics.json";

export const GENERATION_CONFIG = {
  articlesPerRun: 1,
  minWordCount: 1800,
  maxWordCount: 3000,
  faqItemsPerArticle: 5,
  language: "pt-BR",
  currentYear: new Date().getFullYear(),
};

// ─── Authors (E-E-A-T rotation) ───
export interface Author {
  name: string;
  title: string;
  bio: string;
  slug: string;
}

export const AUTHORS: Author[] = [
  {
    name: "Equipe LK Digital",
    title: "Especialistas em Marketing Digital para Odontologia",
    bio: "A LK Digital é especializada exclusivamente em marketing para dentistas. Combinamos SEO local, Google Ads, presença em IA e automação para encher a agenda de consultórios odontológicos em todo o Brasil.",
    slug: "lk-digital",
  },
  {
    name: "Lucas Kroeger",
    title: "Fundador & Estrategista Digital — LK Digital",
    bio: "Especialista em marketing digital para odontologia com foco em captação de pacientes de alto valor. Fundador da LK Digital, o sistema de crescimento para clínicas odontológicas no Brasil.",
    slug: "lucas-kroeger",
  },
];

// ─── Content Pillars ───
export type Pillar = "P1" | "P2" | "P3" | "P4" | "P5";

export const PILLAR_LABELS: Record<Pillar, string> = {
  P1: "How-To & Tutoriais",
  P2: "Problemas de Dentistas",
  P3: "Insights & Tendências",
  P4: "Guias por Especialidade",
  P5: "Frameworks de Experts",
};

// ─── Topic Seed Interface ───
export interface TopicSeed {
  title: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  pillar: Pillar;
  searchIntent: "informational" | "commercial" | "transactional";
  outline: string[];
  problemRef?: string;
  frameworkRef?: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaButton: string;
  priority: 1 | 2 | 3;
}

// ─── Categories ───
export const CATEGORIES = [
  "SEO",
  "Google Maps",
  "Ads",
  "Conversão",
  "Gestão",
  "Reputação",
  "Posicionamento",
  "Tendências",
  "Compliance",
  "Estratégia",
  "Mentalidade",
  "Ferramentas",
  "Conteúdo",
  "Redes Sociais",
  "Retenção",
  "Captação",
  "GEO",
  "Dados",
  "Website",
  "Implantodontia",
  "Ortodontia",
  "Odontopediatria",
  "Endodontia",
  "Periodontia",
  "Estética",
] as const;

// ─── Brazilian Portuguese anti-AI patterns ───
export const BANNED_PHRASES = [
  "neste artigo",
  "é importante ressaltar",
  "é fundamental destacar",
  "vale a pena mencionar",
  "em suma",
  "em conclusão",
  "sem mais delongas",
  "nos dias de hoje",
  "cada vez mais",
  "diante disso",
  "sendo assim",
  "nesse sentido",
  "por fim",
  "em primeiro lugar",
  "não é segredo que",
  "como já mencionado",
  "cabe ressaltar",
  "pode-se afirmar",
  "é notório que",
  "no mundo atual",
];

// ─── Master Problems Context (injected into prompts) ───
export const DENTIST_PROBLEMS_CONTEXT = `
PROBLEMAS REAIS DE DENTISTAS NO BRASIL (use como contexto para escrever com empatia e precisão):

STATUS:
- Não ser percebido como autoridade na especialidade
- Ser visto como "mais uma clínica" ao invés de premium
- Preços questionados porque paciente não vê valor
- Presença online desatualizada que danifica credibilidade
- Concorrentes com branding melhor parecendo mais premium
- Medo de parecer amador ou desesperado por pacientes

NEGÓCIO:
- Sem fluxo previsível de leads qualificados
- Receita inconsistente mês a mês
- Dependência de indicações
- Leads que não podem pagar, não aparecem, só querem orçamento
- Sem processo estruturado de vendas ou scripts
- Sem follow-up multi-etapa
- Agenda caótica com consultas de baixo valor
- Recepção não treinada causando vazamento de vendas
- Sem CRM ou dashboard de performance

RELACIONAMENTOS:
- Pacientes somem depois da primeira consulta
- Sem estratégia de fidelização ou retenção
- Recepcionistas que não lidam bem com leads
- Equipe não segue scripts ou protocolos

MEDOS PROFUNDOS:
- "Vou gastar dinheiro e não vai ter retorno"
- "Agência promete muito e entrega pouco"
- "Já tentei marketing e deu errado"
- Se sentir inferior a concorrentes com agendas cheias
- Medo de perder relevância no mercado
- Ser ultrapassado por dentistas mais jovens com redes sociais fortes
`;

// ─── Framework References (injected for P5 articles) ───
export const FRAMEWORK_CONTEXTS: Record<string, string> = {
  "Hormozi Value Equation": `
FRAMEWORK: Equação de Valor (Alex Hormozi, $100M Offers)
Valor = (Resultado Desejado × Probabilidade Percebida) ÷ (Tempo de Espera × Esforço do Cliente)
- Aumentar o resultado desejado (agenda cheia, pacientes premium, autoridade)
- Aumentar probabilidade percebida (provas, casos, garantias, sistemas)
- Reduzir tempo de espera (resultados em semanas, não meses)
- Reduzir esforço do cliente (nós fazemos tudo, dentista só atende)
Aplicar ao contexto odontológico brasileiro com exemplos específicos.`,

  "Hormozi $100M Offers": `
FRAMEWORK: Grand Slam Offer (Alex Hormozi, $100M Offers)
Uma oferta irresistível tem: resultado claro + probabilidade alta + tempo curto + esforço zero do cliente.
Componentes: Dream Outcome + Perceived Likelihood + Time Delay reduction + Effort & Sacrifice removal.
Adicionar: escassez real, urgência genuína, bônus que aumentam valor, garantias que removem risco.
Aplicar para ofertas de consultórios odontológicos (avaliação premium, planejamento 3D, etc.)`,

  "Hormozi $100M Leads": `
FRAMEWORK: Core 4 Lead Generation (Alex Hormozi, $100M Leads)
4 métodos de gerar leads: Warm Outreach, Cold Outreach, Content, Paid Ads.
Warm = indicações sistematizadas. Cold = Google Ads, Meta Ads. Content = blog, redes, YouTube. Paid = tráfego pago otimizado.
O poder está em combinar múltiplos métodos. Aplicar ao contexto de captação de pacientes odontológicos.`,

  "Kennedy Wealth Magnet": `
FRAMEWORK: Wealth Magnets (Dan Kennedy, No B.S. Wealth Attraction)
Princípios aplicáveis: Be Somebody (autoridade), Be Somewhere (presença), Do Something (ação),
Demonstration (mostrar, não dizer), Follow-Up (persistência), Integrity (confiança),
No Fear (investir sem medo), No Excuses (parar de justificar), Speak Money (linguagem de investimento).
Aplicar ao mindset de dentistas brasileiros que querem crescer.`,

  "Meadows Thinking in Systems": `
FRAMEWORK: Pensamento Sistêmico (Donella Meadows, Thinking in Systems)
Consultório é um SISTEMA com loops de feedback, gargalos e pontos de alavancagem.
Loops de reforço: marketing → pacientes → avaliações → mais pacientes.
Loops de equilíbrio: capacidade limitada, tempo do dentista, equipe.
Pontos de alavancagem: visibilidade digital (topo do funil), conversão da recepção (meio), retenção (fundo).
Identificar ONDE está o gargalo antes de investir.`,
};
