"use client";

import { useRef, useState, useCallback } from "react";
import { useInView } from "framer-motion";
import type { BilingualText } from "@/lib/types";
import { useLanguage } from "@/hooks/useLanguage";
import {
  TIER_CONFIGS,
  SVG_WIDTH,
  SVG_HEIGHT,
  SVG_CX,
} from "@/lib/gopuram-layout";
import GopuramFinial from "./GopuramFinial";
import GopuramBase from "./GopuramBase";
import OrnamentalBand from "./OrnamentalBand";
import GopuramTierSVG, { type TierItem } from "./GopuramTierSVG";
import GopuramTooltip from "./GopuramTooltip";

import departments from "@/data/departments.json";
import districts from "@/data/districts.json";
import executive from "@/data/executive.json";

/* ------------------------------------------------------------------ */
/*  Build tier data from JSON                                          */
/* ------------------------------------------------------------------ */

const apexItems: TierItem[] = [
  {
    id: "governor",
    label: {
      en: `Governor: ${executive.governor.name}`,
      ta: `\u0b86\u0bb3\u0bc1\u0ba8\u0bb0\u0bcd: ${executive.governor.name}`,
    },
  },
  {
    id: "high-court",
    label: {
      en: "Madras High Court",
      ta: "\u0b9a\u0bc6\u0ba9\u0bcd\u0ba9\u0bc8 \u0b89\u0baf\u0bb0\u0bcd\u0ba8\u0bc0\u0ba4\u0bbf\u0bae\u0ba9\u0bcd\u0bb1\u0bae\u0bcd",
    },
  },
];

const executiveItems: TierItem[] = [
  {
    id: "cm",
    label: {
      en: `CM: ${executive.chiefMinister.name}`,
      ta: `\u0bae\u0bc1\u0ba4\u0bb2\u0bae\u0bc8\u0b9a\u0bcd\u0b9a\u0bb0\u0bcd: ${executive.chiefMinister.name}`,
    },
    sublabel: executive.chiefMinister.party,
  },
  {
    id: "dcm",
    label: {
      en: `Dy CM: ${(executive as Record<string, unknown> & { deputyChiefMinister: { name: string; party: string } }).deputyChiefMinister.name}`,
      ta: `\u0ba4\u0bc1\u0ba3\u0bc8 \u0bae\u0bc1.\u0b85: ${(executive as Record<string, unknown> & { deputyChiefMinister: { name: string; party: string } }).deputyChiefMinister.name}`,
    },
    sublabel: (executive as Record<string, unknown> & { deputyChiefMinister: { name: string; party: string } }).deputyChiefMinister.party,
  },
  ...executive.ministers.slice(2, 8).map((m) => ({
    id: m.id,
    label: { en: m.name, ta: m.name } as BilingualText,
    sublabel: m.title.en.replace("Minister for ", ""),
  })),
];

const departmentItems: TierItem[] = departments.map((d) => ({
  id: d.id,
  label: d.name as BilingualText,
  href: `/departments/${d.id}`,
}));

const legislatureItems: TierItem[] = [
  {
    id: "assembly",
    label: { en: "234 MLAs", ta: "234 \u0b9a\u0b9f\u0bcd\u0b9f\u0bae\u0ba9\u0bcd\u0bb1 \u0b89\u0bb1\u0bc1\u0baa\u0bcd\u0baa\u0bbf\u0ba9\u0bb0\u0bcd\u0b95\u0bb3\u0bcd" },
  },
  {
    id: "speaker",
    label: {
      en: `Speaker: ${(executive as Record<string, unknown> & { speaker: { name: string } }).speaker.name}`,
      ta: `\u0b9a\u0baa\u0bbe\u0ba8\u0bbe\u0baf\u0b95\u0bb0\u0bcd: ${(executive as Record<string, unknown> & { speaker: { name: string } }).speaker.name}`,
    },
  },
  {
    id: "ruling",
    label: { en: "Ruling: DMK+ Alliance", ta: "\u0b86\u0b9f\u0bcd\u0b9a\u0bbf: \u0ba4\u0bbf.\u0bae\u0bc1.\u0b95+ \u0b95\u0bc2\u0b9f\u0bcd\u0b9f\u0ba3\u0bbf" },
  },
];

const districtItems: TierItem[] = districts.map((d) => ({
  id: d.id,
  label: d.name as BilingualText,
  href: `/districts/${d.id}`,
}));

