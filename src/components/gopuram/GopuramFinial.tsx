import { finialPath } from "@/lib/gopuram-paths";

interface GopuramFinialProps {
  cx?: number;
  yTop?: number;
  yBottom?: number;
}

/**
 * The kalasam (pot of prosperity) at the very top of the gopuram.
 * Rendered as a gold shape with gradient fill.
 */
export default function GopuramFinial({
  cx = 500,
  yTop = 0,
  yBottom = 120,
}: GopuramFinialProps) {
  const path = finialPath(cx, yTop, yBottom);
  const gradientId = "finial-gold-gradient";

  return (
    <g pointerEvents="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill={`url(#${gradientId})`}
        stroke="#B8860B"
        strokeWidth={1.5}
      />
      {/* Small decorative circles on the dome */}
      <circle cx={cx} cy={yTop + (yBottom - yTop) * 0.08} r={3} fill="#FFF176" />
      <circle
        cx={cx}
        cy={yTop + (yBottom - yTop) * 0.42}
        r={2}
        fill="#FFF176"
        fillOpacity={0.6}
      />
    </g>
  );
}
