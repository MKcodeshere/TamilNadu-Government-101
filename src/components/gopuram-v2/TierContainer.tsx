"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import type { TierBounds } from "@/lib/gopuram-layout";
import { SVG_WIDTH, SVG_HEIGHT } from "@/lib/gopuram-layout";
import { useLanguage } from "@/hooks/useLanguage";
import type { BilingualText } from "@/lib/types";

interface TierContainerProps {
  /** Tier bounds from TIER_CONFIGS */
  bounds: TierBounds;
  /** Tier label */
  label: BilingualText;
  /** Tier accent color */
  color: string;
  /** Tier index for staggered animation */
  index: number;
  /** The D3 visualization content */
  children: ReactNode;
  /** Whether to show the tier label above the content */
  showLabel?: boolean;
}

/**
 * TierContainer — positions a child visualization component
 * within the gopuram silhouette coordinate system.
 *
 * Converts SVG viewBox coordinates (0-1000 x 0-1800) into
 * percentage-based CSS positioning so overlays align with
 * the background silhouette SVG.
 */
export default function TierContainer({
  bounds,
  label,
  color,
  index,
  children,
  showLabel = true,
}: TierContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const { t } = useLanguage();

  // Convert SVG coordinates to percentages of the container
  const top = (bounds.yTop / SVG_HEIGHT) * 100;
  const height = ((bounds.yBottom - bounds.yTop) / SVG_HEIGHT) * 100;

  // Use average width for the tier (trapezoid → approximate as centered rect)
  const avgWidth = (bounds.widthTop + bounds.widthBottom) / 2;
  const width = (avgWidth / SVG_WIDTH) * 100;
  const left = ((bounds.cx - avgWidth / 2) / SVG_WIDTH) * 100;

  // Inset padding so content doesn't touch the trapezoid edges
  const padPct = 1.5; // percent

  return (
    <motion.div
      ref={ref}
      className="absolute overflow-hidden"
      style={{
        top: `${top}%`,
        left: `${left + padPct}%`,
        width: `${width - padPct * 2}%`,
        height: `${height}%`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Tier label */}
      {showLabel && (
        <div
          className="text-center text-[0.65rem] sm:text-xs font-semibold tracking-wide uppercase mb-1 sm:mb-2 truncate px-1"
          style={{ color }}
        >
          {t(label)}
        </div>
      )}

      {/* Visualization content */}
      <div className="w-full flex-1 min-h-0" style={{ height: showLabel ? "calc(100% - 1.5rem)" : "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}
