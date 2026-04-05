"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { sectorColors } from "@/lib/colors";
import departments from "@/data/departments.json";
import type { BilingualText } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const allSectors = Array.from(
  new Set(departments.map((d) => d.sector))
).sort();

function formatBudget(crores: number): string {
  if (crores >= 10000) return `${(crores / 1000).toFixed(1)}K Cr`;
  return `${crores.toLocaleString()} Cr`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DepartmentsPage() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return departments.filter((d) => {
      const matchesSector = activeSector ? d.sector === activeSector : true;
      const matchesSearch = search
        ? d.name.en.toLowerCase().includes(search.toLowerCase()) ||
          d.name.ta.includes(search) ||
          d.minister.name.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesSector && matchesSearch;
    });
  }, [search, activeSector]);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {lang === "en"
              ? "Government Departments"
              : "அரசுத் துறைகள்"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] sm:text-base">
            {lang === "en"
              ? `${departments.length} departments across ${allSectors.length} sectors`
              : `${allSectors.length} துறைப்பிரிவுகளில் ${departments.length} துறைகள்`}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "en"
                  ? "Search departments or ministers..."
                  : "துறைகள் அல்லது அமைச்சர்களைத் தேடு..."
              }
              className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]/60 focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] sm:max-w-md"
            />
          </div>

          {/* Sector filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSector(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                activeSector === null
                  ? "bg-[var(--color-accent)] text-white"
                  : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              {lang === "en" ? "All" : "அனைத்தும்"}
            </button>
            {allSectors.map((sector) => {
              const color = sectorColors[sector] || sectorColors.Other;
              const isActive = activeSector === sector;
              return (
                <button
                  key={sector}
                  onClick={() =>
                    setActiveSector(isActive ? null : sector)
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                    isActive
                      ? "text-white"
                      : "border border-[var(--color-border)] bg-white hover:text-white"
                  }`}
                  style={{
                    backgroundColor: isActive ? color : undefined,
                    borderColor: isActive ? color : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = color;
                      e.currentTarget.style.borderColor = color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.borderColor = "";
                    }
                  }}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-xs text-[var(--color-text-secondary)] sm:text-sm">
          {lang === "en"
            ? `Showing ${filtered.length} of ${departments.length} departments`
            : `${departments.length} துறைகளில் ${filtered.length} காட்டப்படுகிறது`}
        </p>

        {/* Department cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dept) => (
            <DepartmentCard key={dept.id} dept={dept} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-[var(--color-text-secondary)]">
            {lang === "en"
              ? "No departments match your search."
              : "உங்கள் தேடலுக்குப் பொருந்தும் துறைகள் இல்லை."}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Department Card                                                    */
/* ------------------------------------------------------------------ */

interface DeptData {
  id: string;
  name: BilingualText;
  sector: string;
  minister: { name: string; constituency?: string; party: string };
  budget: { total: number; year: string };
}

function DepartmentCard({ dept }: { dept: DeptData }) {
  const { t, lang } = useLanguage();
  const sectorColor = sectorColors[dept.sector] || sectorColors.Other;

  return (
    <Link
      href={`/departments/${dept.id}`}
      className="group flex flex-col rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-all hover:shadow-md hover:border-[var(--color-accent)]/40"
      style={{ borderTopColor: sectorColor, borderTopWidth: "3px" }}
    >
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Sector badge */}
        <span
          className="mb-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white sm:text-xs"
          style={{ backgroundColor: sectorColor }}
        >
          {dept.sector}
        </span>

        {/* Department name */}
        <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] sm:text-base">
          {t(dept.name)}
        </h3>
        {lang === "en" && (
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] font-tamil">
            {dept.name.ta}
          </p>
        )}

        {/* Minister */}
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-text-secondary)] sm:text-sm">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="truncate">
            {dept.minister.name}
            <span className="ml-1 opacity-60">({dept.minister.party})</span>
          </span>
        </div>

        {/* Budget */}
        <div className="mt-auto pt-3 flex items-baseline justify-between border-t border-[var(--color-border)]/50 mt-4">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] sm:text-xs">
            {lang === "en" ? "Budget" : "நிதி"} {dept.budget.year}
          </span>
          <span className="text-sm font-bold text-[var(--color-text)] sm:text-base">
            {formatBudget(dept.budget.total)}
          </span>
        </div>
      </div>
    </Link>
  );
}
