import { Card, CardContent } from "@/components/ui/card";
import { Section } from "../section";

export function ForNotFor() {
  return (
    <Section title="Este sistema não é para todos.">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <Card className="rounded-2xl border-muted/60 bg-background py-0">
          <CardContent className="p-6 md:p-8 space-y-4">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              Para
            </h3>
            <ul className="space-y-3 text-base md:text-lg text-muted-foreground leading-relaxed">
              <li className="flex items-start">
                <span className="mr-3 text-accent">•</span>
                <span>Clínicas odontológicas privadas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-accent">•</span>
                <span>Procedimentos de maior valor</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-accent">•</span>
                <span>Donos que querem previsibilidade</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-muted/60 bg-background py-0">
          <CardContent className="p-6 md:p-8 space-y-4">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              Não é para
            </h3>
            <ul className="space-y-3 text-base md:text-lg text-muted-foreground leading-relaxed">
              <li className="flex items-start">
                <span className="mr-3 text-muted-foreground/50">•</span>
                <span>Clínicas populares</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-muted-foreground/50">•</span>
                <span>Quem busca "leads baratos"</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-muted-foreground/50">•</span>
                <span>Quem quer apenas anúncios</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
