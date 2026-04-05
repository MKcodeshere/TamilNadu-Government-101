import type { BilingualText, Language } from "@/lib/types";

interface BilingualLabelProps {
  text: BilingualText;
  showBoth?: boolean;
  className?: string;
  lang?: Language;
}

/**
 * Renders bilingual text. When showBoth is true, the primary language
 * is displayed prominently and the secondary language appears below
 * in smaller text.
 */
export function BilingualLabel({
  text,
  showBoth = false,
  className = "",
  lang = "en",
}: BilingualLabelProps) {
  const primary = lang === "en" ? text.en : text.ta;
  const secondary = lang === "en" ? text.ta : text.en;

  if (!showBoth) {
    return <span className={className}>{primary}</span>;
  }

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span>{primary}</span>
      <span className="text-[0.75em] text-[var(--color-text-secondary)] font-normal leading-tight">
        {secondary}
      </span>
    </span>
  );
}