const localBodiesItems: TierItem[] = [
  { id: "corporations", label: { en: "25 Corporations", ta: "25 \u0bae\u0bbe\u0ba8\u0b95\u0bb0\u0bbe\u0b9f\u0bcd\u0b9a\u0bbf\u0b95\u0bb3\u0bcd" } },
  { id: "municipalities", label: { en: "138 Municipalities", ta: "138 \u0ba8\u0b95\u0bb0\u0bbe\u0b9f\u0bcd\u0b9a\u0bbf\u0b95\u0bb3\u0bcd" } },
  { id: "town-panchayats", label: { en: "490 Town Panchayats", ta: "490 \u0baa\u0bc7\u0bb0\u0bc2\u0bb0\u0bcd \u0baa\u0b9e\u0bcd\u0b9a\u0bbe\u0baf\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bcd" } },
  { id: "panchayat-unions", label: { en: "385 Panchayat Unions", ta: "385 \u0b8a\u0bb0\u0bbe\u0b9f\u0bcd\u0b9a\u0bbf \u0b92\u0ba9\u0bcd\u0bb1\u0bbf\u0baf\u0b99\u0bcd\u0b95\u0bb3\u0bcd" } },
  {
    id: "village-panchayats",
    label: { en: "12,525 Village Panchayats", ta: "12,525 \u0b95\u0bbf\u0bb0\u0bbe\u0bae \u0baa\u0b9e\u0bcd\u0b9a\u0bbe\u0baf\u0ba4\u0bcd\u0ba4\u0bc1\u0b95\u0bb3\u0bcd" },
  },
];

const peopleItems: TierItem[] = [
  {
    id: "people",
    label: { en: "People of Tamil Nadu", ta: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd\u0ba8\u0bbe\u0b9f\u0bc1 \u0bae\u0b95\u0bcd\u0b95\u0bb3\u0bcd" },
    sublabel: "~8 Cr",
  },
];

/** Map tier ID to its items */
const TIER_DATA: Record<string, TierItem[]> = {
  apex: apexItems,
  executive: executiveItems,
  departments: departmentItems,
  legislature: legislatureItems,
  districts: districtItems,
  local_bodies: localBodiesItems,
  people: peopleItems,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface GopuramSVGProps {
  onEntityClick?: (item: TierItem) => void;
}

export default function GopuramSVG({ onEntityClick }: GopuramSVGProps) {
  const { lang } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-40px" });

  const [tooltipEntity, setTooltipEntity] = useState<TierItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleEntityHover = useCallback(
    (item: TierItem | null, x: number, y: number) => {
      setTooltipEntity(item);
      setTooltipPos({ x, y });
    },
    []
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={
          lang === "ta"
            ? "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd\u0ba8\u0bbe\u0b9f\u0bc1 \u0b85\u0bb0\u0b9a\u0bc1 \u0b95\u0bcb\u0baa\u0bc1\u0bb0\u0bae\u0bcd \u0b95\u0bbe\u0b9f\u0bcd\u0b9a\u0bbf\u0baa\u0bcd\u0baa\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bb2\u0bcd"
            : "Tamil Nadu Government Gopuram Visualization"
        }
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBF0" />
            <stop offset="100%" stopColor="#FFF8E1" />
          </linearGradient>
        </defs>
        <rect
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          fill="url(#bg-gradient)"
          rx={8}
        />

        {/* Finial at the top */}
        <GopuramFinial cx={SVG_CX} yTop={0} yBottom={120} />

        {/* Tiers from top to bottom */}
        {TIER_CONFIGS.map((tier, index) => (
          <GopuramTierSVG
            key={tier.id}
            tier={tier}
            items={TIER_DATA[tier.id] || []}
            tierIndex={index}
            isInView={isInView}
            lang={lang}
            onEntityClick={onEntityClick}
            onEntityHover={handleEntityHover}
          />
        ))}

        {/* Ornamental bands between tiers */}
        {TIER_CONFIGS.map((tier, index) => {
          if (tier.bandY === null) return null;
          // Compute band width from adjacent tiers
          const currentBottom = tier.bounds.widthBottom;
          const nextTop =
            index + 1 < TIER_CONFIGS.length
              ? TIER_CONFIGS[index + 1].bounds.widthTop
              : currentBottom;
          const bandWidth = Math.max(currentBottom, nextTop);
          const xStart = SVG_CX - bandWidth / 2;
          const xEnd = SVG_CX + bandWidth / 2;

          return (
            <OrnamentalBand
              key={`band-${tier.id}`}
              xStart={xStart}
              xEnd={xEnd}
              y={tier.bandY}
              color={tier.color}
            />
          );
        })}

        {/* Base pillars */}
        <GopuramBase yTop={1740} yBottom={1800} />
      </svg>

      {/* Tooltip overlay */}
      <GopuramTooltip
        entity={tooltipEntity}
        svgX={tooltipPos.x}
        svgY={tooltipPos.y}
        svgRef={svgRef}
      />
    </div>
  );
}
