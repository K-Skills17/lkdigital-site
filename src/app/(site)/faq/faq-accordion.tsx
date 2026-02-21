"use client";

import { useState } from "react";
import { faqItems } from "./faq-data";

function PlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
        isOpen ? "rotate-45" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
        className="w-full flex items-start justify-between gap-6 py-7 text-left group"
      >
        <span className="text-base md:text-lg font-medium text-foreground leading-snug group-hover:text-accent transition-colors duration-200">
          {item.question}
        </span>
        <PlusIcon isOpen={isOpen} />
      </button>

      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pb-7 pr-10 text-muted-foreground leading-relaxed text-base">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

const categories = [
  {
    label: "GEO, SEO e Estratégia Digital",
    indices: [0, 1],
  },
  {
    label: "Resultados, Especialidades e Processo",
    indices: [2, 3, 4],
  },
  {
    label: "Automação, Investimento e Onboarding",
    indices: [5, 6, 7, 8],
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-16">
      {categories.map((category) => (
        <div key={category.label}>
          <p className="text-xs font-medium text-accent uppercase tracking-widest mb-2">
            Categoria
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            {category.label}
          </h2>
          <div className="border-t border-border">
            {category.indices.map((itemIndex) => {
              const item = faqItems[itemIndex];
              if (!item) return null;
              return (
                <FAQItem
                  key={itemIndex}
                  item={item}
                  index={itemIndex}
                  isOpen={openIndex === itemIndex}
                  onToggle={() => handleToggle(itemIndex)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
