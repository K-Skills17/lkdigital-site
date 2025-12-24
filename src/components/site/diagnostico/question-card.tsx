"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: string;
  options: string[];
  selected?: string;
  onSelect?: (option: string) => void;
}

export function QuestionCard({
  question,
  options,
  selected,
  onSelect,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<string | undefined>(
    selected
  );

  const handleSelect = (option: string) => {
    const newSelected = option === localSelected ? undefined : option;
    setLocalSelected(newSelected);
    onSelect?.(newSelected || "");
  };

  const currentSelected = selected !== undefined ? selected : localSelected;

  return (
    <Card className="rounded-2xl border-muted/60 bg-background hover:shadow-md transition py-0">
      <CardContent className="p-6 md:p-8 space-y-6">
        <h3 className="text-xl md:text-2xl font-semibold text-[rgb(var(--brand-primary))]">
          {question}
        </h3>
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border transition-all",
                currentSelected === option
                  ? "border-[rgb(var(--brand-accent))] bg-[rgb(var(--brand-accent))]/5"
                  : "border-muted/60 hover:bg-muted/30 hover:border-muted"
              )}
            >
              <span className="text-base text-foreground">{option}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

