# Project Cedar: Multi-Role Diligence Workspace

> Concept-level mock built solo as a Riipen application artifact. Mock deal, mock parties, mock documents. Not derived from any internal source. Not affiliated with Acephalt.

## Problem framing

Mid-market diligence rooms get read by people with different jobs and different legitimate access boundaries. A credit analyst needs to underwrite the borrower. A compliance reviewer needs full visibility of beneficial owners and sanctions screens. An external counterparty (co-lender, borrower-side counsel, sometimes a rating agency) should see only the deal terms and clauses tied to their party. A generic "view-only" permission setting collapses these into one mode and forces lenders to keep sensitive material out of the room entirely. That is the pain point most data rooms solve poorly.

## Why three role lenses

Each role has different legitimate access needs. Treating role as a UI filter rather than a backend access decision is the safer scoping move for a workflow tool that lives next to a real data room. Three roles, not five, because three is what the diligence pattern actually carries: one party doing the underwriting, one party gatekeeping risk, one party with bilateral information rights. Adding more roles dilutes the argument.

| Role | Sees | Does not see |
|-|-|-|
| Investor Analyst | Deal terms, covenants, financials, audit reports, growth plan, KYC summary | Beneficial ownership detail, source-of-funds attestations, privileged counsel-to-counsel correspondence |
| Compliance Reviewer | Everything in the room, with an audit watermark on every render | Nothing. The watermark is the cost of full access. |
| External Counterparty | Top-level deal terms, MNDA terms, public auditor opinion, clauses tied to their party | Operating metrics, growth plan, full financials, side-letter detail not bilateral to them, KYC pack contents, lender-side legal opinion procedures, internal pricing rationale |

## Data model

```
Deal (1) ─── (N) Document (1) ─── (N) DocumentField
                                     │
                                     └── visibleTo: Role[]
                                     └── redactionReason: string
```

Field-level redaction, not document-level. The same document can have a public summary visible to the counterparty and a privileged annex visible only to compliance. That is closer to how diligence actually works than a binary "share this document or do not share it" gate. The cost is more thinking about per-field policy. The win is that lenders do not have to choose between sharing too much or splitting the same artifact into three different files for three different audiences.

## Redaction engine

`evaluateField(field, role)` returns `{ field, visible, reason }`. `visible` is `field.visibleTo.includes(role)`. `reason` is `field.redactionReason ?? defaultReason` when the field is hidden. Pure function, no I/O, no role context lookup, deterministic. Same engine drives the document list (counts), the audit ribbon (totals), and the document detail render (per-field). No parallel sources of truth.

A real implementation would push the same predicate down to the database layer. Either a row-level security policy on a `document_field` table keyed on `field_id, role`, or a server-side filter applied before the field set ever leaves the API. The point of the mock is that the policy lives in one place and the UI is a consumer of it, not the author of it.

## Audit ribbon

Persistent strip directly under the top bar. Shows the active role, the current redaction count for the active role across all documents in the room, the most recent document the user opened, and a generated session ID. The ribbon is the smallest visible artifact of a real audit log. In production it would write to an append-only log on every field-level access event, not just on document open.

## Stop conditions

The brief explicitly limits scope to two screens, mock JSON, and no backend. No LLM call. No real auth. No flagging or commenting flows. Anything beyond that is a different artifact.

## Honest disclaimer

Project Cedar is invented. Larkspur Software Holdings, Aldercrest Capital Partners, Cascade Pension Trust, Northbank Credit Partners, Holman & Yates, and Holloway & Reed are fictional. The redaction taxonomy in this mock is an opinion drawn from public diligence-workflow vocabulary, not a description of any internal Acephalt product or schema. The artifact is a contained scoping argument, not a system pitch.
