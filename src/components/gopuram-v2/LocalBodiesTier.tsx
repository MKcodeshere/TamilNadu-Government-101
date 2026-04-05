"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import localBodiesData from "@/data/local-bodies.json";

interface CounterProps {
  value: number;
  label: string;
  icon: string;
  delay: number;
}

function AnimatedCounter({ value, label, icon, delay }: CounterProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <span className="text-xs sm:text-sm">{icon}</span>
      <span className="text-[0.55rem] sm:text-xs font-bold text-[#2E7D32]">
        {value.toLocaleString()}
      </span>
      <span className="text-[0.4rem] sm:text-[0.5rem] text-[var(--color-text-secondary)] leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

/**
 * LocalBodiesTier — animated counters for local body categories.
 * Total: 13,699 local bodies across urban + rural.
 */
export default function LocalBodiesTier() {
  const { lang } = useLanguage();

  const items = [
    {
      value: localBodiesData.municipalCorporations.count,
      label: lang === "en" ? "Corporations" : "மாநகராட்சிகள்",
      icon: "🏙",
    },
    {
      value: localBodiesData.municipalities.count,
      label: lang === "en" ? "Municipalities" : "நகராட்சிகள்",
      icon: "🏘",
    },
    {
      value: localBodiesData.townPanchayats.count,
      label: lang === "en" ? "Town Panchayats" : "பேரூராட்சிகள்",
      icon: "🏡",
    },
    {
      value: localBodiesData.panchayatUnions.count,
      label: lang === "en" ? "Unions" : "ஊராட்சி ஒன்றியங்கள்",
      icon: "🤝",
    },
    {
      value: localBodiesData.villagePanchayats.count,
      label: lang === "en" ? "Village Panchayats" : "கிராம ஊராட்சிகள்",
      icon: "🌾",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      {/* Total count */}
      <motion.div
        className="text-[0.55rem] sm:text-xs font-semibold text-[#2E7D32]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {localBodiesData.summary.totalLocalBodies.toLocaleString()}{" "}
        {lang === "en" ? "Local Bodies" : "உள்ளாட்சி அமைப்புகள்"}
      </motion.div>

      {/* Counter row */}
      <div className="flex items-start justify-center gap-2 sm:gap-3 flex-wrap px-1">
        {items.map((item, i) => (
          <AnimatedCounter
            key={item.label}
            value={item.value}
            label={item.label}
            icon={item.icon}
            delay={0.5 + i * 0.08}
          />
        ))}
      </div>
    </div>
  );
}
