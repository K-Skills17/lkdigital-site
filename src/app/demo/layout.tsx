import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demonstração do Assistente IA | LK Digital",
  description:
    "Veja em tempo real como o assistente da LK Digital qualifica e agenda pacientes automaticamente para clínicas odontológicas.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Hide the global floating ChatWidget and WhatsApp button — the chat is inline here */}
      <style
        dangerouslySetInnerHTML={{
          __html: `#global-widgets { display: none !important; }`,
        }}
      />
      {children}
    </>
  );
}
