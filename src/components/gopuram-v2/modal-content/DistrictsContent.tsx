"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import districtsData from "@/data/districts.json";
import type { BilingualText } from "@/lib/types";

interface DistrictItem {
  id: string;
  name: BilingualText;
  collector: string;
  headquarters: BilingualText;
}

export default function DistrictsContent() {
  const { t, lang } = useLanguage();
  const districts = districtsData as DistrictItem[];

  return (
    <div className="space-y-4">
      <p
        className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
        style={{ fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)" }}
      >
        {lang === "en"
          ? "Tamil Nadu is divided into 38 districts, each headed by a District Collector appointed by the state government."
          : "தமிழ்நாடு 38 மாவட்டங்களாகப் பிரிக்கப்பட்டுள்ளது, ஒவ்வொன்றும் மாநில அரசால் நியமிக்கப்பட்ட மாவட்ட ஆட்சியரால் வழிநடத்தப்படுகிறது."}
      </p>

      {/* District grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {districts.map((d) => (
          <Link
            key={d.id}
            href={`/districts/${d.id}`}
            className="group rounded-lg border border-[var(--color-border)] bg-white px-3 py-2.5 shadow-sm hover:shadow-md hover:border-[#BF360C]/40 transition-all"
          >
            <p
              className="font-semibold text-[var(--color-text)] group-hover:text-[#BF360C] truncate transition-colors"
              style={{
                fontSize: "0.8rem",
                fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)",
              }}
            >
              {t(d.name)}
            </p>
            <p className="text-[0.65rem] text-[var(--color-text-secondary)] truncate mt-0.5">
              {d.collector}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
