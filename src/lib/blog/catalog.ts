// lib/blog/catalog.ts
// Authors and categories editors can pick from in /painel/blog.

import type { Author } from "./types";

export const AUTHORS: Author[] = [
  {
    slug: "stephen-domingos-komando",
    name: "Stephen Domingos Komando",
    title: "Fundador, LK Digital",
    bio: "Stephen Domingos Komando é fundador da LK Digital, agência especializada exclusivamente em marketing odontológico. Trabalha com dentistas em todo o Brasil ajudando a lotar agendas e construir marcas premium.",
  },
  {
    slug: "lk-digital",
    name: "Equipe LK Digital",
    title: "Especialistas em Marketing Digital para Odontologia",
    bio: "A LK Digital é especializada exclusivamente em marketing para dentistas. Combinamos SEO local, Google Ads, presença em IA e automação para encher a agenda de consultórios odontológicos em todo o Brasil.",
  },
];

export const DEFAULT_AUTHOR_SLUG = AUTHORS[0].slug;

/** Only Stephen has an author page today; others link to /sobre. */
export function authorHref(slug: string): string {
  return slug === "stephen-domingos-komando" ? `/autores/${slug}` : "/sobre";
}

export function getAuthor(slug: string | null | undefined): Author {
  return AUTHORS.find((a) => a.slug === slug) ?? AUTHORS[0];
}

export const CATEGORIES = [
  "Captação",
  "Conversão",
  "Gestão",
  "Estratégia",
  "Mentalidade",
  "Posicionamento",
  "SEO",
  "Google Maps",
  "GEO",
  "Ads",
  "Website",
  "Redes Sociais",
  "Conteúdo",
  "Reputação",
  "Retenção",
  "Visibilidade",
  "Dados",
  "Tendências",
  "Ferramentas",
  "Compliance",
  "Clínico Geral",
  "Implantodontia",
  "Ortodontia",
  "Odontopediatria",
  "Endodontia",
  "Periodontia",
  "Prótese",
  "Estética",
] as const;

export const DEFAULT_CTA = {
  heading: "Quer Mais Pacientes Pelo Google?",
  description:
    "A LK Digital é especializada exclusivamente em marketing para dentistas. Fazemos diagnóstico gratuito da sua presença digital.",
  button: "Agendar Diagnóstico Gratuito",
};
