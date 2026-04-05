"use client";

import { useMemo, useState, useCallback } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { sectorColors } from "@/lib/colors";
import budgetData from "@/data/budget-2025-26.json";
import type { BilingualText } from "@/lib/types";

interface BudgetLeaf {
  departmentId: string;
  department: BilingualText;
  sector: string;
  total: number;
}

interface TooltipData {
  dept: BilingualText;
  sector: string;
  total: number;
  x: number;
  y: number;
}

/**
 * DepartmentTreemap — D3 treemap of 43 departments sized by budget.
 * School Education (₹46,767 Cr) dominates. Color by sector.
 */
export default function DepartmentTreemap() {
  const { t, lang } = useLanguage();
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [containerSize, setContainerSize] = useState({ w: 400, h: 200 });

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setContainerSize({ w: width, h: height });
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const leaves = useMemo(() => {
    const items = budgetData.items as BudgetLeaf[];
    const root = d3
      .hierarchy<{ children?: BudgetLeaf[] } | BudgetLeaf>({ children: items })
      .sum((d) => ("total" in d ? d.total : 0))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    d3.treemap<{ children?: BudgetLeaf[] } | BudgetLeaf>()
      .size([containerSize.w, containerSize.h])
      .padding(1.5)
      .round(true)(root);

    return root.leaves() as d3.HierarchyRectangularNode<BudgetLeaf>[];
  }, [containerSize]);

  const handleClick = (leaf: d3.HierarchyRectangularNode<BudgetLeaf>) => {
    const deptId = leaf.data.departmentId;
    if (deptId) {
      window.location.href = `/departments/${deptId}`;
    }
  };

  const formatBudget = (crores: number) => {
    if (crores >= 10000) return `₹${(crores / 1000).toFixed(0)}K Cr`;
    if (crores >= 1000) return `₹${(crores / 1000).toFixed(1)}K Cr`;
    return `₹${crores.toLocaleString()} Cr`;
  };

  // Minimum rect dimensions to show text
  const MIN_LABEL_W = 45;
  const MIN_LABEL_H = 28;
  const MIN_BUDGET_H = 38;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {leaves.map((leaf, i) => {
          const w = leaf.x1 - leaf.x0;
          const h = leaf.y1 - leaf.y0;
          const fill = sectorColors[leaf.data.sector] || "#78909C";
          const showLabel = w > MIN_LABEL_W && h > MIN_LABEL_H;
          const showBudget = w > MIN_LABEL_W && h > MIN_BUDGET_H;
          const labelText = t(leaf.data.department);

          // Truncate label to fit
          const maxChars = Math.floor(w / 5.5);
          const truncated =
            labelText.length > maxChars
              ? labelText.slice(0, maxChars - 1) + "…"
              : labelText;

          return (
            <motion.g
              key={leaf.data.departmentId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.015 }}
              style={{ cursor: "pointer" }}
              onClick={() => handleClick(leaf)}
              onMouseEnter={(e) => {
                const svg = (e.target as SVGElement).closest("svg");
                if (!svg) return;
                const pt = svg.getBoundingClientRect();
                setTooltip({
                  dept: leaf.data.department,
                  sector: leaf.data.sector,
                  total: leaf.data.total,
                  x: pt.left + ((leaf.x0 + leaf.x1) / 2 / containerSize.w) * pt.width,
                  y: pt.top + (leaf.y0 / containerSize.h) * pt.height - 8,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <rect
                x={leaf.x0}
                y={leaf.y0}
                width={w}
                height={h}
                fill={fill}
                opacity={0.85}
                rx={2}
                className="transition-opacity hover:opacity-100"
              />
              {showLabel && (
                <text
                  x={leaf.x0 + w / 2}
                  y={leaf.y0 + h / 2 - (showBudget ? 4 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={Math.min(10, w / 8)}
                  fontWeight="600"
                  style={{ pointerEvents: "none", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                >
                  {truncated}
                </text>
              )}
              {showBudget && (
                <text
                  x={leaf.x0 + w / 2}
                  y={leaf.y0 + h / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={Math.min(8, w / 10)}
                  opacity={0.8}
                  style={{ pointerEvents: "none" }}
                >
                  {formatBudget(leaf.data.total)}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* HTML Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 shadow-lg text-xs pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="font-semibold text-[var(--color-text)]">
              {t(tooltip.dept)}
            </div>
            <div className="text-[var(--color-text-secondary)]">
              {tooltip.sector} · {formatBudget(tooltip.total)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
