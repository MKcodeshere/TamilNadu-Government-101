"use client";

import { useEffect, useRef, useState } from "react";
import type { BilingualText } from "@/lib/types";

interface TooltipEntity {
  label: BilingualText;
  sublabel?: string;
}

interface GopuramTooltipProps {
  entity: TooltipEntity | null;
  /** Position in SVG coordinate space */
  svgX: number;
  svgY: number;
  /** Reference to the SVG element for coordinate conversion */
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export default function GopuramTooltip({
  entity,
  svgX,
  svgY,
  svgRef,
}: GopuramTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!entity || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const svgWidth = svg.viewBox.baseVal.width || 1000;
    const svgHeight = svg.viewBox.baseVal.height || 1800;

    // Convert SVG coordinates to screen coordinates
    const scaleX = rect.width / svgWidth;
    const scaleY = rect.height / svgHeight;

    const screenX = rect.left + svgX * scaleX;
    const screenY = rect.top + svgY * scaleY;

    setPos({ x: screenX, y: screenY - 10 });
  }, [entity, svgX, svgY, svgRef]);

  if (!entity) return null;

  return (
    <div
      ref={tooltipRef}
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 shadow-lg"
      style={{
        left: pos.x,
        top: pos.y,
        maxWidth: 280,
      }}
    >
      <p className="text-sm font-semibold text-[var(--color-text)]">
        {entity.label.en}
      </p>
      {entity.label.ta !== entity.label.en && (
        <p className="text-xs text-[var(--color-text-secondary)]">
          {entity.label.ta}
        </p>
      )}
      {entity.sublabel && (
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
          {entity.sublabel}
        </p>
      )}
    </div>
  );
}
