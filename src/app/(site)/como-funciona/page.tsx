import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/site/page-header";

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      <PageHeader
        title="Como funciona"
        description="Conteúdo em desenvolvimento."
      />

      <Card className="rounded-2xl border-muted/60 bg-background py-0">
        <CardContent className="p-6 md:p-8">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Esta página está em construção. Em breve você encontrará informações
            detalhadas sobre como a LK Digital instala sistemas previsíveis de
            aquisição e conversão.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
