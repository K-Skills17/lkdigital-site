import { publishedSlugs } from "@/lib/blog/store";

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

/** Build the full list of all indexable site URLs (blog posts come from the database). */
export async function getAllSiteUrls(): Promise<string[]> {
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
    "/ferramentas/checklist-google",
    "/ferramentas/calculadora-cac",
    "/ferramentas/dashboard-clinica",
    "/ferramentas/scripts-whatsapp",
    "/ferramentas/auditoria-site",
    "/ferramentas/simulador-convenios",
    "/ferramentas/calculadora-precificacao",
    "/ferramentas/calculadora-agenda",
  ];

  const cities = [
    "sao-paulo", "rio-de-janeiro", "belo-horizonte", "brasilia", "curitiba",
    "porto-alegre", "salvador", "recife", "fortaleza", "campinas",
    "florianopolis", "goiania", "manaus", "belem", "vitoria",
  ];

  return [
    ...staticPages.map((p) => `${base}${p}`),
    ...cities.map((c) => `${base}/cidades/${c}`),
    `${base}/cidades`,
    ...(await publishedSlugs()).map((p) => `${base}/blog/${p.slug}`),
  ];
}
