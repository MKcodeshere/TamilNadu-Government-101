"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import districtsData from "@/data/districts.json";
import constituenciesData from "@/data/constituencies.json";
import areasData from "@/data/constituency-areas.json";

interface SearchResult {
  type: "district" | "constituency" | "area";
  label: string;
  sublabel: string;
  districtId?: string;
  constituencyId?: string;
  areaName?: string; // raw area name for highlight
}

// Build search index once
function buildSearchIndex() {
  const index: SearchResult[] = [];

  // Districts
  for (const d of districtsData) {
    index.push({
      type: "district",
      label: d.name.en,
      sublabel: d.name.ta,
      districtId: d.id,
    });
  }

  // Constituencies
  for (const c of constituenciesData) {
    const districtObj = districtsData.find(
      (d) => d.name.en.toLowerCase() === c.district.toLowerCase()
    );
    index.push({
      type: "constituency",
      label: `${c.name.en} — ${c.currentMla.name} (${c.currentMla.party})`,
      sublabel: `${c.name.ta} · ${c.district}`,
      districtId: districtObj?.id,
      constituencyId: c.id,
    });
  }

  // Areas (villages, towns, municipalities)
  for (const c of areasData) {
    const constObj = constituenciesData.find(
      (cn) => cn.number === c.constituencyNumber
    );
    const districtObj = constObj
      ? districtsData.find(
          (d) => d.name.en.toLowerCase() === constObj.district.toLowerCase()
        )
      : undefined;

    for (const area of c.areas) {
      if (area.type === "taluk") continue; // skip taluks in search (too generic)
      index.push({
        type: "area",
        label: area.name,
        sublabel: `${c.constituencyName} constituency · ${c.district}`,
        districtId: districtObj?.id,
        constituencyId: constObj?.id,
        areaName: area.name,
      });
    }
  }

  return index;
}

const typeLabels: Record<string, string> = {
  district: "District",
  constituency: "Constituency",
  area: "Town/Village",
};

const typeColors: Record<string, string> = {
  district: "#C84B31",
  constituency: "#FF9933",
  area: "#2E7D32",
};

interface DistrictSearchProps {
  onSelectDistrict: (districtId: string) => void;
  onSelectConstituency: (districtId: string, constituencyId: string, highlightTerm?: string) => void;
}

export default function DistrictSearch({
  onSelectDistrict,
  onSelectConstituency,
}: DistrictSearchProps) {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    const matches = searchIndex
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.sublabel.toLowerCase().includes(q)
      )
      .slice(0, 20);

    // Group by type
    const grouped: Record<string, SearchResult[]> = {};
    for (const m of matches) {
      if (!grouped[m.type]) grouped[m.type] = [];
      grouped[m.type].push(m);
    }
    return grouped;
  }, [query, searchIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasResults = Object.keys(results).length > 0;

  function handleSelect(result: SearchResult) {
    setQuery("");
    setIsOpen(false);
    if (result.type === "district" && result.districtId) {
      onSelectDistrict(result.districtId);
    } else if (result.districtId) {
      onSelectConstituency(
        result.districtId,
        result.constituencyId || "",
        result.areaName
      );
    }
  }

  return (
    <div className="relative w-full max-w-lg mx-auto mb-6">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={
            lang === "en"
              ? "Search district, constituency, town, village..."
              : "மாவட்டம், தொகுதி, நகரம், கிராமம் தேடுங்கள்..."
          }
          className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[var(--color-border)] bg-white text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/50 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 shadow-sm"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-[var(--color-border)] rounded-xl shadow-lg z-40 max-h-72 overflow-y-auto"
        >
          {!hasResults ? (
            <p className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
              {lang === "en" ? "No results found" : "முடிவுகள் இல்லை"}
            </p>
          ) : (
            Object.entries(results).map(([type, items]) => (
              <div key={type}>
                <div className="px-3 py-1.5 bg-gray-50 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: typeColors[type] }}
                >
                  {typeLabels[type]} ({items.length})
                </div>
                {items.map((item, i) => (
                  <button
                    key={`${type}-${i}`}
                    onClick={() => handleSelect(item)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] truncate">
                      {item.sublabel}
                    </p>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
