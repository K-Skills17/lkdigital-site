import { Hero } from "@/components/site/home/hero";
import { MarketReframe } from "@/components/site/home/market-reframe";
import { Pillars } from "@/components/site/home/pillars";
import { DentistaOS } from "@/components/site/home/dentista-os";
import { ForNotFor } from "@/components/site/home/for-not-for";
import { HowItStarts } from "@/components/site/home/how-it-starts";
import { TrustFooter } from "@/components/site/home/trust-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <MarketReframe />
      <Pillars />
      <DentistaOS />
      <ForNotFor />
      <HowItStarts />
      <TrustFooter />
    </>
  );
}
