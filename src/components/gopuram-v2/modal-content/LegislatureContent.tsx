"use client";

import LegislatureHemicycle from "../LegislatureHemicycle";
import { useLanguage } from "@/hooks/useLanguage";
import Link from "next/link";

export default function LegislatureContent() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-4">
      <p
        className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
        style={{ fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)" }}
      >
        {lang === "en"
          ? "The Tamil Nadu Legislative Assembly has 234 seats. Members are elected from single-member constituencies across the state."
          : "தமிழ்நாடு சட்டமன்றத்தில் 234 இடங்கள் உள்ளன. உறுப்பினர்கள் மாநிலம் முழுவதும் உள்ள தனி உறுப்பினர் தொகுதிகளிலிருந்து தேர்ந்தெடுக்கப்படுகிறார்கள்."}
      </p>

      {/* Speaker info */}
      <div className="rounded-lg border border-[var(--color-border)] bg-white p-3 flex items-center gap-3">
        <span className="text-xl">🔨</span>
        <div>
          <p className="text-xs font-medium text-[#E65100] uppercase tracking-wider">
            {lang === "en" ? "Speaker" : "சபாநாயகர்"}
          </p>
          <p className="font-semibold text-[var(--color-text)]" style={{ fontSize: "0.9rem" }}>
            M. Appavu
          </p>
        </div>
      </div>

      {/* Hemicycle */}
      <div className="w-full rounded-xl border border-[var(--color-border)] bg-white overflow-hidden" style={{ height: "280px" }}>
        <LegislatureHemicycle />
      </div>

      <div className="text-center">
        <Link
          href="/legislature"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#E65100] hover:text-[#BF360C] transition-colors"
        >
          {lang === "en" ? "Explore all 234 constituencies" : "அனைத்து 234 தொகுதிகளையும் ஆராயுங்கள்"}
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
