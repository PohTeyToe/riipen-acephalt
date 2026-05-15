"use client";

import * as React from "react";
import { useRoleContext } from "@/lib/roleContext";
import { ROLES, PROJECT_CEDAR } from "@/lib/mockData";
import { totalRedactions } from "@/lib/redactionEngine";
import { Eye, FileText, Hash, ShieldCheck } from "lucide-react";

const ROLE_DOT: Record<string, string> = {
  investor_analyst: "text-[var(--role-investor)]",
  compliance_reviewer: "text-[var(--role-compliance)]",
  external_counterparty: "text-[var(--role-counterparty)]",
};

export function AuditRibbon() {
  const {
    role,
    sessionId,
    policyVersion,
    lastViewedDocId,
    lastViewedAt,
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
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 text-xs text-slate-500 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={`role-dot ${ROLE_DOT[role]}`}
            style={{ backgroundColor: "currentColor" }}
          />
          <span className="uppercase tracking-wider">Role</span>
          <span className="font-mono text-slate-200">{roleConfig.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-amber-400" />
          <span className="uppercase tracking-wider">Redacted</span>
          <span className="font-mono tabular-nums text-slate-200">
            {redactionCount}
            <span className="text-slate-600">/{totalFields}</span>
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-400" />
          <span className="uppercase tracking-wider">Last opened</span>
          <span className="max-w-[28ch] truncate text-slate-200">
            {lastDoc ?? "No document yet"}
          </span>
          {lastViewedAt ? (
            <span className="font-mono text-[10px] text-slate-600">
              {lastViewedAt}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="uppercase tracking-wider">Policy</span>
          <span className="font-mono text-slate-400">{policyVersion}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Hash className="h-3.5 w-3.5" />
          <span className="font-mono text-slate-500">{sessionId}</span>
        </div>
      </div>
    </div>
  );
}
