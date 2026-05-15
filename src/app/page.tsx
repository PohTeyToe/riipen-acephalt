"use client";

import * as React from "react";
import Link from "next/link";
import { PROJECT_CEDAR, ROLES } from "@/lib/mockData";
import { useRoleContext } from "@/lib/roleContext";
import { DocumentRow } from "@/components/DocumentRow";
import {
  documentAccessState,
  documentAccessSummary,
  firstHiddenField,
  firstRedactionReason,
  totalRedactions,
} from "@/lib/redactionEngine";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Briefcase,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

const ROLE_ACCENT: Record<string, string> = {
  investor_analyst: "var(--role-investor)",
  compliance_reviewer: "var(--role-compliance)",
  external_counterparty: "var(--role-counterparty)",
};

export default function DataRoomPage() {
  const { role } = useRoleContext();
  const deal = PROJECT_CEDAR;
  const roleConfig = ROLES.find((r) => r.id === role)!;
  const redacted = totalRedactions(deal.documents, role);
  const totalFields = deal.documents.reduce((acc, d) => acc + d.fields.length, 0);
  const hotspots = deal.documents
    .map((doc) => {
      const access = documentAccessSummary(doc, role);
      const hiddenField = firstHiddenField(doc, role);
      return {
        doc,
        access,
        hiddenField,
        reason: firstRedactionReason(doc, role),
      };
    })
    .filter((entry) => entry.access.redacted > 0)
    .sort((a, b) => b.access.redacted - a.access.redacted)
    .slice(0, 3);
  const sortedDocuments = [...deal.documents].sort((a, b) => {
    const stateOrder = { partial: 0, locked: 1, open: 2 };
    const aState = documentAccessState(a, role);
    const bState = documentAccessState(b, role);
    if (stateOrder[aState] !== stateOrder[bState]) {
      return stateOrder[aState] - stateOrder[bState];
    }
    const aRedacted = documentAccessSummary(a, role).redacted;
    const bRedacted = documentAccessSummary(b, role).redacted;
    return bRedacted - aRedacted;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <section
        key={role}
        className="field-fade rounded-lg border border-slate-800 bg-slate-900/40 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]"
      >
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <Briefcase className="h-3.5 w-3.5" />
                Active deal
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-[28px]">
                {deal.codename}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                <span className="text-slate-300">{deal.borrower}</span>
                <span className="px-2 text-slate-600">/</span>
                {deal.borrowerSector}
                <span className="px-2 text-slate-600">/</span>
                {deal.facility}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone="info">{deal.status.replaceAll("_", " ")}</Badge>
              <span className="font-mono text-xs text-slate-500">
                Close target {deal.closeTarget}
              </span>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-4 sm:px-6">
          <Stat label="Facility size" value={deal.size} mono />
          <Stat label="Vintage" value={deal.vintage} mono />
          <Stat label="Lead arranger" value={deal.lead.replace("Lead Arranger: ", "")} />
          <Stat label="Documents" value={`${deal.documents.length} in room`} mono />
        </dl>
      </section>

      <section
        key={`posture-${role}`}
        className="field-fade relative mt-4 flex items-start gap-3 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30 px-5 py-3.5 text-sm sm:px-6"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-0.5"
          style={{ backgroundColor: ROLE_ACCENT[role] }}
        />
        <ShieldAlert
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: ROLE_ACCENT[role] }}
        />
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Active posture
            </span>
            <span className="text-sm font-medium text-slate-100">
              {roleConfig.label}
            </span>
            <span className="font-mono text-xs tabular-nums text-slate-500">
              / {redacted}/{totalFields} fields redacted
            </span>
          </div>
          <p className="max-w-3xl text-xs leading-relaxed text-slate-400">
            {roleConfig.description}
          </p>
        </div>
      </section>

      {hotspots.length > 0 ? (
        <section className="mt-4 rounded-lg border border-slate-800 bg-slate-950/35">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-100">
                Where this role hits trust boundaries
              </h2>
            </div>
          </div>
          <div className="grid gap-px bg-slate-800 sm:grid-cols-3">
            {hotspots.map(({ doc, access, hiddenField, reason }) => (
              <Link
                key={doc.id}
                href={`/document/${doc.id}${hiddenField ? `?focus=${hiddenField.id}` : ""}`}
                className="group bg-slate-950/70 px-5 py-4 transition-colors hover:bg-slate-950 sm:px-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-slate-100 group-hover:text-white">
                      {doc.title}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">
                      {access.visible}/{access.total} visible
                    </div>
                  </div>
                  <Badge tone={access.visible === 0 ? "danger" : "warning"}>
                    {access.redacted} hidden
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {reason}
                </p>
                {hiddenField ? (
                  <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Jump to {hiddenField.label}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-6 rounded-lg border border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6">
          <h2 className="text-sm font-semibold text-slate-100">Data room contents</h2>
          <span className="text-[11px] uppercase tracking-wider text-slate-500">
            {deal.documents.length} documents
          </span>
        </div>
        <div className="hidden border-b border-slate-800/80 bg-slate-950/60 px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:grid sm:grid-cols-12 sm:gap-x-4">
          <div className="col-span-5">Document</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Sensitivity</div>
          <div className="col-span-1 text-right">Access</div>
        </div>
        <div key={`docs-${role}`} className="field-fade divide-y divide-slate-900">
          {sortedDocuments.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} role={role} />
          ))}
        </div>
      </section>

      <p className="mt-6 inline-flex items-center gap-1 text-xs text-slate-500">
        Click a hotspot or document row to inspect the exact policy outcome.
        <ChevronRight className="h-3.5 w-3.5" />
      </p>
    </div>
  );
}

function Stat({
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
