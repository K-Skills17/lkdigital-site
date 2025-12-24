import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  metaPill?: string;
}

export function PageHeader({ title, description, metaPill }: PageHeaderProps) {
  return (
    <div className="space-y-4 mb-10 md:mb-12">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[rgb(var(--brand-primary))]">
          {title}
        </h1>
        {metaPill && (
          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            {metaPill}
          </span>
        )}
      </div>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}
