"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { DealDocument, Role } from "@/lib/types";
import { documentAccessSummary } from "@/lib/redactionEngine";
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

const SENSITIVITY_TONE: Record<
  string,
  "muted" | "warning" | "danger"
> = {
  standard: "muted",
  restricted: "warning",
  privileged: "danger",
};

type Props = {
  doc: DealDocument;
  role: Role;
};

export function DocumentRow({ doc, role }: Props) {
  const { visible, total, redacted } = documentAccessSummary(doc, role);
  const fullyRedacted = visible === 0 && total > 0;

  return (
    <Link
      href={`/document/${doc.id}`}
      className="group grid grid-cols-12 gap-x-4 items-center border-b border-slate-800/80 px-4 py-3 transition-colors hover:bg-slate-900/60 sm:px-6"
    >
      <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-700">
          {fullyRedacted ? (
            <Lock className="h-4 w-4" />
          ) : (
            <span className="text-[10px] font-mono uppercase tracking-wider">
              {doc.id.slice(0, 3)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-slate-100 group-hover:text-white">
            {doc.title}
          </div>
          <div className="truncate text-xs text-slate-500">
            {doc.sourceParty}
          </div>
        </div>
      </div>
      <div className="hidden sm:block sm:col-span-2 text-xs text-slate-400">
        {TYPE_LABEL[doc.type] ?? doc.type}
      </div>
      <div className="hidden sm:block sm:col-span-2 text-xs text-slate-400 font-mono tabular-nums">
        {doc.date}
      </div>
      <div className="hidden sm:flex sm:col-span-2 items-center gap-2">
        <Badge tone={SENSITIVITY_TONE[doc.sensitivity]}>
          {doc.sensitivity}
        </Badge>
      </div>
      <div className="col-span-12 sm:col-span-1 mt-2 sm:mt-0 flex items-center justify-between sm:justify-end gap-2 text-xs">
        <span className="font-mono tabular-nums text-slate-400">
          {visible}/{total}
          {redacted > 0 ? (
            <span className="ml-1 text-amber-400">−{redacted}</span>
          ) : null}
        </span>
        <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
      </div>
    </Link>
  );
}
