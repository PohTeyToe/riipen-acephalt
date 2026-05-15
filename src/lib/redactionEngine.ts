// Field-level redaction engine for the diligence workspace mock.
// Pure functions, no I/O, no side effects, deterministic.

import type { DealDocument, DocumentField, Role } from "./types";

export type PolicyRule = {
  id: string;
  label: string;
  category:
    | "shared"
    | "counterparty_boundary"
    | "lender_underwriting"
    | "bilateral_side_letter"
    | "compliance_only"
    | "legal_packet"
    | "audit_procedure";
  allowedRoles: Role[];
  rationale: string;
};

export type FieldVisibility = {
  field: DocumentField;
  visible: boolean;
  // Always populated when visible === false. Defaults to a generic notice if the
  // field author did not supply a redactionReason.
  reason: string | null;
  rule: PolicyRule;
};

const DEFAULT_REDACTION_REASON =
  "Restricted by role policy. Switch role to view if you have the appropriate access.";
export const POLICY_VERSION = "role-policy.v0.3.1";

const POLICY_RULES: Record<string, PolicyRule> = {
  "policy.shared-room.visible@v0.3.1": {
    id: "policy.shared-room.visible@v0.3.1",
    label: "Shared room document surface",
    category: "shared",
    allowedRoles: [
      "investor_analyst",
      "compliance_reviewer",
      "external_counterparty",
    ],
    rationale: "Core deal packet is visible across the shared room surface.",
  },
  "policy.counterparty-boundary.packet@v0.3.1": {
    id: "policy.counterparty-boundary.packet@v0.3.1",
    label: "Counterparty boundary",
    category: "counterparty_boundary",
    allowedRoles: ["investor_analyst", "compliance_reviewer"],
    rationale:
      "Lender-side diligence fields stay inside the lender review boundary until final paper is set.",
  },
  "policy.lender-underwriting.only@v0.3.1": {
    id: "policy.lender-underwriting.only@v0.3.1",
    label: "Lender underwriting only",
    category: "lender_underwriting",
    allowedRoles: ["investor_analyst", "compliance_reviewer"],
    rationale:
      "Underwriting detail is restricted to internal lender-side reviewers.",
  },
  "policy.bilateral-side-letter.boundary@v0.3.1": {
    id: "policy.bilateral-side-letter.boundary@v0.3.1",
    label: "Bilateral side letter boundary",
    category: "bilateral_side_letter",
    allowedRoles: ["investor_analyst", "compliance_reviewer"],
    rationale:
      "Bilateral side letter terms are limited to the lender participants named in that packet.",
  },
  "policy.compliance-kyc.only@v0.3.1": {
    id: "policy.compliance-kyc.only@v0.3.1",
    label: "Compliance-only identity review",
    category: "compliance_only",
    allowedRoles: ["compliance_reviewer"],
    rationale:
      "Beneficial ownership, sanctions, and source-of-funds detail is restricted to compliance review.",
  },
  "policy.privileged-counsel.compliance-only@v0.3.1": {
    id: "policy.privileged-counsel.compliance-only@v0.3.1",
    label: "Privileged counsel commentary",
    category: "compliance_only",
    allowedRoles: ["compliance_reviewer"],
    rationale:
      "Privileged counsel-to-counsel commentary is restricted to compliance review.",
  },
  "policy.lender-legal.packet@v0.3.1": {
    id: "policy.lender-legal.packet@v0.3.1",
    label: "Lender legal packet",
    category: "legal_packet",
    allowedRoles: ["investor_analyst", "compliance_reviewer"],
    rationale:
      "Legal packet detail is visible to lender-side reviewers, not to counterparties.",
  },
  "policy.audit-procedure.lender-side@v0.3.1": {
    id: "policy.audit-procedure.lender-side@v0.3.1",
    label: "Lender-side audit procedure detail",
    category: "audit_procedure",
    allowedRoles: ["investor_analyst", "compliance_reviewer"],
    rationale:
      "Detailed audit procedures stay within the lender-side diligence packet.",
  },
};

