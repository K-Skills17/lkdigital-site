import { ReactNode } from "react";

type CalloutType = "summary" | "insight" | "warning" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutStyles: Record<
  CalloutType,
  { bg: string; border: string; icon: ReactNode; defaultTitle: string }
> = {
  summary: {
    bg: "bg-trust-bg",
    border: "border-accent",
    defaultTitle: "Resumo Executivo",
    icon: (
      <svg
        className="w-5 h-5 text-accent"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  insight: {
    bg: "bg-accent/5",
    border: "border-accent",
    defaultTitle: "Insight Estratégico",
    icon: (
      <svg
        className="w-5 h-5 text-accent"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  warning: {
    bg: "bg-orange-50",
    border: "border-orange-400",
    defaultTitle: "Atenção",
    icon: (
      <svg
        className="w-5 h-5 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
  tip: {
    bg: "bg-green-50",
    border: "border-green-400",
    defaultTitle: "Dica Prática",
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
};

export function Callout({ type = "summary", title, children }: CalloutProps) {
  const styles = calloutStyles[type];

  return (
    <aside
      className={`${styles.bg} border-l-4 ${styles.border} p-4 md:p-6 my-6 md:my-8 rounded-r-sm`}
      role="note"
    >
      <div className="flex items-center gap-3 mb-3">
        {styles.icon}
        <h4 className="text-base md:text-lg font-semibold text-foreground">
          {title || styles.defaultTitle}
        </h4>
      </div>
      <div className="text-sm md:text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none">
        {children}
      </div>
    </aside>
  );
}
