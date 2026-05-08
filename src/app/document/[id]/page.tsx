"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { PROJECT_CEDAR, ROLES } from "@/lib/mockData";
import { useRoleContext } from "@/lib/roleContext";
import { visibleFields } from "@/lib/redactionEngine";
import { RedactedField } from "@/components/RedactedField";
import { Badge } from "@/components/ui/badge";

const TYPE_LABEL: Record<string, string> = {
  term_sheet: "Term Sheet",
  pitch_deck: "Pitch Deck",
  financials: "Financials",
  side_letter: "Side Letter",
  kyc_aml: "KYC / AML",
  legal_opinion: "Legal Opinion",
  auditor_report: "Auditor Report",
  mnda: "MNDA",
};

const SENSITIVITY_TONE: Record<string, "muted" | "warning" | "danger"> = {
  standard: "muted",
  restricted: "warning",
  privileged: "danger",
};

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const { role, setLastViewedDocId } = useRoleContext();
  const id = params?.id;
  const doc = PROJECT_CEDAR.documents.find((d) => d.id === id);

  React.useEffect(() => {
    if (doc) {
      setLastViewedDocId(doc.id);
    }
  }, [doc, setLastViewedDocId]);

  if (!doc) {
    notFound();
  }

  const fvs = visibleFields(doc, role);
  const visibleCount = fvs.filter((f) => f.visible).length;
  const redactedCount = fvs.length - visibleCount;
  const watermark = role === "compliance_reviewer";
  const roleConfig = ROLES.find((r) => r.id === role)!;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Data room
      </Link>

      <header className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40">
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                {TYPE_LABEL[doc.type] ?? doc.type}
              </div>
              <h1 className="text-xl font-semibold text-slate-50 sm:text-2xl tracking-tight">
                {doc.title}
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                {doc.summary}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone={SENSITIVITY_TONE[doc.sensitivity]}>
                {doc.sensitivity}
              </Badge>
              <span className="font-mono text-xs text-slate-500">{doc.date}</span>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-3 sm:px-6">
          <Meta label="Source party" value={doc.sourceParty} />
          <Meta
            label="Active role"
            value={roleConfig.label}
          />
          <Meta
            label="Field access"
            value={`${visibleCount} visible · ${redactedCount} redacted`}
            mono
          />
        </dl>
      </header>

      {watermark ? (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-amber-900/60 bg-amber-950/40 px-4 py-2 text-xs text-amber-200">
          <Lock className="h-3.5 w-3.5" />
          Compliance-review session. Every field render is stamped to the audit log.
        </div>
      ) : null}

      <section
        key={role}
        className="field-fade mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2"
      >
        {fvs.map((fv) => (
          <RedactedField key={fv.field.id} fv={fv} watermark={watermark} />
        ))}
      </section>

      <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-500 sm:p-5">
        <div className="font-semibold text-slate-300">Audit posture</div>
        <p className="mt-1 leading-relaxed">
          This document carries {fvs.length} fields total. The redaction engine
          evaluates visibility per field against the active role, not at the document
          level. Counterparty access is intentionally narrow because the same data
          room serves co-lenders, borrower-side counsel, and unrelated third parties.
        </p>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-slate-100 ${mono ? "font-mono tabular-nums" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
