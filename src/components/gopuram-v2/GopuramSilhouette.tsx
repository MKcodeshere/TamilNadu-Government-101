"use client";

import { TIER_CONFIGS, SVG_WIDTH, SVG_HEIGHT, SVG_CX } from "@/lib/gopuram-layout";
import { trapezoidPath, scallopPath, finialPath } from "@/lib/gopuram-paths";

/**
 * GopuramSilhouette — renders ONLY the architectural outline:
 *   • Finial (kalasam) at top
 *   • 7 trapezoid tier outlines (stroke only, no fill — tiers fill themselves)
 *   • Ornamental scallop bands between tiers
 *   • Pillared base at bottom
 *
 * The tier interiors are left transparent so overlay HTML/SVG
 * tier components can render D3 visualizations inside.
 */
export default function GopuramSilhouette() {
  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        {/* Sandstone gradient for outlines */}
        <linearGradient id="sandstone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="50%" stopColor="#C4956A" />
          <stop offset="100%" stopColor="#B8875E" />
        </linearGradient>

        {/* Gold gradient for finial */}
        <linearGradient id="finialGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>

        {/* Subtle shadow filter */}
        <filter id="tierShadow" x="-2%" y="-2%" width="104%" height="108%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000020" />
        </filter>

        {/* Per-tier gradients (subtle, mostly transparent) */}
        {TIER_CONFIGS.map((tier) => (
          <linearGradient key={tier.id} id={`tier-bg-${tier.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tier.color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={tier.color} stopOpacity="0.12" />
          </linearGradient>
        ))}
      </defs>

      {/* Background */}
      <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="transparent" />

      {/* Finial (kalasam) at the top */}
      <path
        d={finialPath(SVG_CX, 0, 120)}
        fill="url(#finialGold)"
        stroke="#B8860B"
        strokeWidth="1"
      />
      {/* Finial decorative circles */}
      <circle cx={SVG_CX} cy={45} r={3} fill="#FFF176" />
      <circle cx={SVG_CX} cy={90} r={4} fill="#FFD700" />

      {/* Tier outlines — light fill + sandstone stroke */}
      {TIER_CONFIGS.map((tier) => (
        <g key={tier.id} filter="url(#tierShadow)">
          <path
            d={trapezoidPath(tier.bounds)}
            fill={`url(#tier-bg-${tier.id})`}
            stroke="url(#sandstone)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Ornamental scallop bands between tiers */}
      {TIER_CONFIGS.filter((t) => t.bandY !== null).map((tier) => {
        const y = tier.bandY!;
        // Interpolate width at band position
        const idx = TIER_CONFIGS.indexOf(tier);
        const nextTier = TIER_CONFIGS[idx + 1];
        const bandWidth = nextTier
          ? (tier.bounds.widthBottom + nextTier.bounds.widthTop) / 2
          : tier.bounds.widthBottom;
        const xStart = SVG_CX - bandWidth / 2;
        const xEnd = SVG_CX + bandWidth / 2;

        return (
          <g key={`band-${tier.id}`}>
            <path
              d={scallopPath(xStart, xEnd, y, 24)}
              fill="none"
              stroke="url(#sandstone)"
              strokeWidth="2"
              opacity="0.6"
            />
            {/* Thin horizontal line above scallop */}
            <line
              x1={xStart}
              y1={y - 1}
              x2={xEnd}
              y2={y - 1}
              stroke="#C4956A"
              strokeWidth="1"
              opacity="0.3"
            />
          </g>
        );
      })}

      {/* Pillared base below the people tier */}
      <Base />
    </svg>
  );
}

/** Pillared base at the very bottom */
function Base() {
  const y = 1740;
  const height = 60;
  const pillarCount = 14;
  const totalWidth = 1000;
  const padX = 10;
  const pillarWidth = 8;
  const spacing = (totalWidth - padX * 2) / (pillarCount - 1);

  return (
    <g>
      {/* Base platform */}
      <rect
        x={padX}
        y={y}
        width={totalWidth - padX * 2}
        height={height}
        fill="url(#sandstone)"
        opacity="0.3"
        rx="2"
      />
      {/* Pillars */}
      {Array.from({ length: pillarCount }).map((_, i) => {
        const px = padX + i * spacing;
        return (
          <g key={i}>
            {/* Capital (top) */}
            <rect
              x={px - pillarWidth / 2 - 2}
              y={y + 2}
              width={pillarWidth + 4}
              height={6}
              fill="#C4956A"
              opacity="0.5"
              rx="1"
            />
            {/* Shaft */}
            <rect
              x={px - pillarWidth / 2}
              y={y + 8}
              width={pillarWidth}
              height={height - 14}
              fill="#C4956A"
              opacity="0.35"
              rx="1"
            />
            {/* Base */}
            <rect
              x={px - pillarWidth / 2 - 2}
              y={y + height - 6}
              width={pillarWidth + 4}
              height={5}
              fill="#C4956A"
              opacity="0.5"
              rx="1"
            />
          </g>
        );
      })}
    </g>
  );
}
