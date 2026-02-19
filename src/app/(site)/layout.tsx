import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { StickyCTA } from "@/components/site/sticky-cta";
import { ScrollObserver } from "@/components/shared/scroll-observer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollObserver />
      <Header />
      <main className="container mx-auto max-w-6xl px-4 flex-1">
        {children}
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}

