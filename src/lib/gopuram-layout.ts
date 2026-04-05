import type { BilingualText, GopuramTierType } from "./types";

/** Bounding box for a single tier within the SVG viewBox */
export interface TierBounds {
  /** Y coordinate of the top edge */
  yTop: number;
  /** Y coordinate of the bottom edge */
  yBottom: number;
  /** Width of the tier at the top edge */
  widthTop: number;
  /** Width of the tier at the bottom edge */
  widthBottom: number;
  /** Center X of the SVG */
  cx: number;
}

export interface TierConfig {
  id: GopuramTierType;
  label: BilingualText;
  bounds: TierBounds;
  color: string;
  bandY: number | null; // Y position of decorative band below this tier (null for bottom tier)
}

/** The SVG viewBox dimensions */
export const SVG_WIDTH = 1000;
export const SVG_HEIGHT = 1800;
export const SVG_CX = 500;

/**
 * Tier configurations from top (apex) to bottom (people).
 * Each tier is a trapezoid that gets wider as we go down.
 */
export const TIER_CONFIGS: TierConfig[] = [
  {
    id: "apex",
    label: { en: "Apex - Raj Bhavan", ta: "\u0b89\u0b9a\u0bcd\u0b9a\u0bae\u0bcd - \u0bb0\u0bbe\u0b9c\u0bcd\u0baa\u0bb5\u0ba9\u0bcd" },
    bounds: { yTop: 120, yBottom: 320, widthTop: 360, widthBottom: 440, cx: SVG_CX },
    color: "#4A148C",
    bandY: 320,
  },
  {
    id: "executive",
    label: { en: "Executive - Council of Ministers", ta: "\u0ba8\u0bbf\u0bb0\u0bcd\u0bb5\u0bbe\u0b95\u0bae\u0bcd - \u0b85\u0bae\u0bc8\u0b9a\u0bcd\u0b9a\u0bb0\u0bb5\u0bc8" },
    bounds: { yTop: 340, yBottom: 540, widthTop: 480, widthBottom: 560, cx: SVG_CX },
    color: "#FFD700",
    bandY: 540,
  },
  {
    id: "departments",
    label: { en: "43 Departments", ta: "43 \u0ba4\u0bc1\u0bb1\u0bc8\u0b95\u0bb3\u0bcd" },
    bounds: { yTop: 560, yBottom: 820, widthTop: 600, widthBottom: 680, cx: SVG_CX },
    color: "#8B0000",
    bandY: 820,
  },
  {
    id: "legislature",
    label: { en: "Legislature - TN Assembly", ta: "\u0b9a\u0b9f\u0bcd\u0b9f\u0bae\u0ba9\u0bcd\u0bb1\u0bae\u0bcd" },
    bounds: { yTop: 840, yBottom: 1040, widthTop: 700, widthBottom: 780, cx: SVG_CX },
    color: "#FF9933",
    bandY: 1040,
  },
  {
    id: "districts",
    label: { en: "38 Districts", ta: "38 \u0bae\u0bbe\u0bb5\u0b9f\u0bcd\u0b9f\u0b99\u0bcd\u0b95\u0bb3\u0bcd" },
    bounds: { yTop: 1060, yBottom: 1300, widthTop: 800, widthBottom: 880, cx: SVG_CX },
    color: "#C84B31",
    bandY: 1300,
  },
  {
    id: "local_bodies",
    label: { en: "Local Bodies", ta: "\u0b89\u0bb3\u0bcd\u0bb3\u0bbe\u0b9f\u0bcd\u0b9a\u0bbf \u0b85\u0bae\u0bc8\u0baa\u0bcd\u0baa\u0bc1\u0b95\u0bb3\u0bcd" },
    bounds: { yTop: 1320, yBottom: 1520, widthTop: 900, widthBottom: 960, cx: SVG_CX },
    color: "#2E7D32",
    bandY: 1520,
  },
  {
    id: "people",
    label: { en: "We, the People", ta: "\u0ba8\u0bbe\u0bae\u0bcd, \u0bae\u0b95\u0bcd\u0b95\u0bb3\u0bcd" },
    bounds: { yTop: 1540, yBottom: 1740, widthTop: 960, widthBottom: 1000, cx: SVG_CX },
    color: "#1B5E20",
    bandY: null,
  },
];

