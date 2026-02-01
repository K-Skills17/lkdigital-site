import { Hero } from "@/components/site/home/hero";
import { ValueProp } from "@/components/site/home/value-prop";
import { GrowthCycle } from "@/components/site/home/growth-cycle";
import { Pillars } from "@/components/site/home/pillars";
import { Philosophy } from "@/components/site/home/philosophy";
import { LeadForm } from "@/components/site/home/lead-form";
import { LKGuarantee } from "@/components/shared/lk-guarantee";
import { HomepageStructuredData } from "@/components/shared/structured-data";

export default function Home() {
  return (
    <>
      <HomepageStructuredData />
      <Hero />
      <ValueProp />
      <GrowthCycle />
      <LKGuarantee />
      <Pillars />
      <Philosophy />
      <LeadForm />
    </>
  );
}
