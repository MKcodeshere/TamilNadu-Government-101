"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors, sectorColors } from "@/lib/colors";
import executiveData from "@/data/executive.json";
import departmentsData from "@/data/departments.json";
import districtsData from "@/data/districts.json";
import localBodiesData from "@/data/local-bodies.json";
import EntityCard from "./EntityCard";
import TierDivider from "./TierDivider";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function GovernmentCards() {
  const { t, lang } = useLanguage();

  // Group departments by sector
  const sectorMap = new Map<string, typeof departmentsData>();
  for (const dept of departmentsData) {
    if (!sectorMap.has(dept.sector)) sectorMap.set(dept.sector, []);
    sectorMap.get(dept.sector)!.push(dept);
  }

  const cabinetMinisters = executiveData.ministers.filter(
    (m) => m.rank === "cabinet"
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {/* --- Apex Tier --- */}
      <TierDivider
        label={{ en: "Apex — Raj Bhavan", ta: "உச்சம் — ராஜ்பவன்" }}
        color={gopuramColors.apex}
        count={2}
      />
      <div className="grid grid-cols-2 gap-3">
        <motion.div variants={itemVariants}>
          <EntityCard
            icon="👑"
            title={{ en: "Governor", ta: "ஆளுநர்" }}
            subtitle={executiveData.governor.name}
            color={gopuramColors.apex}
            href="/formation"
            size="md"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <EntityCard
            icon="⭐"
            title={{ en: "Chief Minister", ta: "முதலமைச்சர்" }}
            subtitle={`${executiveData.chiefMinister.name} (${executiveData.chiefMinister.party})`}
            color={gopuramColors.executive}
            href="/formation"
            size="md"
          />
        </motion.div>
      </div>

      {/* --- Ministers Tier --- */}
      <TierDivider
        label={{ en: "Council of Ministers", ta: "அமைச்சர்கள் குழு" }}
        color={gopuramColors.executive}
        count={cabinetMinisters.length}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {cabinetMinisters.slice(0, 12).map((minister) => (
          <motion.div key={minister.id} variants={itemVariants}>
            <EntityCard
              icon="📋"
              title={minister.title}
              subtitle={minister.name}
              color={gopuramColors.executive}
              size="sm"
            >
              <p className="text-[10px] text-[var(--color-text-secondary)] line-clamp-1">
                {minister.portfolios.map((p) => (lang === "ta" ? p.ta : p.en)).join(", ")}
              </p>
            </EntityCard>
          </motion.div>
        ))}
      </div>

      {/* --- Departments Tier --- */}
      <TierDivider
        label={{ en: "Departments", ta: "துறைகள்" }}
        color={gopuramColors.departments}
        count={departmentsData.length}
      />
      {Array.from(sectorMap.entries()).map(([sector, depts]) => (
        <div key={sector} className="mb-3">
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: sectorColors[sector] || "#78909C" }}
            />
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              {sector} ({depts.length})
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {depts.map((dept) => (
              <motion.div key={dept.id} variants={itemVariants}>
                <EntityCard
                  icon="🏢"
                  title={dept.name}
                  subtitle={dept.minister.name}
                  stat={`₹${(dept.budget.total / 1000).toFixed(1)}K`}
                  statLabel={{ en: "Cr", ta: "கோடி" }}
                  color={sectorColors[dept.sector] || "#78909C"}
                  href={`/departments/${dept.id}`}
                  size="sm"
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* --- Districts Tier --- */}
      <TierDivider
        label={{ en: "Districts", ta: "மாவட்டங்கள்" }}
        color={gopuramColors.districts}
        count={districtsData.length}
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {districtsData.map((district) => (
          <motion.div key={district.id} variants={itemVariants}>
            <EntityCard
              icon="📍"
              title={district.name}
              color={gopuramColors.districts}
              href={`/districts/${district.id}`}
              size="sm"
            />
          </motion.div>
        ))}
      </div>

      {/* --- Local Bodies Tier --- */}
      <TierDivider
        label={{ en: "Local Bodies", ta: "உள்ளாட்சி அமைப்புகள்" }}
        color={gopuramColors.localBodies}
        count={5}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          {
            icon: "🏙",
            name: { en: "Municipal Corporations", ta: "மாநகராட்சிகள்" },
            count: localBodiesData.municipalCorporations.count,
          },
          {
            icon: "🏘",
            name: { en: "Municipalities", ta: "நகராட்சிகள்" },
            count: localBodiesData.municipalities.count,
          },
          {
            icon: "🏡",
            name: { en: "Town Panchayats", ta: "பேரூராட்சிகள்" },
            count: localBodiesData.townPanchayats.count,
          },
          {
            icon: "🌾",
            name: { en: "Panchayat Unions", ta: "ஊராட்சி ஒன்றியங்கள்" },
            count: localBodiesData.panchayatUnions.count,
          },
          {
            icon: "🏠",
            name: { en: "Village Panchayats", ta: "கிராம ஊராட்சிகள்" },
            count: localBodiesData.villagePanchayats.count,
          },
        ].map((lb) => (
          <motion.div key={lb.name.en} variants={itemVariants}>
            <EntityCard
              icon={lb.icon}
              title={lb.name}
              stat={lb.count.toLocaleString()}
              statLabel={{ en: "bodies", ta: "அமைப்புகள்" }}
              color={gopuramColors.localBodies}
              size="sm"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
