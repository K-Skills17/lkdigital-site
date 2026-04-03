export interface CityData {
  slug: string;
  name: string;
  state: string;
  stateAbbr: string;
  population: string;
  estimatedDentists: string;
  competitionLevel: "alta" | "média" | "baixa";
  region: string;
  highlights: string[];
  topSearches: string[];
  marketInsight: string;
}

export const cities: CityData[] = [
  {
    slug: "sao-paulo",
    name: "São Paulo",
    state: "São Paulo",
    stateAbbr: "SP",
    population: "22 milhões",
    estimatedDentists: "85.000+",
    competitionLevel: "alta",
    region: "Sudeste",
    highlights: [
      "Maior concentração de dentistas do Brasil — diferenciação digital é essencial",
      "Pacientes pesquisam por bairro, não apenas cidade — SEO hiperlocal é obrigatório",
      "Alto ticket médio para procedimentos estéticos e implantes",
    ],
    topSearches: [
      "dentista em São Paulo",
      "implante dentário SP",
      "ortodontista zona sul SP",
      "clareamento dental São Paulo preço",
      "dentista perto de mim SP",
    ],
    marketInsight:
      "São Paulo concentra mais de 85 mil dentistas — o maior mercado odontológico da América Latina. A competição é feroz: para cada paciente pesquisando no Google, dezenas de consultórios disputam visibilidade. Neste cenário, a diferença entre agenda cheia e cadeiras vazias está no posicionamento digital. Consultórios que investem em SEO local, Google Maps otimizado e presença em IA captam pacientes que os concorrentes nem sabem que existem.",
  },
  {
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    state: "Rio de Janeiro",
    stateAbbr: "RJ",
    population: "13,5 milhões",
    estimatedDentists: "42.000+",
    competitionLevel: "alta",
    region: "Sudeste",
    highlights: [
      "Forte demanda por estética dental — lentes de contato e clareamento lideram buscas",
      "Mercado dividido entre Zona Sul premium e expansão na Zona Oeste e Baixada",
      "Turismo médico odontológico em crescimento — pacientes de fora buscam especialistas",
    ],
    topSearches: [
      "dentista no Rio de Janeiro",
      "implante dentário RJ",
      "lente de contato dental Rio",
      "ortodontista Barra da Tijuca",
      "dentista Copacabana",
    ],
    marketInsight:
      "O Rio de Janeiro tem um mercado odontológico polarizado: de um lado, a Zona Sul com pacientes de alto ticket buscando estética dental premium; do outro, a Zona Oeste e Baixada Fluminense com demanda crescente por serviços acessíveis e de qualidade. Dentistas cariocas que dominam o Google Maps na sua micro-região captam pacientes que antes iriam para concorrentes mais visíveis — não necessariamente melhores.",
  },
  {
    slug: "curitiba",
    name: "Curitiba",
    state: "Paraná",
    stateAbbr: "PR",
    population: "3,6 milhões",
    estimatedDentists: "15.000+",
    competitionLevel: "alta",
    region: "Sul",
    highlights: [
      "Público exigente e bem informado — conteúdo de qualidade converte mais que preço baixo",
      "Forte presença de clínicas de ortodontia com alinhadores invisíveis",
      "Região metropolitana em expansão cria oportunidades em cidades satélites",
    ],
    topSearches: [
      "dentista em Curitiba",
      "implante dentário Curitiba preço",
      "ortodontista Curitiba",
      "invisalign Curitiba",
      "clínica odontológica Curitiba",
    ],
    marketInsight:
      "Curitiba é um dos mercados odontológicos mais sofisticados do Brasil. O público curitibano pesquisa extensivamente antes de escolher um dentista — lê avaliações, compara tratamentos e valoriza credibilidade acima de preço. Isso significa que consultórios com presença digital bem construída, avaliações genuínas e conteúdo educativo têm uma vantagem desproporcional sobre concorrentes que dependem apenas de indicação.",
  },
  {
    slug: "salvador",
    name: "Salvador",
    state: "Bahia",
    stateAbbr: "BA",
    population: "4 milhões",
    estimatedDentists: "12.000+",
    competitionLevel: "média",
    region: "Nordeste",
    highlights: [
      "Mercado em digitalização acelerada — oportunidade de ser pioneiro no posicionamento digital",
      "Forte demanda por implantes e próteses na região metropolitana",
      "Crescimento de buscas por dentistas no Google supera a média nacional",
    ],
    topSearches: [
      "dentista em Salvador",
      "implante dentário Salvador",
      "ortodontista Salvador BA",
      "dentista perto de mim Salvador",
      "clareamento dental Salvador",
    ],
    marketInsight:
      "Salvador representa uma das maiores oportunidades de marketing digital para odontologia no Nordeste. Enquanto muitos consultórios ainda dependem exclusivamente de indicações, o volume de buscas por dentistas no Google cresce acima da média nacional. Profissionais que investem em presença digital agora conquistam um posicionamento difícil de replicar quando a concorrência acordar.",
  },
  {
    slug: "goiania",
    name: "Goiânia",
    state: "Goiás",
    stateAbbr: "GO",
    population: "2,6 milhões",
    estimatedDentists: "10.000+",
    competitionLevel: "média",
    region: "Centro-Oeste",
    highlights: [
      "Uma das maiores concentrações de dentistas per capita do Brasil",
      "Mercado de estética dental em expansão acelerada",
      "Forte cultura de indicação — mas buscas online crescem rapidamente",
    ],
    topSearches: [
      "dentista em Goiânia",
      "implante dentário Goiânia",
      "lente de contato dental Goiânia",
      "ortodontista Goiânia GO",
      "faceta de porcelana Goiânia",
    ],
    marketInsight:
      "Goiânia tem uma das maiores proporções de dentistas por habitante do Brasil, o que torna a competição intensa — mas predominantemente offline. A maioria dos consultórios goianos ainda depende de boca a boca e localização física. Dentistas que constroem presença digital estruturada captam pacientes que os concorrentes nem sabem que estão perdendo, especialmente em procedimentos estéticos de alto valor.",
  },
  {
    slug: "belo-horizonte",
    name: "Belo Horizonte",
    state: "Minas Gerais",
    stateAbbr: "MG",
    population: "6 milhões",
    estimatedDentists: "25.000+",
    competitionLevel: "alta",
    region: "Sudeste",
    highlights: [
      "Forte tradição acadêmica em odontologia — UFMG forma grande volume de profissionais",
      "Mercado competitivo que exige diferenciação clara",
      "Expansão metropolitana cria micro-mercados em Contagem, Betim e Nova Lima",
    ],
    topSearches: [
      "dentista em BH",
      "implante dentário Belo Horizonte",
      "ortodontista BH preço",
      "dentista Savassi",
      "clínica odontológica Belo Horizonte",
    ],
    marketInsight:
      "Belo Horizonte é um dos mercados odontológicos mais densos do Brasil, com mais de 25 mil profissionais na região metropolitana. A forte tradição acadêmica da UFMG e PUC Minas produz centenas de novos dentistas por ano, intensificando a competição. Neste cenário, o consultório que aparece no topo do Google quando o paciente busca não é necessariamente o melhor — é o mais visível. E visibilidade se constrói com estratégia, não com sorte.",
  },
  {
    slug: "campinas",
    name: "Campinas",
    state: "São Paulo",
    stateAbbr: "SP",
    population: "3,2 milhões",
    estimatedDentists: "12.000+",
    competitionLevel: "média",
    region: "Sudeste",
    highlights: [
      "Hub tecnológico — público digitalmente maduro que pesquisa antes de agendar",
      "Proximidade com São Paulo cria competição por pacientes de alto ticket",
      "Forte mercado de ortodontia e estética entre profissionais de tecnologia",
    ],
    topSearches: [
      "dentista em Campinas",
      "implante dentário Campinas SP",
      "ortodontista Campinas",
      "clareamento dental Campinas",
      "dentista Barão Geraldo",
    ],
    marketInsight:
      "Campinas combina renda elevada, público digitalmente sofisticado e uma região metropolitana em expansão. Os pacientes campineiros — muitos profissionais de tecnologia — pesquisam extensivamente online, leem avaliações e comparam opções antes de agendar. Consultórios com presença digital forte e conteúdo que demonstra expertise captam esses pacientes de alto valor que valorizam qualidade e conveniência.",
  },
  {
    slug: "brasilia",
    name: "Brasília",
    state: "Distrito Federal",
    stateAbbr: "DF",
    population: "4,8 milhões",
    estimatedDentists: "16.000+",
    competitionLevel: "alta",
    region: "Centro-Oeste",
    highlights: [
      "Maior renda per capita do Brasil — pacientes investem em procedimentos premium",
      "Mercado de harmonização orofacial e estética em forte crescimento",
      "Cidade planejada com áreas bem definidas — SEO por região é essencial",
    ],
    topSearches: [
      "dentista em Brasília",
      "implante dentário Brasília DF",
      "harmonização orofacial Brasília",
      "ortodontista Asa Sul",
      "lente de contato dental Brasília",
    ],
    marketInsight:
      "Brasília tem a maior renda per capita do Brasil, e isso se reflete diretamente no mercado odontológico: pacientes brasilienses investem em procedimentos premium como implantes, lentes de contato dental e harmonização orofacial. A estrutura da cidade em regiões administrativas (Asa Sul, Asa Norte, Lago Sul, Águas Claras) torna o SEO hiperlocal uma vantagem competitiva decisiva.",
  },
  {
    slug: "fortaleza",
    name: "Fortaleza",
    state: "Ceará",
    stateAbbr: "CE",
    population: "4,1 milhões",
    estimatedDentists: "11.000+",
    competitionLevel: "média",
    region: "Nordeste",
    highlights: [
      "Digitalização acelerada — buscas por dentistas crescem acima da média nordestina",
      "Mercado de implantes em expansão com público cada vez mais exigente",
      "Oportunidade de posicionamento pioneiro antes que concorrentes invistam em digital",
    ],
    topSearches: [
      "dentista em Fortaleza",
      "implante dentário Fortaleza CE",
      "ortodontista Fortaleza",
      "clareamento dental Fortaleza",
      "dentista Aldeota",
    ],
    marketInsight:
      "Fortaleza é o maior mercado odontológico do Nordeste, com uma classe média em crescimento que busca cada vez mais serviços odontológicos de qualidade. A digitalização do comportamento do consumidor fortalezense acelera: pacientes que antes dependiam exclusivamente de indicações agora pesquisam no Google, leem avaliações e comparam opções. Consultórios que estabelecem presença digital forte agora captam esse fluxo crescente antes dos concorrentes.",
  },
  {
    slug: "recife",
    name: "Recife",
    state: "Pernambuco",
    stateAbbr: "PE",
    population: "4 milhões",
    estimatedDentists: "10.000+",
    competitionLevel: "média",
    region: "Nordeste",
    highlights: [
      "Polo de tecnologia (Porto Digital) — público digitalmente ativo",
      "Forte demanda por estética dental entre jovens profissionais",
      "Mercado metropolitano inclui Olinda e Jaboatão com oportunidades subutilizadas",
    ],
    topSearches: [
      "dentista em Recife",
      "implante dentário Recife",
      "ortodontista Recife PE",
      "lente de contato dental Recife",
      "dentista Boa Viagem",
    ],
    marketInsight:
      "Recife combina uma cena tech vibrante (Porto Digital) com um mercado odontológico em transformação digital. Profissionais jovens de tecnologia — habituados a pesquisar tudo online — formam um segmento crescente de pacientes que escolhem dentistas pela presença digital, não por indicação. A expansão metropolitana para Olinda e Jaboatão cria micro-mercados com alta demanda e pouca competição digital.",
  },
  {
    slug: "porto-alegre",
    name: "Porto Alegre",
    state: "Rio Grande do Sul",
    stateAbbr: "RS",
    population: "4,4 milhões",
    estimatedDentists: "18.000+",
    competitionLevel: "alta",
    region: "Sul",
    highlights: [
      "Alta densidade de profissionais — diferenciação digital é decisiva",
      "Público gaúcho valoriza qualidade e relacionamento de longo prazo",
      "Forte mercado de implantes e reabilitação oral",
    ],
    topSearches: [
      "dentista em Porto Alegre",
      "implante dentário POA",
      "ortodontista Porto Alegre RS",
      "clínica odontológica Porto Alegre",
      "dentista Moinhos de Vento",
    ],
    marketInsight:
      "Porto Alegre tem uma das maiores densidades de dentistas per capita do Sul do Brasil. O gaúcho é um paciente fiel — uma vez conquistado, permanece por anos. Mas conquistá-lo exige credibilidade demonstrada: avaliações reais, presença consistente e conteúdo que mostre expertise. Consultórios que investem em reputação digital construída sobre resultados reais dominam o mercado local.",
  },
  {
    slug: "florianopolis",
    name: "Florianópolis",
    state: "Santa Catarina",
    stateAbbr: "SC",
    population: "1,2 milhão",
    estimatedDentists: "5.000+",
    competitionLevel: "média",
    region: "Sul",
    highlights: [
      "Alta renda e qualidade de vida — pacientes investem em estética dental",
      "Hub de startups — público tech-savvy que decide tudo online",
      "Mercado sazonal com turismo que aumenta demanda em temporada",
    ],
    topSearches: [
      "dentista em Florianópolis",
      "implante dentário Floripa",
      "ortodontista Florianópolis SC",
      "lente de contato dental Floripa",
      "dentista Centro Florianópolis",
    ],
    marketInsight:
      "Florianópolis é um mercado premium: alta renda, população jovem e digitalmente madura, e um ecossistema de startups que influencia como as pessoas consomem serviços. Pacientes florianopolitanos pesquisam no Google, checam Instagram, leem avaliações e só então agendam. Para dentistas em Floripa, presença digital não é diferencial — é pré-requisito.",
  },
  {
    slug: "manaus",
    name: "Manaus",
    state: "Amazonas",
    stateAbbr: "AM",
    population: "2,7 milhões",
    estimatedDentists: "5.000+",
    competitionLevel: "baixa",
    region: "Norte",
    highlights: [
      "Menor competição digital — oportunidade de dominar o posicionamento da região",
      "Polo Industrial de Manaus gera renda e demanda por serviços odontológicos de qualidade",
      "Crescimento do acesso à internet amplia o público que busca dentistas online",
    ],
    topSearches: [
      "dentista em Manaus",
      "implante dentário Manaus",
      "ortodontista Manaus AM",
      "clínica odontológica Manaus",
      "dentista perto de mim Manaus",
    ],
    marketInsight:
      "Manaus é o maior mercado do Norte do Brasil e um dos menos competitivos digitalmente na odontologia. A maioria dos dentistas manauaras ainda não investe em presença digital estruturada, criando uma janela de oportunidade significativa. Com o Polo Industrial gerando renda e o acesso à internet em expansão, a demanda por dentistas encontrados online cresce mais rápido que a oferta de presença digital.",
  },
  {
    slug: "vitoria",
    name: "Vitória",
    state: "Espírito Santo",
    stateAbbr: "ES",
    population: "2 milhões",
    estimatedDentists: "6.000+",
    competitionLevel: "média",
    region: "Sudeste",
    highlights: [
      "Alta qualidade de vida impulsiona demanda por estética dental",
      "Região metropolitana compacta — SEO local bem feito domina toda a Grande Vitória",
      "Mercado em crescimento com espaço para posicionamento digital",
    ],
    topSearches: [
      "dentista em Vitória ES",
      "implante dentário Vitória",
      "ortodontista Vila Velha",
      "clareamento dental Vitória",
      "dentista Serra ES",
    ],
    marketInsight:
      "A Grande Vitória é um mercado compacto mas próspero. A região metropolitana abrange Vitória, Vila Velha, Serra e Cariacica — uma área que pode ser dominada digitalmente com estratégia localizada. A qualidade de vida elevada do Espírito Santo se traduz em pacientes dispostos a investir em saúde bucal e estética dental.",
  },
  {
    slug: "belem",
    name: "Belém",
    state: "Pará",
    stateAbbr: "PA",
    population: "2,5 milhões",
    estimatedDentists: "6.000+",
    competitionLevel: "baixa",
    region: "Norte",
    highlights: [
      "Baixíssima competição digital — posicionamento pioneiro disponível",
      "Crescimento econômico impulsiona demanda por odontologia de qualidade",
      "Mercado metropolitano inclui Ananindeua com oportunidades inexploradas",
    ],
    topSearches: [
      "dentista em Belém",
      "implante dentário Belém PA",
      "ortodontista Belém",
      "clínica odontológica Belém",
      "dentista perto de mim Belém",
    ],
    marketInsight:
      "Belém é um dos mercados com maior potencial inexplorado no Brasil para marketing digital odontológico. A competição digital é praticamente inexistente — a maioria dos consultórios depende de localização física e indicações. Dentistas que estabelecem presença digital estruturada agora se posicionam como referência antes que a concorrência sequer comece a investir.",
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return cities.map((c) => c.slug);
}
