"use client";

import { motion } from "framer-motion";
import type { BilingualText } from "@/lib/types";
import { useLanguage } from "@/hooks/useLanguage";

interface TierItem {
  id: string;
  label: BilingualText;
  sublabel?: string;
  href?: string;
}

interface GopuramTierProps {
  tierName: BilingualText;
  color: string;
  items: TierItem[];
  tierIndex: number;
  isInView: boolean;
  /** Width percentage at this tier level (100 = full width, smaller = narrower) */
  widthPercent: number;
  onItemClick?: (item: TierItem) => void;
}

export default function GopuramTier({
  tierName,
  color,
  items,
  tierIndex,
  isInView,
  widthPercent,
  onItemClick,
}: GopuramTierProps) {
  const { t } = useLanguage();

  // Determine text color based on background brightness
  const textColor = isLightColor(color) ? "#1A1A2E" : "#FFFFFF";
  const pillBg = isLightColor(color)
    ? "rgba(0,0,0,0.12)"
    : "rgba(255,255,255,0.18)";
  const pillHoverBg = isLightColor(color)
    ? "rgba(0,0,0,0.22)"
    : "rgba(255,255,255,0.30)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: tierIndex * 0.1 }}
      className="flex flex-col items-center w-full"
    >
      {/* Tier band with trapezoid shape */}
      <div
        className="relative rounded-lg overflow-hidden transition-all duration-300"
        style={{
          width: `${widthPercent}%`,
          backgroundColor: color,
          minHeight: items.length > 6 ? "auto" : "80px",
        }}
      >
        {/* Decorative top border pattern */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${textColor} 50%, transparent 100%)`,
          }}
        />

        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {/* Tier title */}
          <h3
            className="text-sm font-semibold tracking-wide uppercase text-center mb-2 sm:text-base"
            style={{ color: textColor }}
          >
            {t(tierName)}
          </h3>

          {/* Entity pills */}
          {items.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center sm:gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onItemClick?.(item)}
                  className="group px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer hover:scale-105 sm:text-sm sm:px-3 sm:py-1.5"
                  style={{
                    backgroundColor: pillBg,
                    color: textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = pillHoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = pillBg;
                  }}
                >
                  <span>{t(item.label)}</span>
                  {item.sublabel && (
                    <span className="ml-1 opacity-70 text-[10px] sm:text-xs">
                      {item.sublabel}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Decorative bottom border pattern */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${textColor} 50%, transparent 100%)`,
          }}
        />
      </div>
    </motion.div>
  );
}

/** Simple brightness check for a hex color */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Using perceived brightness formula
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}
