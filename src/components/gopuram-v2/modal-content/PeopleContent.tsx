"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function PeopleContent() {
  const { lang } = useLanguage();

  const stats = [
    { value: "~8 Cr", label: lang === "en" ? "Population" : "மக்கள்தொகை", icon: "👥" },
    { value: "5.67 Cr", label: lang === "en" ? "Registered Voters" : "பதிவு செய்த வாக்காளர்கள்", icon: "🗳️" },
    { value: "234", label: lang === "en" ? "Constituencies" : "தொகுதிகள்", icon: "📍" },
    { value: "Apr 23", label: lang === "en" ? "Election Day 2026" : "தேர்தல் நாள் 2026", icon: "📅" },
  ];

  return (
    <div className="space-y-5">
      <p
        className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
        style={{ fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)" }}
      >
        {lang === "en"
          ? "In a democracy, power flows from the people. The citizens of Tamil Nadu elect 234 MLAs who form the Legislative Assembly, which in turn forms the government. The entire machinery of state serves the people."
          : "ஜனநாயகத்தில், அதிகாரம் மக்களிடமிருந்து வருகிறது. தமிழ்நாட்டு குடிமக்கள் 234 சட்டமன்ற உறுப்பினர்களைத் தேர்ந்தெடுக்கிறார்கள்."}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--color-border)] bg-white p-4 text-center shadow-sm"
          >
            <span className="text-xl">{s.icon}</span>
            <p className="font-bold text-[#1B5E20] mt-1" style={{ fontSize: "1.3rem" }}>
              {s.value}
            </p>
            <p
              className="text-xs text-[var(--color-text-secondary)] mt-0.5"
              style={{ fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center space-y-2">
        <Link
          href="/elections"
          className="inline-flex items-center gap-2 rounded-full bg-[#1B5E20] text-white px-5 py-2.5 text-sm font-semibold shadow-md hover:bg-[#2E7D32] transition-colors"
        >
          {lang === "en" ? "Election 2026 →" : "தேர்தல் 2026 →"}
        </Link>
      </div>
    </div>
  );
}
