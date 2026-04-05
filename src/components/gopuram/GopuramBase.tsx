import type { ReactElement } from "react";
import { SVG_CX, SVG_WIDTH } from "@/lib/gopuram-layout";

interface GopuramBaseProps {
  yTop?: number;
  yBottom?: number;
}

/**
 * Pillared foundation at the bottom of the gopuram.
 * Deep green color matching the people tier.
 */
export default function GopuramBase({
  yTop = 1740,
  yBottom = 1800,
}: GopuramBaseProps) {
  const baseHeight = yBottom - yTop;
  const pillarCount = 12;
  const platformWidth = SVG_WIDTH;
  const xStart = SVG_CX - platformWidth / 2;
  const pillarSpacing = platformWidth / (pillarCount + 1);
  const pillarWidth = 16;
  const pillarHeight = baseHeight * 0.7;
  const capitalHeight = 6;
  const baseColor = "#1B5E20";

  const pillars: ReactElement[] = [];
  for (let i = 1; i <= pillarCount; i++) {
    const px = xStart + i * pillarSpacing;
    pillars.push(
      <g key={i}>
        {/* Capital (top of pillar) */}
        <rect
          x={px - pillarWidth * 0.7}
          y={yTop}
          width={pillarWidth * 1.4}
          height={capitalHeight}
          fill={baseColor}
          fillOpacity={0.8}
          rx={1}
        />
        {/* Pillar shaft */}
        <rect
          x={px - pillarWidth / 2}
          y={yTop + capitalHeight}
          width={pillarWidth}
          height={pillarHeight - capitalHeight}
          fill={baseColor}
          fillOpacity={0.6}
          rx={2}
        />
      </g>
    );
  }

  return (
    <g pointerEvents="none">
      {/* Ground platform */}
      <rect
        x={xStart}
        y={yTop + pillarHeight}
        width={platformWidth}
        height={baseHeight - pillarHeight}
        fill={baseColor}
        fillOpacity={0.9}
        rx={3}
      />
      {/* Pillars */}
      {pillars}
      {/* Top ledge */}
      <line
        x1={xStart}
        y1={yTop}
        x2={xStart + platformWidth}
        y2={yTop}
        stroke={baseColor}
        strokeWidth={2}
        strokeOpacity={0.5}
      />
    </g>
  );
}
