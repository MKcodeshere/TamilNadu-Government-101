// Bilingual text type
export interface BilingualText {
  en: string;
  ta: string;
}

// Government entity types
export type EntityType =
  | "people"
  | "constitutional_head"
  | "executive"
  | "legislature"
  | "judiciary"
  | "department"
  | "agency"
  | "corporation"
  | "district"
  | "local_body";

export type GopuramTierType =
  | "people"
  | "local_bodies"
  | "districts"
  | "legislature"
  | "departments"
  | "executive"
  | "apex";

export interface GovernmentEntity {
  id: string;
  name: BilingualText;
  type: EntityType;
  parentId?: string;
  head?: {
    name: string;
    title: BilingualText;
    party?: string;
    since?: string;
  };
  budget?: {
    amount: number; // in crores
    year: string;
  };
  staffCount?: number;
  website?: string;
  description: BilingualText;
}

// Department
export interface Department {
  id: string;
  name: BilingualText;
  sector: string;
  minister: {
    name: string;
    constituency?: string;
    party: string;
  };
  secretary: string;
  budget: {
    revenue: number;
    capital: number;
    total: number;
    year: string;
  };
  agencies: { name: BilingualText; type: string }[];
  keySchemes: { name: BilingualText; description: BilingualText }[];
  description: BilingualText;
}

// Constituency
export type ReservationType = "general" | "sc" | "st";

export interface Constituency {
  id: string;
  number: number;
  name: BilingualText;
  district: string;
  type: ReservationType;
  currentMla: {
    name: string;
    party: string;
  };
  voterCount?: number;
}

// District
export interface District {
  id: string;
  name: BilingualText;
  collector: string;
  headquarters: BilingualText;
  taluks: number;
  revenueDivisions: number;
  villagePanchayats: number;
  panchayatUnions: number;
  municipalities: number;
  municipalCorporations: number;
  townPanchayats: number;
  area: number; // sq km
  population?: number;
  constituencies: string[]; // constituency IDs
}

// Alliance / Election
export type AllianceName = "DMK-SPA" | "AIADMK-NDA" | "TVK" | "NTK" | "Others";

export interface Alliance {
  id: string;
  name: BilingualText;
  shortName: AllianceName;
  color: string;
  parties: {
    name: BilingualText;
    shortName: string;
    seats: number;
    color: string;
  }[];
  totalSeats: number;
}

// Executive
export interface Minister {
  id: string;
  name: string;
  title: BilingualText;
  portfolios: BilingualText[];
  party: string;
  constituency?: string;
  rank: "cabinet" | "state";
}

export interface Executive {
  governor: {
    name: string;
    since: string;
  };
  chiefMinister: {
    name: string;
    party: string;
    constituency: string;
    since: string;
  };
  ministers: Minister[];
}

// Budget
export interface BudgetItem {
  departmentId: string;
  department: BilingualText;
  sector: string;
  revenue: number;
  capital: number;
  total: number;
}

export interface BudgetData {
  year: string;
  totalRevenue: number;
  totalCapital: number;
  grandTotal: number;
  items: BudgetItem[];
}

// Glossary
export interface GlossaryTerm {
  term: BilingualText;
  definition: BilingualText;
  category: string;
}

// Language
export type Language = "en" | "ta";
