# Acephalt Diligence Workspace: Project Cedar

Scoped prototype built solo as a Riipen application artifact. Project Cedar, the deal data, and all parties are invented. The artifact does not rely on internal Acephalt source material or imply affiliation.

## What it is

A small mid-market data room rendered through three role lenses with field-level redaction, room-level access hotspots, and seeded audit telemetry. Two screens, sample JSON data, no backend.

The point is to argue for one specific scoping choice. Diligence is messy because the same set of fund documents gets read by an investor analyst chasing returns, a compliance reviewer flagging exposure, and a counterparty who should only see redacted slices. That role-aware trust layer is where most data-room tooling either underbuilds or fakes it with permissions theater. Better to scope a single contained slice than pitch a generic "AI for data rooms" copilot.

The Acephalt-specific bet is narrower than that: if Acephalt's V3 framing is serious about becoming part of the operating system for investment decisions, the platform eventually has to own policy outcomes inside the room, not just workflow around it.

## Roles

- `investor_analyst`: underwrites the credit. Sees deal terms, projections, and most diligence artifacts. Sensitive party identifiers and privileged legal correspondence are masked.
- `compliance_reviewer`: owns KYC/AML and conflicts checks. Sees full party identifiers and beneficial ownership. Every field carries an audit watermark while in this view.
- `external_counterparty`: borrower-side or co-lender contact. Sees only the top-level deal terms and clauses tied to their party. Internal commentary, financials, and other counterparties' fields are hidden.

The role switcher in the top bar is a prototype lens, not a real auth flow. It re-renders the same document set through the policy engine so the access differences can be compared quickly.

## Stack

- Next.js 16 (App Router) with TypeScript strict
- React 19
- Tailwind CSS v4 (CSS-driven theme)
- Radix primitives (Dialog, Slot) under shadcn-style component wrappers
- Lucide icons

## Run it

```bash
npm install
npm run dev
```

Visit http://localhost:3000. Use the role toggle in the top right. Click any document to see the field-by-field redaction render.

The room view now surfaces the sharpest trust boundaries for the active role before you open a document. The document view shows the same file across all three role lenses and calls out exactly which fields disappear for each reviewer type.

```bash
npm run build
npm run start
```

## Mock data shape

`src/lib/mockData.ts` contains a single `Deal` (Project Cedar, a USD 42M senior secured term loan to a fictional vertical SaaS borrower) with eight documents: term sheet, pitch deck, borrower financials, side letter, KYC/AML pack, legal opinion, auditor report, and a counterparty MNDA. Each document carries 3 to 6 fields. Every field is tagged with the roles allowed to see it and a redaction reason explaining why others cannot.

The redaction engine in `src/lib/redactionEngine.ts` is a pure function over `(document, role) -> field[]`. It runs per render. Counts surfaced in the hotspot cards, audit ribbon, and data room list all come from the same function. No parallel state.

## Disclaimer

Project Cedar is invented. All borrower names, sponsors, counsel, and side-letter parties in this demo are fictional. The redaction model and role taxonomy are an opinionated prototype surface, not a description of any internal Acephalt product or schema.
