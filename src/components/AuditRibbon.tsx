"use client";

import * as React from "react";
import { useRoleContext } from "@/lib/roleContext";
import { ROLES, PROJECT_CEDAR } from "@/lib/mockData";
import { totalRedactions } from "@/lib/redactionEngine";
import { Clock, Eye, FileText, Hash, ShieldCheck } from "lucide-react";

const ROLE_DOT: Record<string, string> = {
  investor_analyst: "text-[var(--role-investor)]",
  compliance_reviewer: "text-[var(--role-compliance)]",
  external_counterparty: "text-[var(--role-counterparty)]",
};

export function AuditRibbon() {
  const {
    role,
    sessionId,
    sessionOpenedAt,
    policyVersion,
    lastViewedDocId,
    lastViewedAt,
    lastViewedEventId,
  } = useRoleContext();
  const roleConfig = ROLES.find((r) => r.id === role)!;
  const redactionCount = totalRedactions(PROJECT_CEDAR.documents, role);
  const totalFields = PROJECT_CEDAR.documents.reduce(
    (acc, d) => acc + d.fields.length,
    0,
  );
  const lastDoc = lastViewedDocId
    ? PROJECT_CEDAR.documents.find((d) => d.id === lastViewedDocId)?.title
    : null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 text-xs text-slate-400 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={`role-dot ${ROLE_DOT[role]}`}
            style={{ backgroundColor: "currentColor" }}
          />
          <span className="uppercase tracking-wider text-slate-500">
            Active role
          </span>
          <span className="font-mono text-slate-200">{roleConfig.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-amber-400" />
          <span className="uppercase tracking-wider text-slate-500">
            Restricted
          </span>
          <span className="font-mono tabular-nums text-slate-200">
            {redactionCount}
            <span className="text-slate-500">/{totalFields}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-400" />
          <span className="uppercase tracking-wider text-slate-500">
            Last document access
          </span>
          <span className="max-w-[20ch] truncate text-slate-200 sm:max-w-none">
            {lastDoc ?? "No document viewed"}
          </span>
          {lastViewedAt ? (
            <span className="font-mono text-[10px] text-slate-500">
              {lastViewedAt}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span className="uppercase tracking-wider text-slate-500">
            Session opened
          </span>
          <span className="font-mono tabular-nums text-slate-300">
            {sessionOpenedAt}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="uppercase tracking-wider text-slate-500">
            Policy slice
          </span>
          <span className="font-mono text-slate-300">{policyVersion}</span>
        </div>
        {lastViewedEventId ? (
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-slate-500" />
            <span className="uppercase tracking-wider text-slate-500">
              Last open trace
            </span>
            <span className="font-mono text-slate-300">{lastViewedEventId}</span>
          </div>
        ) : null}
        <div className="ml-auto flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 text-slate-500" />
          <span className="uppercase tracking-wider text-slate-500">
            Session
          </span>
          <span className="font-mono text-slate-300">{sessionId}</span>
        </div>
      </div>
    </div>
  );
}
