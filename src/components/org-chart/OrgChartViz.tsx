"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { buildHierarchyData } from "./buildHierarchyData";
import type { OrgNode } from "./orgChartTypes";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function getNodeHtml(d: OrgNode, lang: "en" | "ta"): string {
  const name = lang === "ta" ? d.name.ta : d.name.en;
  const role = lang === "ta" ? d.role.ta : d.role.en;
  const holder = d.holder ? escapeHtml(d.holder) : "";
  const budgetStr = d.budget ? `₹${d.budget.toLocaleString()} Cr` : "";
  const partyBadge = d.party ? `<span style="font-size:9px;color:#666;margin-left:4px">(${escapeHtml(d.party)})</span>` : "";

  if (d.nodeType === "root") {
    return `<div style="display:none"></div>`;
  }

  const borderColor = d.color;
  const isLeader = d.nodeType === "branch_head" || d.nodeType === "leader";
  const bgColor = isLeader ? `${borderColor}08` : "#fff";

  return `
    <div style="
      background:${bgColor};
      border:2px solid ${borderColor};
      border-top:4px solid ${borderColor};
      border-radius:8px;
      padding:10px 12px;
      font-family:Inter,system-ui,sans-serif;
      cursor:pointer;
      box-shadow:0 2px 8px rgba(0,0,0,0.06);
      transition:box-shadow 0.2s;
      width:100%;
      box-sizing:border-box;
    " onmouseenter="this.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)'" onmouseleave="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'">
      <div style="font-size:${isLeader ? "13px" : "11px"};font-weight:700;color:#1A1A2E;line-height:1.3;margin-bottom:2px">
        ${escapeHtml(name)}
      </div>
      <div style="font-size:9px;color:${borderColor};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">
        ${escapeHtml(role)}
      </div>
      ${holder ? `<div style="font-size:11px;color:#4A4A6A">${holder}${partyBadge}</div>` : ""}
      ${budgetStr ? `<div style="font-size:11px;font-weight:600;color:${borderColor};margin-top:3px">${budgetStr}</div>` : ""}
    </div>
  `;
}

interface SelectedNodeInfo {
  node: OrgNode;
  x: number;
  y: number;
}

export default function OrgChartViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<unknown>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(null);
  const { lang } = useLanguage();

  const data = useMemo(() => buildHierarchyData(), []);

  const renderChart = useCallback(async () => {
    if (!containerRef.current) return;

    // Dynamic import d3-org-chart (client-side only)
    const { OrgChart } = await import("d3-org-chart");

    // Clear previous chart
    containerRef.current.innerHTML = "";

    const chart = new OrgChart()
      .container(containerRef.current)
      .data(data)
      .nodeId((d: OrgNode) => d.id)
      .parentNodeId((d: OrgNode) => d.parentId)
      .nodeWidth(() => 200)
      .nodeHeight((d: { data: OrgNode }) => {
        if (d.data.nodeType === "root") return 1;
        if (d.data.nodeType === "department") return 70;
        return 85;
      })
      .childrenMargin(() => 40)
      .siblingsMargin(() => 15)
      .neighbourMargin(() => 40)
      .compactMarginBetween(() => 15)
      .compactMarginPair(() => 60)
      .initialExpandLevel(3) // Show Governor → CM → Deputy CM → Ministers
      .nodeContent((d: { data: OrgNode }) => getNodeHtml(d.data, lang))
      .nodeUpdate(function (this: SVGElement, d: { data: OrgNode }) {
        // Style the expand/collapse button
        const el = this as SVGGElement;
        const btn = el.querySelector(".node-button-g");
        if (btn) {
          const circle = btn.querySelector("circle");
          if (circle) {
            circle.setAttribute("fill", d.data.color);
            circle.setAttribute("r", "14");
          }
        }
      })
      .onNodeClick((d: { data: OrgNode }) => {
        if (d.data.href) {
          setSelectedNode({ node: d.data, x: 0, y: 0 });
        }
      })
      .linkUpdate(function (this: SVGPathElement, d: { data: OrgNode }) {
        const el = this as SVGPathElement;
        el.setAttribute("stroke", d.data.color || "#ddd");
        el.setAttribute("stroke-width", "1.5");
        el.setAttribute("opacity", "0.4");
      })
      .compact(true)
      .layout("top")
      .render();

    chartRef.current = chart;

    // Fit to screen after render
    setTimeout(() => {
      chart.fit();
    }, 100);
  }, [data, lang]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  // Re-render on language change
  useEffect(() => {
    if (chartRef.current) {
      renderChart();
    }
  }, [lang, renderChart]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-white/80"
        style={{ height: "550px" }}
      />

      {/* Hint */}
      <p className="text-center text-xs text-[var(--color-text-secondary)] mt-2">
        {lang === "en"
          ? "Click nodes to expand/collapse · Scroll to zoom · Drag to pan"
          : "விரிவாக்க/சுருக்க நோட்களை க்ளிக் செய்யவும் · ஸ்க்ரோல் செய்து பெரிதாக்கவும்"}
      </p>

      {/* Selected node link */}
      {selectedNode?.node.href && (
        <div className="text-center mt-2">
          <a
            href={selectedNode.node.href}
            className="text-sm font-medium hover:underline"
            style={{ color: selectedNode.node.color }}
          >
            {lang === "en" ? "View details for" : "விவரங்களைக் காண"}{" "}
            {lang === "ta" ? selectedNode.node.name.ta : selectedNode.node.name.en} →
          </a>
        </div>
      )}
    </div>
  );
}
