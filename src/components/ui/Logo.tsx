/**
 * LK Digital logo icon — extracted from brand SVG.
 * The geometric angular mark representing Legacy Keystone Digital.
 */

interface LogoIconProps {
  className?: string;
  color?: string;
}

export function LogoIcon({ className = "w-7 h-7", color = "currentColor" }: LogoIconProps) {
  return (
    <svg
      viewBox="424 393 232 296"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        fill={color}
        points="655.41 465.5 655.41 688.16 424.67 688.16 424.67 688.08 480.31 616.63 503.12 587.35 534.23 547.41 579.26 489.59 598.03 465.5 655.41 465.5"
      />
      <polygon
        fill={color}
        points="653.75 393.97 598.03 465.5 503.12 465.5 503.12 393.97 653.75 393.97"
      />
    </svg>
  );
}

interface LogoProps {
  variant?: "full" | "compact";
  color?: "white" | "dark" | "accent";
  className?: string;
}

export default function Logo({ variant = "compact", color = "white", className = "" }: LogoProps) {
  const textColor =
    color === "white" ? "text-white" :
    color === "accent" ? "text-accent" :
    "text-foreground";

  const iconColor =
    color === "white" ? "#ffffff" :
    color === "accent" ? "#c5a368" :
    "#1a1a1a";

  if (variant === "full") {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <LogoIcon className="w-8 h-8" color={iconColor} />
        <span className="flex flex-col leading-none">
          <span className={`font-display text-base font-medium tracking-tight ${textColor}`}>
            LK Digital
          </span>
          <span className={`text-[9px] uppercase tracking-[0.2em] ${textColor} opacity-50 mt-0.5`}>
            Legacy Keystone
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoIcon className="w-7 h-7" color={iconColor} />
      <span className={`font-display text-lg font-medium tracking-tight ${textColor}`}>
        LK Digital
      </span>
    </span>
  );
}
