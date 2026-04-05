"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import districts from "@/data/districts.json";
import type { BilingualText } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DistrictDetailPage() {
  const params = useParams<{ id: string }>();
  const { t, lang } = useLanguage();

  const district = districts.find((d) => d.id === params.id);

  if (!district) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {lang === "en" ? "District not found" : "\u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD \u0B95\u0BBE\u0BA3\u0BAA\u0BCD\u0BAA\u0B9F\u0BB5\u0BBF\u0BB2\u0BCD\u0BB2\u0BC8"}
        </h1>
        <Link
          href="/districts"
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent)]/90"
        >
          {lang === "en" ? "Back to Districts" : "\u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0BA4\u0BCD \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BCD\u0BAA\u0BC1"}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Back button */}
        <Link
          href="/districts"
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
          {lang === "en" ? "All Districts" : "\u0B85\u0BA9\u0BC8\u0BA4\u0BCD\u0BA4\u0BC1 \u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0BAE\u0BCD"}
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl lg:text-4xl">
            {t(district.name)}
          </h1>
          {lang === "en" && (
            <p className="mt-1 text-base text-[var(--color-text-secondary)] font-tamil sm:text-lg">
              {district.name.ta}
            </p>
          )}
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {lang === "en" ? "Headquarters:" : "\u0BA4\u0BB2\u0BC8\u0BAE\u0BC8\u0BAF\u0BAE\u0BCD:"}{" "}
            <span className="font-medium text-[var(--color-text)]">
              {t(district.headquarters)}
            </span>
          </p>
        </header>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label={lang === "en" ? "Area" : "\u0BAA\u0BB0\u0BAA\u0BCD\u0BAA\u0BB3\u0BB5\u0BC1"}
            value={`${formatNumber(district.area)} sq km`}
          />
          <StatCard
            label={lang === "en" ? "Population" : "\u0BAE\u0B95\u0BCD\u0B95\u0BB3\u0BCD\u0BA4\u0BCA\u0B95\u0BC8"}
            value={formatNumber(district.population)}
          />
          <StatCard
            label={lang === "en" ? "Taluks" : "\u0BA4\u0BBE\u0BB2\u0BC1\u0B95\u0BBE\u0B95\u0BCD\u0B95\u0BB3\u0BCD"}
            value={String(district.taluks)}
          />
          <StatCard
            label={lang === "en" ? "Revenue Divisions" : "\u0BB5\u0BB0\u0BC1\u0BB5\u0BBE\u0BAF\u0BCD \u0BAA\u0BBF\u0BB0\u0BBF\u0BB5\u0BC1\u0B95\u0BB3\u0BCD"}
            value={String(district.revenueDivisions)}
          />
        </div>

        {/* Local Bodies Breakdown */}
        <section className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {lang === "en" ? "Local Bodies" : "\u0B89\u0BB3\u0BCD\u0BB3\u0BBE\u0B9F\u0BCD\u0B9A\u0BBF \u0B85\u0BAE\u0BC8\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD"}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <LocalBodyItem
              label={lang === "en" ? "Municipal Corporations" : "\u0BAE\u0BBE\u0BA8\u0B95\u0BB0\u0BBE\u0B9F\u0BCD\u0B9A\u0BBF\u0B95\u0BB3\u0BCD"}
              count={district.municipalCorporations}
              color="bg-purple-100 text-purple-700"
            />
            <LocalBodyItem
              label={lang === "en" ? "Municipalities" : "\u0BA8\u0B95\u0BB0\u0BBE\u0B9F\u0BCD\u0B9A\u0BBF\u0B95\u0BB3\u0BCD"}
              count={district.municipalities}
              color="bg-blue-100 text-blue-700"
            />
            <LocalBodyItem
              label={lang === "en" ? "Town Panchayats" : "\u0BAA\u0BC7\u0BB0\u0BC2\u0BB0\u0BBE\u0B9F\u0BCD\u0B9A\u0BBF\u0B95\u0BB3\u0BCD"}
              count={district.townPanchayats}
              color="bg-teal-100 text-teal-700"
            />
            <LocalBodyItem
              label={lang === "en" ? "Panchayat Unions" : "\u0BAA\u0B9E\u0BCD\u0B9A\u0BBE\u0BAF\u0BA4\u0BCD\u0BA4\u0BC1 \u0B92\u0BA9\u0BCD\u0BB1\u0BBF\u0BAF\u0B99\u0BCD\u0B95\u0BB3\u0BCD"}
              count={district.panchayatUnions}
              color="bg-orange-100 text-orange-700"
            />
            <LocalBodyItem
              label={lang === "en" ? "Village Panchayats" : "\u0B95\u0BBF\u0BB0\u0BBE\u0BAE \u0BAA\u0B9E\u0BCD\u0B9A\u0BBE\u0BAF\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD"}
              count={district.villagePanchayats}
              color="bg-green-100 text-green-700"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--color-text)] sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function LocalBodyItem({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-[var(--color-bg)] p-3">
      <p className={`inline-flex rounded-full px-2 py-0.5 text-sm font-bold ${color}`}>
        {count}
      </p>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{label}</p>
    </div>
  );
}
