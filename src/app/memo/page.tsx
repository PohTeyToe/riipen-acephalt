"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Lock, Scale, ShieldAlert } from "lucide-react";
import { useRoleContext } from "@/lib/roleContext";
import {
  claimsAffectedCount,
  defaultResolverAction,
  evaluateMemoClaim,
  getMemoClaims,
  type ClaimStatus,
  type EvaluatedCitation,
  type ResolverAction,
} from "@/lib/memoDraft";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/mockData";

const ROLE_ACCENT: Record<string, string> = {
  investor_analyst: "var(--role-investor)",
  compliance_reviewer: "var(--role-compliance)",
  external_counterparty: "var(--role-counterparty)",
};

export default function MemoDraftPage() {
  const { role } = useRoleContext();
  const [selectedClaimId, setSelectedClaimId] = React.useState(() => getMemoClaims()[0]?.id);
  const [resolverActions, setResolverActions] = React.useState<
    Record<string, ResolverAction>
  >({});

  const evaluatedClaims = React.useMemo(
    () => getMemoClaims().map((claim) => evaluateMemoClaim(claim, role)),
    [role],
  );
  const selectedClaim =
    evaluatedClaims.find((claim) => claim.id === selectedClaimId) ?? evaluatedClaims[0];
  const roleConfig = ROLES.find((candidate) => candidate.id === role)!;
  const affectedCount = claimsAffectedCount(role);
  const selectedAction =
    resolverActions[selectedClaim.id] ?? defaultResolverAction(selectedClaim.status);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Scale className="h-3.5 w-3.5" />
            Data room
            <ChevronRight className="h-3.5 w-3.5" />
            Memo draft
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
            Source-traced diligence memo
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            This route shows how the same room evidence hardens into memo language,
            and how that language changes when the supporting fields are hidden,
            conflicted, or role-gated.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={affectedCount === 0 ? "success" : "warning"}>
            {affectedCount} claim{affectedCount === 1 ? "" : "s"} affected by current role
          </Badge>
          <Badge tone="info">{roleConfig.label}</Badge>
        </div>
      </div>

      <section
        key={role}
        className="field-fade relative mt-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-900/30"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-0.5"
          style={{ backgroundColor: ROLE_ACCENT[role] }}
        />
        <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
          <ShieldAlert
            className="mt-0.5 h-4 w-4 shrink-0"
            style={{ color: ROLE_ACCENT[role] }}
          />
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Decision posture
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-300">
              The room shows what this role can inspect. The memo draft shows what
              this role can responsibly assert after those visibility boundaries
              change the evidence set.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
        <div key={`claim-list-${role}`} className="field-fade space-y-2">
          {evaluatedClaims.map((claim) => (
            <button
              key={claim.id}
              type="button"
              onClick={() => setSelectedClaimId(claim.id)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                selectedClaim.id === claim.id
                  ? "relative overflow-hidden border-slate-600 bg-slate-900/60"
                  : "border-slate-800 bg-slate-950/35 hover:bg-slate-950/60",
              )}
            >
              {selectedClaim.id === claim.id ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-0.5"
                  style={{ backgroundColor: ROLE_ACCENT[role] }}
                />
              ) : null}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    {claim.shortLabel}
                  </div>
                  <div className="mt-1 text-sm font-medium leading-relaxed text-slate-100">
                    {claim.draft}
                  </div>
                </div>
                <StatusBadge status={claim.status} />
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/40">
          <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Draft claim
                </div>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-50">
                  {selectedClaim.draft}
                </h2>
              </div>
              <StatusBadge status={selectedClaim.status} />
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
              {selectedClaim.whyItMatters}
            </p>
          </div>

          <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Evidence
            </div>
            <div className="mt-3 space-y-3">
              {selectedClaim.requiredEvidence.map((citation) => (
                <CitationCard key={`${citation.doc.id}:${citation.field.id}`} citation={citation} />
              ))}
              {selectedClaim.contextEvidence.length > 0 ? (
                <div className="pt-2">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Supporting context
                  </div>
                  <div className="mt-2 space-y-3">
                    {selectedClaim.contextEvidence.map((citation) => (
                      <CitationCard
                        key={`${citation.doc.id}:${citation.field.id}`}
                        citation={citation}
                        context
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              {selectedClaim.conflictingEvidence.length > 0 ? (
                <div className="pt-2">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-amber-300/80">
                    Conflicting evidence
                  </div>
                  <div className="mt-2 space-y-3">
                    {selectedClaim.conflictingEvidence.map((citation) => (
                      <CitationCard
                        key={`${citation.doc.id}:${citation.field.id}`}
                        citation={citation}
                        conflict
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Resolver action
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["keep", "rewrite", "escalate"] as const).map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() =>
                    setResolverActions((current) => ({
                      ...current,
                      [selectedClaim.id]: action,
                    }))
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors",
                    selectedAction === action
                      ? "border-slate-500 bg-slate-900 text-slate-100"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200",
                  )}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 sm:px-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Memo delta
            </div>
            <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Draft line
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-100">
                {selectedClaim.draft}
              </p>
              <div className="mt-4 border-t border-slate-800 pt-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Current role outcome
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {selectedClaim.resolverCopy[selectedClaim.status]}
                </p>
                <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200">
                  Resolver set to <span className="font-medium">{selectedAction}</span>.{" "}
                  {resolverOutcomeCopy(selectedAction, selectedClaim.nextAction)}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-slate-500">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {selectedClaim.nextAction}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  const tone =
    status === "supported"
      ? "success"
      : status === "conflicted"
        ? "warning"
        : status === "assumption"
          ? "muted"
          : "danger";
  const label =
    status === "evidence_withheld" ? "withheld" : status.replaceAll("_", " ");
  return <Badge tone={tone}>{label}</Badge>;
}

function CitationCard({
  citation,
  conflict,
  context,
}: {
  citation: EvaluatedCitation;
  conflict?: boolean;
  context?: boolean;
}) {
  const href = `/document/${citation.doc.id}?focus=${citation.field.id}`;
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg border px-4 py-3 transition-colors hover:bg-slate-950/60",
        conflict
          ? "border-amber-900/60 bg-amber-950/10"
          : context
            ? "border-slate-800 bg-slate-950/35"
            : "border-slate-800 bg-slate-950/55",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            {citation.doc.title}
          </div>
          <div className="mt-1 text-sm font-medium text-slate-100">
            {citation.field.label}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conflict ? <Badge tone="warning">conflict</Badge> : null}
          {citation.visibility.visible ? (
            <Badge tone="info">visible</Badge>
          ) : (
            <Badge tone="danger">withheld</Badge>
          )}
        </div>
      </div>
      <div className="mt-3">
        {citation.visibility.visible ? (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-slate-200">
              {fieldExcerpt(citation.field)}
            </p>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              rule: {citation.visibility.rule.id}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 rounded-sm border border-amber-900/60 bg-amber-950/40 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-amber-300">
              <Lock className="h-3 w-3" />
              {citation.visibility.rule.label}
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {citation.visibility.reason}
            </p>
            <div
              aria-hidden
              className="redaction-hatch space-y-1.5 rounded-sm border border-slate-800/60 bg-slate-900/30 p-2"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-2.5 rounded-sm bg-slate-800/80"
                  style={{ width: `${70 + ((index * 11) % 20)}%` }}
                />
              ))}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
              rule: {citation.visibility.rule.id}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function fieldExcerpt(field: EvaluatedCitation["field"]) {
  if (field.rows && field.rows.length > 0) {
    return field.rows
      .slice(0, 3)
      .map((row) => `${row.key}: ${row.value}`)
      .join(" / ");
  }
  if (field.body) {
    return field.body;
  }
  return field.label;
}

function resolverOutcomeCopy(action: ResolverAction, nextAction: string) {
  if (action === "keep") {
    return "Carry the sentence into the memo with the visible evidence set as-is.";
  }
  if (action === "rewrite") {
    return `Rewrite the memo language to reflect the narrower evidence posture. ${nextAction}`;
  }
  return `Escalate the claim before memo circulation. ${nextAction}`;
}
