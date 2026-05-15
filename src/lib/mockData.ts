// Project Cedar (invented) is a mid-market private credit deal used as a concept-level
// data room for the Acephalt diligence workspace mock. Not a real deal. Not derived
// from any internal Acephalt source.

import type { Deal, RoleConfig } from "./types";

export const ROLES: RoleConfig[] = [
  {
    id: "investor_analyst",
    label: "Investor Analyst",
    shortLabel: "Analyst",
    description:
      "Underwrites the credit. Sees deal terms, projections, and most diligence artifacts. Sensitive party identifiers and privileged legal correspondence are masked.",
    badgeColor: "bg-blue-900 text-blue-100",
  },
  {
    id: "compliance_reviewer",
    label: "Compliance Reviewer",
    shortLabel: "Compliance",
    description:
      "Owns KYC/AML and conflicts checks. Sees full party identifiers and beneficial ownership. Every field carries an audit watermark while in this view.",
    badgeColor: "bg-amber-900 text-amber-100",
  },
  {
    id: "external_counterparty",
    label: "External Counterparty",
    shortLabel: "Counterparty",
    description:
      "Borrower-side or co-lender contact. Sees only the top-level deal terms and clauses tied to their party. Internal commentary, financials, and other counterparties' fields are hidden.",
    badgeColor: "bg-slate-700 text-slate-100",
  },
];

