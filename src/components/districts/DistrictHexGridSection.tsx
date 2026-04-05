"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors } from "@/lib/colors";
import districtsData from "@/data/districts.json";
import DistrictSearch from "./DistrictSearch";
import localBodiesData from "@/data/local-bodies.json";

// Zone colors
const zoneColors: Record<string, string> = {
  north: "#1565C0",
  south: "#E53935",
  west: "#2E7D32",
  central: "#FF8F00",
  delta: "#6A1B9A",
  east: "#00838F",
};

const districtZones: Record<string, string> = {
  chennai: "north", chengalpattu: "north", kancheepuram: "north",
  tiruvallur: "north", ranipet: "north", vellore: "north",
  tirupattur: "north", tiruvannamalai: "north", villupuram: "east",
  kallakurichi: "east", cuddalore: "east", ariyalur: "central",
  perambalur: "central", tiruchirappalli: "central", karur: "central",
  namakkal: "central", salem: "west", dharmapuri: "west",
  krishnagiri: "west", erode: "west", tiruppur: "west",
  coimbatore: "west", nilgiris: "west", dindigul: "central",
  madurai: "south", theni: "south", virudhunagar: "south",
  sivagangai: "south", ramanathapuram: "south", pudukkottai: "delta",
  thanjavur: "delta", tiruvarur: "delta", nagapattinam: "delta",
  mayiladuthurai: "delta", tenkasi: "south", tirunelveli: "south",
  thoothukudi: "south", kanyakumari: "south",
};

const localBodySummary = [
  { icon: "🏙", name: { en: "Corporations", ta: "மாநகராட்சிகள்" }, count: localBodiesData.municipalCorporations.count },
  { icon: "🏘", name: { en: "Municipalities", ta: "நகராட்சிகள்" }, count: localBodiesData.municipalities.count },
  { icon: "🏡", name: { en: "Town Panchayats", ta: "பேரூராட்சிகள்" }, count: localBodiesData.townPanchayats.count },
  { icon: "🌾", name: { en: "Panchayat Unions", ta: "ஊராட்சி ஒன்றியங்கள்" }, count: localBodiesData.panchayatUnions.count },
  { icon: "🏠", name: { en: "Village Panchayats", ta: "கிராம ஊராட்சிகள்" }, count: localBodiesData.villagePanchayats.count },
];

