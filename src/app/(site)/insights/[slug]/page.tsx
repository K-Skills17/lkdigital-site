import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/site/page-header";

export default function InsightSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      <PageHeader
        title={`Insight: ${params.slug}`}
        description="Conteúdo em desenvolvimento."
      />

      <Card className="rounded-2xl border-muted/60 bg-background py-0">
        <CardContent className="p-6 md:p-8">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Esta página está em construção. Em breve você encontrará o conteúdo
            completo deste insight.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
