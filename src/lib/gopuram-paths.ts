import type { TierBounds } from "./gopuram-layout";

/**
 * Generate a trapezoid SVG path for a tier.
 * The trapezoid is narrower at the top and wider at the bottom.
 */
export function trapezoidPath(bounds: TierBounds): string {
  const { yTop, yBottom, widthTop, widthBottom, cx } = bounds;
  const x1 = cx - widthTop / 2;
  const x2 = cx + widthTop / 2;
  const x3 = cx + widthBottom / 2;
  const x4 = cx - widthBottom / 2;

  return `M ${x1} ${yTop} L ${x2} ${yTop} L ${x3} ${yBottom} L ${x4} ${yBottom} Z`;
}

/**
 * Generate a rounded-top rectangle path (arched niche) for an entity.
 * The top has a semicircular arch, the rest is rectangular.
 */
export function archedNichePath(
  x: number,
  y: number,
  width: number,
  height: number,
  archRadius?: number
): string {
  const r = archRadius ?? Math.min(width / 2, height * 0.3);
  const effectiveR = Math.min(r, width / 2);

  // Start at bottom-left, go up the left side, arch across the top, down the right, close
  return [
    `M ${x} ${y + height}`,
    `L ${x} ${y + effectiveR}`,
    `A ${effectiveR} ${effectiveR} 0 0 1 ${x + effectiveR} ${y}`,
    `L ${x + width - effectiveR} ${y}`,
    `A ${effectiveR} ${effectiveR} 0 0 1 ${x + width} ${y + effectiveR}`,
    `L ${x + width} ${y + height}`,
    `Z`,
  ].join(" ");
}

/**
 * Generate a decorative scallop / wave pattern path along a horizontal line.
 */
export function scallopPath(
  xStart: number,
  xEnd: number,
  y: number,
  wavelength: number = 30
): string {
  const segments: string[] = [];
  const amplitude = wavelength * 0.3;
  let x = xStart;

  segments.push(`M ${x} ${y}`);

  while (x < xEnd) {
    const nextX = Math.min(x + wavelength, xEnd);
    const midX = (x + nextX) / 2;
    segments.push(`Q ${midX} ${y + amplitude} ${nextX} ${y}`);
    x = nextX;
  }

  return segments.join(" ");
}

/**
 * Generate the finial (kalasam) shape at the very top of the gopuram.
 * Centered at cx, occupying the space from yTop to yBottom.
 */
export function finialPath(cx: number = 500, yTop: number = 0, yBottom: number = 120): string {
  const h = yBottom - yTop;

  // Spire tip
  const spireTop = yTop;
  const spireBottom = yTop + h * 0.25;
  const spireWidth = 6;

  // Onion dome
  const domeTop = spireBottom;
  const domeBottom = yTop + h * 0.55;
  const domeWidth = 40;

  // Neck
  const neckTop = domeBottom;
  const neckBottom = yTop + h * 0.65;
  const neckWidth = 16;

  // Pot body
  const potTop = neckBottom;
  const potBottom = yTop + h * 0.85;
  const potWidth = 50;

  // Pot base
  const baseTop = potBottom;
  const baseBottom = yBottom;
  const baseWidth = 60;

  return [
    // Spire
    `M ${cx} ${spireTop}`,
    `L ${cx + spireWidth} ${spireBottom}`,
    `L ${cx - spireWidth} ${spireBottom}`,
    `Z`,
    // Dome (onion shape using cubic beziers)
    `M ${cx - neckWidth / 2} ${domeBottom}`,
    `C ${cx - domeWidth} ${domeBottom} ${cx - domeWidth} ${domeTop} ${cx} ${domeTop}`,
    `C ${cx + domeWidth} ${domeTop} ${cx + domeWidth} ${domeBottom} ${cx + neckWidth / 2} ${domeBottom}`,
    `Z`,
    // Neck
    `M ${cx - neckWidth / 2} ${neckTop}`,
    `L ${cx + neckWidth / 2} ${neckTop}`,
    `L ${cx + neckWidth / 2} ${neckBottom}`,
    `L ${cx - neckWidth / 2} ${neckBottom}`,
    `Z`,
    // Pot body (bulging shape)
    `M ${cx - neckWidth / 2} ${potTop}`,
    `C ${cx - potWidth} ${potTop + (potBottom - potTop) * 0.3} ${cx - potWidth} ${potBottom - (potBottom - potTop) * 0.1} ${cx - baseWidth / 2} ${potBottom}`,
    `L ${cx + baseWidth / 2} ${potBottom}`,
    `C ${cx + potWidth} ${potBottom - (potBottom - potTop) * 0.1} ${cx + potWidth} ${potTop + (potBottom - potTop) * 0.3} ${cx + neckWidth / 2} ${potTop}`,
    `Z`,
    // Base platform
    `M ${cx - baseWidth / 2} ${baseTop}`,
    `L ${cx + baseWidth / 2} ${baseTop}`,
    `L ${cx + baseWidth / 2 + 5} ${baseBottom}`,
    `L ${cx - baseWidth / 2 - 5} ${baseBottom}`,
    `Z`,
  ].join(" ");
}
