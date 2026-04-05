import executiveData from "@/data/executive.json";
import departmentsData from "@/data/departments.json";
import budgetData from "@/data/budget-2025-26.json";
import { gopuramColors, sectorColors } from "@/lib/colors";
import type { OrgNode } from "./orgChartTypes";

export function buildHierarchyData(): OrgNode[] {
  const nodes: OrgNode[] = [];

  const budgetMap = new Map<string, number>();
  for (const item of budgetData.items) {
    budgetMap.set(item.departmentId, item.total);
  }

  // Root (hidden)
  nodes.push({
    id: "root",
    parentId: null,
    name: { en: "Tamil Nadu", ta: "தமிழ்நாடு" },
    role: { en: "State Government", ta: "மாநில அரசு" },
    color: gopuramColors.apex,
    branch: "executive",
    nodeType: "root",
  });

  // --- Three Branches ---

  // Executive: Governor
  nodes.push({
    id: "governor",
    parentId: "root",
    name: { en: "Governor", ta: "ஆளுநர்" },
    role: { en: "Constitutional Head", ta: "அரசியலமைப்பு தலைவர்" },
    holder: executiveData.governor.name,
    color: gopuramColors.apex,
    branch: "executive",
    nodeType: "branch_head",
  });

  // Legislature: Speaker
  nodes.push({
    id: "speaker",
    parentId: "root",
    name: { en: "Legislature", ta: "சட்டமன்றம்" },
    role: { en: "Speaker of Assembly", ta: "சட்டமன்ற சபாநாயகர்" },
    holder: executiveData.speaker.name,
    color: gopuramColors.legislature,
    branch: "legislature",
    nodeType: "branch_head",
    href: "/legislature",
  });

  // Judiciary: High Court
  nodes.push({
    id: "high-court",
    parentId: "root",
    name: { en: "Judiciary", ta: "நீதித்துறை" },
    role: { en: "Madras High Court", ta: "சென்னை உயர்நீதிமன்றம்" },
    holder: "Chief Justice",
    color: "#311B92",
    branch: "judiciary",
    nodeType: "branch_head",
  });

  // --- Executive Branch Hierarchy ---

  // Chief Minister
  nodes.push({
    id: "cm",
    parentId: "governor",
    name: { en: "Chief Minister", ta: "முதலமைச்சர்" },
    role: { en: "Head of Government", ta: "அரசாங்கத் தலைவர்" },
    holder: executiveData.chiefMinister.name,
    color: gopuramColors.executive,
    branch: "executive",
    nodeType: "leader",
    party: executiveData.chiefMinister.party,
    href: "/formation",
  });

  // Deputy CM
  nodes.push({
    id: "deputy-cm",
    parentId: "cm",
    name: { en: "Deputy Chief Minister", ta: "துணை முதலமைச்சர்" },
    role: { en: "Deputy Head of Government", ta: "துணை அரசாங்கத் தலைவர்" },
    holder: executiveData.deputyChiefMinister.name,
    color: gopuramColors.executive,
    branch: "executive",
    nodeType: "leader",
    party: executiveData.deputyChiefMinister.party,
  });

  // Cabinet Ministers (under Deputy CM for visual flow)
  const cabinetMinisters = executiveData.ministers.filter(
    (m) => m.rank === "cabinet" && m.id !== "min-01" && m.id !== "min-02" // exclude CM & Deputy CM
  );

  for (const minister of cabinetMinisters) {
    nodes.push({
      id: minister.id,
      parentId: "deputy-cm",
      name: minister.title,
      role: { en: "Cabinet Minister", ta: "அமைச்சரவை அமைச்சர்" },
      holder: minister.name,
      color: gopuramColors.executive,
      branch: "executive",
      nodeType: "minister",
      party: minister.party,
      portfolios: minister.portfolios,
    });

    // Find departments for this minister
    const ministerDepts = departmentsData.filter(
      (d) => d.minister.name === minister.name
    );

    for (const dept of ministerDepts) {
      const budget = budgetMap.get(dept.id) || dept.budget.total;
      nodes.push({
        id: `dept-${dept.id}`,
        parentId: minister.id,
        name: dept.name,
        role: { en: "Department", ta: "துறை" },
        holder: dept.secretary,
        color: sectorColors[dept.sector] || "#78909C",
        branch: "executive",
        nodeType: "department",
        budget,
        sector: dept.sector,
        href: `/departments/${dept.id}`,
      });
    }
  }

  // Departments without a matching minister (assign under Deputy CM)
  const assignedDeptIds = new Set(
    nodes.filter((n) => n.nodeType === "department").map((n) => n.id)
  );
  for (const dept of departmentsData) {
    const deptId = `dept-${dept.id}`;
    if (!assignedDeptIds.has(deptId)) {
      const budget = budgetMap.get(dept.id) || dept.budget.total;
      nodes.push({
        id: deptId,
        parentId: "deputy-cm",
        name: dept.name,
        role: { en: "Department", ta: "துறை" },
        holder: dept.secretary,
        color: sectorColors[dept.sector] || "#78909C",
        branch: "executive",
        nodeType: "department",
        budget,
        sector: dept.sector,
        href: `/departments/${dept.id}`,
      });
    }
  }

  return nodes;
}
