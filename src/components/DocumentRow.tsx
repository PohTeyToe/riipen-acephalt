"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { DealDocument, Role } from "@/lib/types";
import {
  documentAccessState,
  documentAccessSummary,
  firstRedactionReason,
} from "@/lib/redactionEngine";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

type Props = {
  doc: DealDocument;
  role: Role;
};

export function DocumentRow({ doc, role }: Props) {
  const { visible, total, redacted } = documentAccessSummary(doc, role);
  const accessState = documentAccessState(doc, role);
  const fullyRedacted = visible === 0 && total > 0;
  const previewReason = firstRedactionReason(doc, role);

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
          <div className="truncate text-xs text-slate-500">{doc.sourceParty}</div>
          {previewReason ? (
            <div className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-slate-400">
              {previewReason}
            </div>
          ) : (
            <div className="mt-1 text-[11px] text-emerald-400/80">
              Fully visible for this role.
            </div>
          )}
        </div>
      </div>
      <div className="hidden sm:block sm:col-span-2 text-xs text-slate-400">
        {TYPE_LABEL[doc.type] ?? doc.type}
      </div>
      <div className="hidden sm:block sm:col-span-2 text-xs text-slate-400 font-mono tabular-nums">
        {doc.date}
      </div>
      <div className="hidden sm:flex sm:col-span-2 items-center gap-2">
        <Badge tone={SENSITIVITY_TONE[doc.sensitivity]}>{doc.sensitivity}</Badge>
      </div>
      <div className="col-span-12 sm:col-span-1 mt-2 sm:mt-0 flex items-center justify-between sm:justify-end gap-2 text-xs">
        <span className="inline-flex items-center gap-2">
          <span
            className={cn(
              "rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
              accessState === "open" &&
                "border-emerald-900/60 bg-emerald-950/30 text-emerald-300",
              accessState === "partial" &&
                "border-amber-900/60 bg-amber-950/30 text-amber-300",
              accessState === "locked" &&
                "border-slate-700 bg-slate-900 text-slate-300",
            )}
          >
            {accessState}
          </span>
          <span className="font-mono tabular-nums text-slate-400">
            {visible}/{total}
            {redacted > 0 ? (
              <span className="ml-1 text-amber-400">-{redacted}</span>
            ) : null}
          </span>
        </span>
        <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
      </div>
    </Link>
  );
}
