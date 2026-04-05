"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import districts from "@/data/districts.json";
import constituenciesData from "@/data/constituencies.json";
import localBodies from "@/data/local-bodies.json";
import type { BilingualText, Constituency } from "@/lib/types";
import DistrictSearch from "@/components/districts/DistrictSearch";
import ConstituencyCard from "@/components/districts/ConstituencyCard";

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export default function DistrictsPage() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);
  const [highlightedConstituency, setHighlightedConstituency] = useState<string | null>(null);
  const [highlightTerm, setHighlightTerm] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Read URL params on mount (from home page search navigation)
  useEffect(() => {
    const districtParam = searchParams.get("district");
    const constituencyParam = searchParams.get("constituency");
    const highlightParam = searchParams.get("highlight");

    if (districtParam) {
      setExpandedDistrict(districtParam);
      if (constituencyParam) setHighlightedConstituency(constituencyParam);
      if (highlightParam) setHighlightTerm(highlightParam);
      setTimeout(() => expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [searchParams]);

  const handleSelectDistrict = useCallback((districtId: string) => {
    setExpandedDistrict(districtId);
    setHighlightedConstituency(null);
    setHighlightTerm(null);
    setTimeout(() => expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  }, []);

  const handleSelectConstituency = useCallback((districtId: string, constituencyId: string, term?: string) => {
    setExpandedDistrict(districtId);
    setHighlightedConstituency(constituencyId);
    setHighlightTerm(term || null);
    setTimeout(() => expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  }, []);

  const expandedData = expandedDistrict
    ? districts.find((d) => d.id === expandedDistrict)
    : null;

  const expandedConstituencies: Constituency[] = expandedData
    ? (constituenciesData as Constituency[]).filter(
        (c) => c.district.toLowerCase() === expandedData.name.en.toLowerCase()
      )
    : [];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {lang === "en"
              ? "38 Districts of Tamil Nadu"
              : "தமிழ்நாட்டின் 38 மாவட்டங்கள்"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] sm:text-base">
            {lang === "en"
              ? "Search by village, town, constituency, or district name to find your area"
              : "உங்கள் பகுதியைக் கண்டறிய கிராமம், நகரம், தொகுதி அல்லது மாவட்ட பெயரால் தேடுங்கள்"}
          </p>
        </div>

        {/* Full Search */}
        <DistrictSearch
          onSelectDistrict={handleSelectDistrict}
          onSelectConstituency={handleSelectConstituency}
        />

        {/* Expanded District Detail */}
        {expandedData && (
          <div
            ref={expandedRef}
            className="mb-6 rounded-xl border border-[var(--color-border)] bg-white shadow-md overflow-hidden"
          >
            {/* District Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100" style={{ backgroundColor: "#C84B3108" }}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">{t(expandedData.name)}</h2>
                  {lang === "en" && (
                    <p className="text-sm text-[var(--color-text-secondary)] font-tamil">{expandedData.name.ta}</p>
                  )}
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {lang === "en" ? "HQ" : "தலைமையகம்"}: {t(expandedData.headquarters)}
                  </p>
                </div>
                <button
                  onClick={() => { setExpandedDistrict(null); setHighlightedConstituency(null); }}
                  className="text-sm text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-white/80 px-3 py-2 border border-gray-100">
                  <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">{lang === "en" ? "Population" : "மக்கள்"}</p>
                  <p className="text-sm font-bold text-[var(--color-text)]">{formatNumber(expandedData.population || 0)}</p>
                </div>
                <div className="rounded-lg bg-white/80 px-3 py-2 border border-gray-100">
                  <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">{lang === "en" ? "Area" : "பரப்பளவு"}</p>
                  <p className="text-sm font-bold text-[var(--color-text)]">{formatNumber(expandedData.area)} {lang === "en" ? "sq km" : "ச.கி.மீ"}</p>
                </div>
                <div className="rounded-lg bg-white/80 px-3 py-2 border border-gray-100">
                  <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">{lang === "en" ? "Taluks" : "தாலுகாக்கள்"}</p>
                  <p className="text-sm font-bold text-[var(--color-text)]">{expandedData.taluks}</p>
                </div>
                <div className="rounded-lg bg-white/80 px-3 py-2 border border-gray-100">
                  <p className="text-[10px] text-[var(--color-text-secondary)] uppercase">{lang === "en" ? "Local Bodies" : "உள்ளாட்சி"}</p>
                  <div className="flex gap-1 mt-0.5">
                    <span className="px-1 py-0.5 rounded text-[9px] bg-blue-50 text-blue-700">{expandedData.municipalCorporations} Corp</span>
                    <span className="px-1 py-0.5 rounded text-[9px] bg-green-50 text-green-700">{expandedData.municipalities} Muni</span>
                    <span className="px-1 py-0.5 rounded text-[9px] bg-amber-50 text-amber-700">{expandedData.townPanchayats} TP</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/districts/${expandedData.id}`}
                className="mt-3 inline-flex text-xs font-medium hover:underline"
                style={{ color: "#C84B31" }}
              >
                {lang === "en" ? "View full district page" : "முழு மாவட்ட பக்கம்"} →
              </Link>
            </div>

            {/* Constituencies */}
            <div className="p-4 sm:p-5">
              <h3 className="text-base font-semibold text-[var(--color-text)] mb-3">
                {lang === "en" ? "Constituencies" : "தொகுதிகள்"}{" "}
                <span className="text-[var(--color-text-secondary)] font-normal">({expandedConstituencies.length})</span>
              </h3>
              {expandedConstituencies.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {lang === "en" ? "No constituency data for this district" : "இந்த மாவட்டத்திற்கு தொகுதி தரவு இல்லை"}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {expandedConstituencies
                    .sort((a, b) => a.number - b.number)
                    .map((c) => (
                      <ConstituencyCard
                        key={c.id}
                        constituency={c}
                        isHighlighted={highlightedConstituency === c.id}
                        highlightTerm={highlightedConstituency === c.id ? highlightTerm || undefined : undefined}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* District cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((district) => (
            <DistrictCard
              key={district.id}
              district={district}
              isExpanded={expandedDistrict === district.id}
              onExpand={() => handleSelectDistrict(district.id)}
            />
          ))}
        </div>

        {/* Local Government Explainer */}
        <LocalGovernmentExplainer />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  District Card                                                      */
/* ------------------------------------------------------------------ */

interface DistrictData {
  id: string;
  name: BilingualText;
  headquarters: BilingualText;
  population: number;
  area: number;
  taluks: number;
  constituencies: string[];
  municipalCorporations: number;
  municipalities: number;
  townPanchayats: number;
  panchayatUnions: number;
  villagePanchayats: number;
}

function DistrictCard({
  district,
  isExpanded,
  onExpand,
}: {
  district: DistrictData;
  isExpanded: boolean;
  onExpand: () => void;
}) {
  const { t, lang } = useLanguage();

  // Count constituencies for this district
  const constCount = (constituenciesData as Constituency[]).filter(
    (c) => c.district.toLowerCase() === district.name.en.toLowerCase()
  ).length;

  return (
    <div
      onClick={onExpand}
      className={`group flex flex-col rounded-xl border bg-white shadow-sm transition-all cursor-pointer hover:shadow-md ${
        isExpanded
          ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20"
          : "border-[var(--color-border)] hover:border-[var(--color-accent)]/40"
      }`}
      style={{ borderTopColor: "#C84B31", borderTopWidth: "3px" }}
    >
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] sm:text-base">
          {t(district.name)}
        </h3>
        {lang === "en" && (
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] font-tamil">
            {district.name.ta}
          </p>
        )}

        <div className="mt-2 text-xs text-[var(--color-text-secondary)]">
          <span className="font-medium">{lang === "en" ? "HQ:" : "தலைமையகம்:"}</span> {t(district.headquarters)}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-[var(--color-bg)] px-2 py-1.5">
            <span className="block text-[10px] text-[var(--color-text-secondary)]">
              {lang === "en" ? "Population" : "மக்கள்தொகை"}
            </span>
            <span className="font-semibold text-[var(--color-text)]">{formatNumber(district.population)}</span>
          </div>
          <div className="rounded-md bg-[var(--color-bg)] px-2 py-1.5">
            <span className="block text-[10px] text-[var(--color-text-secondary)]">
              {lang === "en" ? "Area (sq km)" : "பரப்பளவு"}
            </span>
            <span className="font-semibold text-[var(--color-text)]">{formatNumber(district.area)}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
          <span>{district.taluks} {lang === "en" ? "Taluks" : "தாலுகாக்கள்"}</span>
          <span className="text-[var(--color-border)]">|</span>
          <span>{constCount} {lang === "en" ? "Constituencies" : "தொகுதிகள்"}</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[var(--color-border)]/50 mt-3">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)]">
            {lang === "en" ? "Local Bodies" : "உள்ளாட்சி"}
          </span>
          <div className="flex items-center gap-2 text-xs">
            {district.municipalCorporations > 0 && (
              <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700">
                {district.municipalCorporations} Corp
              </span>
            )}
            {district.municipalities > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                {district.municipalities} Mun
              </span>
            )}
            {district.townPanchayats > 0 && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                {district.townPanchayats} TP
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Local Government Explainer                                         */
/* ------------------------------------------------------------------ */

function LocalGovernmentExplainer() {
  const { lang } = useLanguage();

  return (
    <section className="mt-12 rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-8">
      <h2 className="mb-6 text-lg font-bold text-[var(--color-text)] sm:text-xl">
        {lang === "en" ? "Local Government Structure" : "உள்ளாட்சி அரசு அமைப்பு"}
      </h2>
      <div className="rounded-lg bg-[var(--color-bg)] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
          {lang === "en" ? "Total Counts" : "மொத்த எண்ணிக்கை"}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { count: localBodies.municipalCorporations.count, label: { en: "Corporations", ta: "மாநகராட்சிகள்" } },
            { count: localBodies.municipalities.count, label: { en: "Municipalities", ta: "நகராட்சிகள்" } },
            { count: localBodies.townPanchayats.count, label: { en: "Town Panchayats", ta: "பேரூராட்சிகள்" } },
            { count: localBodies.districtPanchayats.count, label: { en: "District Panchayats", ta: "மாவட்ட பஞ்சாயத்துக்கள்" } },
            { count: localBodies.panchayatUnions.count, label: { en: "Panchayat Unions", ta: "பஞ்சாயத்து ஒன்றியங்கள்" } },
            { count: localBodies.villagePanchayats.count, label: { en: "Village Panchayats", ta: "கிராம பஞ்சாயத்துக்கள்" } },
          ].map((item) => (
            <div key={item.label.en}>
              <p className="text-lg font-bold text-[var(--color-text)]">{formatNumber(item.count)}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {lang === "en" ? item.label.en : item.label.ta}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-[var(--color-border)]/50 pt-3 text-sm">
          <span className="font-semibold text-[var(--color-text)]">
            {lang === "en" ? "Total Local Bodies:" : "மொத்த உள்ளாட்சி அமைப்புகள்:"}{" "}
          </span>
          <span className="font-bold text-[var(--color-accent)]">
            {formatNumber(localBodies.summary.totalLocalBodies)}
          </span>
        </div>
      </div>
    </section>
  );
}
