"use client";

import { useEffect, useRef, useCallback } from "react";
import { OrgChart } from "d3-org-chart";
import * as d3 from "d3";
import { useLanguage } from "@/hooks/useLanguage";
import executiveData from "@/data/executive.json";
import departmentsData from "@/data/departments.json";
import type { BilingualText } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface OrgNode {
  id: string;
  parentId: string;
  name: string;
  title: string;
  party?: string;
  icon: string;
  color: string;
  textColor: string;
  tier: string;
  href?: string;
  childCount?: number;
}

/* ------------------------------------------------------------------ */
/*  Build the hierarchy data                                           */
/* ------------------------------------------------------------------ */

function buildOrgData(lang: "en" | "ta"): OrgNode[] {
  const t = (b: BilingualText) => (lang === "ta" ? b.ta : b.en);
  const nodes: OrgNode[] = [];

  // 1. Governor
  nodes.push({
    id: "governor",
    parentId: "",
    name: executiveData.governor.name,
    title: lang === "en" ? "Governor" : "ஆளுநர்",
    icon: "🏛",
    color: "#4A148C",
    textColor: "#FFFFFF",
    tier: "apex",
  });

  // 2. High Court (sibling of CM under Governor)
  nodes.push({
    id: "highcourt",
    parentId: "governor",
    name: lang === "en" ? "Madras High Court" : "சென்னை உயர் நீதிமன்றம்",
    title: lang === "en" ? "High Court" : "உயர் நீதிமன்றம்",
    icon: "⚖️",
    color: "#311B92",
    textColor: "#FFFFFF",
    tier: "judiciary",
  });

  // 3. Chief Minister
  nodes.push({
    id: "cm",
    parentId: "governor",
    name: executiveData.chiefMinister.name,
    title: lang === "en" ? "Chief Minister" : "முதலமைச்சர்",
    party: executiveData.chiefMinister.party,
    icon: "👑",
    color: "#FFD700",
    textColor: "#1A1A2E",
    tier: "executive",
  });

  // 4. Deputy CM
  nodes.push({
    id: "dcm",
    parentId: "cm",
    name: executiveData.deputyChiefMinister.name,
    title: lang === "en" ? "Deputy Chief Minister" : "துணை முதலமைச்சர்",
    party: executiveData.deputyChiefMinister.party,
    icon: "⭐",
    color: "#FFC107",
    textColor: "#1A1A2E",
    tier: "executive",
  });

  // 5. Speaker
  nodes.push({
    id: "speaker",
    parentId: "cm",
    name: executiveData.speaker.name,
    title: lang === "en" ? "Speaker" : "சபாநாயகர்",
    icon: "🔨",
    color: "#FF9933",
    textColor: "#FFFFFF",
    tier: "legislature",
    href: "/legislature",
  });

  // 6. Ministers (under CM, skip CM and DCM who are already listed)
  const ministers = executiveData.ministers.slice(2);
  ministers.forEach((m) => {
    nodes.push({
      id: m.id,
      parentId: "cm",
      name: m.name,
      title: lang === "en" ? m.title.en : m.title.ta,
      party: m.party,
      icon: "📋",
      color: "#E8EAF6",
      textColor: "#1A1A2E",
      tier: "minister",
    });
  });

  // 7. Departments (under CM for now — we'll link to minister later)
  const depts = departmentsData as Array<{
    id: string;
    name: BilingualText;
    sector: string;
    minister: { name: string };
  }>;

  // Group node for departments
  nodes.push({
    id: "dept-group",
    parentId: "cm",
    name: lang === "en" ? "43 Departments" : "43 துறைகள்",
    title: lang === "en" ? "Government Departments" : "அரசு துறைகள்",
    icon: "🏢",
    color: "#8B0000",
    textColor: "#FFFFFF",
    tier: "departments",
    href: "/departments",
    childCount: depts.length,
  });

  // Individual departments under the group
  depts.forEach((d) => {
    nodes.push({
      id: `dept-${d.id}`,
      parentId: "dept-group",
      name: t(d.name),
      title: d.sector,
      icon: "📁",
      color: "#FFEBEE",
      textColor: "#1A1A2E",
      tier: "department",
      href: `/departments/${d.id}`,
    });
  });

  // 8. Legislature group
  nodes.push({
    id: "legislature",
    parentId: "speaker",
    name: lang === "en" ? "234 MLAs" : "234 சட்டமன்ற உறுப்பினர்கள்",
    title: lang === "en" ? "Legislative Assembly" : "சட்டமன்றம்",
    icon: "🗳️",
    color: "#FF9933",
    textColor: "#FFFFFF",
    tier: "legislature",
    href: "/legislature",
    childCount: 234,
  });

  // 9. Districts group
  nodes.push({
    id: "districts",
    parentId: "cm",
    name: lang === "en" ? "38 Districts" : "38 மாவட்டங்கள்",
    title: lang === "en" ? "District Administration" : "மாவட்ட நிர்வாகம்",
    icon: "🗺️",
    color: "#BF360C",
    textColor: "#FFFFFF",
    tier: "districts",
    href: "/districts",
    childCount: 38,
  });

  // 10. Local Bodies
  nodes.push({
    id: "local-bodies",
    parentId: "districts",
    name: lang === "en" ? "13,699 Local Bodies" : "13,699 உள்ளாட்சி அமைப்புகள்",
    title: lang === "en" ? "Panchayats & Municipalities" : "ஊராட்சி & நகராட்சிகள்",
    icon: "🏘️",
    color: "#2E7D32",
    textColor: "#FFFFFF",
    tier: "local_bodies",
  });

  // 11. People
  nodes.push({
    id: "people",
    parentId: "local-bodies",
    name: lang === "en" ? "~8 Crore Citizens" : "~8 கோடி குடிமக்கள்",
    title: lang === "en" ? "People of Tamil Nadu" : "தமிழ்நாடு மக்கள்",
    icon: "🙏",
    color: "#1B5E20",
    textColor: "#FFFFFF",
    tier: "people",
  });

  return nodes;
}

