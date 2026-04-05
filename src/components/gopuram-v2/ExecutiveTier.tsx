"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import executiveData from "@/data/executive.json";

/**
 * ExecutiveTier — CM-centered card strip showing key ministers.
 * CM is prominently centered, DCM beside, then key ministers.
 * The layout adapts — shows 5 cards on narrow tiers, more on wider.
 */
export default function ExecutiveTier() {
  const { lang } = useLanguage();

  // CM + DCM + top 3 ministers (5 total fits the tier width)
  const ministers = executiveData.ministers.slice(0, 5).map((m) => ({
    id: m.id,
    name: m.name,
    title: lang === "en" ? m.title.en : m.title.ta,
    party: m.party,
    isCM: m.id === "min-01",
    isDCM: m.id === "min-02",
  }));

  return (
    <div className="w-full h-full flex items-center justify-center gap-1 sm:gap-2 px-1">
      {ministers.map((m, i) => {
        const isCMOrDCM = m.isCM || m.isDCM;
        return (
          <motion.div
            key={m.id}
            className={`flex flex-col items-center text-center rounded-md border bg-white/80 backdrop-blur-sm shadow-sm min-w-0 ${
              m.isCM
                ? "border-[#FFD700] px-1.5 py-1 sm:px-3 sm:py-2 flex-[1.5]"
                : m.isDCM
                  ? "border-[#FFD700]/60 px-1 py-0.5 sm:px-2 sm:py-1.5 flex-[1.2]"
                  : "border-[#E0D5C1] px-0.5 py-0.5 sm:px-1.5 sm:py-1 flex-1"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <span className={`${m.isCM ? "text-sm sm:text-lg" : "text-[0.6rem] sm:text-sm"}`}>
              {m.isCM ? "👑" : m.isDCM ? "⭐" : "📋"}
            </span>
            <span
              className={`font-semibold leading-tight truncate w-full ${
                isCMOrDCM
                  ? "text-[0.5rem] sm:text-[0.65rem] text-[#4A148C]"
                  : "text-[0.4rem] sm:text-[0.55rem] text-[var(--color-text)]"
              }`}
            >
              {m.name}
            </span>
            <span
              className={`truncate w-full ${
                isCMOrDCM
                  ? "text-[0.4rem] sm:text-[0.5rem]"
                  : "text-[0.35rem] sm:text-[0.45rem]"
              } text-[var(--color-text-secondary)]`}
            >
              {m.title}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
