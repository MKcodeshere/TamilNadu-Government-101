import type { BilingualText } from "@/lib/types";

export type NodeType =
  | "governor"
  | "chief_minister"
  | "minister"
  | "department"
  | "district"
  | "local_body_type"
  | "legislature";

export type NodeShape = "circle" | "square" | "diamond" | "hexagon";

export interface NetworkNode {
  id: string;
  name: BilingualText;
  type: NodeType;
  ring: number; // 0 = center, 1 = ministers, 2 = departments, 3 = districts, 4 = local bodies
  color: string;
  size: number; // radius in px
  shape: NodeShape;
  detail?: string;
  detailTa?: string;
  party?: string;
  sector?: string;
  budget?: number;
  href?: string;
  // Computed during layout
  x?: number;
  y?: number;
  angle?: number;
}

export interface NetworkEdge {
  source: string; // node id
  target: string; // node id
  type: "appointment" | "oversight" | "jurisdiction";
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}
