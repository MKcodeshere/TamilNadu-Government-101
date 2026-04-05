"use client";

import { useLanguage } from "@/hooks/useLanguage";
import localBodiesData from "@/data/local-bodies.json";

export default function LocalBodiesContent() {
  const { lang } = useLanguage();

  const categories = [
    {
      icon: "🏙️",
      count: localBodiesData.municipalCorporations.count,
      label: lang === "en" ? "Municipal Corporations" : "மாநகராட்சிகள்",
      detail: lang === "en"
        ? "Governs large cities like Chennai, Madurai, Coimbatore"
        : "சென்னை, மதுரை, கோயம்புத்தூர் போன்ற பெரிய நகரங்களை ஆளுகிறது",
      color: "#1565C0",
    },
    {
      icon: "🏘️",
      count: localBodiesData.municipalities.count,
      label: lang === "en" ? "Municipalities" : "நகராட்சிகள்",
      detail: lang === "en"
        ? "Manages towns with 50,000 to 5,00,000 population"
        : "50,000 முதல் 5,00,000 மக்கள்தொகை கொண்ட நகரங்களை நிர்வகிக்கிறது",
      color: "#00838F",
    },
    {
      icon: "🏡",
      count: localBodiesData.townPanchayats.count,
      label: lang === "en" ? "Town Panchayats" : "பேரூராட்சிகள்",
      detail: lang === "en"
        ? "Transitional areas between rural and urban"
        : "கிராமப்புறம் மற்றும் நகர்ப்புறத்திற்கு இடையிலான இடைநிலை பகுதிகள்",
      color: "#558B2F",
    },
    {
      icon: "🤝",
      count: localBodiesData.panchayatUnions.count,
      label: lang === "en" ? "Panchayat Unions" : "ஊராட்சி ஒன்றியங்கள்",
      detail: lang === "en"
        ? "Middle tier of rural governance"
        : "கிராம ஆட்சியின் நடுத்தர அடுக்கு",
      color: "#33691E",
    },
    {
      icon: "🌾",
      count: localBodiesData.villagePanchayats.count,
      label: lang === "en" ? "Village Panchayats" : "கிராம ஊராட்சிகள்",
      detail: lang === "en"
        ? "Grassroots governance at village level"
        : "கிராம அளவிலான அடிமட்ட ஆட்சி",
      color: "#1B5E20",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="text-center py-2">
        <span
          className="font-bold text-[#2E7D32]"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
        >
          {localBodiesData.summary.totalLocalBodies.toLocaleString()}
        </span>
        <p
          className="text-sm text-[var(--color-text-secondary)] mt-0.5"
          style={{ fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)" }}
        >
          {lang === "en" ? "Total Local Bodies" : "மொத்த உள்ளாட்சி அமைப்புகள்"}
        </p>
      </div>

      {/* Category cards */}
      {categories.map((cat) => (
        <div
          key={cat.label}
          className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3 sm:p-4 shadow-sm"
        >
          <span className="text-2xl flex-shrink-0">{cat.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-bold" style={{ fontSize: "1.1rem", color: cat.color }}>
                {cat.count.toLocaleString()}
              </span>
              <span
                className="font-semibold text-[var(--color-text)] truncate"
                style={{
                  fontSize: "0.85rem",
                  fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)",
                }}
              >
                {cat.label}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-snug">
              {cat.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