export const PROJECT_CEDAR: Deal = {
  id: "cedar-2026-q3",
  codename: "Project Cedar",
  borrower: "Larkspur Software Holdings, Inc.",
  borrowerSector: "Vertical SaaS for field service operators",
  vintage: "2026 Q3",
  size: "USD 42,000,000",
  facility: "Senior Secured Term Loan, 5-year, SOFR + 6.50%",
  closeTarget: "2026-09-30",
  status: "due_diligence",
  lead: "Lead Arranger: Northbank Credit Partners",
  documents: [
    {
      id: "term-sheet",
      title: "Term Sheet · Project Cedar",
      type: "term_sheet",
      date: "2026-07-22",
      sourceParty: "Northbank Credit Partners",
      sensitivity: "standard",
      summary:
        "Indicative terms for a USD 42M senior secured term loan to Larkspur Software Holdings.",
      fields: [
        {
          id: "facility-overview",
          label: "Facility overview",
          rows: [
            { key: "Borrower", value: "Larkspur Software Holdings, Inc." },
            { key: "Facility", value: "Senior Secured Term Loan" },
            { key: "Commitment", value: "USD 42,000,000" },
            { key: "Tenor", value: "5 years (bullet)" },
            { key: "Pricing", value: "SOFR + 6.50%, 1.00% floor" },
            { key: "Upfront fee", value: "2.00%" },
          ],
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
        {
          id: "covenants",
          label: "Financial covenants",
          rows: [
            { key: "Total Net Leverage", value: "<= 4.75x, stepping to 4.00x by Y3" },
            { key: "Interest Coverage", value: ">= 2.25x" },
            { key: "Minimum Liquidity", value: "USD 5,000,000" },
            { key: "ARR Floor", value: "USD 38,000,000 trailing twelve months" },
          ],
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
        {
          id: "use-of-proceeds",
          label: "Use of proceeds",
          body:
            "Refinance USD 24M existing senior facility, fund USD 12M tuck-in acquisition of a regional dispatch software vendor, USD 4M for working capital, USD 2M for fees and expenses.",
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
        {
          id: "internal-pricing-notes",
          label: "Lead arranger pricing rationale",
          body:
            "Northbank credit committee discussed a SOFR + 7.00% open at the September 4 IC meeting. Pricing tightened on the second draft after the sponsor flagged a competing term sheet from a direct lender. The stretch-case scenario assumes a 50bps tightening at syndication.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Lead arranger internal pricing memo. Not shareable with counterparties.",
        },
      ],
    },
    {
      id: "pitch-deck",
      title: "Borrower Pitch Deck · Larkspur Software",
      type: "pitch_deck",
      date: "2026-06-30",
      sourceParty: "Larkspur Software Holdings, Inc.",
      sensitivity: "standard",
      summary:
        "Borrower-prepared lender deck. Concept-level summary of business, GTM, and growth plan.",
      fields: [
        {
          id: "company-overview",
          label: "Company overview",
          body:
            "Larkspur Software Holdings is a vertical SaaS provider for field service operators in HVAC, plumbing, and electrical trades. Founded 2017. Headquartered in Charlotte, NC. Approximately 280 employees across product, engineering, sales, and customer success.",
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
        {
          id: "metrics",
          label: "Key operating metrics",
          rows: [
            { key: "ARR (TTM)", value: "USD 41.2M" },
            { key: "Net Revenue Retention", value: "112%" },
            { key: "Gross Margin", value: "78%" },
            { key: "Active Customers", value: "2,140" },
            { key: "Logo Concentration (top 10)", value: "14.3%" },
            { key: "Magic Number (LTM)", value: "0.71" },
          ],
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Lender-side model inputs. Counterparty access to ARR, NRR, and margin would expose the sponsor's negotiating range before syndication closes.",
        },
        {
          id: "growth-plan",
          label: "3-year growth plan",
          body:
            "Borrower plans to reach USD 68M ARR by FYE 2029 via product-led expansion in adjacent trades, a tuck-in of a regional dispatch vendor (target included in use-of-proceeds), and a price-increase program targeting customers below the median ARPU.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Forward plan used for lender underwriting. Counterparty access would leak the expansion case before final paper is signed.",
        },
      ],
    },
    {
      id: "financials",
      title: "Borrower Financials · 3-year audited",
      type: "financials",
      date: "2026-06-15",
      sourceParty: "Larkspur Software Holdings, Inc.",
      sensitivity: "restricted",
      summary:
        "Audited income statement and balance sheet snapshots for FY2023, FY2024, FY2025.",
      fields: [
        {
          id: "revenue-history",
          label: "Revenue history",
          rows: [
            { key: "FY2023 Revenue", value: "USD 28.4M" },
            { key: "FY2024 Revenue", value: "USD 35.1M" },
            { key: "FY2025 Revenue", value: "USD 40.6M" },
            { key: "FY2025 Subscription Mix", value: "94%" },
          ],
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Underwriting support for lender-side reviewers. Counterparty access is limited to the negotiated deal package, not the borrower model.",
        },
        {
          id: "ebitda",
          label: "Adjusted EBITDA bridge",
          rows: [
            { key: "FY2025 GAAP EBITDA", value: "USD 4.1M" },
            { key: "Stock-based comp add-back", value: "USD 2.8M" },
            { key: "Acquisition transaction costs", value: "USD 0.6M" },
            { key: "FY2025 Adjusted EBITDA", value: "USD 7.5M" },
          ],
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Internal lender view of earnings quality. Counterparty access would expose the adjustment logic behind pricing and leverage.",
        },
        {
          id: "balance-sheet",
          label: "Balance sheet snapshot (FY2025)",
          rows: [
            { key: "Cash & equivalents", value: "USD 8.9M" },
            { key: "Deferred revenue", value: "USD 14.2M" },
            { key: "Existing senior debt", value: "USD 24.0M" },
            { key: "Total stockholders' equity", value: "USD 18.6M" },
          ],
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Borrower balance-sheet detail used for lender diligence. Not part of the external counterparty packet.",
        },
        {
          id: "concentration",
          label: "Customer concentration table",
          body:
            "Top 5 customers represent 9.4% of ARR. Top 25 customers represent 26.1% of ARR. No single customer exceeds 2.5% of ARR. Reviewer should reconcile against the customer ledger in Annex C of the auditor report.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Borrower concentration detail shapes lender risk views. Counterparty access would reveal the customer book behind the credit case.",
        },
      ],
    },
    {
      id: "side-letter",
      title: "Side Letter · Anchor Co-Lender",
      type: "side_letter",
      date: "2026-08-04",
      sourceParty: "Northbank Credit Partners / Cascade Pension Trust",
      sensitivity: "privileged",
      summary:
        "Bilateral side letter granting Cascade Pension Trust most-favored-nation status on fees and certain reporting rights.",
      fields: [
        {
          id: "mfn",
          label: "Most-favored-nation clause",
          body:
            "If, during the syndication period, the Lead Arranger grants any other Lender economic terms more favorable than those granted to Cascade Pension Trust under the Credit Agreement, those terms shall automatically extend to Cascade on a no-fee basis.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Side letter is bilateral between Northbank and Cascade. Not visible to other counterparties.",
        },
        {
          id: "reporting",
          label: "Enhanced reporting rights",
          body:
            "Borrower shall deliver monthly ARR, NRR, and gross margin metrics to Cascade within 15 business days of month-end, in addition to the quarterly compliance certificate delivered to all Lenders.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Side letter is bilateral. Not shareable outside the named counterparties.",
        },
        {
          id: "internal-cascade-notes",
          label: "Cascade Pension Trust counsel commentary",
          body:
            "Cascade's outside counsel flagged the MFN drafting on August 1, 2026 as ambiguous on the question of whether non-economic terms (information rights, board observer rights) are also covered. Northbank counter-proposed restricting MFN to economic terms only on August 3.",
          visibleTo: ["compliance_reviewer"],
          redactionReason:
            "Privileged counsel-to-counsel commentary. Compliance review only.",
        },
      ],
    },
    {
      id: "kyc-aml",
      title: "KYC / AML Pack · Borrower Beneficial Owners",
      type: "kyc_aml",
      date: "2026-07-08",
      sourceParty: "Larkspur Software Holdings, Inc.",
      sensitivity: "privileged",
      summary:
        "Beneficial ownership disclosure, sanctions screening, and source-of-funds verification.",
      fields: [
        {
          id: "ownership",
          label: "Beneficial ownership > 10%",
          rows: [
            { key: "Sponsor · Aldercrest Capital Partners IV", value: "62.4%" },
            { key: "Founder · A. Maddox", value: "11.8%" },
            { key: "Co-founder · R. Patel", value: "10.2%" },
          ],
          visibleTo: ["compliance_reviewer"],
          redactionReason:
            "Beneficial ownership detail. Restricted to compliance reviewers under deal NDA.",
        },
        {
          id: "sanctions",
          label: "Sanctions screening result",
          body:
            "All disclosed beneficial owners and authorized signatories cleared OFAC, EU consolidated, and HMT sanctions screens on 2026-07-07. No politically exposed persons identified. Refresh scheduled at close and every 12 months thereafter.",
          visibleTo: ["compliance_reviewer"],
          redactionReason:
            "Sanctions screening detail. Compliance review only.",
        },
        {
          id: "source-of-funds",
          label: "Sponsor source-of-funds attestation",
          body:
            "Aldercrest Capital Partners IV provided LP commitment register and audited fund statements as of 2026-03-31. Source-of-funds review complete. No high-risk jurisdiction exposure identified at the LP level.",
          visibleTo: ["compliance_reviewer"],
          redactionReason:
            "Source-of-funds detail. Compliance review only.",
        },
        {
          id: "summary-tag",
          label: "KYC/AML status",
          rows: [
            { key: "Pack status", value: "Complete" },
            { key: "Last refreshed", value: "2026-07-08" },
            { key: "Next refresh due", value: "2027-07-08" },
          ],
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "KYC pack contents are restricted; counterparties see only deal-level acknowledgements elsewhere.",
        },
      ],
    },
    {
      id: "legal-opinion",
      title: "Legal Opinion · Borrower Counsel",
      type: "legal_opinion",
      date: "2026-08-12",
      sourceParty: "Holloway & Reed LLP (Borrower Counsel)",
      sensitivity: "restricted",
      summary:
        "Customary enforceability and corporate authority opinion delivered at signing.",
      fields: [
        {
          id: "scope",
          label: "Scope of opinion",
          body:
            "Opinion addresses the due authorization, execution, and delivery of the Credit Agreement and Security Documents by the Borrower, and the enforceability of those documents under New York law, subject to customary qualifications (bankruptcy, equitable principles, fraudulent transfer).",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Legal opinion delivered to lenders. Not part of the counterparty information bundle.",
        },
        {
          id: "qualifications",
          label: "Material qualifications",
          body:
            "Opinion is qualified by the standard exceptions to enforceability and excludes any opinion on (i) federal or state securities laws, (ii) tax matters, and (iii) the perfection of security interests in deposit accounts not held with a Permitted Bank.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Legal opinion delivered to lenders only.",
        },
        {
          id: "privileged-correspondence",
          label: "Counsel-to-counsel correspondence",
          body:
            "Borrower counsel and Lead Arranger counsel exchanged comments between July 30 and August 11, 2026. Twelve drafting points were resolved; one remains open at the time of this disclosure (treatment of subsidiary guarantor releases on a permitted disposition).",
          visibleTo: ["compliance_reviewer"],
          redactionReason:
            "Privileged counsel-to-counsel correspondence. Compliance review only.",
        },
      ],
    },
    {
      id: "auditor-report",
      title: "Auditor Report · FY2025",
      type: "auditor_report",
      date: "2026-04-18",
      sourceParty: "Holman & Yates LLP (Independent Auditor)",
      sensitivity: "restricted",
      summary:
        "Unqualified opinion on FY2025 financial statements with two key audit matters.",
      fields: [
        {
          id: "opinion",
          label: "Auditor opinion",
          body:
            "In our opinion, the consolidated financial statements present fairly, in all material respects, the financial position of Larkspur Software Holdings, Inc. as of December 31, 2025, and the results of its operations and its cash flows for the year then ended, in conformity with US GAAP.",
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
        {
          id: "kam-revenue",
          label: "Key audit matter / revenue recognition",
          body:
            "Subscription revenue is recognized ratably over the contract term. We tested management's allocation of transaction price across performance obligations on a sample of 42 customer contracts representing 31% of FY2025 revenue. No material misstatements identified.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Detailed audit procedures restricted to lender-side reviewers.",
        },
        {
          id: "kam-acquisition",
          label: "Key audit matter / purchase price allocation",
          body:
            "FY2024 acquisition of MeridianRoute, Inc. resulted in USD 6.2M of goodwill. We tested the underlying valuation, including the discount rate (12.4%) and customer attrition assumption (8% per annum), and found the assumptions to be within an acceptable range.",
          visibleTo: ["investor_analyst", "compliance_reviewer"],
          redactionReason:
            "Detailed audit procedures restricted to lender-side reviewers.",
        },
      ],
    },
    {
      id: "mnda",
      title: "Mutual NDA · Counterparty Engagement",
      type: "mnda",
      date: "2026-06-02",
      sourceParty: "Larkspur Software Holdings, Inc. / Cascade Pension Trust",
      sensitivity: "standard",
      summary:
        "Mutual non-disclosure agreement governing the diligence exchange.",
      fields: [
        {
          id: "term",
          label: "Term and survival",
          body:
            "Two-year term from the effective date. Confidentiality obligations survive for an additional three years following termination. Trade secrets remain confidential for as long as they qualify as trade secrets under applicable law.",
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
        {
          id: "permitted-use",
          label: "Permitted use",
          body:
            "Confidential Information may be used solely to evaluate the proposed financing transaction and may be shared with employees, advisors, and rating agencies on a need-to-know basis, provided each recipient is bound by confidentiality obligations no less protective than this Agreement.",
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
        {
          id: "exceptions",
          label: "Exceptions",
          body:
            "Standard four-corner exceptions: information that is or becomes publicly available without breach; was known prior to disclosure without confidentiality obligation; is independently developed without use of Confidential Information; or is rightfully obtained from a third party without confidentiality obligation.",
          visibleTo: [
            "investor_analyst",
            "compliance_reviewer",
            "external_counterparty",
          ],
        },
      ],
    },
  ],
};
