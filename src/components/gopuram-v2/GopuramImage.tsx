"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import type { BilingualText } from "@/lib/types";
import TierModal from "./TierModal";

/* ------------------------------------------------------------------ */
/*  Tier definitions mapped to the gopuram image                       */
/* ------------------------------------------------------------------ */

export interface TierZone {
  id: string;
  /** Y-position as percentage from top of image */
  topPct: number;
  /** Height as percentage of image */
  heightPct: number;
  /** Label */
  label: BilingualText;
  /** Subtitle / key stat */
  subtitle: BilingualText;
  /** Accent color */
  color: string;
  /** Text color on the band */
  textColor: string;
  /** Icon */
  icon: string;
}

const TIER_ZONES: TierZone[] = [
  {
    id: "apex",
    topPct: 6,
    heightPct: 11,
    label: { en: "Raj Bhavan", ta: "ராஜ்பவன்" },
    subtitle: { en: "Governor · High Court", ta: "ஆளுநர் · உயர் நீதிமன்றம்" },
    color: "#4A148C",
    textColor: "#FFFFFF",
    icon: "🏛",
  },
  {
    id: "executive",
    topPct: 17,
    heightPct: 11,
    label: { en: "Executive", ta: "நிர்வாகம்" },
    subtitle: { en: "CM · Council of Ministers", ta: "முதலமைச்சர் · அமைச்சரவை" },
    color: "#B8860B",
    textColor: "#FFFFFF",
    icon: "👑",
  },
  {
    id: "departments",
    topPct: 28,
    heightPct: 14,
    label: { en: "43 Departments", ta: "43 துறைகள்" },
    subtitle: { en: "₹4.39 Lakh Crore Budget", ta: "₹4.39 லட்சம் கோடி பட்ஜெட்" },
    color: "#8B0000",
    textColor: "#FFFFFF",
    icon: "🏢",
  },
  {
    id: "legislature",
    topPct: 42,
    heightPct: 14,
    label: { en: "Legislature", ta: "சட்டமன்றம்" },
    subtitle: { en: "234 MLAs · TN Assembly", ta: "234 சட்டமன்ற உறுப்பினர்கள்" },
    color: "#E65100",
    textColor: "#FFFFFF",
    icon: "⚖️",
  },
  {
    id: "districts",
    topPct: 56,
    heightPct: 14,
    label: { en: "38 Districts", ta: "38 மாவட்டங்கள்" },
    subtitle: { en: "Chennai to Tenkasi", ta: "சென்னை முதல் தென்காசி வரை" },
    color: "#BF360C",
    textColor: "#FFFFFF",
    icon: "🗺️",
  },
  {
    id: "local_bodies",
    topPct: 70,
    heightPct: 10,
    label: { en: "Local Bodies", ta: "உள்ளாட்சி அமைப்புகள்" },
    subtitle: { en: "13,699 Panchayats & Municipalities", ta: "13,699 ஊராட்சி & நகராட்சிகள்" },
    color: "#2E7D32",
    textColor: "#FFFFFF",
    icon: "🏘️",
  },
  {
    id: "people",
    topPct: 80,
    heightPct: 15,
    label: { en: "We, the People", ta: "நாம், மக்கள்" },
    subtitle: { en: "8 Crore Citizens of Tamil Nadu", ta: "தமிழ்நாட்டின் 8 கோடி குடிமக்கள்" },
    color: "#1B5E20",
    textColor: "#FFFFFF",
    icon: "🙏",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GopuramImage() {
  const { t, lang } = useLanguage();
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<string | null>(null);

  const activeTierData = TIER_ZONES.find((z) => z.id === activeTier) ?? null;

  return (
    <>
      <div className="relative mx-auto w-full max-w-[480px] select-none">
        {/* The gopuram image */}
        <Image
          src="/gopuram.jpg"
          alt="Gopuram - Tamil Nadu Government Structure"
          width={720}
          height={1280}
          className="w-full h-auto"
          priority
          draggable={false}
        />

        {/* Tier hotspot overlays */}
        {TIER_ZONES.map((tier, i) => {
          const isHovered = hoveredTier === tier.id;

          return (
            <motion.button
              key={tier.id}
              className="absolute left-0 w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{
                top: `${tier.topPct}%`,
                height: `${tier.heightPct}%`,
              }}
              onClick={() => setActiveTier(tier.id)}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              aria-label={t(tier.label)}
            >
              {/* Semi-transparent label band */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  backgroundColor: isHovered
                    ? `${tier.color}cc`
                    : `${tier.color}00`,
                }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className={`
                    flex items-center gap-2 sm:gap-3
                    rounded-full
                    px-3 py-1.5 sm:px-5 sm:py-2
                    backdrop-blur-sm
                    transition-all duration-300
                    ${isHovered ? "scale-105 shadow-lg" : "shadow-md"}
                  `}
                  style={{
                    backgroundColor: `${tier.color}${isHovered ? "e6" : "b3"}`,
                  }}
                >
                  {/* Icon */}
                  <span className="text-sm sm:text-lg flex-shrink-0">{tier.icon}</span>

                  {/* Text */}
                  <div className="text-left min-w-0">
                    <div
                      className="font-semibold tracking-wide leading-tight truncate"
                      style={{
                        color: tier.textColor,
                        fontSize: "clamp(0.65rem, 1.8vw, 0.875rem)",
                        fontFamily: lang === "ta" ? "var(--font-noto-tamil), sans-serif" : "var(--font-inter), sans-serif",
                        letterSpacing: lang === "ta" ? "0" : "0.03em",
                      }}
                    >
                      {t(tier.label)}
                    </div>
                    <div
                      className="leading-tight truncate opacity-85"
                      style={{
                        color: tier.textColor,
                        fontSize: "clamp(0.5rem, 1.3vw, 0.7rem)",
                        fontFamily: lang === "ta" ? "var(--font-noto-tamil), sans-serif" : "var(--font-inter), sans-serif",
                      }}
                    >
                      {t(tier.subtitle)}
                    </div>
                  </div>

                  {/* Expand arrow */}
                  <motion.span
                    className="text-white/80 flex-shrink-0 text-xs sm:text-sm"
                    animate={{ x: isHovered ? 3 : 0 }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.div>
            </motion.button>
          );
        })}

        {/* Kalasam label (non-interactive, decorative) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none"
          style={{ top: "1%" }}
        >
          <span
            className="text-[0.55rem] sm:text-xs font-medium tracking-widest uppercase"
            style={{
              color: "#B8860B",
              fontFamily: "var(--font-inter), sans-serif",
              textShadow: "0 1px 3px rgba(255,255,255,0.8)",
            }}
          >
            {lang === "en" ? "கலசம்" : "கலசம்"}
          </span>
        </div>
      </div>

      {/* Tier detail modal */}
      <AnimatePresence>
        {activeTier && activeTierData && (
          <TierModal
            tier={activeTierData}
            onClose={() => setActiveTier(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
