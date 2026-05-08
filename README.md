# Acephalt Diligence Workspace: Project Cedar (concept mock)

Concept-level mock built solo as a Riipen application artifact. Mock deal, mock parties, mock documents. Project Cedar is invented. Not derived from any internal source. Not affiliated with Acephalt. Visual styling is generic-fintech-shaped, not a clone of their product.

## What it is

A small mid-market data room rendered through three role lenses with field-level redaction and a persistent audit ribbon. Two screens, mock JSON data, no backend.

The point is to argue for one specific scoping choice. Diligence is messy because the same set of fund documents gets read by an investor analyst chasing returns, a compliance reviewer flagging exposure, and a counterparty who should only see redacted slices. That role-aware trust layer is where most data-room tooling either underbuilds or fakes it with permissions theater. Better to scope a single contained slice than pitch a generic "AI for data rooms" copilot.

## Roles

- `investor_analyst`: underwrites the credit. Sees deal terms, projections, and most diligence artifacts. Sensitive party identifiers and privileged legal correspondence are masked.
- `compliance_reviewer`: owns KYC/AML and conflicts checks. Sees full party identifiers and beneficial ownership. Every field carries an audit watermark while in this view.
- `external_counterparty`: borrower-side or co-lender contact. Sees only the top-level deal terms and clauses tied to their party. Internal commentary, financials, and other counterparties' fields are hidden.

The role switcher in the top bar is a dev affordance, not a real auth flow. Switching role re-renders the same data through the redaction engine. No page reload.

## Stack

- Next.js 16 (App Router) with TypeScript strict
- React 19
- Tailwind CSS v4 (CSS-driven theme)
- Radix primitives (Dialog, Slot) under shadcn-style component wrappers
- Lucide icons

## Run it

```
npm install
npm run dev
```

Visit http://localhost:3000. Use the role toggle in the top right. Click any document to see the field-by-field redaction render.

```
npm run build
npm run start
```

## Mock data shape

`src/lib/mockData.ts` contains a single `Deal` (Project Cedar, a USD 42M senior secured term loan to a fictional vertical SaaS borrower) with eight documents: term sheet, pitch deck, borrower financials, side letter, KYC/AML pack, legal opinion, auditor report, and a counterparty MNDA. Each document carries 3 to 6 fields. Every field is tagged with the roles allowed to see it and a redaction reason explaining why others cannot.

The redaction engine in `src/lib/redactionEngine.ts` is a pure function over `(document, role) -> field[]`. It runs per render. Counts surfaced in the audit ribbon and the data room list come from the same function. No parallel state.

## Disclaimer

Concept-level mock. Project Cedar is invented. All borrower names, sponsors, counsel, and side-letter parties in this demo are fictional. The redaction model and role taxonomy are an opinion, not a description of any internal Acephalt product or schema. Built as a Riipen application artifact.
