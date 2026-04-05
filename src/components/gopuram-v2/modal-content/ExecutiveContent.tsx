"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import executiveData from "@/data/executive.json";

export default function ExecutiveContent() {
  const { lang } = useLanguage();

  const cm = executiveData.chiefMinister;
  const dcm = executiveData.deputyChiefMinister;
  const ministers = executiveData.ministers.slice(2, 12); // top 10 after CM/DCM

  return (
    <div className="space-y-5">
      {/* CM Card */}
      <div className="rounded-xl border-2 border-[#FFD700] bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👑</span>
          <div>
            <p className="text-xs font-medium text-[#B8860B] uppercase tracking-wider">
              {lang === "en" ? "Chief Minister" : "முதலமைச்சர்"}
            </p>
            <h3
              className="font-bold text-[var(--color-text)]"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)" }}
            >
              {cm.name}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {cm.party} · {cm.constituency} · {lang === "en" ? `Since ${cm.since.slice(0, 4)}` : `${cm.since.slice(0, 4)} முதல்`}
            </p>
          </div>
        </div>
      </div>

      {/* DCM Card */}
      <div className="rounded-xl border border-[#FFD700]/50 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="text-xs font-medium text-[#B8860B] uppercase tracking-wider">
              {lang === "en" ? "Deputy Chief Minister" : "துணை முதலமைச்சர்"}
            </p>
            <h3 className="font-bold text-[var(--color-text)]" style={{ fontSize: "1.1rem" }}>
              {dcm.name}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {dcm.party} · {dcm.constituency}
            </p>
          </div>
        </div>
      </div>

      {/* Minister Grid */}
      <div>
        <h4
          className="text-sm font-semibold text-[var(--color-text)] mb-3 uppercase tracking-wider"
          style={{ fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)" }}
        >
          {lang === "en" ? "Council of Ministers" : "அமைச்சரவை"}
        </h4>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {ministers.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm hover:shadow-md hover:border-[#FFD700]/40 transition-all"
            >
              <p
                className="font-semibold text-[var(--color-text)] truncate"
                style={{ fontSize: "0.8rem" }}
              >
                {m.name}
              </p>
              <p
                className="text-[var(--color-text-secondary)] truncate mt-0.5"
                style={{
                  fontSize: "0.7rem",
                  fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)",
                }}
              >
                {lang === "en" ? m.title.en : m.title.ta}
              </p>
              <p className="text-[0.6rem] text-[var(--color-text-secondary)] mt-1 opacity-70">
                {m.party} · {m.constituency}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
