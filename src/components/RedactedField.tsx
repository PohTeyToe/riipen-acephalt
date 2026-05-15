"use client";

import * as React from "react";
import { Lock, ShieldCheck } from "lucide-react";
import type { FieldVisibility } from "@/lib/redactionEngine";
import { cn } from "@/lib/utils";

type Props = {
  fv: FieldVisibility;
  watermark?: boolean;
  emphasize?: boolean;
  stamp?: {
    eventId: string;
    timestamp: string;
    ruleId: string;
  } | null;
};

export function RedactedField({ fv, watermark, emphasize, stamp }: Props) {
  const { field, visible, reason } = fv;

  return (
    <div
      id={field.id}
      className={cn(
        "group relative overflow-hidden rounded-md border bg-slate-950/40 transition-colors scroll-mt-28",
        visible
          ? "border-slate-800 hover:border-slate-700"
          : "border-dashed border-slate-800",
        emphasize && "ring-1 ring-amber-400/60 shadow-[0_0_0_1px_rgba(251,191,36,0.16)]",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {field.label}
        </h3>
        {visible ? (
          watermark ? (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-400/90">
              <ShieldCheck className="h-3 w-3" /> Compliance review
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              Visible
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1 rounded-sm border border-amber-900/60 bg-amber-950/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-amber-300">
            <Lock className="h-3 w-3" /> Redacted
          </span>
        )}
      </div>
      <div className="relative px-4 py-3 text-sm text-slate-200">
        {visible ? (
          <FieldBody fv={fv} stamp={watermark ? stamp : null} />
        ) : (
          <RedactedBody
            tag={fv.rule.label}
            reason={reason}
            ruleId={fv.rule.id}
            rows={field.rows?.length ?? 0}
          />
        )}
        {visible && watermark ? (
          <div
            aria-hidden
            className="compliance-watermark pointer-events-none absolute inset-0 mix-blend-screen"
          />
        ) : null}
      </div>
    </div>
  );
}

function FieldBody({
  fv,
  stamp,
}: {
  fv: FieldVisibility;
  stamp?: {
    eventId: string;
    timestamp: string;
    ruleId: string;
  } | null;
}) {
  const { field } = fv;
  if (field.rows && field.rows.length > 0) {
    return (
      <div className="space-y-3">
        <dl className="grid grid-cols-1 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-y-2">
          {field.rows.map((row) => (
            <React.Fragment key={row.key}>
              <dt className="text-xs uppercase tracking-wider text-slate-500 sm:py-0.5">
                {row.key}
              </dt>
              <dd className="font-mono text-sm text-slate-100 tabular-nums sm:py-0.5">
                {row.value}
              </dd>
            </React.Fragment>
          ))}
        </dl>
        {stamp ? <FieldStamp stamp={stamp} /> : null}
      </div>
    );
  }
  if (field.body) {
    return (
      <div className="space-y-3">
        <p className="leading-relaxed text-slate-200">{field.body}</p>
        {stamp ? <FieldStamp stamp={stamp} /> : null}
      </div>
    );
  }
  return stamp ? <FieldStamp stamp={stamp} /> : null;
}

function RedactedBody({
  tag,
  reason,
  ruleId,
  rows,
}: {
  tag: string;
  reason: string | null;
  ruleId: string;
  rows: number;
}) {
  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-sm border border-amber-900/70 bg-amber-950/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
        {tag}
      </div>
      <div className="text-sm leading-relaxed text-slate-200">
        {reason}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
        rule: {ruleId}
      </div>
      <RedactionPlaceholder rows={rows} />
    </div>
  );
}

function FieldStamp({
  stamp,
}: {
  stamp: {
    eventId: string;
    timestamp: string;
    ruleId: string;
  };
}) {
  return (
    <div className="rounded-sm border border-amber-900/50 bg-amber-950/20 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-200/90">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>stamped {stamp.timestamp}</span>
        <span>{stamp.eventId}</span>
      </div>
      <div className="mt-1 text-amber-300/75">rule {stamp.ruleId}</div>
    </div>
  );
}

function RedactionPlaceholder({ rows }: { rows: number }) {
  const blockCount = rows > 0 ? rows : 3;
  return (
    <div
      aria-hidden
      className="redaction-hatch space-y-1.5 rounded-sm border border-slate-800/60 bg-slate-900/30 p-2"
    >
      {Array.from({ length: blockCount }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 rounded-sm bg-slate-800/80"
          style={{ width: `${68 + ((i * 13) % 28)}%` }}
        />
      ))}
    </div>
  );
}
