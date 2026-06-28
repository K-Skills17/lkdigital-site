import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raio-X da Clínica Unicórnio™ | LK Digital",
  description:
    "Faça o diagnóstico das 7 Alavancas e descubra exatamente onde sua clínica está deixando dinheiro na mesa — em menos de 3 minutos.",
  openGraph: {
    title: "Raio-X da Clínica Unicórnio™ | LK Digital",
    description:
      "Faça o diagnóstico das 7 Alavancas e descubra exatamente onde sua clínica está deixando dinheiro na mesa.",
    images: [{ url: "https://lkdigital.odo.br/og-unicornio.jpg", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  alternates: { canonical: "/unicornio" },
};

export default function UnicornioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide global float widgets (WhatsApp button, chat) on this route */}
      <style
        dangerouslySetInnerHTML={{
          __html: `#global-widgets { display: none !important; }`,
        }}
      />
      {children}
    </>
  );
}
