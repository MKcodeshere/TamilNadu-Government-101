"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { sectorColors } from "@/lib/colors";
import budgetData from "@/data/budget-2025-26.json";
import type { BilingualText } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Map budget-file sectors to sectorColors keys where they differ */
const budgetSectorColorMap: Record<string, string> = {
  "Health & Family Welfare": sectorColors["Health & Family Welfare"] || "#E53935",
  Education: sectorColors.Education || "#1565C0",
  Infrastructure: sectorColors.Infrastructure || "#6D4C41",
  "Social Welfare": sectorColors["Social Welfare"] || "#7B1FA2",
  "Social Justice": "#6A1B9A",
  Agriculture: sectorColors.Agriculture || "#33691E",
  "Urban Development": sectorColors["Urban Development"] || "#00838F",
  "Rural Development": sectorColors["Rural Development"] || "#558B2F",
  Energy: sectorColors["Energy & Environment"] || "#F9A825",
  "Public Safety": sectorColors["Law & Order"] || "#283593",
  Industry: sectorColors.Industry || "#E65100",
  "Public Distribution": "#5D4037",
  "Cooperative Development": "#00695C",
  Other: sectorColors.Other || "#78909C",
};

function getSectorColor(sector: string): string {
  return (
    budgetSectorColorMap[sector] ||
    sectorColors[sector] ||
    sectorColors.Other ||
    "#78909C"
  );
}

function formatCrores(crores: number): string {
  if (crores >= 100000) return `${(crores / 100000).toFixed(2)}L Cr`;
  if (crores >= 1000) return `${(crores / 1000).toFixed(1)}K Cr`;
  return `${crores.toLocaleString()} Cr`;
}

function formatAmount(crores: number): string {
  return `${crores.toLocaleString()} Cr`;
}

