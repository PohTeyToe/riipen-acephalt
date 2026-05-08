// Concept-level type definitions for the Acephalt diligence workspace mock.
// Not derived from any internal Acephalt source.

export type Role =
  | "investor_analyst"
  | "compliance_reviewer"
  | "external_counterparty";

export type RoleConfig = {
  id: Role;
  label: string;
  shortLabel: string;
  description: string;
  badgeColor: string;
};

export type Sensitivity = "standard" | "restricted" | "privileged";

export type DocumentType =
  | "term_sheet"
  | "pitch_deck"
  | "financials"
  | "side_letter"
  | "kyc_aml"
  | "legal_opinion"
  | "auditor_report"
  | "mnda";

export type DocumentField = {
  id: string;
  label: string;
  // Either a free-form string body or a structured key/value list rendered as a small table.
  body?: string;
  rows?: { key: string; value: string }[];
  visibleTo: Role[];
  // When a non-visible field is hit by a role, this string explains why it is hidden.
  redactionReason?: string;
};

export type DealDocument = {
  id: string;
  title: string;
  type: DocumentType;
  date: string; // ISO yyyy-mm-dd
  sourceParty: string;
  sensitivity: Sensitivity;
  summary: string;
  fields: DocumentField[];
};

export type Deal = {
  id: string;
  codename: string;
  borrower: string;
  borrowerSector: string;
  vintage: string;
  size: string;
  facility: string;
  closeTarget: string;
  status: "indicative" | "due_diligence" | "term_sheet_circulated";
  lead: string;
  documents: DealDocument[];
};
