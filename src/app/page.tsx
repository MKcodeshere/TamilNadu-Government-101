"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "@/hooks/useLanguage";
import { gopuramColors } from "@/lib/colors";
import type { BilingualText } from "@/lib/types";
import GopuramEntry from "@/components/gopuram-entry/GopuramEntry";
import DistrictHexGridSection from "@/components/districts/DistrictHexGridSection";

const RadialNetwork = dynamic(
  () => import("@/components/radial-network/RadialNetwork"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-[var(--color-text-secondary)] text-sm">
          Loading visualization...
        </div>
      </div>
    ),
  }
);

const GovernmentCards = dynamic(
  () => import("@/components/card-drilldown/GovernmentCards"),
  { ssr: false }
);

/* ------------------------------------------------------------------ */
/*  Stat card data                                                     */
/* ------------------------------------------------------------------ */

interface StatCard {
  value: string;
  label: BilingualText;
  href?: string;
}

const stats: StatCard[] = [
  { value: "234", label: { en: "Constituencies", ta: "தொகுதிகள்" }, href: "/legislature" },
  { value: "43", label: { en: "Departments", ta: "துறைகள்" }, href: "/departments" },
  { value: "38", label: { en: "Districts", ta: "மாவட்டங்கள்" }, href: "/districts" },
  { value: "5.67 Cr", label: { en: "Voters", ta: "வாக்காளர்கள்" }, href: "/elections" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [showEntry, setShowEntry] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleEntryComplete = useCallback(() => {
    setShowEntry(false);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#4A148C]/5 via-[#FFFBF0] to-[#FFFBF0] py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl"
          >
            {lang === "en" ? "How Tamil Nadu is Governed" : "தமிழ்நாடு எவ்வாறு ஆளப்படுகிறது"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-text-secondary)] sm:text-lg"
          >
            {lang === "en"
              ? "An interactive visual guide to the machinery of state government — from the people to the Raj Bhavan."
              : "மக்கள் முதல் ராஜ்பவன் வரை — மாநில அரசின் இயந்திரத்திற்கான ஊடாடும் காட்சி வழிகாட்டி."}
          </motion.p>
        </div>
      </section>

      {/* Gopuram Entry → then Radial Network */}
      <section className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        {showEntry ? (
          <GopuramEntry onComplete={handleEntryComplete} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-2 text-center text-lg font-semibold text-[var(--color-text)] sm:text-xl">
              {lang === "en" ? "Government Structure" : "அரசாங்க அமைப்பு"}
            </h2>
            <p className="mb-4 text-center text-xs text-[var(--color-text-secondary)]">
              {lang === "en"
                ? "Hover to explore · Click to see details · Scroll to zoom"
                : "ஆராய நகர்த்தவும் · விவரங்களைக் காண க்ளிக் · பெரிதாக்க ஸ்க்ரோல்"}
            </p>
            {isMobile ? <GovernmentCards /> : <RadialNetwork />}
          </motion.div>
        )}
      </section>

      {/* Quick Stats */}
      {!showEntry && (
        <section className="border-t border-[var(--color-border)] bg-white/60 py-8 sm:py-12">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-6 text-center text-lg font-semibold text-[var(--color-text)] sm:text-xl">
              {lang === "en" ? "Tamil Nadu at a Glance" : "ஒரு பார்வையில் தமிழ்நாடு"}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {stats.map((stat) => (
                <Link
                  key={stat.label.en}
                  href={stat.href ?? "#"}
                  className="group flex flex-col items-center gap-1 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm transition-all hover:border-[var(--color-accent)] hover:shadow-md sm:p-6"
                >
                  <span className="text-2xl font-bold text-[var(--color-accent)] sm:text-3xl">{stat.value}</span>
                  <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] sm:text-base">
                    {t(stat.label)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Districts & Local Bodies */}
      {!showEntry && <DistrictHexGridSection />}

      {/* Explore Cards */}
      {!showEntry && (
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="mb-6 text-center text-lg font-semibold text-[var(--color-text)] sm:text-xl">
              {lang === "en" ? "Explore" : "ஆராயுங்கள்"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <ExploreCard href="/departments" icon="🏢" title={{ en: "Departments", ta: "துறைகள்" }} desc={{ en: "43 departments covering health, education, finance, and more", ta: "சுகாதாரம், கல்வி, நிதி மற்றும் பல துறைகளை உள்ளடக்கிய 43 துறைகள்" }} color={gopuramColors.departments} />
              <ExploreCard href="/districts" icon="🗺" title={{ en: "Districts", ta: "மாவட்டங்கள்" }} desc={{ en: "38 districts from Chennai to Tenkasi", ta: "சென்னை முதல் தென்காசி வரை 38 மாவட்டங்கள்" }} color={gopuramColors.districts} />
              <ExploreCard href="/legislature" icon="🏛" title={{ en: "Legislature", ta: "சட்டமன்றம்" }} desc={{ en: "234 constituencies and their elected representatives", ta: "234 தொகுதிகள் மற்றும் அவற்றின் தேர்ந்தெடுக்கப்பட்ட பிரதிநிதிகள்" }} color={gopuramColors.legislature} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ExploreCard({ href, icon, title, desc, color }: { href: string; icon: string; title: BilingualText; desc: BilingualText; color: string }) {
  const { t } = useLanguage();
  return (
    <Link href={href} className="group flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition-all hover:shadow-md" style={{ borderTopColor: color, borderTopWidth: "3px" }}>
      <span className="text-2xl">{icon}</span>
      <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] sm:text-lg">{t(title)}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">{t(desc)}</p>
    </Link>
  );
}
