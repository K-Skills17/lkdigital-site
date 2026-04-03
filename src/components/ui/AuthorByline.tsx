export default function AuthorByline({
  date,
  readTime,
  category,
}: {
  date: string;
  readTime?: string;
  category?: string;
}) {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
          LK
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">Equipe LK Digital</p>
          <p className="text-[10px] text-muted-foreground">Marketing Digital para Odontologia</p>
        </div>
      </div>
      <span className="w-px h-4 bg-border" />
      <time dateTime={date} className="text-xs">{formattedDate}</time>
      {readTime && (
        <>
          <span className="w-px h-4 bg-border" />
          <span className="text-xs">{readTime} de leitura</span>
        </>
      )}
      {category && (
        <>
          <span className="w-px h-4 bg-border" />
          <span className="px-2 py-0.5 text-[10px] font-medium text-accent bg-accent/10 rounded">{category}</span>
        </>
      )}
    </div>
  );
}
