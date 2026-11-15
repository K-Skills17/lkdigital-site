import { Container } from "@/components/home/primitives";

/**
 * Service index on the brand black. Was a continuously scrolling marquee;
 * now static so every item is readable and nothing moves without purpose.
 * (Component name kept so imports elsewhere keep working.)
 */
export default function Marquee() {
  const tags = [
    "Google Ads",
    "SEO Local",
    "Google Maps",
    "Instagram Ads",
    "Meta Ads",
    "GEO & AEO",
    "Conteúdo",
    "Landing Pages",
    "Google Meu Negócio",
    "Branding",
    "Campanhas",
    "Analytics",
    "Funil de Captação",
    "Remarketing",
  ];

  return (
    <section className="bg-hero-bg py-10" aria-label="Serviços oferecidos">
      <Container>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
          {tags.map((tag, i) => (
            <li key={tag} className="flex items-center gap-6">
              {tag}
              {i < tags.length - 1 && (
                <span aria-hidden="true" className="text-accent">
                  /
                </span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
