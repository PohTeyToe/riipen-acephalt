import { PROJECT_CEDAR } from "./mockData";
import { evaluateField, type FieldVisibility } from "./redactionEngine";
import type { DealDocument, DocumentField, Role } from "./types";

export type ClaimStatus =
  | "supported"
  | "conflicted"
  | "assumption"
  | "evidence_withheld";

export type ResolverAction = "keep" | "rewrite" | "escalate";

type CitationRef = {
  docId: string;
  fieldId: string;
};

export type MemoClaimSeed = {
  id: string;
  shortLabel: string;
  draft: string;
  whyItMatters: string;
  required: CitationRef[];
  context?: CitationRef[];
  conflicting?: CitationRef[];
  resolverCopy: Record<ClaimStatus, string>;
  nextAction: string;
};

export type EvaluatedCitation = {
  doc: DealDocument;
  field: DocumentField;
  visibility: FieldVisibility;
};

export type EvaluatedMemoClaim = MemoClaimSeed & {
  status: ClaimStatus;
  requiredEvidence: EvaluatedCitation[];
  contextEvidence: EvaluatedCitation[];
  conflictingEvidence: EvaluatedCitation[];
};

const MEMO_CLAIMS: MemoClaimSeed[] = [
  {
    id: "revenue-quality",
    shortLabel: "Revenue quality",
    draft:
      "ARR of USD 40.6M and NRR of 112% support the underwriting case at close.",
    whyItMatters:
      "This is the memo sentence that justifies conviction on growth quality rather than only on raw scale.",
    required: [
      { docId: "financials", fieldId: "revenue-history" },
      { docId: "pitch-deck", fieldId: "metrics" },
    ],
    resolverCopy: {
      supported:
        "Claim can stay in the memo as written. The growth and retention picture is directly evidenced for this role.",
      conflicted:
        "Claim should be rewritten. The visible evidence set does not agree on the quality of recurring revenue.",
      assumption:
        "Claim overreaches the current view. Carry it only as an assumption until the withheld operating metrics are reviewed.",
      evidence_withheld:
        "This role cannot defend the revenue-quality sentence from primary evidence.",
    },
    nextAction:
      "Open the pitch deck metrics and audited revenue history side by side before finalizing the IC summary.",
  },
  {
    id: "leverage-at-close",
    shortLabel: "Leverage at close",
    draft:
      "Adjusted leverage at close is approximately 5.6x on FY2025 EBITDA of USD 7.5M.",
    whyItMatters:
      "This sentence anchors whether the proposed structure looks merely aggressive or still financeable.",
    required: [
      { docId: "financials", fieldId: "ebitda" },
      { docId: "term-sheet", fieldId: "covenants" },
    ],
    resolverCopy: {
      supported:
        "Claim can stay in the memo. EBITDA support and covenant framing are both visible to this role.",
      conflicted:
        "Claim should be rewritten. The supporting EBITDA bridge and covenant story are not aligned.",
      assumption:
        "Claim should be qualified. This role sees part of the structure, but not enough to support the leverage sentence cleanly.",
      evidence_withheld:
        "This role cannot support the leverage sentence because the earnings-quality bridge is outside its view.",
    },
    nextAction:
      "Reconcile the EBITDA bridge against the term sheet covenant framing before carrying leverage language into the memo.",
  },
  {
    id: "kyc-clearance",
    shortLabel: "KYC clearance",
    draft:
      "KYC / AML review is complete, with no PEP exposure and no high-risk jurisdiction in the LP base.",
    whyItMatters:
      "This is the sentence that changes the memo from 'commercially attractive' to 'close-ready'.",
    required: [
      { docId: "kyc-aml", fieldId: "ownership" },
      { docId: "kyc-aml", fieldId: "sanctions" },
      { docId: "kyc-aml", fieldId: "source-of-funds" },
    ],
    context: [{ docId: "kyc-aml", fieldId: "summary-tag" }],
    resolverCopy: {
      supported:
        "Claim is defensible for this role. The underlying ownership, sanctions, and source-of-funds evidence is visible.",
      conflicted:
        "Claim should be paused. A visible conflict exists inside the KYC evidence set.",
      assumption:
        "This role can see that the pack is marked complete, but not the underlying fields required to defend the sentence.",
      evidence_withheld:
        "All proof for this claim sits behind the compliance-only boundary.",
    },
    nextAction:
      "Use the KYC status tag only as context. Do not carry the clearance sentence into the memo unless the full pack is visible to your role.",
  },
  {
    id: "mfn-risk",
    shortLabel: "MFN risk",
    draft:
      "The Cascade side letter is economically manageable and creates no material syndication ratchet risk.",
    whyItMatters:
      "This sentence determines whether the side letter is treated as a contained commercial wrinkle or a real execution risk.",
    required: [{ docId: "side-letter", fieldId: "mfn" }],
    conflicting: [{ docId: "side-letter", fieldId: "internal-cascade-notes" }],
    resolverCopy: {
      supported:
        "Claim can stay, but only because the visible evidence set does not expose the privileged ambiguity note.",
      conflicted:
        "Draft overstates certainty. Rewrite the memo to note that Cascade counsel flagged MFN ambiguity on information-rights scope.",
      assumption:
        "Claim should not be stated this strongly. This role lacks the privileged commentary needed to rule out drafting risk.",
      evidence_withheld:
        "This role cannot responsibly characterize the side-letter risk from visible evidence.",
    },
    nextAction:
      "Escalate the side letter if privileged commentary is visible; otherwise keep the sentence narrow and avoid claiming drafting certainty.",
  },
  {
    id: "pricing-tightening",
    shortLabel: "Pricing tightening",
    draft:
      "Pricing tightened from SOFR + 7.00% to SOFR + 6.50% because of market pressure, not credit deterioration.",
    whyItMatters:
      "This sentence reframes tighter economics as competitive pressure rather than a weakening credit case.",
    required: [
      { docId: "term-sheet", fieldId: "internal-pricing-notes" },
      { docId: "term-sheet", fieldId: "facility-overview" },
    ],
    resolverCopy: {
      supported:
        "Claim can stay in the memo. The visible pricing rationale supports a market-pressure explanation.",
      conflicted:
        "Claim should be rewritten. The visible rationale and final economics tell different stories.",
      assumption:
        "Claim should be qualified. This role can see the final pricing but not the internal rationale behind the tightening.",
      evidence_withheld:
        "This role sees the facility terms, but not the internal note needed to defend the pricing narrative.",
    },
    nextAction:
      "Keep the pricing sentence tied to visible evidence. If the rationale note is withheld, avoid inferring motive.",
  },
  {
    id: "legal-open-point",
    shortLabel: "Legal open point",
    draft:
      "One open legal point remains on subsidiary guarantor release treatment at the time of memo circulation.",
    whyItMatters:
      "This is the kind of unresolved drafting issue that changes memo confidence even when commercial terms still look good.",
    required: [{ docId: "legal-opinion", fieldId: "privileged-correspondence" }],
    context: [{ docId: "legal-opinion", fieldId: "scope" }],
    resolverCopy: {
      supported:
        "Claim should stay in the memo. The privileged correspondence directly confirms the unresolved point.",
      conflicted:
        "Claim should be rewritten. The visible legal packet does not support a clean unresolved-point narrative.",
      assumption:
        "Claim should be marked as assumption only. This role sees the opinion scope but not the privileged comment trail.",
      evidence_withheld:
        "The underlying legal discussion is fully outside this role's view.",
    },
    nextAction:
      "If privileged correspondence is visible, escalate the open point into the deal-risk section before the memo circulates.",
  },
];

