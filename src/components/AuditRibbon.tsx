"use client";

import * as React from "react";
import { useRoleContext } from "@/lib/roleContext";
import { ROLES, PROJECT_CEDAR } from "@/lib/mockData";
import { totalRedactions } from "@/lib/redactionEngine";
import { Activity, Eye, FileText, Hash } from "lucide-react";

export function AuditRibbon() {
  const { role, sessionId, lastViewedDocId } = useRoleContext();
  const roleConfig = ROLES.find((r) => r.id === role)!;
  const redactionCount = totalRedactions(PROJECT_CEDAR.documents, role);
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
        <div className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span className="uppercase tracking-wider text-slate-500">Active role</span>
          <span className="font-mono text-slate-200">{roleConfig.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-amber-400" />
          <span className="uppercase tracking-wider text-slate-500">Redactions</span>
          <span className="font-mono text-slate-200 tabular-nums">
            {redactionCount} field{redactionCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-400" />
          <span className="uppercase tracking-wider text-slate-500">Last doc</span>
          <span className="truncate max-w-[20ch] sm:max-w-none text-slate-200">
            {lastDoc ?? "None"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Hash className="h-3.5 w-3.5 text-slate-500" />
          <span className="uppercase tracking-wider text-slate-500">Session</span>
          <span className="font-mono text-slate-300">{sessionId}</span>
        </div>
      </div>
    </div>
  );
}
