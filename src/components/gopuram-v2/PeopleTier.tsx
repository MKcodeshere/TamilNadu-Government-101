"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * PeopleTier — the foundation of the gopuram.
 * "We, the People · ~8 Crore" with a particle/dot animation effect.
 */
export default function PeopleTier() {
  const { lang } = useLanguage();

  // Deterministic dot positions (seeded) to avoid hydration mismatch
  const dots = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        // Simple hash-based pseudo-random from index
        const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
        const t = Math.sin(i * 269.5 + 183.3) * 43758.5453;
        const u = Math.sin(i * 419.2 + 37.1) * 43758.5453;
        const v = Math.sin(i * 631.9 + 97.3) * 43758.5453;
        return {
          cx: 5 + (s - Math.floor(s)) * 90,
          cy: 20 + (t - Math.floor(t)) * 60,
          r: 1 + (u - Math.floor(u)) * 1.5,
          delay: (v - Math.floor(v)) * 2,
        };
      }),
    []
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Particle dots — representing the people */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="#ffffff"
            opacity={0.3}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{
              duration: 3,
              delay: d.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Main text */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-sm sm:text-base font-bold text-white tracking-wide">
          {lang === "en" ? "We, the People" : "நாம், மக்கள்"}
        </div>
        <div className="text-[0.55rem] sm:text-xs text-white/70 font-medium">
          {lang === "en" ? "People of Tamil Nadu · ~8 Crore" : "தமிழ்நாடு மக்கள் · ~8 கோடி"}
        </div>
      </motion.div>
    </div>
  );
}
