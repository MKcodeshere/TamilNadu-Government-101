"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import type { NetworkNode } from "./types";

interface NetworkDetailPanelProps {
  node: NetworkNode | null;
  onClose: () => void;
}

const typeLabels: Record<string, { en: string; ta: string }> = {
  governor: { en: "Constitutional Head", ta: "அரசியலமைப்பு தலைவர்" },
  chief_minister: { en: "Head of Government", ta: "அரசாங்கத் தலைவர்" },
  minister: { en: "Cabinet Minister", ta: "அமைச்சரவை அமைச்சர்" },
  department: { en: "Government Department", ta: "அரசுத் துறை" },
  district: { en: "Revenue District", ta: "வருவாய் மாவட்டம்" },
  local_body_type: { en: "Local Governance", ta: "உள்ளாட்சி நிர்வாகம்" },
  legislature: { en: "Legislature", ta: "சட்டமன்றம்" },
};

export default function NetworkDetailPanel({
  node,
  onClose,
}: NetworkDetailPanelProps) {
  const { t, lang } = useLanguage();

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="absolute left-2 top-2 w-56 bg-white/95 backdrop-blur-sm border border-[var(--color-border)] rounded-xl shadow-lg z-20"
        >
          <div className="p-3">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[var(--color-text)] leading-tight truncate">
                  {t(node.name)}
                </h2>
                <span
                  className="inline-block mt-1 px-1.5 py-0.5 rounded-full text-[8px] font-semibold text-white"
                  style={{ backgroundColor: node.color }}
                >
                  {t(typeLabels[node.type] || { en: node.type, ta: node.type })}
                </span>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[10px] text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Detail */}
            {node.detail && (
              <p className="mt-2 text-xs text-[var(--color-text-secondary)] leading-snug">
                {lang === "ta" && node.detailTa ? node.detailTa : node.detail}
              </p>
            )}

            {/* Inline meta */}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
              {node.budget && (
                <span className="font-bold" style={{ color: node.color }}>
                  ₹{node.budget.toLocaleString()} {lang === "en" ? "Cr" : "கோடி"}
                </span>
              )}
              {node.sector && (
                <span className="text-[var(--color-text-secondary)]">{node.sector}</span>
              )}
              {node.party && (
                <span className="text-[var(--color-text-secondary)]">{node.party}</span>
              )}
            </div>

            {/* Link */}
            {node.href && (
              <Link
                href={node.href}
                className="mt-2 inline-flex text-[10px] font-medium hover:underline"
                style={{ color: node.color }}
              >
                {lang === "en" ? "View details" : "விவரங்களைக் காண"} →
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
