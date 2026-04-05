"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import * as d3 from "d3";
import { useLanguage } from "@/hooks/useLanguage";
import { sectorColors, gopuramColors } from "@/lib/colors";
import budgetData from "@/data/budget-2025-26.json";
import executiveData from "@/data/executive.json";
import districtsData from "@/data/districts.json";
import localBodiesData from "@/data/local-bodies.json";
import type { BilingualText } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Hierarchical data builder                                          */
/* ------------------------------------------------------------------ */

interface SunburstNode {
  name: string;
  nameTa?: string;
  value?: number;
  color?: string;
  icon?: string;
  href?: string;
  detail?: string;
  children?: SunburstNode[];
}

function buildHierarchy(lang: "en" | "ta"): SunburstNode {
  const t = (b: BilingualText) => (lang === "ta" ? b.ta : b.en);

  // Group departments by sector — normalize budget to log scale for visual balance
  const sectorMap = new Map<string, SunburstNode[]>();
  for (const item of budgetData.items) {
    const sector = item.sector;
    if (!sectorMap.has(sector)) sectorMap.set(sector, []);
    // Use sqrt scale to compress range while preserving proportions
    const normalizedValue = Math.sqrt(item.total) * 2;
    sectorMap.get(sector)!.push({
      name: t(item.department),
      value: normalizedValue,
      color: sectorColors[sector] || "#78909C",
      detail: `₹${item.total.toLocaleString()} Cr`,
    });
  }

  const deptChildren: SunburstNode[] = Array.from(sectorMap.entries()).map(
    ([sector, depts]) => ({
      name: sector,
      color: sectorColors[sector] || "#78909C",
      children: depts,
    })
  );

  // Ministers (top 10 by portfolio count)
  const ministerChildren: SunburstNode[] = executiveData.ministers.slice(0, 12).map((m) => ({
    name: m.name,
    nameTa: m.title.ta,
    value: 1,
    color: "#FFF3E0",
    icon: m.id === "min-01" ? "👑" : m.id === "min-02" ? "⭐" : "📋",
    detail: lang === "en" ? m.title.en : m.title.ta,
  }));

  // Districts — equal weight per district, boosted for visibility
  const districtNodes: SunburstNode[] = (districtsData as Array<{ id: string; name: BilingualText; population?: number }>).map((d) => ({
    name: t(d.name),
    value: 30,
    color: "#FFCCBC",
    detail: `Pop: ${((d.population || 0) / 100000).toFixed(1)} lakh`,
  }));

  // Local bodies — boosted for visibility
  const localBodyNodes: SunburstNode[] = [
    { name: lang === "en" ? "Municipal Corporations" : "மாநகராட்சிகள்", value: 80, color: "#81D4FA", detail: `${localBodiesData.municipalCorporations.count} bodies` },
    { name: lang === "en" ? "Municipalities" : "நகராட்சிகள்", value: 120, color: "#A5D6A7", detail: `${localBodiesData.municipalities.count} bodies` },
    { name: lang === "en" ? "Town Panchayats" : "பேரூராட்சிகள்", value: 140, color: "#C5E1A5", detail: `${localBodiesData.townPanchayats.count} bodies` },
    { name: lang === "en" ? "Panchayat Unions" : "ஊராட்சி ஒன்றியங்கள்", value: 120, color: "#DCEDC8", detail: `${localBodiesData.panchayatUnions.count} bodies` },
    { name: lang === "en" ? "Village Panchayats" : "கிராம ஊராட்சிகள்", value: 400, color: "#F1F8E9", detail: `${localBodiesData.villagePanchayats.count} bodies` },
  ];

  return {
    name: lang === "en" ? "Tamil Nadu" : "தமிழ்நாடு",
    color: "#4A148C",
    children: [
      {
        name: lang === "en" ? "Executive" : "நிர்வாகம்",
        color: gopuramColors.executive,
        children: [
          {
            name: lang === "en" ? "Council of Ministers" : "அமைச்சரவை",
            color: "#FFD700",
            children: ministerChildren,
          },
          {
            name: lang === "en" ? "43 Departments" : "43 துறைகள்",
            color: gopuramColors.departments,
            children: deptChildren,
          },
        ],
      },
      {
        name: lang === "en" ? "Legislature" : "சட்டமன்றம்",
        color: gopuramColors.legislature,
        href: "/legislature",
        children: [
          { name: lang === "en" ? "Speaker" : "சபாநாயகர்", value: 80, color: "#FF9933", detail: executiveData.speaker.name },
          { name: lang === "en" ? "234 MLAs" : "234 உறுப்பினர்கள்", value: 500, color: "#FFB74D", detail: lang === "en" ? "234 elected members" : "234 தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள்" },
        ],
      },
      {
        name: lang === "en" ? "Judiciary" : "நீதித்துறை",
        color: "#311B92",
        children: [
          { name: lang === "en" ? "Madras High Court" : "சென்னை உயர் நீதிமன்றம்", value: 200, color: "#5C6BC0", detail: lang === "en" ? "Est. 1862" : "நிறுவப்பட்டது 1862" },
          { name: lang === "en" ? "District Courts" : "மாவட்ட நீதிமன்றங்கள்", value: 150, color: "#7986CB", detail: lang === "en" ? "38 district courts" : "38 மாவட்ட நீதிமன்றங்கள்" },
        ],
      },
      {
        name: lang === "en" ? "38 Districts" : "38 மாவட்டங்கள்",
        color: gopuramColors.districts,
        href: "/districts",
        children: districtNodes,
      },
      {
        name: lang === "en" ? "Local Bodies" : "உள்ளாட்சி அமைப்புகள்",
        color: gopuramColors.localBodies,
        children: localBodyNodes,
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Sunburst Component                                                 */
/* ------------------------------------------------------------------ */

export default function ZoomableSunburst() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  const renderChart = useCallback(() => {
    if (!svgRef.current) return;

    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = Math.min(container.clientWidth, 700);
    const height = width;
    const radius = width / 2;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const data = buildHierarchy(lang);

    // Build hierarchy
    const root = d3
      .hierarchy<SunburstNode>(data)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    // Partition layout — after this, root has x0/x1/y0/y1
    const partition = d3.partition<SunburstNode>().size([2 * Math.PI, radius]);
    const partitioned = partition(root) as unknown as d3.HierarchyRectangularNode<SunburstNode>;

    const arcNodes = partitioned.descendants();

    // Arc generator
    const arc = d3
      .arc<d3.HierarchyRectangularNode<SunburstNode>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(0.002)
      .padRadius(radius / 2)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1 - 1);

    // Color scale
    const getColor = (d: d3.HierarchyRectangularNode<SunburstNode>): string => {
      if (d.data.color) return d.data.color;
      if (d.parent) return getColor(d.parent);
      return "#4A148C";
    };

    // SVG setup
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `${-radius} ${-radius} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "var(--font-inter), Inter, system-ui, sans-serif");

    // Current zoom state
    let currentFocus = partitioned;

    // Draw arcs
    const paths = svg
      .selectAll("path")
      .data(arcNodes.filter((d) => d.depth > 0)) // skip root
      .join("path")
      .attr("d", arc as unknown as string)
      .attr("fill", (d) => {
        const c = getColor(d);
        // Lighten deeper levels
        const lighten = d.depth * 0.08;
        return d3.color(c)?.brighter(lighten)?.formatHex() ?? c;
      })
      .attr("fill-opacity", (d) => (arcIsVisible(d, currentFocus) ? 0.85 : 0))
      .attr("stroke", "#FFFBF0")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("click", (_event, d) => {
        if (d.children) {
          zoomTo(d);
        }
        // Leaf nodes just show tooltip — no navigation from sunburst
      })
      .on("mouseenter", (_event, d) => {
        showTooltip(d);
      })
      .on("mouseleave", () => {
        hideTooltip();
      });

    // Labels (only for segments large enough)
    const labels = svg
      .selectAll("text")
      .data(arcNodes.filter((d) => d.depth > 0))
      .join("text")
      .attr("transform", (d) => labelTransform(d))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", (d) => {
        const c = getColor(d);
        const rgb = d3.color(c);
        if (!rgb) return "#1A1A2E";
        const r = (rgb as d3.RGBColor).r;
        const g = (rgb as d3.RGBColor).g;
        const b = (rgb as d3.RGBColor).b;
        const brightness = r * 0.299 + g * 0.587 + b * 0.114;
        return brightness > 160 ? "#1A1A2E" : "#FFFFFF";
      })
      .attr("font-size", (d) => {
        const angle = d.x1 - d.x0;
        const size = Math.min(11, Math.max(7, angle * 30));
        return `${size}px`;
      })
      .attr("font-weight", (d) => (d.depth <= 2 ? "600" : "400"))
      .attr("opacity", (d) => {
        const angle = d.x1 - d.x0;
        return arcIsVisible(d, currentFocus) && angle > 0.04 ? 1 : 0;
      })
      .attr("pointer-events", "none")
      .text((d) => {
        const angle = d.x1 - d.x0;
        const maxLen = Math.floor(angle * 50);
        const name = d.data.name;
        return name.length > maxLen ? name.slice(0, maxLen - 1) + "…" : name;
      });

    // Center circle (click to zoom out)
    svg
      .append("circle")
      .attr("r", arcNodes[0].y1)
      .attr("fill", "#4A148C")
      .attr("fill-opacity", 0.9)
      .attr("stroke", "#FFFBF0")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", () => zoomTo(partitioned));

    // Center text
    const centerText = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "700")
      .attr("font-size", "14px")
      .attr("dy", "-0.2em")
      .text(data.name);

    const centerSubtext = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "9px")
      .attr("opacity", 0.7)
      .attr("dy", "1.2em")
      .text(lang === "en" ? "Click to zoom out" : "சுருக்க க்ளிக்");

    // Zoom function
    function zoomTo(target: d3.HierarchyRectangularNode<SunburstNode>) {
      currentFocus = target;

      // Update breadcrumb
      const trail: string[] = [];
      let node: d3.HierarchyRectangularNode<SunburstNode> | null = target;
      while (node) {
        trail.unshift(node.data.name);
        node = node.parent;
      }
      setBreadcrumb(trail);

      // Transition arcs
      const t = svg.transition().duration(600);

      paths
        .transition(t as unknown as string)
        .attr("fill-opacity", (d) => (arcIsVisible(d, target) ? 0.85 : 0))
        .attrTween("d", (d) => {
          const xd = d3.interpolate(
            (d as unknown as { x0s: number }).x0s ?? d.x0,
            ((d.x0 - target.x0) / (target.x1 - target.x0)) * 2 * Math.PI
          );
          const xd1 = d3.interpolate(
            (d as unknown as { x1s: number }).x1s ?? d.x1,
            ((d.x1 - target.x0) / (target.x1 - target.x0)) * 2 * Math.PI
          );
          const yd0 = d3.interpolate(
            (d as unknown as { y0s: number }).y0s ?? d.y0,
            Math.max(0, d.y0 - target.y0)
          );
          const yd1 = d3.interpolate(
            (d as unknown as { y1s: number }).y1s ?? d.y1,
            Math.max(0, d.y1 - target.y0)
          );

          return (tt: number) => {
            const node = d as unknown as { x0s: number; x1s: number; y0s: number; y1s: number };
            node.x0s = xd(tt);
            node.x1s = xd1(tt);
            node.y0s = yd0(tt);
            node.y1s = yd1(tt);
            return (
              arc({
                x0: node.x0s,
                x1: node.x1s,
                y0: node.y0s,
                y1: node.y1s,
              } as d3.HierarchyRectangularNode<SunburstNode>) ?? ""
            );
          };
        });

      labels.transition(t as unknown as string).attr("opacity", (d) => {
        const angle = ((d.x1 - d.x0) / (target.x1 - target.x0)) * 2 * Math.PI;
        return arcIsVisible(d, target) && angle > 0.04 ? 1 : 0;
      });

      // Update center text
      centerText.text(target.data.name);
      centerSubtext.text(
        target === partitioned
          ? lang === "en"
            ? "₹4.39 Lakh Cr Budget"
            : "₹4.39 லட்சம் கோடி"
          : lang === "en"
            ? "← Click to zoom out"
            : "← சுருக்க க்ளிக்"
      );
    }

    // Tooltip
    function showTooltip(d: d3.HierarchyRectangularNode<SunburstNode>) {
      if (!tooltipRef.current) return;
      const tip = tooltipRef.current;
      tip.style.opacity = "1";
      tip.innerHTML = `
        <div style="font-weight:700; font-size:13px; color:#1A1A2E;">${d.data.name}</div>
        ${d.data.detail ? `<div style="font-size:11px; color:#4A4A6A; margin-top:2px;">${d.data.detail}</div>` : ""}
        ${d.children ? `<div style="font-size:10px; color:#888; margin-top:3px;">Click to zoom in</div>` : ""}
      `;
    }

    function hideTooltip() {
      if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
    }

    // Initial breadcrumb
    setBreadcrumb([data.name]);
  }, [lang]);

  useEffect(() => {
    renderChart();
    const handler = () => renderChart();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [renderChart]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-3 text-xs sm:text-sm text-[var(--color-text-secondary)] flex-wrap justify-center">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-[var(--color-border)]">›</span>}
            <span className={i === breadcrumb.length - 1 ? "font-semibold text-[var(--color-text)]" : ""}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* SVG container */}
      <div className="relative w-full" style={{ maxWidth: "700px" }}>
        <svg
          ref={svgRef}
          className="w-full h-auto"
          style={{ maxHeight: "700px" }}
        />

        {/* Tooltip */}
        <div
          ref={tooltipRef}
          className="absolute top-4 right-4 rounded-xl border border-[var(--color-border)] bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg transition-opacity duration-200 pointer-events-none"
          style={{ opacity: 0, maxWidth: "220px" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function arcIsVisible(
  d: d3.HierarchyRectangularNode<SunburstNode>,
  focus: d3.HierarchyRectangularNode<SunburstNode>
): boolean {
  return d.x0 >= focus.x0 && d.x1 <= focus.x1 && d.depth >= focus.depth;
}

function labelTransform(d: d3.HierarchyRectangularNode<SunburstNode>): string {
  const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
  const y = (d.y0 + d.y1) / 2;
  return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}