/** Determine CSS grid span based on budget size relative to max */
function getGridSpan(total: number, maxTotal: number): { col: number; row: number } {
  const ratio = total / maxTotal;
  if (ratio > 0.7) return { col: 3, row: 2 };
  if (ratio > 0.4) return { col: 2, row: 2 };
  if (ratio > 0.2) return { col: 2, row: 1 };
  return { col: 1, row: 1 };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BudgetPage() {
  const { t, lang } = useLanguage();
  const [expenditureType, setExpenditureType] = useState<"total" | "revenue" | "capital">("total");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const items = budgetData.items;
  const maxTotal = Math.max(...items.map((i) => i.total));

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const valA = expenditureType === "revenue" ? a.revenue : expenditureType === "capital" ? a.capital : a.total;
      const valB = expenditureType === "revenue" ? b.revenue : expenditureType === "capital" ? b.capital : b.total;
      return valB - valA;
    });
  }, [items, expenditureType]);

  const top10 = sortedItems.slice(0, 10);
  const top10Max = top10.length > 0
    ? (expenditureType === "revenue" ? top10[0].revenue : expenditureType === "capital" ? top10[0].capital : top10[0].total)
    : 1;

  function getItemValue(item: (typeof items)[0]): number {
    if (expenditureType === "revenue") return item.revenue;
    if (expenditureType === "capital") return item.capital;
    return item.total;
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {lang === "en" ? "Where the Money Goes" : "பணம் எங்கே செல்கிறது"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] sm:text-base">
            {lang === "en"
              ? `Tamil Nadu Budget ${budgetData.year} — Total: ${formatCrores(budgetData.grandTotal)}`
              : `தமிழ்நாடு வரவு செலவு ${budgetData.year} — மொத்தம்: ${formatCrores(budgetData.grandTotal)}`}
          </p>
        </div>

        {/* Revenue / Capital / Total Toggle */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["total", "revenue", "capital"] as const).map((type) => {
            const labels = {
              total: { en: "Total", ta: "மொத்தம்" },
              revenue: { en: "Revenue", ta: "வருவாய்" },
              capital: { en: "Capital", ta: "மூலதனம்" },
            };
            const isActive = expenditureType === type;
            return (
              <button
                key={type}
                onClick={() => setExpenditureType(type)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  isActive
                    ? "bg-[var(--color-accent)] text-white"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                }`}
              >
                {lang === "en" ? labels[type].en : labels[type].ta}
              </button>
            );
          })}
        </div>

        {/* Treemap-like Budget Grid */}
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "Budget Allocation by Department" : "துறை வாரி நிதி ஒதுக்கீடு"}
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
            {sortedItems.map((item) => {
              const span = getGridSpan(item.total, maxTotal);
              const color = getSectorColor(item.sector);
              const value = getItemValue(item);
              const isHovered = hoveredItem === item.departmentId;
              return (
                <div
                  key={item.departmentId}
                  className="relative cursor-pointer overflow-hidden rounded-lg transition-all duration-200"
                  style={{
                    gridColumn: `span ${span.col}`,
                    gridRow: `span ${span.row}`,
                    backgroundColor: color,
                    opacity: hoveredItem && !isHovered ? 0.6 : 1,
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                  }}
                  onMouseEnter={() => setHoveredItem(item.departmentId)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex h-full min-h-[80px] flex-col justify-between p-2.5 sm:p-3">
                    <div>
                      <p className="text-xs font-semibold leading-tight text-white sm:text-sm">
                        {t(item.department)}
                      </p>
                      {lang === "en" && span.col >= 2 && (
                        <p className="mt-0.5 text-[10px] leading-tight text-white/70 font-tamil">
                          {item.department.ta}
                        </p>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-bold text-white sm:text-base">
                      {formatCrores(value)}
                    </p>
                  </div>
                  {/* Hover tooltip */}
                  {isHovered && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 px-3 py-2 text-[10px] text-white sm:text-xs">
                      <div className="flex justify-between">
                        <span>{lang === "en" ? "Revenue" : "வருவாய்"}</span>
                        <span>{formatAmount(item.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === "en" ? "Capital" : "மூலதனம்"}</span>
                        <span>{formatAmount(item.capital)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>{lang === "en" ? "Total" : "மொத்தம்"}</span>
                        <span>{formatAmount(item.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 10 Bar Chart */}
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "Top 10 Departments by Budget" : "நிதி ஒதுக்கீட்டில் முதல் 10 துறைகள்"}
          </h2>
          <div className="space-y-3">
            {top10.map((item, idx) => {
              const value = getItemValue(item);
              const percentage = ((value / budgetData.grandTotal) * 100).toFixed(1);
              const barWidth = (value / top10Max) * 100;
              const color = getSectorColor(item.sector);
              return (
                <div key={item.departmentId}>
                  <div className="mb-1 flex items-baseline justify-between text-xs sm:text-sm">
                    <span className="font-medium text-[var(--color-text)]">
                      <span className="mr-2 text-[var(--color-text-secondary)]">{idx + 1}.</span>
                      {t(item.department)}
                    </span>
                    <span className="shrink-0 pl-2 text-[var(--color-text-secondary)]">
                      {formatCrores(value)}{" "}
                      <span className="text-[10px]">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-5 w-full overflow-hidden rounded-full bg-[var(--color-border)]/30">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: { en: "Revenue Expenditure", ta: "வருவாய் செலவு" },
              value: budgetData.totalRevenue,
              color: "#1565C0",
            },
            {
              label: { en: "Capital Expenditure", ta: "மூலதன செலவு" },
              value: budgetData.totalCapital,
              color: "#2E7D32",
            },
            {
              label: { en: "Grand Total", ta: "மொத்த தொகை" },
              value: budgetData.grandTotal,
              color: "#C84B31",
            },
          ].map((stat) => (
            <div
              key={stat.label.en}
              className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
              style={{ borderTopColor: stat.color, borderTopWidth: "3px" }}
            >
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] sm:text-sm">
                {lang === "en" ? stat.label.en : stat.label.ta}
              </p>
              <p className="mt-2 text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                {formatCrores(stat.value)}
              </p>
              <p className="mt-1 text-[10px] text-[var(--color-text-secondary)] sm:text-xs">
                {formatAmount(stat.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Fiscal note */}
        <p className="mt-8 text-center text-[10px] text-[var(--color-text-secondary)] sm:text-xs">
          {lang === "en"
            ? `Fiscal deficit: ${budgetData.fiscalDeficitPercent}% of GSDP. ${budgetData.note}`
            : `நிதிப் பற்றாக்குறை: GSDP-யின் ${budgetData.fiscalDeficitPercent}%. அனைத்து எண்களும் கோடிகளில்.`}
        </p>
      </div>
    </div>
  );
}
