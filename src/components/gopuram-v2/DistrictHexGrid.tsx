"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import districtsData from "@/data/districts.json";
import type { BilingualText } from "@/lib/types";

interface DistrictItem {
  id: string;
  name: BilingualText;
  collector: string;
  headquarters: BilingualText;
}

/**
 * DistrictHexGrid — 38 districts arranged in a hex grid.
 * Districts are laid out in rows roughly matching TN's geography.
 */
export default function DistrictHexGrid() {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState<DistrictItem | null>(null);

  const districts = districtsData as DistrictItem[];

  // Hex grid layout: arrange 38 districts in roughly 6-7 columns
  const hexPositions = useMemo(() => {
    const cols = 7;
    const hexW = 52;
    const hexH = 30;
    const positions: { district: DistrictItem; x: number; y: number }[] = [];

    districts.forEach((d, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      // Odd rows offset by half
      const xOffset = row % 2 === 1 ? hexW / 2 : 0;
      positions.push({
        district: d,
        x: col * hexW + xOffset + hexW / 2,
        y: row * hexH + hexH / 2,
      });
    });

    return positions;
  }, [districts]);

  const totalRows = Math.ceil(districts.length / 7);
  const viewW = 7.5 * 52;
  const viewH = totalRows * 30 + 15;

  // Hex path generator
  const hexPath = (cx: number, cy: number, r: number) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6; // flat-top hex
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return `M ${pts.join(" L ")} Z`;
  };

  // Color by region (rough geographic grouping)
  const regionColor = (id: string): string => {
    // North TN
    if (["chennai", "tiruvallur", "kancheepuram", "chengalpattu", "vellore", "ranipet", "tirupattur", "tiruvannamalai"].includes(id)) return "#1976D2";
    // West TN
    if (["coimbatore", "nilgiris", "erode", "tiruppur", "salem", "namakkal", "dharmapuri", "krishnagiri"].includes(id)) return "#2E7D32";
    // Central TN
    if (["tiruchirappalli", "perambalur", "ariyalur", "karur", "thanjavur", "tiruvarur", "nagapattinam", "mayiladuthurai", "cuddalore", "villupuram", "kallakurichi"].includes(id)) return "#E65100";
    // South TN
    if (["madurai", "theni", "dindigul", "sivaganga", "ramanathapuram", "virudhunagar", "tenkasi", "tirunelveli", "thoothukudi", "kanniyakumari", "pudukkottai"].includes(id)) return "#7B1FA2";
    return "#78909C";
  };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {hexPositions.map((hp, i) => {
          const isHovered = hovered?.id === hp.district.id;
          const hexR = 13;
          const label = t(hp.district.name);
          const truncLabel = label.length > 5 ? label.slice(0, 4) + "…" : label;

          return (
            <motion.g
              key={hp.district.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.01 }}
              style={{ cursor: "pointer" }}
              onClick={() => (window.location.href = `/districts/${hp.district.id}`)}
              onMouseEnter={() => setHovered(hp.district)}
              onMouseLeave={() => setHovered(null)}
            >
              <path
                d={hexPath(hp.x, hp.y, hexR)}
                fill={regionColor(hp.district.id)}
                opacity={isHovered ? 1 : 0.75}
                stroke={isHovered ? "#fff" : regionColor(hp.district.id)}
                strokeWidth={isHovered ? 1.5 : 0.5}
                className="transition-all duration-150"
              />
              <text
                x={hp.x}
                y={hp.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={5}
                fontWeight="600"
                style={{ pointerEvents: "none", textShadow: "0 0.5px 1px rgba(0,0,0,0.3)" }}
              >
                {truncLabel}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-[var(--color-border)] bg-white px-2 py-1.5 shadow-lg text-[0.6rem] pointer-events-none whitespace-nowrap"
          >
            <div className="font-semibold">{t(hovered.name)}</div>
            <div className="text-[var(--color-text-secondary)]">
              {hovered.collector} · {t(hovered.headquarters)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
