// Gopuram-inspired color palette
export const gopuramColors = {
  // Tier colors (bottom to top)
  people: "#1B5E20", // Deep green - earth/foundation
  localBodies: "#2E7D32", // Temple green
  districts: "#C84B31", // Terracotta
  legislature: "#FF9933", // Saffron
  departments: "#8B0000", // Deep red
  executive: "#FFD700", // Gold
  apex: "#4A148C", // Royal purple

  // Party colors
  dmk: "#E31E24", // DMK Red
  aiadmk: "#00A650", // AIADMK Green (two leaves)
  bjp: "#FF9933", // BJP Saffron
  congress: "#19AAED", // Congress Blue
  tvk: "#FF6F00", // TVK Orange
  ntk: "#D32F2F", // NTK Red
  pmk: "#FFEB3B", // PMK Yellow
  cpim: "#F44336", // CPI(M) Red
  cpi: "#E53935", // CPI Red
  vck: "#2196F3", // VCK Blue
  mdmk: "#FF5722", // MDMK
  dmdk: "#FFC107", // DMDK
  mnm: "#9C27B0", // MNM Purple
  ammk: "#4CAF50", // AMMK Green
  independent: "#9E9E9E", // Grey
  others: "#757575",

  // Alliance colors
  dmkSpa: "#E31E24",
  aiadmkNda: "#00A650",
  tvkAlliance: "#FF6F00",
  ntkAlliance: "#D32F2F",

  // Reservation type colors
  general: "#1976D2",
  sc: "#E65100",
  st: "#2E7D32",

  // UI colors
  background: "#FFFBF0", // Warm cream
  surface: "#FFFFFF",
  text: "#1A1A2E",
  textSecondary: "#4A4A6A",
  border: "#E0D5C1",
  accent: "#C84B31",
} as const;

// Sector colors for departments
export const sectorColors: Record<string, string> = {
  "Health & Family Welfare": "#E53935",
  Education: "#1565C0",
  Finance: "#2E7D32",
  Infrastructure: "#6D4C41",
  "Social Welfare": "#7B1FA2",
  Agriculture: "#33691E",
  "Law & Order": "#283593",
  Industry: "#E65100",
  "Urban Development": "#00838F",
  "Rural Development": "#558B2F",
  "Energy & Environment": "#F9A825",
  "Culture & Tourism": "#AD1457",
  Administration: "#455A64",
  Other: "#78909C",
};
