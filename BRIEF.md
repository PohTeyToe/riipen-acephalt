# Project Cedar: Multi-Role Diligence Workspace

> Scoped prototype built solo as a Riipen application artifact. Project Cedar, the deal data, and all parties are invented. Not derived from internal Acephalt source material and not presented as affiliated work.

## Problem framing

Acephalt's V3 framing points toward an operating system for investment decisions. Project Cedar takes that logic one layer down: if the platform owns the workflow around diligence, it eventually has to own the trust boundary inside the room as well. The scoping bet here is that field-level policy outcomes are one of the smallest believable surfaces where that claim becomes visible.

Mid-market diligence rooms get read by people with different jobs and different legitimate access boundaries. A credit analyst needs to underwrite the borrower. A compliance reviewer needs full visibility of beneficial owners and sanctions screens. An external counterparty (co-lender, borrower-side counsel, sometimes a rating agency) should see only the deal terms and clauses tied to their party. A generic "view-only" permission setting collapses these into one mode and forces lenders to keep sensitive material out of the room entirely.

## Why three role lenses

Each role has different legitimate access needs. This prototype visualizes the outcome of a backend policy decision rather than pretending the browser is the enforcement layer. Three roles, not five, because three is what the diligence pattern actually carries: one party doing the underwriting, one party gatekeeping risk, one party with bilateral information rights. Adding more roles dilutes the argument.

| Role | Sees | Does not see |
| - | - | - |
| Investor Analyst | Deal terms, covenants, financials, audit reports, growth plan, KYC summary | Beneficial ownership detail, source-of-funds attestations, privileged counsel-to-counsel correspondence |
| Compliance Reviewer | Everything in the room, with an audit watermark on every render | Nothing. The watermark is the cost of full access. |
| External Counterparty | Top-level deal terms, MNDA terms, public auditor opinion, clauses tied to their party | Operating metrics, growth plan, full financials, side-letter detail not bilateral to them, KYC pack contents, lender-side legal opinion procedures, internal pricing rationale |

## Data model

```text
Deal (1) -> (N) Document (1) -> (N) DocumentField
DocumentField.visibleTo: Role[]
DocumentField.redactionReason: string
```

Field-level redaction, not document-level. The same document can have a public summary visible to the counterparty and a privileged annex visible only to compliance. That is closer to how diligence actually works than a binary "share this document or do not share it" gate. The cost is more thinking about per-field policy. The win is that lenders do not have to choose between sharing too much or splitting the same artifact into three different files for three different audiences.

## Redaction engine

`evaluateField(field, role)` returns `{ field, visible, reason }`. `visible` is `field.visibleTo.includes(role)`. `reason` is `field.redactionReason ?? defaultReason` when the field is hidden. Pure function, no I/O, no role context lookup, deterministic. The same engine now drives the document list counts, the hotspot callouts, the cross-role document comparison, the audit ribbon totals, and the per-field render. No parallel sources of truth.

A real implementation would push the same predicate down to the database layer. Either a row-level security policy on a `document_field` table keyed on `field_id, role`, or a server-side filter applied before the field set ever leaves the API. The point of the prototype is that the policy lives in one place and the UI is a consumer of it, not the author of it.

## Fast-read surfaces

The room view now does two extra jobs before a reviewer opens a document:

- it shows the highest-friction access hotspots for the active role
- it previews the first redaction reason under each document row

The document view adds a compact three-role comparison strip so the same file can be read through all three access lenses at a glance. That makes the redaction thesis legible without a lot of role toggling.

## Audit ribbon

Persistent strip directly under the top bar. Shows the active role, the current redaction count for the active role across all documents in the room, the most recent document the reviewer opened, a policy version, and seeded sample telemetry. The ribbon is a prototype view of what a real audit layer would expose. In production it would write to an append-only log on every field-level access event, not just on document open.

## Stop conditions

The brief explicitly limits scope to two screens, sample JSON, and no backend. No LLM call. No real auth. No flagging or commenting flows. Anything beyond that is a different artifact.

## Honest disclaimer

Project Cedar is invented. Larkspur Software Holdings, Aldercrest Capital Partners, Cascade Pension Trust, Northbank Credit Partners, Holman & Yates, and Holloway & Reed are fictional. The redaction taxonomy in this prototype is an opinion drawn from public diligence-workflow vocabulary, not a description of any internal Acephalt product or schema. The artifact is a contained scoping argument, not a system pitch.
