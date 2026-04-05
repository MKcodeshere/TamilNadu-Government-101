"use client";

import { motion } from "framer-motion";
import type { BilingualText, Language } from "@/lib/types";
import type { TierConfig, NichePosition, LayoutNicheOptions } from "@/lib/gopuram-layout";
import { layoutNiches } from "@/lib/gopuram-layout";
import { trapezoidPath } from "@/lib/gopuram-paths";
import NicheNode from "./NicheNode";

export interface TierItem {
  id: string;
  label: BilingualText;
  sublabel?: string;
  href?: string;
}

interface GopuramTierSVGProps {
  tier: TierConfig;
  items: TierItem[];
  tierIndex: number;
  isInView: boolean;
  lang: Language;
  simplified?: boolean;
  onEntityClick?: (item: TierItem) => void;
  onEntityHover?: (item: TierItem | null, x: number, y: number) => void;
}

export default function GopuramTierSVG({
  tier,
  items,
  tierIndex,
  isInView,
  lang,
  simplified = false,
  onEntityClick,
  onEntityHover,
}: GopuramTierSVGProps) {
  const { bounds, color, label } = tier;

  // Compute layout options based on item count
  const layoutOptions: LayoutNicheOptions = {
    padX: 30,
    padY: items.length > 20 ? 28 : 32,
    gapX: items.length > 20 ? 4 : 8,
    gapY: items.length > 20 ? 4 : 8,
    maxCols: items.length > 30 ? 10 : items.length > 10 ? 8 : 6,
    minNicheWidth: items.length > 30 ? 50 : 60,
    maxNicheWidth: items.length <= 3 ? 160 : items.length > 20 ? 80 : 120,
  };

  const positions: NichePosition[] = layoutNiches(items.length, bounds, layoutOptions);
  const path = trapezoidPath(bounds);

  // Gradient IDs
  const gradId = `tier-grad-${tier.id}`;

  // Title position: centered at top of tier
  const titleY = bounds.yTop + 18;

  // Text color based on brightness
  const textColor = isLightColor(color) ? "#1A1A2E" : "#FFFFFF";
  const tierLabel = lang === "ta" ? label.ta : label.en;

  return (
    <motion.g
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: tierIndex * 0.08 }}
    >
      {/* Tier gradient definition */}
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.75} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      </defs>

      {/* Trapezoid background */}
      <path
        d={path}
        fill={`url(#${gradId})`}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.5}
      />

      {/* Tier title */}
      <text
        x={bounds.cx}
        y={titleY}
        fill={textColor}
        fontSize={14}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="central"
        letterSpacing={1}
        pointerEvents="none"
        style={{ textTransform: "uppercase", userSelect: "none" }}
      >
        {tierLabel}
      </text>

      {/* Entity niches */}
      {!simplified &&
        items.map((item, i) => {
          const pos = positions[i];
          if (!pos) return null;
          return (
            <NicheNode
              key={item.id}
              x={pos.x}
              y={pos.y}
              width={pos.width}
              height={pos.height}
              label={item.label}
              sublabel={item.sublabel}
              color={color}
              lang={lang}
              onClick={() => onEntityClick?.(item)}
              onHover={(hovering, cx, cy) => {
                onEntityHover?.(hovering ? item : null, cx, cy);
              }}
            />
          );
        })}
    </motion.g>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}
