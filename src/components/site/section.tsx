import { ReactNode } from "react";

interface SectionProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function Section({
  title,
  eyebrow,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`py-10 md:py-14 space-y-10 ${className}`}>
      {(eyebrow || title || description) && (
        <div className="space-y-4">
          {eyebrow && (
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>
      )}
      {children && <div>{children}</div>}
    </section>
  );
}
