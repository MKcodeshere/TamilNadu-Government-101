"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors } from "@/lib/colors";
import constituenciesData from "@/data/constituencies.json";
import type { BilingualText } from "@/lib/types";

interface Seat {
  id: string;
  name: BilingualText;
  party: string;
  mla: string;
  district: string;
}

interface SeatPosition {
  seat: Seat;
  cx: number;
  cy: number;
  r: number;
}

const PARTY_COLORS: Record<string, string> = {
  DMK: gopuramColors.dmk,
  INC: gopuramColors.congress,
  AIADMK: gopuramColors.aiadmk,
  BJP: gopuramColors.bjp,
  CPI: gopuramColors.cpi,
  "CPI(M)": gopuramColors.cpim,
  VCK: gopuramColors.vck,
  MDMK: gopuramColors.mdmk,
  PMK: gopuramColors.pmk,
  DMDK: gopuramColors.dmdk,
  TVK: gopuramColors.tvk,
  NTK: gopuramColors.ntk,
  AMMK: gopuramColors.ammk,
  MNM: gopuramColors.mnm,
  Independent: gopuramColors.independent,
};

function getPartyColor(party: string): string {
  return PARTY_COLORS[party] || gopuramColors.others;
}

/**
 * LegislatureHemicycle — 234-seat parliament-style half-circle chart.
 * Seats arranged in concentric arcs, colored by party.
 */
export default function LegislatureHemicycle() {
  const { t } = useLanguage();
  const [hoveredSeat, setHoveredSeat] = useState<SeatPosition | null>(null);

  const seats: Seat[] = useMemo(
    () =>
      (constituenciesData as Array<{
        id: string;
        name: BilingualText;
        district: string;
        currentMla: { name: string; party: string };
      }>).map((c) => ({
        id: c.id,
        name: c.name,
        party: c.currentMla.party,
        mla: c.currentMla.name,
        district: c.district,
      })),
    []
  );

  // Sort seats by party for visual grouping
  const sortedSeats = useMemo(() => {
    const partyOrder = ["DMK", "INC", "VCK", "CPI(M)", "CPI", "MDMK", "AIADMK", "BJP", "PMK"];
    return [...seats].sort((a, b) => {
      const ai = partyOrder.indexOf(a.party);
      const bi = partyOrder.indexOf(b.party);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [seats]);

  // Layout seats in hemicycle arcs
  const seatPositions: SeatPosition[] = useMemo(() => {
    const total = sortedSeats.length; // 234
    const viewW = 400;
    const viewH = 200;
    const cx = viewW / 2;
    const cy = viewH - 10; // center at bottom

    // Rows from inner to outer
    const rows = 6;
    const rMin = 55;
    const rMax = viewH - 15;
    const seatRadius = 4.2;

    // Distribute seats across rows
    const seatsPerRow: number[] = [];
    let remaining = total;
    for (let row = 0; row < rows; row++) {
      const r = rMin + ((rMax - rMin) * row) / (rows - 1);
      const arcLength = Math.PI * r;
      const maxSeats = Math.floor(arcLength / (seatRadius * 2.4));
      const rowSeats = row === rows - 1 ? remaining : Math.min(maxSeats, Math.ceil(remaining / (rows - row)));
      seatsPerRow.push(rowSeats);
      remaining -= rowSeats;
    }

    const positions: SeatPosition[] = [];
    let seatIdx = 0;

    for (let row = 0; row < rows; row++) {
      const r = rMin + ((rMax - rMin) * row) / (rows - 1);
      const count = seatsPerRow[row];
      if (count <= 0) continue;

      const padAngle = 0.06; // radians padding at edges
      const startAngle = Math.PI + padAngle;
      const endAngle = 2 * Math.PI - padAngle;
      const step = (endAngle - startAngle) / Math.max(count - 1, 1);

      for (let i = 0; i < count && seatIdx < total; i++) {
        const angle = startAngle + step * i;
        positions.push({
          seat: sortedSeats[seatIdx],
          cx: cx + r * Math.cos(angle),
          cy: cy + r * Math.sin(angle),
          r: seatRadius,
        });
        seatIdx++;
      }
    }

    return positions;
  }, [sortedSeats]);

  // Party seat counts for legend
  const partyCounts = useMemo(() => {
    const counts = new Map<string, number>();
    seats.forEach((s) => counts.set(s.party, (counts.get(s.party) || 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6); // Top 6 parties
  }, [seats]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Hemicycle SVG */}
      <div className="flex-1 min-h-0">
        <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Speaker podium */}
          <rect x={190} y={185} width={20} height={12} rx={2} fill="#8B4513" opacity={0.6} />
          <text x={200} y={194} textAnchor="middle" fontSize={5} fill="white" fontWeight="bold">
            🔨
          </text>

          {/* Seats */}
          {seatPositions.map((sp, i) => (
            <motion.circle
              key={sp.seat.id}
              cx={sp.cx}
              cy={sp.cy}
              r={sp.r}
              fill={getPartyColor(sp.seat.party)}
              opacity={hoveredSeat?.seat.id === sp.seat.id ? 1 : 0.85}
              stroke={hoveredSeat?.seat.id === sp.seat.id ? "#fff" : "none"}
              strokeWidth={hoveredSeat?.seat.id === sp.seat.id ? 1.5 : 0}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 0.85, r: sp.r }}
              transition={{ duration: 0.3, delay: i * 0.003 }}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredSeat(sp)}
              onMouseLeave={() => setHoveredSeat(null)}
              onClick={() => (window.location.href = "/legislature")}
            />
          ))}

          {/* Center label */}
          <text x={200} y={175} textAnchor="middle" fontSize={9} fill="#4A4A6A" fontWeight="600">
            234
          </text>
        </svg>
      </div>

      {/* Mini legend (party dots) */}
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 px-1">
        {partyCounts.map(([party, count]) => (
          <span key={party} className="flex items-center gap-0.5 text-[0.5rem] sm:text-[0.6rem] text-[var(--color-text-secondary)]">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: getPartyColor(party) }}
            />
            {party} {count}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSeat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-[var(--color-border)] bg-white px-2 py-1.5 shadow-lg text-[0.6rem] pointer-events-none"
          >
            <div className="font-semibold">{t(hoveredSeat.seat.name)}</div>
            <div className="text-[var(--color-text-secondary)]">
              {hoveredSeat.seat.mla} · {hoveredSeat.seat.party}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
