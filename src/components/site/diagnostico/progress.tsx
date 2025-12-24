interface ProgressProps {
  current: number;
  total: number;
}

export function Progress({ current, total }: ProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-3">
      {/* Top bar */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Diagnóstico</span>
        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
          {current} de {total}
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-[rgb(var(--brand-accent))] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

