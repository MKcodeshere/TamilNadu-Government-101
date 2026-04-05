import executiveData from "@/data/executive.json";
import departmentsData from "@/data/departments.json";
import budgetData from "@/data/budget-2025-26.json";
import { gopuramColors, sectorColors } from "@/lib/colors";
import type { NetworkNode, NetworkEdge, NetworkData } from "./types";

export function buildNetworkData(): NetworkData {
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];

  const budgetMap = new Map<string, number>();
  for (const item of budgetData.items) {
    budgetMap.set(item.departmentId, item.total);
  }
  const maxBudget = Math.max(...budgetData.items.map((i) => i.total));

  // --- Ring 0: Three Branches (Governor, Legislature Speaker, High Court) ---
  nodes.push({
    id: "governor",
    name: { en: "Governor", ta: "ஆளுநர்" },
    type: "governor",
    ring: 0,
    color: gopuramColors.apex,
    size: 16,
    shape: "circle",
    detail: executiveData.governor.name,
    detailTa: executiveData.governor.name,
  });

  nodes.push({
    id: "speaker",
    name: { en: "Legislature", ta: "சட்டமன்றம்" },
    type: "legislature",
    ring: 0,
    color: gopuramColors.legislature,
    size: 12,
    shape: "hexagon",
    detail: `Speaker: ${executiveData.speaker.name}`,
    detailTa: `சபாநாயகர்: ${executiveData.speaker.name}`,
    href: "/legislature",
  });

  nodes.push({
    id: "high-court",
    name: { en: "Judiciary", ta: "நீதித்துறை" },
    type: "legislature",
    ring: 0,
    color: "#311B92",
    size: 12,
    shape: "diamond",
    detail: "Madras High Court",
    detailTa: "சென்னை உயர்நீதிமன்றம்",
  });

  // --- Ring 1: CM + Deputy CM ---
  nodes.push({
    id: "cm",
    name: { en: "Chief Minister", ta: "முதலமைச்சர்" },
    type: "chief_minister",
    ring: 1,
    color: gopuramColors.executive,
    size: 14,
    shape: "circle",
    detail: `${executiveData.chiefMinister.name} (${executiveData.chiefMinister.party})`,
    detailTa: `${executiveData.chiefMinister.name} (${executiveData.chiefMinister.party})`,
    party: executiveData.chiefMinister.party,
    href: "/formation",
  });

  nodes.push({
    id: "deputy-cm",
    name: { en: "Deputy CM", ta: "துணை முதலமைச்சர்" },
    type: "chief_minister",
    ring: 1,
    color: gopuramColors.executive,
    size: 11,
    shape: "circle",
    detail: `${executiveData.deputyChiefMinister.name} (${executiveData.deputyChiefMinister.party})`,
    detailTa: `${executiveData.deputyChiefMinister.name} (${executiveData.deputyChiefMinister.party})`,
    party: executiveData.deputyChiefMinister.party,
  });

  edges.push({ source: "governor", target: "cm", type: "appointment" });
  edges.push({ source: "cm", target: "deputy-cm", type: "appointment" });

  // --- Ring 2: Cabinet Ministers ---
  const cabinetMinisters = executiveData.ministers
    .filter((m) => m.rank === "cabinet" && m.id !== "min-01" && m.id !== "min-02")
    .slice(0, 18);

  for (const minister of cabinetMinisters) {
    nodes.push({
      id: minister.id,
      name: minister.title,
      type: "minister",
      ring: 2,
      color: gopuramColors.dmk,
      size: 7,
      shape: "circle",
      detail: `${minister.name} — ${minister.portfolios.map((p) => p.en).join(", ")}`,
      detailTa: `${minister.name} — ${minister.portfolios.map((p) => p.ta).join(", ")}`,
      party: minister.party,
    });

    edges.push({ source: "cm", target: minister.id, type: "appointment" });
  }

  // --- Ring 3: Departments (connected to their minister) ---
  for (const dept of departmentsData) {
    const budget = budgetMap.get(dept.id) || dept.budget.total;
    const normalizedSize = 4 + Math.sqrt(budget / maxBudget) * 7;

    const parentMinister = cabinetMinisters.find(
      (m) => m.name === dept.minister.name
    );

    nodes.push({
      id: `dept-${dept.id}`,
      name: dept.name,
      type: "department",
      ring: 3,
      color: sectorColors[dept.sector] || "#78909C",
      size: normalizedSize,
      shape: "square",
      detail: `₹${budget.toLocaleString()} Cr · ${dept.sector}`,
      detailTa: `₹${budget.toLocaleString()} கோடி · ${dept.sector}`,
      sector: dept.sector,
      budget,
      href: `/departments/${dept.id}`,
    });

    if (parentMinister) {
      edges.push({
        source: parentMinister.id,
        target: `dept-${dept.id}`,
        type: "oversight",
      });
    }
  }

  return { nodes, edges };
}

export const ringLabels: { ring: number; label: { en: string; ta: string }; color: string }[] = [
  { ring: 0, label: { en: "Three Branches", ta: "மூன்று கிளைகள்" }, color: gopuramColors.apex },
  { ring: 1, label: { en: "Leadership", ta: "தலைமை" }, color: "#1A1A2E" },
  { ring: 2, label: { en: "Ministers", ta: "அமைச்சர்கள்" }, color: gopuramColors.dmk },
  { ring: 3, label: { en: "Departments", ta: "துறைகள்" }, color: gopuramColors.departments },
];
