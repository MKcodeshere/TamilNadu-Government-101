"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors } from "@/lib/colors";
import type { Constituency } from "@/lib/types";
import areasData from "@/data/constituency-areas.json";

const partyColors: Record<string, string> = {
  DMK: gopuramColors.dmk,
  AIADMK: gopuramColors.aiadmk,
  BJP: gopuramColors.bjp,
  Congress: gopuramColors.congress,
  INC: gopuramColors.congress,
  PMK: gopuramColors.pmk,
  CPI: gopuramColors.cpi,
  "CPI(M)": gopuramColors.cpim,
  VCK: gopuramColors.vck,
  MDMK: gopuramColors.mdmk,
  Independent: gopuramColors.independent,
};

const areaTypeLabels: Record<string, { en: string; ta: string }> = {
  village: { en: "Villages", ta: "கிராமங்கள்" },
  town_panchayat: { en: "Town Panchayats", ta: "பேரூராட்சிகள்" },
  municipality: { en: "Municipalities", ta: "நகராட்சிகள்" },
  municipal_corporation: { en: "Corporations", ta: "மாநகராட்சிகள்" },
  census_town: { en: "Census Towns", ta: "மக்கள்தொகை நகரங்கள்" },
  taluk: { en: "Taluks", ta: "தாலுகாக்கள்" },
};

interface ConstituencyCardProps {
  constituency: Constituency;
  isHighlighted?: boolean;
  highlightTerm?: string;
}

export default function ConstituencyCard({
  constituency,
  isHighlighted,
  highlightTerm,
}: ConstituencyCardProps) {
  const { t, lang } = useLanguage();
  const [showAreas, setShowAreas] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-expand and scroll when highlighted with a search term
  useEffect(() => {
    if (isHighlighted && highlightTerm) {
      setShowAreas(true);
      setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    }
  }, [isHighlighted, highlightTerm]);

  const partyColor =
    partyColors[constituency.currentMla.party] || gopuramColors.others;

  // Find areas for this constituency
  const areaData = areasData.find(
    (a) => a.constituencyNumber === constituency.number
  );

  // Group areas by type
  const areasByType: Record<string, string[]> = {};
  if (areaData) {
    for (const area of areaData.areas) {
      if (!areasByType[area.type]) areasByType[area.type] = [];
      areasByType[area.type].push(area.name);
    }
  }

  const totalAreas = areaData?.areas.length || 0;

  return (
    <div
      ref={cardRef}
      className={`rounded-lg border bg-white p-3 transition-all ${
        isHighlighted
          ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 shadow-md"
          : "border-[var(--color-border)] shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
              #{constituency.number}
            </span>
            {constituency.type === "sc" && (
              <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-orange-100 text-orange-700">
                SC
              </span>
            )}
            {constituency.type === "st" && (
              <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-green-100 text-green-700">
                ST
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-[var(--color-text)] leading-tight">
            {t(constituency.name)}
          </h4>
        </div>
        <div
          className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
          style={{ backgroundColor: partyColor }}
        >
          {constituency.currentMla.party}
        </div>
      </div>

      {/* MLA */}
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        {lang === "en" ? "MLA" : "எம்.எல்.ஏ"}: {constituency.currentMla.name}
      </p>

      {/* Voter count */}
      {constituency.voterCount && (
        <p className="text-[10px] text-[var(--color-text-secondary)]">
          {(constituency.voterCount / 1000).toFixed(0)}K{" "}
          {lang === "en" ? "voters" : "வாக்காளர்கள்"}
        </p>
      )}

      {/* Areas toggle */}
      {totalAreas > 0 && (
        <button
          onClick={() => setShowAreas(!showAreas)}
          className="mt-2 w-full text-left text-[10px] font-medium hover:underline flex items-center gap-1"
          style={{ color: gopuramColors.districts }}
        >
          <span>{showAreas ? "▼" : "▶"}</span>
          {totalAreas} {lang === "en" ? "areas" : "பகுதிகள்"}
          {" · "}
          {lang === "en" ? "click to expand" : "விரிவாக்க க்ளிக்"}
        </button>
      )}

      {/* Areas detail */}
      {showAreas && areaData && (
        <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
          {Object.entries(areasByType).map(([type, names]) => (
            <div key={type}>
              <p
                className="text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                style={{
                  color:
                    type === "municipality" || type === "municipal_corporation"
                      ? "#1565C0"
                      : type === "town_panchayat"
                        ? "#E65100"
                        : type === "census_town"
                          ? "#00838F"
                          : "#558B2F",
                }}
              >
                {t(areaTypeLabels[type] || { en: type, ta: type })} ({names.length})
              </p>
              <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
                {names.map((name, ni) => {
                  const isMatch = highlightTerm && name.toLowerCase().includes(highlightTerm.toLowerCase());
                  return (
                    <span key={ni}>
                      {ni > 0 && ", "}
                      {isMatch ? (
                        <mark className="bg-yellow-200 font-bold text-[var(--color-text)] px-0.5 rounded">{name}</mark>
                      ) : (
                        name
                      )}
                    </span>
                  );
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