function HexTile({
  district,
  index,
  isSelected,
  onClick,
}: {
  district: (typeof districtsData)[0];
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const zone = districtZones[district.id] || "central";
  const color = zoneColors[zone] || gopuramColors.districts;

  const cols = 7;
  const size = 32;
  const hGap = size * 1.8;
  const vGap = size * 1.6;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const xOffset = row % 2 === 1 ? hGap / 2 : 0;
  const cx = col * hGap + xOffset + size + 10;
  const cy = row * vGap + size + 10;

  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${Math.cos(angle) * size},${Math.sin(angle) * size}`;
  }).join(" ");

  return (
    <g
      transform={`translate(${cx}, ${cy})`}
      onClick={onClick}
      className="cursor-pointer"
    >
      <polygon
        points={hexPoints}
        fill={isSelected ? color : `${color}18`}
        stroke={color}
        strokeWidth={isSelected ? 2.5 : 1}
      />
      <text
        textAnchor="middle"
        dy="-2"
        fontSize={t(district.name).length > 10 ? "6.5" : "7.5"}
        fontWeight="600"
        fill={isSelected ? "#fff" : color}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {t(district.name).length > 12 ? t(district.name).substring(0, 11) + "…" : t(district.name)}
      </text>
      <text
        textAnchor="middle"
        dy="10"
        fontSize="5.5"
        fill={isSelected ? "#ffffffcc" : "#999"}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {district.population ? `${(district.population / 100000).toFixed(1)}L` : ""}
      </text>
    </g>
  );
}

export default function DistrictHexGridSection() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const selected = selectedDistrict
    ? districtsData.find((d) => d.id === selectedDistrict)
    : null;

  const handleSearchDistrict = useCallback((districtId: string) => {
    router.push(`/districts?district=${districtId}`);
  }, [router]);

  const handleSearchConstituency = useCallback((districtId: string, constituencyId: string, highlightTerm?: string) => {
    let url = `/districts?district=${districtId}&constituency=${constituencyId}`;
    if (highlightTerm) url += `&highlight=${encodeURIComponent(highlightTerm)}`;
    router.push(url);
  }, [router]);

  const cols = 7;
  const size = 32;
  const hGap = size * 1.8;
  const vGap = size * 1.6;
  const rows = Math.ceil(districtsData.length / cols);
  const svgWidth = cols * hGap + hGap / 2 + size + 20;
  const svgHeight = rows * vGap + size * 2 + 20;

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-2 text-center text-lg font-semibold text-[var(--color-text)] sm:text-xl">
          {lang === "en" ? "Districts & Local Bodies" : "மாவட்டங்கள் & உள்ளாட்சி அமைப்புகள்"}
        </h2>
        <p className="mb-4 text-center text-sm text-[var(--color-text-secondary)]">
          {lang === "en"
            ? "38 districts · Click any district for details"
            : "38 மாவட்டங்கள் · விவரங்களைக் காண க்ளிக் செய்யவும்"}
        </p>

        {/* Search */}
        <DistrictSearch
          onSelectDistrict={handleSearchDistrict}
          onSelectConstituency={handleSearchConstituency}
        />

        {/* Zone Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {Object.entries(zoneColors).map(([zone, color]) => (
            <div key={zone} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-[var(--color-text-secondary)] capitalize">{zone}</span>
            </div>
          ))}
        </div>

        {/* Hex Grid */}
        <div className="flex justify-center overflow-x-auto pb-4">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-2xl"
            style={{ aspectRatio: `${svgWidth} / ${svgHeight}` }}
          >
            {districtsData.map((district, i) => (
              <HexTile
                key={district.id}
                district={district}
                index={i}
                isSelected={selectedDistrict === district.id}
                onClick={() =>
                  setSelectedDistrict(
                    selectedDistrict === district.id ? null : district.id
                  )
                }
              />
            ))}
          </svg>
        </div>

        {/* Simple district info popup */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 mx-auto max-w-md p-4 rounded-xl border border-[var(--color-border)] bg-white shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[var(--color-text)]">{t(selected.name)}</h3>
              <button onClick={() => setSelectedDistrict(null)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[var(--color-text-secondary)]">
              <div><span className="font-medium">{lang === "en" ? "HQ" : "தலைமையகம்"}:</span> {t(selected.headquarters)}</div>
              <div><span className="font-medium">{lang === "en" ? "Population" : "மக்கள்"}:</span> {(selected.population || 0).toLocaleString()}</div>
              <div><span className="font-medium">{lang === "en" ? "Area" : "பரப்பளவு"}:</span> {selected.area.toLocaleString()} {lang === "en" ? "sq km" : "ச.கி.மீ"}</div>
              <div><span className="font-medium">{lang === "en" ? "Taluks" : "தாலுகாக்கள்"}:</span> {selected.taluks}</div>
            </div>
            <Link
              href={`/districts`}
              onClick={() => {/* will navigate to districts page */}}
              className="mt-3 inline-flex text-xs font-medium hover:underline"
              style={{ color: gopuramColors.districts }}
            >
              {lang === "en" ? "View constituencies & areas" : "தொகுதிகள் & பகுதிகளைக் காண"} →
            </Link>
          </motion.div>
        )}

        {/* Local Bodies Summary Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {localBodySummary.map((lb) => (
            <div
              key={lb.name.en}
              className="flex flex-col items-center gap-1 rounded-lg border border-[var(--color-border)] bg-white/80 p-3"
            >
              <span className="text-lg">{lb.icon}</span>
              <span className="text-lg font-bold" style={{ color: gopuramColors.localBodies }}>
                {lb.count.toLocaleString()}
              </span>
              <span className="text-[10px] text-[var(--color-text-secondary)] text-center">
                {t(lb.name)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
