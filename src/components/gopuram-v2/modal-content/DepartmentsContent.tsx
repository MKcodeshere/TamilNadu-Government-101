"use client";

import DepartmentTreemap from "../DepartmentTreemap";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * DepartmentsContent — D3 treemap of 43 departments by budget,
 * rendered inside the tier modal.
 */
export default function DepartmentsContent() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-4">
      <p
        className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
        style={{ fontFamily: lang === "ta" ? "var(--font-noto-tamil)" : "var(--font-inter)" }}
      >
        {lang === "en"
          ? "Tamil Nadu has 43 government departments. The treemap below shows each department sized by its budget allocation. Click any department to explore further."
          : "தமிழ்நாட்டில் 43 அரசு துறைகள் உள்ளன. கீழே உள்ள வரைபடத்தில் ஒவ்வொரு துறையும் அதன் வரவு-செலவு ஒதுக்கீட்டின் அடிப்படையில் காட்டப்படுகிறது."}
      </p>

      {/* Treemap visualization */}
      <div className="w-full rounded-xl border border-[var(--color-border)] bg-white overflow-hidden" style={{ height: "320px" }}>
        <DepartmentTreemap />
      </div>

      <p className="text-xs text-[var(--color-text-secondary)] opacity-70 text-center">
        {lang === "en"
          ? "Hover for details · Click to explore department"
          : "விவரங்களுக்கு hover செய்யவும் · துறையை ஆராய க்ளிக் செய்யவும்"}
      </p>
    </div>
  );
}
