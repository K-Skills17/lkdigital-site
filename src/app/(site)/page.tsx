import { Hero } from "@/components/site/home/hero";
import { ValueProp } from "@/components/site/home/value-prop";
import { PerformanceGuarantee } from "@/components/site/home/performance-guarantee";
import { Pillars } from "@/components/site/home/pillars";
import { Philosophy } from "@/components/site/home/philosophy";
import { LeadForm } from "@/components/site/home/lead-form";
import { HomepageStructuredData } from "@/components/shared/structured-data";

export default function Home() {
  return (
    <>
      <HomepageStructuredData />
      <Hero />
      <ValueProp />
      <PerformanceGuarantee />
      <Pillars />
      <Philosophy />
      <LeadForm />
    </>
  );
}
