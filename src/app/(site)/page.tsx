import { Hero } from "@/components/site/home/hero";
import { AuthorityNarrative } from "@/components/site/home/authority-narrative";
import { Pillars } from "@/components/site/home/pillars";
import { Philosophy } from "@/components/site/home/philosophy";
import { LeadForm } from "@/components/site/home/lead-form";
import { HomepageStructuredData } from "@/components/shared/structured-data";

export default function Home() {
  return (
    <>
      <HomepageStructuredData />
      <Hero />
      <AuthorityNarrative />
      <Pillars />
      <Philosophy />
      <LeadForm />
    </>
  );
}