/** A positioned niche within a tier */
export interface NichePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutNicheOptions {
  /** Horizontal padding from the trapezoid edges */
  padX?: number;
  /** Vertical padding from top/bottom */
  padY?: number;
  /** Gap between niches horizontally */
  gapX?: number;
  /** Gap between niches vertically */
  gapY?: number;
  /** Maximum columns to use */
  maxCols?: number;
  /** Minimum niche width */
  minNicheWidth?: number;
  /** Maximum niche width */
  maxNicheWidth?: number;
}

/**
 * Compute grid positions for niches within a trapezoid tier.
 * The trapezoid narrows toward the top, so we compute row-by-row
 * widths to ensure niches fit within the angled edges.
 */
export function layoutNiches(
  itemCount: number,
  bounds: TierBounds,
  options: LayoutNicheOptions = {}
): NichePosition[] {
  const {
    padX = 20,
    padY = 30,
    gapX = 8,
    gapY = 8,
    maxCols = 12,
    minNicheWidth = 50,
    maxNicheWidth = 140,
  } = options;

  if (itemCount === 0) return [];

  const tierHeight = bounds.yBottom - bounds.yTop;
  const usableHeight = tierHeight - padY * 2;

  // Compute how many columns fit in the average width
  const avgWidth = (bounds.widthTop + bounds.widthBottom) / 2 - padX * 2;

  // Determine niche width: try to fit as many as possible
  let cols = Math.min(maxCols, itemCount);
  let nicheWidth = (avgWidth - gapX * (cols - 1)) / cols;

  // Clamp niche width
  if (nicheWidth > maxNicheWidth) {
    nicheWidth = maxNicheWidth;
    cols = Math.min(itemCount, Math.floor((avgWidth + gapX) / (nicheWidth + gapX)));
  }
  if (nicheWidth < minNicheWidth && cols > 1) {
    cols = Math.max(1, Math.floor((avgWidth + gapX) / (minNicheWidth + gapX)));
    nicheWidth = (avgWidth - gapX * (cols - 1)) / cols;
  }
  nicheWidth = Math.max(minNicheWidth, Math.min(maxNicheWidth, nicheWidth));

  const rows = Math.ceil(itemCount / cols);
  const nicheHeight = Math.min(
    (usableHeight - gapY * (rows - 1)) / rows,
    60
  );

  // Total block height
  const blockHeight = rows * nicheHeight + (rows - 1) * gapY;
  const startY = bounds.yTop + padY + (usableHeight - blockHeight) / 2;

  const positions: NichePosition[] = [];

  for (let i = 0; i < itemCount; i++) {
    const row = Math.floor(i / cols);
    const colIndex = i % cols;

    // How many items in this row
    const itemsInRow = Math.min(cols, itemCount - row * cols);

    // Interpolate the width at this row's Y position
    const rowY = startY + row * (nicheHeight + gapY);
    const t = (rowY + nicheHeight / 2 - bounds.yTop) / (bounds.yBottom - bounds.yTop);
    const rowTotalWidth = bounds.widthTop + (bounds.widthBottom - bounds.widthTop) * t;
    const rowUsable = rowTotalWidth - padX * 2;

    // Center niches within the row
    const rowBlockWidth = itemsInRow * nicheWidth + (itemsInRow - 1) * gapX;
    const rowStartX = bounds.cx - rowBlockWidth / 2;

    positions.push({
      x: rowStartX + colIndex * (nicheWidth + gapX),
      y: rowY,
      width: Math.min(nicheWidth, rowUsable / itemsInRow - gapX),
      height: nicheHeight,
    });
  }

  return positions;
}
