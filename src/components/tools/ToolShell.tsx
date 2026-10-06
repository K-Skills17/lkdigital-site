// Shared page shell for every free tool and lead magnet: the site Navbar, a light
// tool area scoped to `.tool-<slug>` (see postcss-tool-scope.cjs) and the site Footer,
// so all tools look like part of the same site.
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toolFontVars } from "@/tools/shared/fonts";

export default function ToolShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <>
      <Navbar ctaHref="/raio-x" ctaLabel="Fazer o RAIO-X" />
      <main id="main-content" className={`${toolFontVars} tool-${slug} lk-tool pt-16 md:pt-20`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