export function getMemoClaims(): MemoClaimSeed[] {
  return MEMO_CLAIMS;
}

export function evaluateMemoClaim(
  claim: MemoClaimSeed,
  role: Role,
): EvaluatedMemoClaim {
  const requiredEvidence = claim.required.map((ref) => evaluateCitation(ref, role));
  const contextEvidence = (claim.context ?? []).map((ref) => evaluateCitation(ref, role));
  const conflictingEvidence = (claim.conflicting ?? []).map((ref) =>
    evaluateCitation(ref, role),
  );

  const visibleRequired = requiredEvidence.filter((entry) => entry.visibility.visible);
  const visibleContext = contextEvidence.filter((entry) => entry.visibility.visible);
  const visibleConflict = conflictingEvidence.filter((entry) => entry.visibility.visible);

  let status: ClaimStatus;
  if (visibleConflict.length > 0) {
    status = "conflicted";
  } else if (visibleRequired.length === requiredEvidence.length) {
    status = "supported";
  } else if (visibleRequired.length > 0 || visibleContext.length > 0) {
    status = "assumption";
  } else {
    status = "evidence_withheld";
  }

  return {
    ...claim,
    status,
    requiredEvidence,
    contextEvidence,
    conflictingEvidence,
  };
}

export function claimsAffectedCount(role: Role) {
  return getMemoClaims()
    .map((claim) => evaluateMemoClaim(claim, role))
    .filter((claim) => claim.status !== "supported").length;
}

export function defaultResolverAction(status: ClaimStatus): ResolverAction {
  if (status === "supported") return "keep";
  if (status === "conflicted") return "rewrite";
  return "escalate";
}

function evaluateCitation(ref: CitationRef, role: Role): EvaluatedCitation {
  const doc = PROJECT_CEDAR.documents.find((candidate) => candidate.id === ref.docId);
  if (!doc) {
    throw new Error(`Unknown memo citation document: ${ref.docId}`);
  }
  const field = doc.fields.find((candidate) => candidate.id === ref.fieldId);
  if (!field) {
    throw new Error(`Unknown memo citation field: ${ref.docId}.${ref.fieldId}`);
  }
  return {
    doc,
    field,
    visibility: evaluateField(field, role),
  };
}

