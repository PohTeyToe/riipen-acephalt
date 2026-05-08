// Field-level redaction engine for the diligence workspace mock.
// Pure functions, no I/O, no side effects, deterministic.

import type { DealDocument, DocumentField, Role } from "./types";

export type FieldVisibility = {
  field: DocumentField;
  visible: boolean;
  // Always populated when visible === false. Defaults to a generic notice if the
  // field author did not supply a redactionReason.
  reason: string | null;
};

const DEFAULT_REDACTION_REASON =
  "Restricted by role policy. Switch role to view if you have the appropriate access.";

export function evaluateField(
  field: DocumentField,
  role: Role,
): FieldVisibility {
  const visible = field.visibleTo.includes(role);
  return {
    field,
    visible,
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
  return doc.fields.filter((f) => !f.visibleTo.includes(role)).length;
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
  const visible = doc.fields.filter((f) => f.visibleTo.includes(role)).length;
  return { visible, total, redacted: total - visible };
}
