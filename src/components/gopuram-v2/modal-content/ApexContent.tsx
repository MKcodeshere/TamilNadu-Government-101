"use client";

import { useLanguage } from "@/hooks/useLanguage";
import executiveData from "@/data/executive.json";

export default function ApexContent() {
  const { lang } = useLanguage();

  const items = [
    {
      icon: "🏛",
      title: lang === "en" ? "Governor of Tamil Nadu" : "தமிழ்நாடு ஆளுநர்",
      name: executiveData.governor.name,
      detail: lang === "en" ? `In office since ${executiveData.governor.since}` : `${executiveData.governor.since} முதல் பதவியில்`,
      note: lang === "en" ? executiveData.governor.note : executiveData.governor.note,
    },
    {
      icon: "⚖️",
      title: lang === "en" ? "Madras High Court" : "சென்னை உயர் நீதிமன்றம்",
      name: lang === "en" ? "High Court of Judicature at Madras" : "சென்னை உயர் நீதிமன்றம்",
      detail: lang === "en" ? "Established 1862 · Bench at Madurai" : "1862-ல் நிறுவப்பட்டது · மதுரை கிளை",
      note: lang === "en"
        ? "The constitutional head of Tamil Nadu is the Governor, appointed by the President of India. The High Court is the highest judicial authority in the state."
        : "தமிழ்நாட்டின் அரசியலமைப்பு தலைவர் ஆளுநர், இந்திய குடியரசுத் தலைவரால் நியமிக்கப்படுகிறார்.",
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-[var(--color-border)] bg-white p-4 sm:p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{item.icon}</span>
            <div className="min-w-0 flex-1">
              <h3
                className="font-semibold text-[var(--color-text)] leading-snug"
                style={{
                  fontSize: "clamp(0.875rem, 2.5vw, 1.05rem)",
                  fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)",
                }}
              >
                {item.title}
              </h3>
              <p
                className="font-bold text-[#4A148C] mt-1"
                style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}
              >
                {item.name}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{item.detail}</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed opacity-80">
                {item.note}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
