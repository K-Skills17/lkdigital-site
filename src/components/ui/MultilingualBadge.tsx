interface MultilingualBadgeProps {
  text?: string;
}

export default function MultilingualBadge({
  text = "Atendemos em Portugu\u00eas, English & Fran\u00e7ais",
}: MultilingualBadgeProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-1.5 text-base">
          <span>{"\u{1F1E7}\u{1F1F7}"}</span>
          <span>{"\u{1F1EC}\u{1F1E7}"}</span>
          <span>{"\u{1F1EB}\u{1F1F7}"}</span>
        </div>
        <span className="text-xs sm:text-sm text-white/60">{text}</span>
      </div>
    </div>
  );
}
