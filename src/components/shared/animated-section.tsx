"use client";

import { useEffect, useRef, ReactNode } from "react";

type AnimationType = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  threshold?: number;
}

export function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  threshold = 0.15,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const delayClass = delay > 0 ? `stagger-${delay}` : "";
  const animClass = `anim-${animation}`;

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${animClass} ${delayClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