/* ------------------------------------------------------------------ */
/*  Node template                                                      */
/* ------------------------------------------------------------------ */

function nodeTemplate(d: { data: OrgNode }): string {
  const n = d.data;
  const isLeafGroup = !!n.childCount;
  const badgeBg = isLeafGroup ? n.color : n.color;
  const isAccentNode = ["apex", "executive", "judiciary", "legislature", "departments", "districts", "local_bodies", "people"].includes(n.tier);
  const isBoldNode = ["governor", "cm", "dcm", "speaker"].includes(n.id) || isAccentNode;

  const cardBg = isAccentNode ? n.color : n.color;
  const cardText = n.textColor;
  const borderColor = isAccentNode ? n.color : "#E0D5C1";

  const nameSize = isBoldNode ? "14px" : "12px";
  const titleSize = isBoldNode ? "11px" : "10px";

  return `
    <div style="
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 12px;
      background: ${cardBg};
      border: 2px solid ${borderColor};
      color: ${cardText};
      font-family: var(--font-inter), 'Inter', system-ui, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      cursor: ${n.href ? "pointer" : "default"};
      transition: transform 0.15s, box-shadow 0.15s;
      min-width: 140px;
      max-width: 240px;
    " ${n.href ? `onclick="window.location.href='${n.href}'"` : ""}
       onmouseenter="this.style.transform='scale(1.04)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)'"
       onmouseleave="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'"
    >
      <span style="font-size: 22px; flex-shrink: 0;">${n.icon}</span>
      <div style="min-width: 0;">
        <div style="font-weight: 700; font-size: ${nameSize}; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${n.name}
        </div>
        <div style="font-size: ${titleSize}; opacity: 0.8; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${n.title}
        </div>
        ${n.party ? `<div style="font-size: 9px; opacity: 0.6; margin-top: 2px;">${n.party}</div>` : ""}
        ${isLeafGroup ? `<div style="font-size: 9px; opacity: 0.7; margin-top: 3px; font-weight: 600;">▶ Click to explore</div>` : ""}
      </div>
    </div>
  `;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrgTree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<OrgChart<OrgNode> | null>(null);
  const { lang } = useLanguage();

  const renderChart = useCallback(() => {
    if (!containerRef.current) return;

    const data = buildOrgData(lang);

    // Clear previous
    containerRef.current.innerHTML = "";

    const chart = new OrgChart<OrgNode>()
      .container(containerRef.current as unknown as string)
      .data(data)
      .nodeWidth(() => 220)
      .nodeHeight(() => 70)
      .childrenMargin(() => 40)
      .compactMarginBetween(() => 25)
      .compactMarginPair(() => 50)
      .siblingsMargin(() => 25)
      .neighbourMargin(() => 30)
      .nodeContent((d) => nodeTemplate(d as unknown as { data: OrgNode }))
      .linkUpdate(function (this: SVGPathElement) {
        // Style the connecting lines
        d3.select(this)
          .attr("stroke", "#C4956A")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.5)
          .attr("stroke-dasharray", "")
          .attr("fill", "none");
      })
      .render()
      .fit();

    chartRef.current = chart;
  }, [lang]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  // Re-render on window resize
  useEffect(() => {
    const handler = () => chartRef.current?.fit();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden"
        style={{ height: "650px" }}
      />
    </div>
  );
}
