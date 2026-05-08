"use client";

import * as React from "react";
import { PROJECT_CEDAR, ROLES } from "@/lib/mockData";
import { useRoleContext } from "@/lib/roleContext";
import { DocumentRow } from "@/components/DocumentRow";
import { totalRedactions } from "@/lib/redactionEngine";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ChevronRight, ShieldAlert } from "lucide-react";

export default function DataRoomPage() {
  const { role } = useRoleContext();
  const deal = PROJECT_CEDAR;
  const roleConfig = ROLES.find((r) => r.id === role)!;
  const redacted = totalRedactions(deal.documents, role);
  const totalFields = deal.documents.reduce((acc, d) => acc + d.fields.length, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Deal header card */}
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
              <h1 className="text-2xl font-semibold text-slate-50 sm:text-[28px] tracking-tight">
                {deal.codename}
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl">
                {deal.borrower}. {deal.borrowerSector}. {deal.facility}.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone="info">{deal.status.replaceAll("_", " ")}</Badge>
              <span className="text-xs text-slate-500 font-mono">
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

      {/* Role posture banner */}
      <section
        key={`posture-${role}`}
        className="field-fade mt-4 flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/30 px-5 py-3.5 text-sm sm:px-6"
      >
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Active posture
            </span>
            <span className="text-sm font-medium text-slate-100">
              {roleConfig.label}
            </span>
            <span className="text-xs text-slate-500">
              · {redacted}/{totalFields} fields redacted
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            {roleConfig.description}
          </p>
        </div>
      </section>

      {/* Document table */}
      <section className="mt-6 rounded-lg border border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6">
          <h2 className="text-sm font-semibold text-slate-100">Data room contents</h2>
          <span className="text-[11px] uppercase tracking-wider text-slate-500">
            {deal.documents.length} documents
          </span>
        </div>
        <div className="hidden sm:grid sm:grid-cols-12 sm:gap-x-4 border-b border-slate-800/80 bg-slate-950/60 px-6 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          <div className="col-span-5">Document</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Sensitivity</div>
          <div className="col-span-1 text-right">Access</div>
        </div>
        <div key={`docs-${role}`} className="field-fade divide-y divide-slate-900">
          {deal.documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} role={role} />
          ))}
        </div>
      </section>

      <p className="mt-6 inline-flex items-center gap-1 text-xs text-slate-500">
        Switch role using the top-bar control. Redactions update live.
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
