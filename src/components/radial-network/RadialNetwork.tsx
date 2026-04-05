"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { useLanguage } from "@/hooks/useLanguage";
import { buildNetworkData, ringLabels } from "./buildNetworkData";
import NetworkDetailPanel from "./NetworkDetailPanel";
import NetworkLegend from "./NetworkLegend";
import type { NetworkNode } from "./types";

// Ring radii as % of container radius (4 rings: center, leadership, ministers, departments)
const RING_RADII = [0, 0.15, 0.38, 0.72];

function getNodePath(shape: string, size: number): string {
  const s = size;
  switch (shape) {
    case "square": {
      const h = s * 0.85;
      return `M${-h},${-h} L${h},${-h} L${h},${h} L${-h},${h} Z`;
    }
    case "diamond": {
      return `M0,${-s} L${s},0 L0,${s} L${-s},0 Z`;
    }
    case "hexagon": {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        pts.push(`${Math.cos(angle) * s},${Math.sin(angle) * s}`);
      }
      return `M${pts.join("L")}Z`;
    }
    default:
      return ""; // circle uses <circle>
  }
}

export default function RadialNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { t, lang } = useLanguage();

  const data = useMemo(() => buildNetworkData(), []);

  // Compute node positions
  const positionedData = useMemo(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const maxRadius = Math.min(cx, cy) - 20;

    // Group nodes by ring
    const ringGroups = new Map<number, NetworkNode[]>();
    for (const node of data.nodes) {
      if (!ringGroups.has(node.ring)) ringGroups.set(node.ring, []);
      ringGroups.get(node.ring)!.push(node);
    }

    const positioned = data.nodes.map((node) => {
      const ringNodes = ringGroups.get(node.ring) || [];
      const idx = ringNodes.indexOf(node);
      const count = ringNodes.length;

      if (node.ring === 0) {
        // Center nodes: spread horizontally (Governor center, Speaker left, HC right)
        const spacing = 35;
        const offset = (idx - (count - 1) / 2) * spacing;
        return { ...node, x: cx + offset, y: cy };
      }

      const radius = maxRadius * RING_RADII[node.ring];
      const angleStep = (2 * Math.PI) / count;
      const startAngle = -Math.PI / 2; // top
      const angle = startAngle + idx * angleStep;

      return {
        ...node,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        angle,
      };
    });

    return positioned;
  }, [data.nodes, dimensions]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const height = Math.min(width * 0.85, 650);
      setDimensions({ width, height });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Draw with D3
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(cx, cy) - 20;

    const g = svg.append("g");

    // Draw ring guides
    for (let i = 1; i <= 3; i++) {
      const r = maxRadius * RING_RADII[i];
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r)
        .attr("fill", "none")
        .attr("stroke", ringLabels[i]?.color || "#ddd")
        .attr("stroke-width", 0.5)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.3);
    }

    // Draw edges
    const nodeMap = new Map(positionedData.map((n) => [n.id, n]));

    const edgeGroup = g.append("g").attr("class", "edges");
    for (const edge of data.edges) {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (!source?.x || !target?.x) continue;

      edgeGroup
        .append("line")
        .attr("x1", source.x)
        .attr("y1", source.y!)
        .attr("x2", target.x)
        .attr("y2", target.y!)
        .attr("stroke", "#ddd")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3)
        .attr("data-source", edge.source)
        .attr("data-target", edge.target);
    }

    // Draw nodes
    const nodeGroup = g.append("g").attr("class", "nodes");

    for (const node of positionedData) {
      if (node.x === undefined || node.y === undefined) continue;

      const nodeG = nodeGroup
        .append("g")
        .attr("transform", `translate(${node.x},${node.y})`)
        .attr("cursor", "pointer")
        .attr("data-id", node.id);

      // Node shape
      if (node.shape === "circle") {
        nodeG
          .append("circle")
          .attr("r", node.size)
          .attr("fill", node.color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.85);
      } else {
        nodeG
          .append("path")
          .attr("d", getNodePath(node.shape, node.size))
          .attr("fill", node.color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.85);
      }

      // Hover and click handlers
      nodeG
        .on("mouseenter", function (event) {
          d3.select(this).select("circle, path").attr("opacity", 1).attr("stroke-width", 2.5).attr("stroke", "#F59E0B");

          // Highlight connected edges
          edgeGroup.selectAll("line").each(function () {
            const line = d3.select(this);
            const src = line.attr("data-source");
            const tgt = line.attr("data-target");
            if (src === node.id || tgt === node.id) {
              line.attr("stroke", node.color).attr("stroke-width", 1.5).attr("opacity", 0.6);
            }
          });

          setHoveredNode(node);
          setTooltipPos({ x: event.offsetX, y: event.offsetY });
        })
        .on("mouseleave", function () {
          d3.select(this).select("circle, path").attr("opacity", 0.85).attr("stroke-width", 1.5).attr("stroke", "#fff");

          edgeGroup.selectAll("line").attr("stroke", "#ddd").attr("stroke-width", 0.5).attr("opacity", 0.3);

          setHoveredNode(null);
        })
        .on("click", function () {
          setSelectedNode(node);
        });
    }

    // Entry animation
    nodeGroup
      .selectAll("g")
      .attr("opacity", 0)
      .transition()
      .duration(600)
      .delay((_, i) => i * 8)
      .attr("opacity", 1);

    edgeGroup
      .selectAll("line")
      .attr("opacity", 0)
      .transition()
      .duration(400)
      .delay(300)
      .attr("opacity", 0.3);
  }, [positionedData, data.edges, dimensions]);

  const handleClosePanel = useCallback(() => setSelectedNode(null), []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none bg-white/95 backdrop-blur border border-[var(--color-border)] rounded-lg shadow-lg px-3 py-2 text-xs max-w-[200px]"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 8,
            transform: tooltipPos.x > dimensions.width * 0.7 ? "translateX(-110%)" : undefined,
          }}
        >
          <p className="font-semibold text-[var(--color-text)]">
            {t(hoveredNode.name)}
          </p>
          {hoveredNode.detail && (
            <p className="text-[var(--color-text-secondary)] mt-0.5">
              {lang === "ta" && hoveredNode.detailTa
                ? hoveredNode.detailTa
                : hoveredNode.detail}
            </p>
          )}
          <p className="text-[var(--color-text-secondary)] mt-1 italic">
            {lang === "en" ? "Click to explore" : "ஆராய க்ளிக் செய்யவும்"}
          </p>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        style={{ background: "transparent" }}
      />

      {/* Ring labels — placed to the right of rings, not on top of nodes */}
      <div className="absolute inset-0 pointer-events-none">
        {ringLabels.slice(1).map((rl) => {
          const maxR = Math.min(dimensions.width / 2, dimensions.height / 2) - 20;
          const r = maxR * RING_RADII[rl.ring];
          const top = dimensions.height / 2 - r * 0.7;
          const right = dimensions.width / 2 - r * 0.7;
          if (right < 10) return null;
          return (
            <span
              key={rl.ring}
              className="absolute text-[11px] sm:text-xs font-bold tracking-widest uppercase"
              style={{
                top,
                right: Math.max(right - 30, 8),
                color: rl.color,
                opacity: 0.85,
                textShadow: "0 0 8px #FFFBF0, 0 0 16px #FFFBF0, 0 0 24px #FFFBF0",
              }}
            >
              {t(rl.label)}
            </span>
          );
        })}
      </div>

      {/* Detail Panel */}
      <NetworkDetailPanel node={selectedNode} onClose={handleClosePanel} />

      {/* Legend */}
      <NetworkLegend />
    </div>
  );
}
