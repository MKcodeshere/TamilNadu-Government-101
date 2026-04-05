import type { BilingualText } from "@/lib/types";

export interface OrgNode {
  id: string;
  parentId: string | null;
  name: BilingualText;
  role: BilingualText;
  holder?: string;
  color: string;
  branch: "executive" | "legislature" | "judiciary";
  nodeType: "root" | "branch_head" | "leader" | "minister" | "department";
  party?: string;
  budget?: number;
  sector?: string;
  href?: string;
  portfolios?: BilingualText[];
  _expanded?: boolean;
}
