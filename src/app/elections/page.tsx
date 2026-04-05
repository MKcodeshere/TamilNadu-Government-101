"use client";

import { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors } from "@/lib/colors";
import constituencies from "@/data/constituencies.json";
import alliances from "@/data/alliances-2026.json";
import type { BilingualText } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const partyColorMap: Record<string, string> = {};
alliances.forEach((a) => {
  a.parties.forEach((p) => {
    partyColorMap[p.shortName] = p.color;
  });
});
partyColorMap["IND"] = gopuramColors.independent;

function getPartyColor(party: string): string {
  return partyColorMap[party] || gopuramColors.others;
}

// Group constituencies by party, sorted by seat count desc
function groupByParty() {
  const groups: Record<string, typeof constituencies> = {};
  for (const c of constituencies) {
    const party = c.currentMla.party;
    if (!groups[party]) groups[party] = [];
    groups[party].push(c);
  }
  return Object.entries(groups).sort(([, a], [, b]) => b.length - a.length);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ElectionsPage() {
  const { t, lang } = useLanguage();

  const partyGroups = useMemo(() => groupByParty(), []);

  const totalGeneral = constituencies.filter((c) => c.type === "general").length;
  const totalSC = constituencies.filter((c) => c.type === "sc").length;
  const totalST = constituencies.filter((c) => c.type === "st").length;

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {lang === "en" ? "Tamil Nadu Elections 2026" : "தமிழ்நாடு தேர்தல் 2026"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] sm:text-base">
            {lang === "en" ? "April 23 | Counting: May 4" : "ஏப்ரல் 23 | வாக்கு எண்ணிக்கை: மே 4"}
          </p>
        </div>

        {/* Alliance Breakdown */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "Alliance Breakdown" : "கூட்டணி விவரங்கள்"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alliances.map((alliance) => (
              <div
                key={alliance.id}
                className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden"
                style={{ borderTopColor: alliance.color, borderTopWidth: "4px" }}
              >
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-bold text-[var(--color-text)] sm:text-base">
                    {alliance.shortName}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">{t(alliance.name)}</p>
                  <div className="mt-3 space-y-1.5">
                    {alliance.parties.map((party) => (
                      <div key={party.shortName} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                          <span className="text-[var(--color-text)]">{party.shortName}</span>
                        </div>
                        <span className="text-[var(--color-text-secondary)]">
                          {party.seats} {lang === "en" ? "seats" : "இடங்கள்"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-[var(--color-border)]/50 pt-2 flex justify-between text-xs font-semibold">
                    <span className="text-[var(--color-text-secondary)]">{lang === "en" ? "Total" : "மொத்தம்"}</span>
                    <span className="text-[var(--color-text)]">{alliance.totalSeats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constituency Stats */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "Constituency Statistics" : "தொகுதி புள்ளிவிவரங்கள்"}
          </h2>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: { en: "Total", ta: "மொத்தம்" }, value: 234, color: "#1A1A2E" },
              { label: { en: "General", ta: "பொது" }, value: totalGeneral, color: gopuramColors.general },
              { label: { en: "SC Reserved", ta: "SC ஒதுக்கீடு" }, value: totalSC, color: gopuramColors.sc },
              { label: { en: "ST Reserved", ta: "ST ஒதுக்கீடு" }, value: totalST, color: gopuramColors.st },
            ].map((stat) => (
              <div key={stat.label.en} className="rounded-lg border border-[var(--color-border)] bg-white p-3 text-center shadow-sm">
                <p className="text-2xl font-bold sm:text-3xl" style={{ color: stat.color }}>{stat.value}</p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                  {lang === "en" ? stat.label.en : stat.label.ta}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Constituencies Grouped by Party */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "Constituencies by Party (Current MLAs)" : "கட்சி வாரி தொகுதிகள் (தற்போதைய எம்.எல்.ஏ.)"}
          </h2>

          {partyGroups.map(([party, seats]) => {
            const color = getPartyColor(party);
            return (
              <div key={party} className="mb-6">
                {/* Party header */}
                <div className="flex items-center gap-3 mb-3 sticky top-16 z-10 bg-[#FFFBF0]/95 backdrop-blur-sm py-2">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <h3 className="text-base font-bold text-[var(--color-text)] sm:text-lg">{party}</h3>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: color }}>
                    {seats.length} {lang === "en" ? "seats" : "இடங்கள்"}
                  </span>
                </div>

                {/* Constituency cards */}
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {seats
                    .sort((a, b) => a.number - b.number)
                    .map((c) => {
                      const typeLabel = c.type === "sc" ? "SC" : c.type === "st" ? "ST" : "";
                      return (
                        <div
                          key={c.id}
                          className="rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                          style={{ borderLeftColor: color, borderLeftWidth: "3px" }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">#{c.number}</span>
                            {typeLabel && (
                              <span
                                className="rounded px-1 py-0.5 text-[8px] font-bold text-white"
                                style={{ backgroundColor: c.type === "sc" ? gopuramColors.sc : gopuramColors.st }}
                              >
                                {typeLabel}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-[var(--color-text)] leading-tight">{t(c.name)}</h4>
                          <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                            {c.currentMla.name} · {c.district}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Government Formation Explainer */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "How Government Forms" : "அரசு எவ்வாறு அமைகிறது"}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { en: "Election", ta: "தேர்தல்", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { en: "Counting", ta: "வாக்கு எண்ணிக்கை", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" },
              { en: "Majority (118+)", ta: "பெரும்பான்மை (118+)", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
              { en: "Governor Invites", ta: "ஆளுநர் அழைப்பு", icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" },
              { en: "CM Sworn In", ta: "முதலமைச்சர் பதவியேற்பு", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
            ].map((step, idx, arr) => (
              <div key={step.en} className="flex items-center gap-2">
                <div className="flex flex-col items-center rounded-lg border border-[var(--color-border)] bg-white p-3 shadow-sm text-center w-28 sm:w-32">
                  <svg className="h-6 w-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                  <span className="mt-1 text-[10px] font-medium text-[var(--color-text)] sm:text-xs">
                    {lang === "en" ? step.en : step.ta}
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <svg className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
