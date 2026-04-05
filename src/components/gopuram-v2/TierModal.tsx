"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import type { TierZone } from "./GopuramImage";

/* Tier-specific content components */
import ApexContent from "./modal-content/ApexContent";
import ExecutiveContent from "./modal-content/ExecutiveContent";
import DepartmentsContent from "./modal-content/DepartmentsContent";
import LegislatureContent from "./modal-content/LegislatureContent";
import DistrictsContent from "./modal-content/DistrictsContent";
import LocalBodiesContent from "./modal-content/LocalBodiesContent";
import PeopleContent from "./modal-content/PeopleContent";

interface TierModalProps {
  tier: TierZone;
  onClose: () => void;
}

const CONTENT_MAP: Record<string, React.ComponentType> = {
  apex: ApexContent,
  executive: ExecutiveContent,
  departments: DepartmentsContent,
  legislature: LegislatureContent,
  districts: DistrictsContent,
  local_bodies: LocalBodiesContent,
  people: PeopleContent,
};

export default function TierModal({ tier, onClose }: TierModalProps) {
  const { t, lang } = useLanguage();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const ContentComponent = CONTENT_MAP[tier.id];

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleOverlayClick}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-[#FFFBF0] shadow-2xl border"
        style={{ borderColor: `${tier.color}40` }}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 sm:px-6 sm:py-5"
          style={{
            background: `linear-gradient(135deg, ${tier.color}f0, ${tier.color}d0)`,
          }}
        >
          <span className="text-xl sm:text-2xl">{tier.icon}</span>
          <div className="flex-1 min-w-0">
            <h2
              className="font-bold tracking-wide leading-tight truncate"
              style={{
                color: tier.textColor,
                fontSize: "clamp(1rem, 3vw, 1.375rem)",
                fontFamily:
                  lang === "ta"
                    ? "var(--font-noto-tamil), sans-serif"
                    : "var(--font-inter), sans-serif",
                letterSpacing: lang === "ta" ? "0" : "0.02em",
              }}
            >
              {t(tier.label)}
            </h2>
            <p
              className="leading-tight truncate mt-0.5"
              style={{
                color: `${tier.textColor}cc`,
                fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                fontFamily:
                  lang === "ta"
                    ? "var(--font-noto-tamil), sans-serif"
                    : "var(--font-inter), sans-serif",
              }}
            >
              {t(tier.subtitle)}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke={tier.textColor}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 4L14 14M14 4L4 14" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6" style={{ maxHeight: "calc(85vh - 5rem)" }}>
          {ContentComponent && <ContentComponent />}
        </div>
      </motion.div>
    </motion.div>
  );
}
