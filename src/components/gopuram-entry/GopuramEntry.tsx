"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors } from "@/lib/colors";

const tiers = [
  { label: { en: "People", ta: "மக்கள்" }, color: gopuramColors.people, pct: 95 },
  { label: { en: "Local Bodies", ta: "உள்ளாட்சி அமைப்புகள்" }, color: gopuramColors.localBodies, pct: 85 },
  { label: { en: "Districts", ta: "மாவட்டங்கள்" }, color: gopuramColors.districts, pct: 75 },
  { label: { en: "Departments", ta: "துறைகள்" }, color: gopuramColors.departments, pct: 65 },
  { label: { en: "Legislature", ta: "சட்டமன்றம்" }, color: gopuramColors.legislature, pct: 55 },
  { label: { en: "Executive", ta: "நிர்வாகம்" }, color: gopuramColors.executive, pct: 45 },
  { label: { en: "Raj Bhavan", ta: "ராஜ்பவன்" }, color: gopuramColors.apex, pct: 35 },
];

interface GopuramEntryProps {
  onComplete: () => void;
}

export default function GopuramEntry({ onComplete }: GopuramEntryProps) {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-4 sm:py-8 w-full max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Finial / Kalasam */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-2"
      >
        <svg width="40" height="56" viewBox="0 0 40 56">
          <path d="M20 0 L24 24 L28 28 Q20 33 12 28 L16 24 Z" fill={gopuramColors.apex} opacity={0.9} />
          <circle cx="20" cy="8" r="4.5" fill={gopuramColors.executive} />
          <ellipse cx="20" cy="32" rx="12" ry="3" fill={gopuramColors.apex} opacity={0.25} />
        </svg>
      </motion.div>

      {/* Gopuram Tiers — rendered bottom-to-top via flex-col-reverse */}
      <div className="flex flex-col-reverse items-center gap-1 w-full">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.label.en}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: 0.3 + i * 0.35,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="relative flex items-center justify-center rounded"
            style={{
              width: `${tier.pct}%`,
              height: "52px",
              backgroundColor: tier.color,
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.35 }}
              className="text-sm sm:text-base font-bold text-white drop-shadow-md tracking-wider"
            >
              {t(tier.label)}
            </motion.span>
            {/* Ornamental niches */}
            <div
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-2.5 h-5 rounded-sm"
              style={{ backgroundColor: tier.color, filter: "brightness(0.7)" }}
            />
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-2.5 h-5 rounded-sm"
              style={{ backgroundColor: tier.color, filter: "brightness(0.7)" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Base platform */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0 }}
        className="mt-1 h-3 rounded-b w-full"
        style={{
          background: `linear-gradient(to right, ${gopuramColors.people}, ${gopuramColors.localBodies}, ${gopuramColors.people})`,
        }}
      />

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.4 }}
        className="mt-6 text-sm sm:text-base text-[var(--color-text-secondary)] tracking-widest uppercase font-medium"
      >
        {t({ en: "Explore the Machinery of State", ta: "அரசு இயந்திரத்தை ஆராயுங்கள்" })}
      </motion.p>
    </motion.div>
  );
}
