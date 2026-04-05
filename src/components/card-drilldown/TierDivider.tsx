"use client";

import { useLanguage } from "@/hooks/useLanguage";
import type { BilingualText } from "@/lib/types";

interface TierDividerProps {
  label: BilingualText;
  color: string;
  count?: number;
}

export default function TierDivider({ label, color, count }: TierDividerProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="h-0.5 flex-1"
        style={{
          background: `linear-gradient(to right, transparent, ${color}40, ${color}80)`,
        }}
      />
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color }}
        >
          {t(label)}
        </span>
        {count !== undefined && (
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {count}
          </span>
        )}
      </div>
      <div
        className="h-0.5 flex-1"
        style={{
          background: `linear-gradient(to left, transparent, ${color}40, ${color}80)`,
        }}
      />
    </div>
  );
}
