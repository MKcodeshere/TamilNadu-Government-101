"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors } from "@/lib/colors";

const legendItems = [
  {
    shape: "circle" as const,
    label: { en: "Governor / CM", ta: "ஆளுநர் / முதலமைச்சர்" },
    color: gopuramColors.apex,
  },
  {
    shape: "hexagon" as const,
    label: { en: "Legislature", ta: "சட்டமன்றம்" },
    color: gopuramColors.legislature,
  },
  {
    shape: "diamond" as const,
    label: { en: "Judiciary", ta: "நீதித்துறை" },
    color: "#311B92",
  },
  {
    shape: "circle" as const,
    label: { en: "Ministers", ta: "அமைச்சர்கள்" },
    color: gopuramColors.dmk,
  },
  {
    shape: "square" as const,
    label: { en: "Departments", ta: "துறைகள்" },
    color: gopuramColors.departments,
  },
];

function ShapeIcon({ shape, color }: { shape: string; color: string }) {
  const size = 12;
  return (
    <svg width={size} height={size} viewBox="0 0 12 12">
      {shape === "circle" && (
        <circle cx="6" cy="6" r="5" fill={color} />
      )}
      {shape === "square" && (
        <rect x="1" y="1" width="10" height="10" rx="2" fill={color} />
      )}
      {shape === "diamond" && (
        <polygon points="6,0 12,6 6,12 0,6" fill={color} />
      )}
      {shape === "hexagon" && (
        <polygon points="3,0 9,0 12,6 9,12 3,12 0,6" fill={color} />
      )}
    </svg>
  );
}

export default function NetworkLegend() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-3 px-4 border-t border-[var(--color-border)] bg-white/60">
      {legendItems.map((item) => (
        <div key={item.label.en} className="flex items-center gap-1.5">
          <ShapeIcon shape={item.shape} color={item.color} />
          <span className="text-[10px] sm:text-xs text-[var(--color-text-secondary)]">
            {t(item.label)}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <svg width="20" height="8" viewBox="0 0 20 8">
          <line x1="0" y1="4" x2="20" y2="4" stroke="#ccc" strokeWidth="1" strokeDasharray="3,2" />
        </svg>
        <span className="text-[10px] sm:text-xs text-[var(--color-text-secondary)]">
          {t({ en: "Relationship", ta: "தொடர்பு" })}
        </span>
      </div>
    </div>
  );
}
