const SITE_HOST = "lkdigital.odo.br";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export interface IndexNowResult {
  submitted: number;
  status: number;
  ok: boolean;
}

/**
 * Submit one or more URLs to IndexNow (broadcasts to Bing, Yandex, Seznam, etc.)
 * Batches automatically if more than 10,000 URLs are passed.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (!INDEXNOW_KEY) throw new Error("INDEXNOW_KEY env var is not set");
  if (urls.length === 0) return { submitted: 0, status: 200, ok: true };

  const unique = Array.from(new Set(urls));
  const batch = unique.slice(0, 10_000); // IndexNow max per request

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: batch,
    }),
  });

  return { submitted: batch.length, status: res.status, ok: res.ok };
}

/** Build the full list of all indexable site URLs */
export function getAllSiteUrls(): string[] {
  const base = `https://${SITE_HOST}`;

  const staticPages = [
    "/",
    "/sobre",
    "/solucoes",
    "/segmentos",
    "/casos",
    "/contato",
    "/ferramentas",
    "/blog",
    "/faq",
    "/raio-x",
  ];

  const cities = [
    "sao-paulo", "rio-de-janeiro", "belo-horizonte", "brasilia", "curitiba",
    "porto-alegre", "salvador", "recife", "fortaleza", "campinas",
    "florianopolis", "goiania", "manaus", "belem", "vitoria",
  ];

  const engineBlogSlugs = [
    "agenda-caotica-dentista-como-organizar",
    "atracao-riqueza-dentista-mentalidade-crescimento",
    "avaliacoes-google-dentista-como-conseguir",
    "cadeiras-vazias-consultorio-como-resolver",
    "chatgpt-recomendando-dentistas-como-aparecer",
    "como-dentista-aparecer-primeira-pagina-google",
    "como-medir-resultados-marketing-dentista",
    "concorrente-dominando-google-como-competir",
    "crm-dentista-gestao-pacientes-leads",
    "custo-por-lead-dentista-quanto-pagar",
    "dados-mercado-odontologico-brasil-2025",
    "demonstracao-resultados-dentista-marketing",
    "dentista-acao-supera-perfeicao",
    "dentista-autoridade-como-ser-referencia",
    "dentista-branding-marca-premium",
    "dentista-burnout-trabalho-demais-como-resolver",
    "dentista-cobrar-mais-sem-perder-pacientes",
    "dentista-depende-indicacao-como-mudar",
    "dentista-equipe-nao-funciona-como-resolver",
    "dentista-falar-linguagem-dinheiro",
    "dentista-leads-nao-podem-pagar",
    "dentista-medo-investir-marketing-como-superar",
    "dentista-nao-aparece-online-como-resolver",
    "dentista-oportunidade-mercado-como-aproveitar",
    "dentista-pacientes-somem-depois-primeira-consulta",
    "dentista-prova-social-como-construir",
    "dentista-sem-desculpas-crescimento",
    "email-marketing-dentista-reativacao-pacientes",
    "escassez-urgencia-consultorio-odontologico",
    "expectativa-paciente-resultado-como-gerenciar",
    "financiamento-tratamento-dentario-como-oferecer",
    "follow-up-pacientes-sistema-dentista",
    "garantias-consultorio-odontologico-confianca",
    "google-ads-vs-seo-dentista-qual-melhor",
    "google-maps-dentista-como-aparecer-top-3",
    "instagram-dentista-conteudo-que-converte",
    "integridade-marketing-dentista-confianca",
    "inteligencia-artificial-odontologia-2025",
    "landing-page-dentista-alta-conversao",
    "leads-estranhos-dentista-como-atrair",
    "leads-nao-aparecem-consulta-no-show-dentista",
    "marketing-clinica-odontologica-multiespecialidade",
    "marketing-dentista-clinico-geral",
    "marketing-digital-dentista-roi-retorno-investimento",
    "marketing-endodontia-emergencia-dental",
    "marketing-estetica-dental-lentes-contato",
    "marketing-harmonizacao-orofacial-captar-pacientes",
    "marketing-implantes-dentarios-captar-pacientes",
    "marketing-odontopediatria-captar-pais",
    "marketing-ortodontia-invisalign-captar-pacientes",
    "marketing-periodontia-educar-pacientes",
    "marketing-protese-dentaria-pacientes-idosos",
    "oferta-irresistivel-dentista-como-criar",
    "pacientes-so-querem-preco-como-lidar",
    "parcerias-estrategicas-dentista-indicacoes",
    "pensamento-sistemico-consultorio-odontologico",
    "perplexity-gemini-dentista-como-aparecer",
    "recepcao-consultorio-perdendo-pacientes",
    "regulamentacao-cfo-publicidade-odontologica-2025",
    "sazonalidade-odontologia-como-manter-faturamento",
    "schema-markup-dentista-seo-tecnico",
    "script-venda-consultorio-dentista",
    "seo-local-dentista-bairro-regiao",
    "site-consultorio-odontologico-elementos-essenciais",
    "tendencias-marketing-odontologico-2025",
    "tiktok-reels-dentista-vale-a-pena",
    "valor-percebido-dentista-como-cobrar-mais",
    "whatsapp-business-dentista-converter-leads",
    "whatsapp-paciente-nao-responde-como-recuperar",
  ];

  const staticBlogSlugs = [
    "seo-local-dentistas-guia-completo",
    "google-meu-negocio-dentista",
    "google-ads-odontologia",
    "marketing-implantodontia",
    "regras-cfo-publicidade",
    "ia-busca-dentistas",
  ];

  return [
    ...staticPages.map((p) => `${base}${p}`),
    ...cities.map((c) => `${base}/cidades/${c}`),
    `${base}/cidades`,
    ...[...engineBlogSlugs, ...staticBlogSlugs].map((s) => `${base}/blog/${s}`),
  ];
}
