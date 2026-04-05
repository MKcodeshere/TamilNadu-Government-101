"use client";

import { TIER_CONFIGS, SVG_WIDTH, SVG_HEIGHT } from "@/lib/gopuram-layout";
import GopuramSilhouette from "./GopuramSilhouette";
import TierContainer from "./TierContainer";
import ApexTier from "./ApexTier";
import ExecutiveTier from "./ExecutiveTier";
import DepartmentTreemap from "./DepartmentTreemap";
import LegislatureHemicycle from "./LegislatureHemicycle";
import DistrictHexGrid from "./DistrictHexGrid";
import LocalBodiesTier from "./LocalBodiesTier";
import PeopleTier from "./PeopleTier";

/**
 * GopuramHybrid — master component combining the architectural
 * silhouette with per-tier D3 visualizations.
 *
 * Architecture:
 *   • Background: SVG silhouette (outline, bands, finial, base)
 *   • Foreground: Absolutely-positioned TierContainer divs with
 *     individual visualization components inside
 */
export default function GopuramHybrid() {
  const tierMap = TIER_CONFIGS.reduce(
    (acc, t) => ({ ...acc, [t.id]: t }),
    {} as Record<string, (typeof TIER_CONFIGS)[number]>
  );

  return (
    <div
      className="relative mx-auto w-full"
      style={{
        maxWidth: "700px",
        aspectRatio: `${SVG_WIDTH} / ${SVG_HEIGHT}`,
      }}
      role="img"
      aria-label="Interactive gopuram visualization of Tamil Nadu government structure"
    >
      {/* Layer 1: SVG silhouette (architectural outline) */}
      <div className="absolute inset-0 pointer-events-none">
        <GopuramSilhouette />
      </div>

      {/* Layer 2: Tier visualizations (positioned to align with silhouette) */}
      <div className="absolute inset-0">
        {/* Tier 1: Apex — Governor + High Court */}
        <TierContainer
          bounds={tierMap.apex.bounds}
          label={tierMap.apex.label}
          color={tierMap.apex.color}
          index={0}
        >
          <ApexTier />
        </TierContainer>

        {/* Tier 2: Executive — CM + Ministers */}
        <TierContainer
          bounds={tierMap.executive.bounds}
          label={tierMap.executive.label}
          color={tierMap.executive.color}
          index={1}
        >
          <ExecutiveTier />
        </TierContainer>

        {/* Tier 3: Departments — D3 Treemap */}
        <TierContainer
          bounds={tierMap.departments.bounds}
          label={tierMap.departments.label}
          color={tierMap.departments.color}
          index={2}
        >
          <DepartmentTreemap />
        </TierContainer>

        {/* Tier 4: Legislature — Hemicycle */}
        <TierContainer
          bounds={tierMap.legislature.bounds}
          label={tierMap.legislature.label}
          color={tierMap.legislature.color}
          index={3}
        >
          <LegislatureHemicycle />
        </TierContainer>

        {/* Tier 5: Districts — Hex Grid */}
        <TierContainer
          bounds={tierMap.districts.bounds}
          label={tierMap.districts.label}
          color={tierMap.districts.color}
          index={4}
        >
          <DistrictHexGrid />
        </TierContainer>

        {/* Tier 6: Local Bodies — Animated Counters */}
        <TierContainer
          bounds={tierMap.local_bodies.bounds}
          label={tierMap.local_bodies.label}
          color={tierMap.local_bodies.color}
          index={5}
        >
          <LocalBodiesTier />
        </TierContainer>

        {/* Tier 7: People — Foundation */}
        <TierContainer
          bounds={tierMap.people.bounds}
          label={tierMap.people.label}
          color={tierMap.people.color}
          index={6}
          showLabel={false}
        >
          <PeopleTier />
        </TierContainer>
      </div>
    </div>
  );
}
