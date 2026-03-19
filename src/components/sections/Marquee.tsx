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

  // Duplicate for seamless loop
  const allTags = [...tags, ...tags];

  return (
    <section className="py-6 bg-[#060810] border-y border-white/5 overflow-hidden">
      <div className="marquee-track" aria-label="Serviços oferecidos">
        {allTags.map((tag, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-6 py-2 text-sm text-white/40 font-medium whitespace-nowrap"
          >
            {tag}
            <span className="ml-6 text-accent/30">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
