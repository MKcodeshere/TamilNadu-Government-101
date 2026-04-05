import { scallopPath } from "@/lib/gopuram-paths";

interface OrnamentalBandProps {
  xStart: number;
  xEnd: number;
  y: number;
  color: string;
}

export default function OrnamentalBand({
  xStart,
  xEnd,
  y,
  color,
}: OrnamentalBandProps) {
  const bandHeight = 20;
  const scallop = scallopPath(xStart, xEnd, y + bandHeight, 24);

  return (
    <g pointerEvents="none">
      {/* Thin horizontal band */}
      <rect
        x={xStart}
        y={y}
        width={xEnd - xStart}
        height={bandHeight}
        fill={color}
        fillOpacity={0.25}
      />
      {/* Decorative line at top */}
      <line
        x1={xStart}
        y1={y}
        x2={xEnd}
        y2={y}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.5}
      />
      {/* Scallop wave at bottom */}
      <path
        d={scallop}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.4}
      />
      {/* Bottom line */}
      <line
        x1={xStart}
        y1={y + bandHeight}
        x2={xEnd}
        y2={y + bandHeight}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.3}
      />
    </g>
  );
}
