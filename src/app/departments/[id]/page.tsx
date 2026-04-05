"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { sectorColors } from "@/lib/colors";
import departments from "@/data/departments.json";
import type { BilingualText } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCrores(amount: number): string {
  if (amount >= 10000) return `${(amount / 1000).toFixed(1)}K Cr`;
  return `${amount.toLocaleString()} Cr`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DepartmentDetailPage() {
  const params = useParams<{ id: string }>();
  const { t, lang } = useLanguage();

  const dept = departments.find((d) => d.id === params.id);

  if (!dept) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {lang === "en" ? "Department not found" : "துறை காணப்படவில்லை"}
        </h1>
        <Link
          href="/departments"
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]/90"
        >
          {lang === "en" ? "Back to Departments" : "துறைகளுக்குத் திரும்பு"}
        </Link>
      </div>
    );
  }

  const sectorColor = sectorColors[dept.sector] || sectorColors.Other;
  const totalBudget = dept.budget.total;
  const revenuePct =
    totalBudget > 0 ? (dept.budget.revenue / totalBudget) * 100 : 0;
  const capitalPct =
    totalBudget > 0 ? (dept.budget.capital / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back button */}
        <Link
          href="/departments"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          {lang === "en" ? "All Departments" : "அனைத்து துறைகளும்"}
        </Link>

        {/* Header */}
        <header className="mb-8">
          <span
            className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white sm:text-sm"
            style={{ backgroundColor: sectorColor }}
          >
            {dept.sector}
          </span>
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl lg:text-4xl">
            {t(dept.name)}
          </h1>
          {lang === "en" && (
            <p className="mt-1 text-base text-[var(--color-text-secondary)] font-tamil sm:text-lg">
              {dept.name.ta}
            </p>
          )}
          <p className="mt-3 text-sm text-[var(--color-text-secondary)] sm:text-base">
            {t(dept.description)}
          </p>
        </header>

        {/* Minister + Secretary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {/* Minister card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {lang === "en" ? "Minister" : "அமைச்சர்"}
            </h2>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {dept.minister.name}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)]">
                {dept.minister.party}
              </span>
              {dept.minister.constituency && (
                <span className="inline-flex items-center rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs text-[var(--color-text-secondary)]">
                  {dept.minister.constituency}
                </span>
              )}
            </div>
          </div>

          {/* Secretary card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {lang === "en" ? "Secretary" : "செயலாளர்"}
            </h2>
            <p className="text-lg font-bold text-[var(--color-text)]">
              {dept.secretary}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {lang === "en" ? "Indian Administrative Service" : "இந்திய நிர்வாக சேவை"}
            </p>
          </div>
        </div>

        {/* Budget section */}
        <section className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {lang === "en"
              ? `Budget ${dept.budget.year}`
              : `நிதி ஒதுக்கீடு ${dept.budget.year}`}
          </h2>

          {/* Total */}
          <p className="mb-4 text-3xl font-bold text-[var(--color-text)]">
            {formatCrores(totalBudget)}
            <span className="ml-2 text-base font-normal text-[var(--color-text-secondary)]">
              {lang === "en" ? "Total" : "மொத்தம்"}
            </span>
          </p>

          {/* Bar chart */}
          <div className="space-y-3">
            {/* Revenue */}
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {lang === "en" ? "Revenue Expenditure" : "வருவாய்ச் செலவு"}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {formatCrores(dept.budget.revenue)}
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-[var(--color-border)]/30">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${revenuePct}%`,
                    backgroundColor: sectorColor,
                  }}
                />
              </div>
            </div>

            {/* Capital */}
            <div>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {lang === "en" ? "Capital Expenditure" : "மூலதனச் செலவு"}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text)]">
                  {formatCrores(dept.budget.capital)}
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-[var(--color-border)]/30">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${capitalPct}%`,
                    backgroundColor: sectorColor,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Agencies */}
        {dept.agencies.length > 0 && (
          <section className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {lang === "en"
                ? `Agencies & Bodies (${dept.agencies.length})`
                : `நிறுவனங்கள் (${dept.agencies.length})`}
            </h2>
            <div className="flex flex-wrap gap-2">
              {dept.agencies.map((agency, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs text-[var(--color-text)] sm:text-sm"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: sectorColor }}
                  />
                  {t(agency.name)}
                  <span className="text-[10px] text-[var(--color-text-secondary)]">
                    ({agency.type})
                  </span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Key Schemes */}
        {dept.keySchemes.length > 0 && (
          <section className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {lang === "en"
                ? `Key Schemes (${dept.keySchemes.length})`
                : `முக்கிய திட்டங்கள் (${dept.keySchemes.length})`}
            </h2>
            <div className="space-y-4">
              {dept.keySchemes.map((scheme, i) => (
                <div
                  key={i}
                  className="rounded-lg border-l-3 border-l-[var(--color-accent)] bg-[var(--color-bg)] p-4"
                  style={{ borderLeftColor: sectorColor }}
                >
                  <h3 className="text-sm font-semibold text-[var(--color-text)] sm:text-base">
                    {t(scheme.name)}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                    {t(scheme.description)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
