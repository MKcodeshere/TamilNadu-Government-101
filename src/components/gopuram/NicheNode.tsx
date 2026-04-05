"use client";

import { useState, useCallback } from "react";
import type { BilingualText, Language } from "@/lib/types";
import { archedNichePath } from "@/lib/gopuram-paths";

interface NicheNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: BilingualText;
  sublabel?: string;
  color: string;
  lang: Language;
  onClick?: () => void;
  onHover?: (hovering: boolean, cx: number, cy: number) => void;
}

/** Determines if a hex color is light (for choosing text contrast) */
function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}

export default function NicheNode({
  x,
  y,
  width,
  height,
  label,
  sublabel,
  color,
  lang,
  onClick,
  onHover,
}: NicheNodeProps) {
  const [hovered, setHovered] = useState(false);

  const textColor = isLight(color) ? "#1A1A2E" : "#FFFFFF";
  const path = archedNichePath(x, y, width, height);

  const cx = x + width / 2;
  const primaryY = sublabel ? y + height * 0.4 : y + height * 0.5;
  const secondaryY = y + height * 0.7;

  const primaryText = lang === "ta" ? label.ta : label.en;

  // Truncate text to fit niche width (rough estimate: ~7px per char at fontSize 10)
  const maxChars = Math.floor(width / 6.5);
  const displayText =
    primaryText.length > maxChars
      ? primaryText.slice(0, maxChars - 1) + "\u2026"
      : primaryText;

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    onHover?.(true, cx, y);
  }, [onHover, cx, y]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    onHover?.(false, cx, y);
  }, [onHover, cx, y]);

  return (
    <g
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      style={{ cursor: onClick ? "pointer" : "default", outline: "none" }}
    >
      <path
        d={path}
        fill={color}
        fillOpacity={hovered ? 0.95 : 0.8}
        stroke={textColor}
        strokeWidth={hovered ? 1.5 : 0.5}
        strokeOpacity={0.3}
        style={{
          transition: "fill-opacity 0.2s, stroke-width 0.2s",
          transform: hovered ? `translate(0, -2px)` : undefined,
        }}
      />
      <text
        x={cx}
        y={primaryY}
        fill={textColor}
        fontSize={width < 80 ? 8 : 10}
        fontWeight={600}
        textAnchor="middle"
        dominantBaseline="central"
        pointerEvents="none"
        style={{ userSelect: "none" }}
      >
        {displayText}
      </text>
      {sublabel && (
        <text
          x={cx}
          y={secondaryY}
          fill={textColor}
          fillOpacity={0.7}
          fontSize={7}
          textAnchor="middle"
          dominantBaseline="central"
          pointerEvents="none"
          style={{ userSelect: "none" }}
        >
          {sublabel.length > maxChars
            ? sublabel.slice(0, maxChars - 1) + "\u2026"
            : sublabel}
        </text>
      )}
    </g>
  );
}
