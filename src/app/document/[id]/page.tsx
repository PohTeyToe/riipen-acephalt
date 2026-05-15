"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Lock } from "lucide-react";
import { PROJECT_CEDAR, ROLES } from "@/lib/mockData";
import { useRoleContext } from "@/lib/roleContext";
import {
  documentAccessSummary,
  hiddenFieldLabels,
  visibleFields,
} from "@/lib/redactionEngine";
import { RedactedField } from "@/components/RedactedField";
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

const SENSITIVITY_TONE: Record<string, "muted" | "warning" | "danger"> = {
  standard: "muted",
  restricted: "warning",
  privileged: "danger",
};

const ROLE_ACCENT: Record<string, string> = {
  investor_analyst: "var(--role-investor)",
  compliance_reviewer: "var(--role-compliance)",
  external_counterparty: "var(--role-counterparty)",
};

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const {
    role,
    policyVersion,
    eventLog,
    appendTraceBatch,
    setLastViewedDocId,
    lastViewedAt,
    lastViewedEventId,
    lastRoleChangeAt,
    lastRoleChangeEventId,
  } = useRoleContext();
  const id = params?.id;
  const focusedFieldId = searchParams.get("focus");
  const doc = PROJECT_CEDAR.documents.find((d) => d.id === id);
  const openedDocRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (doc) {
      if (openedDocRef.current === doc.id) return;
      openedDocRef.current = doc.id;
      setLastViewedDocId(doc.id);
    }
  }, [doc, setLastViewedDocId]);

  React.useEffect(() => {
    if (!focusedFieldId) return;
    const node = document.getElementById(focusedFieldId);
    node?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusedFieldId]);

  if (!doc) {
    notFound();
  }

  const fvs = visibleFields(doc, role);
  const visibleCount = fvs.filter((f) => f.visible).length;
  const redactedCount = fvs.length - visibleCount;
  const watermark = role === "compliance_reviewer";
  const roleConfig = ROLES.find((r) => r.id === role)!;
  const traceAnchor = `${doc.id}:${role}:${lastViewedEventId ?? "none"}:${lastRoleChangeEventId ?? "none"}`;
  const rulesInPlay = React.useMemo(() => {
    const seen = new Map<string, (typeof fvs)[number]["rule"]>();
    for (const fv of fvs) {
      seen.set(fv.rule.id, fv.rule);
    }
    return [...seen.values()];
  }, [fvs]);
  const traceRows = React.useMemo(
    () =>
      eventLog
        .filter(
          (event) =>
            event.docId === doc.id ||
            (event.action === "role.changed" &&
              event.timestamp === lastRoleChangeAt &&
              event.eventId === lastRoleChangeEventId),
        )
        .slice(-10)
        .reverse(),
    [doc.id, eventLog, lastRoleChangeAt, lastRoleChangeEventId],
  );
  const latestDocumentOpen = React.useMemo(
    () => traceRows.find((row) => row.action === "document.opened") ?? null,
    [traceRows],
  );
  const latestTraceEvent = traceRows[0] ?? null;
  const fieldStamps = React.useMemo(() => {
    const next = new Map<string, { eventId: string; timestamp: string; ruleId: string }>();
    for (const event of eventLog) {
      if (event.docId !== doc.id || event.action !== "field.rendered" || !event.fieldId) {
        continue;
      }
      next.set(event.fieldId, {
        eventId: event.eventId,
        timestamp: event.timestamp,
        ruleId: event.ruleId ?? "policy.unmapped",
      });
    }
    return next;
  }, [doc.id, eventLog]);

  React.useEffect(() => {
    if (!lastViewedEventId && !lastRoleChangeEventId) return;
    appendTraceBatch(
      fvs.map((fv) => ({
        actor: role,
        action: fv.visible ? "field.rendered" : "field.withheld",
        targetId: fv.field.id,
        docId: doc.id,
        fieldId: fv.field.id,
        ruleId: fv.rule.id,
        reason: fv.visible
          ? `${fv.field.label} rendered under ${fv.rule.label}`
          : fv.reason ?? fv.rule.rationale,
      })),
      `field-batch:${traceAnchor}`,
    );
  }, [appendTraceBatch, doc.id, fvs, lastRoleChangeEventId, lastViewedEventId, role, traceAnchor]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Data room
      </Link>

      <header className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40">
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                {TYPE_LABEL[doc.type] ?? doc.type}
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                {doc.title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                {doc.summary}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone={SENSITIVITY_TONE[doc.sensitivity]}>{doc.sensitivity}</Badge>
              <span className="font-mono text-xs text-slate-500">{doc.date}</span>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 px-5 py-4 text-sm sm:grid-cols-3 sm:px-6">
          <Meta label="Source party" value={doc.sourceParty} />
          <Meta label="Active role" value={roleConfig.label} />
          <Meta
            label="Field access"
            value={`${visibleCount} visible / ${redactedCount} redacted`}
            mono
          />
        </dl>
      </header>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        {ROLES.map((candidate) => {
          const access = documentAccessSummary(doc, candidate.id);
          const hiddenLabels = hiddenFieldLabels(doc, candidate.id).slice(0, 2);
          const isActive = candidate.id === role;
          return (
            <div
              key={candidate.id}
              className={`rounded-lg border px-4 py-3 ${
                isActive
                  ? "relative overflow-hidden border-slate-600 bg-slate-900/60"
                  : "border-slate-800 bg-slate-950/35"
              }`}
            >
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-0.5"
                  style={{ backgroundColor: ROLE_ACCENT[candidate.id] }}
                />
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    {candidate.shortLabel}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-100">
                    {access.visible}/{access.total} fields visible
                  </div>
                </div>
                {isActive ? <Badge tone="info">active</Badge> : null}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {access.redacted === 0
                  ? "Full room visibility for this document."
                  : hiddenLabels.length > 0
                    ? `Loses: ${hiddenLabels.join(", ")}${access.redacted > hiddenLabels.length ? ", and more." : "."}`
                    : `${access.redacted} fields stay hidden for this role on this document.`}
              </p>
            </div>
          );
        })}
      </section>

      {watermark ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-amber-900/70 bg-amber-950/40 px-4 py-2.5 text-xs text-amber-100 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.08)]">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-amber-300" />
            <span className="font-medium uppercase tracking-wider text-amber-200">
              Compliance review session
            </span>
          </div>
          <span className="text-amber-200/80">
            Every field decision below is stamped from the current prototype session trace.
          </span>
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-amber-300/70">
            Watermark active
          </span>
        </div>
      ) : null}

      <section key={role} className="field-fade mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {fvs.map((fv) => (
          <RedactedField
            key={fv.field.id}
            fv={fv}
            watermark={watermark}
            emphasize={focusedFieldId === fv.field.id}
            stamp={fieldStamps.get(fv.field.id) ?? null}
          />
        ))}
      </section>

      <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950/40 p-4 sm:p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Access trace
        </div>
        <dl className="mt-3 grid gap-y-2 text-sm sm:grid-cols-[170px_minmax(0,1fr)]">
          <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Enforcement
          </dt>
          <dd className="text-slate-300">
            Current-session field decisions are stamped here; production enforcement would sit behind the room boundary.
          </dd>
          <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Prototype boundary
          </dt>
          <dd className="text-slate-300">
            This build keeps the policy model legible in the UI. A real room would move the same rule registry and trace schema to the server or database layer.
          </dd>
          <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Policy source
          </dt>
          <dd className="font-mono text-xs text-slate-400">
            policy registry / {policyVersion}
          </dd>
          <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Role effect
          </dt>
          <dd className="text-slate-300">
            {visibleCount} visible, {redactedCount} withheld for {roleConfig.label}.
          </dd>
          <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Last document open
          </dt>
          <dd className="font-mono text-xs text-slate-400">
            {latestDocumentOpen?.eventId ?? lastViewedEventId ?? "No document open stamped yet"}
          </dd>
          <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Latest trace event
          </dt>
          <dd className="font-mono text-xs text-slate-400">
            {latestTraceEvent?.eventId ?? "No trace stamped yet"}
          </dd>
          <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
            Viewed at
          </dt>
          <dd className="font-mono text-xs text-slate-400">
            {lastViewedAt ?? "No document viewed in this session"}
          </dd>
        </dl>
        <div className="mt-4 border-t border-slate-800 pt-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Rules in play
          </div>
          <div className="mt-3 space-y-2">
            {rulesInPlay.map((rule) => (
              <div
                key={rule.id}
                className="rounded-sm border border-slate-800 bg-slate-950/70 px-3 py-2"
              >
                <div className="font-mono text-[11px] text-slate-300">{rule.id}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {rule.label}. {rule.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 border-t border-slate-800 pt-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Session event trail
          </div>
          <div className="mt-3 space-y-2 font-mono text-[11px] text-slate-300">
            {traceRows.map((row) => (
              <div
                key={row.eventId}
                className="rounded-sm border border-slate-800 bg-slate-950/70 px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-slate-500">{row.timestamp}</span>
                  <span>{row.action}</span>
                  <span className="text-slate-500">{row.eventId}</span>
                  <span className="text-slate-500">
                    target:{row.fieldId ?? row.docId ?? row.targetId}
                  </span>
                  <span className="text-slate-500">actor:{row.actor}</span>
                </div>
                <div className="mt-1 text-slate-500">
                  {row.ruleId ?? "session.trace"} / {row.reason ?? "session event"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({
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
