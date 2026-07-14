/**
 * Submit all site URLs to IndexNow.
 * Run after deployment: npm run indexnow:submit
 *
 * Required env vars:
 *   INDEXNOW_KEY   — your IndexNow API key
 *
 * Optional:
 *   SITE_URL       — override base URL (default: https://lkdigital.odo.br)
 */

const SITE_HOST = "lkdigital.odo.br";
const BASE = process.env.SITE_URL ?? `https://${SITE_HOST}`;
const KEY = process.env.INDEXNOW_KEY;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

if (!KEY) {
  console.error("Error: INDEXNOW_KEY env var is not set.");
  process.exit(1);
}

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
  "/cidades",
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

const urlList = [
  ...staticPages.map((p) => `${BASE}${p}`),
  ...cities.map((c) => `${BASE}/cidades/${c}`),
  ...[...engineBlogSlugs, ...staticBlogSlugs].map((s) => `${BASE}/blog/${s}`),
];

console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: SITE_HOST,
    key: KEY,
    keyLocation: `https://${SITE_HOST}/${KEY}.txt`,
    urlList,
  }),
});

if (res.ok || res.status === 200 || res.status === 202) {
  console.log(`✓ IndexNow accepted: HTTP ${res.status} — ${urlList.length} URLs submitted`);
} else {
  const text = await res.text().catch(() => "");
  console.error(`✗ IndexNow error: HTTP ${res.status}`, text);
  process.exit(1);
}
