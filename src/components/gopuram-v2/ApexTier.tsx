"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import executiveData from "@/data/executive.json";

/**
 * ApexTier — Governor + High Court at the top of the gopuram.
 * Two dignified cards centered in the narrow apex tier.
 */
export default function ApexTier() {
  const { lang } = useLanguage();

  const entities = [
    {
      icon: "🏛",
      title: lang === "en" ? "Governor" : "ஆளுநர்",
      name: executiveData.governor.name,
      subtitle: lang === "en" ? `Since ${executiveData.governor.since}` : `${executiveData.governor.since} முதல்`,
    },
    {
      icon: "⚖️",
      title: lang === "en" ? "High Court" : "உயர் நீதிமன்றம்",
      name: lang === "en" ? "Madras High Court" : "சென்னை உயர் நீதிமன்றம்",
      subtitle: lang === "en" ? "Est. 1862" : "நிறுவப்பட்டது 1862",
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center gap-2 sm:gap-4 px-1">
      {entities.map((e, i) => (
        <motion.div
          key={e.title}
          className="flex flex-col items-center text-center rounded-lg border border-[#4A148C]/20 bg-white/80 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.1 }}
        >
          <span className="text-base sm:text-lg">{e.icon}</span>
          <span className="text-[0.55rem] sm:text-[0.65rem] font-bold text-[#4A148C] uppercase tracking-wide">
            {e.title}
          </span>
          <span className="text-[0.5rem] sm:text-[0.6rem] text-[var(--color-text)] font-medium leading-tight">
            {e.name}
          </span>
          <span className="text-[0.45rem] sm:text-[0.5rem] text-[var(--color-text-secondary)]">
            {e.subtitle}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