const FIELD_POLICY_RULES: Record<string, keyof typeof POLICY_RULES> = {
  "facility-overview": "policy.shared-room.visible@v0.3.1",
  covenants: "policy.shared-room.visible@v0.3.1",
  "use-of-proceeds": "policy.shared-room.visible@v0.3.1",
  "internal-pricing-notes": "policy.counterparty-boundary.packet@v0.3.1",
  "company-overview": "policy.shared-room.visible@v0.3.1",
  metrics: "policy.lender-underwriting.only@v0.3.1",
  "growth-plan": "policy.lender-underwriting.only@v0.3.1",
  "revenue-history": "policy.lender-underwriting.only@v0.3.1",
  ebitda: "policy.lender-underwriting.only@v0.3.1",
  "balance-sheet": "policy.lender-underwriting.only@v0.3.1",
  concentration: "policy.lender-underwriting.only@v0.3.1",
  mfn: "policy.bilateral-side-letter.boundary@v0.3.1",
  reporting: "policy.bilateral-side-letter.boundary@v0.3.1",
  "internal-cascade-notes": "policy.privileged-counsel.compliance-only@v0.3.1",
  ownership: "policy.compliance-kyc.only@v0.3.1",
  sanctions: "policy.compliance-kyc.only@v0.3.1",
  "source-of-funds": "policy.compliance-kyc.only@v0.3.1",
  "summary-tag": "policy.counterparty-boundary.packet@v0.3.1",
  scope: "policy.lender-legal.packet@v0.3.1",
  qualifications: "policy.lender-legal.packet@v0.3.1",
  "privileged-correspondence": "policy.privileged-counsel.compliance-only@v0.3.1",
  opinion: "policy.shared-room.visible@v0.3.1",
  "kam-revenue": "policy.audit-procedure.lender-side@v0.3.1",
  "kam-acquisition": "policy.audit-procedure.lender-side@v0.3.1",
  term: "policy.shared-room.visible@v0.3.1",
  "permitted-use": "policy.shared-room.visible@v0.3.1",
  exceptions: "policy.shared-room.visible@v0.3.1",
};

export function policyRuleForField(field: DocumentField): PolicyRule {
  const ruleId = FIELD_POLICY_RULES[field.id] ?? "policy.shared-room.visible@v0.3.1";
  const rule = POLICY_RULES[ruleId];
  if (!sameRoleSet(rule.allowedRoles, field.visibleTo)) {
    throw new Error(
      `Policy registry mismatch for field ${field.id}. Mock packet visibleTo and rule allowedRoles diverged.`,
    );
  }
  return rule;
}

export function evaluateField(
  field: DocumentField,
  role: Role,
): FieldVisibility {
  const rule = policyRuleForField(field);
  const visible = rule.allowedRoles.includes(role);
  return {
    field,
    visible,
    rule,
    reason: visible ? null : field.redactionReason ?? DEFAULT_REDACTION_REASON,
  };
}

export function visibleFields(
  doc: DealDocument,
  role: Role,
): FieldVisibility[] {
  return doc.fields.map((f) => evaluateField(f, role));
}

export function countRedactions(doc: DealDocument, role: Role): number {
  return doc.fields.filter((f) => !evaluateField(f, role).visible).length;
}

export function totalRedactions(docs: DealDocument[], role: Role): number {
  return docs.reduce((acc, d) => acc + countRedactions(d, role), 0);
}

// Quick descriptor used in the data room list view.
export function documentAccessSummary(
  doc: DealDocument,
  role: Role,
): { visible: number; total: number; redacted: number } {
  const total = doc.fields.length;
  const visible = doc.fields.filter((f) => evaluateField(f, role).visible).length;
  return { visible, total, redacted: total - visible };
}

export function firstRedactionReason(
  doc: DealDocument,
  role: Role,
): string | null {
  const hiddenField = doc.fields.find((field) => !evaluateField(field, role).visible);
  if (!hiddenField) {
    return null;
  }
  return hiddenField.redactionReason ?? DEFAULT_REDACTION_REASON;
}

export function firstHiddenField(
  doc: DealDocument,
  role: Role,
): DocumentField | null {
  return doc.fields.find((field) => !evaluateField(field, role).visible) ?? null;
}

export function hiddenFieldLabels(
  doc: DealDocument,
  role: Role,
): string[] {
  return doc.fields
    .filter((field) => !evaluateField(field, role).visible)
    .map((field) => field.label);
}

export function documentAccessState(
  doc: DealDocument,
  role: Role,
): "open" | "partial" | "locked" {
  const { visible, total } = documentAccessSummary(doc, role);
  if (visible === 0 && total > 0) {
    return "locked";
  }
  if (visible === total) {
    return "open";
  }
  return "partial";
}

function sameRoleSet(left: Role[], right: Role[]) {
  if (left.length !== right.length) return false;
  const leftSorted = [...left].sort();
  const rightSorted = [...right].sort();
  return leftSorted.every((role, index) => role === rightSorted[index]);
}
