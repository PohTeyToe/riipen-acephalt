"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import type { FieldVisibility } from "@/lib/redactionEngine";
import { cn } from "@/lib/utils";

type Props = {
  fv: FieldVisibility;
  watermark?: boolean;
};

export function RedactedField({ fv, watermark }: Props) {
  const { field, visible, reason } = fv;

  return (
    <div
      className={cn(
        "rounded-md border bg-slate-950/40 transition-colors",
        visible
          ? "border-slate-800 hover:border-slate-700"
          : "border-dashed border-slate-800",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {field.label}
        </h3>
        {visible ? (
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            {watermark ? "Compliance review" : "Visible"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-400">
            <Lock className="h-3 w-3" /> Redacted
          </span>
        )}
      </div>
      <div className="relative px-4 py-3 text-sm text-slate-200">
        {visible ? (
          <FieldBody fv={fv} watermark={watermark} />
        ) : (
          <div className="space-y-1.5">
            <div className="text-xs text-slate-500 italic leading-relaxed">
              {reason}
            </div>
            <RedactionPlaceholder rows={field.rows?.length ?? 0} />
          </div>
        )}
        {visible && watermark ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="rotate-[-12deg] text-[44px] font-black uppercase tracking-widest text-amber-400/15 select-none">
              compliance review
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FieldBody({
  fv,
  watermark,
}: {
  fv: FieldVisibility;
  watermark?: boolean;
}) {
  const { field } = fv;
  if (field.rows && field.rows.length > 0) {
    return (
      <dl className="grid grid-cols-1 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-y-2">
        {field.rows.map((row) => (
          <React.Fragment key={row.key}>
            <dt className="text-xs uppercase tracking-wider text-slate-500 sm:py-0.5">
              {row.key}
            </dt>
            <dd
              className={cn(
                "font-mono text-sm text-slate-100 tabular-nums sm:py-0.5",
                watermark && "relative",
              )}
            >
              {row.value}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    );
  }
  if (field.body) {
    return (
      <p className="leading-relaxed text-slate-200">{field.body}</p>
    );
  }
  return null;
}

function RedactionPlaceholder({ rows }: { rows: number }) {
  const blockCount = rows > 0 ? rows : 3;
  return (
    <div className="space-y-1.5">
      {Array.from({ length: blockCount }).map((_, i) => (
        <div
          key={i}
          aria-hidden
          className="h-3 w-full rounded-sm bg-slate-800/70"
          style={{ width: `${72 + ((i * 13) % 26)}%` }}
        />
      ))}
    </div>
  );
}
