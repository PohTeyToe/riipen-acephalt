"use client";

import * as React from "react";
import type { Role } from "./types";

export type TraceEvent = {
  eventId: string;
  timestamp: string;
  actor: Role;
  action:
    | "session.opened"
    | "role.changed"
    | "document.opened"
    | "field.rendered"
    | "field.withheld";
  targetId: string;
  docId?: string;
  fieldId?: string;
  ruleId?: string;
  reason?: string;
};

type RoleContextValue = {
  role: Role;
  setRole: (next: Role) => void;
  sessionId: string;
  sessionOpenedAt: string;
  policyVersion: string;
  eventLog: TraceEvent[];
  lastViewedDocId: string | null;
  lastViewedAt: string | null;
  lastViewedEventId: string | null;
  lastRoleChangeAt: string | null;
  lastRoleChangeEventId: string | null;
  setLastViewedDocId: (id: string | null) => void;
  appendTraceBatch: (
    entries: Array<Omit<TraceEvent, "eventId" | "timestamp">>,
    dedupeKey?: string,
  ) => void;
};

const RoleContext = React.createContext<RoleContextValue | null>(null);

const POLICY_VERSION = "role-policy.v0.3.1";
const MAX_TRACE_EVENTS = 24;

function buildSessionId() {
  const token =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(16).slice(2, 10);
  return `cdr-demo-${token}`;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role>("investor_analyst");
  const [sessionId] = React.useState(() => buildSessionId());
  const [sessionOpenedAt] = React.useState(() => formatUtc(new Date()));
  const [lastViewedDocId, setLastViewedDocId] = React.useState<string | null>(
    null,
  );
  const [lastViewedAt, setLastViewedAt] = React.useState<string | null>(null);
  const [lastViewedEventId, setLastViewedEventId] = React.useState<string | null>(
    null,
  );
  const [lastRoleChangeAt, setLastRoleChangeAt] = React.useState<string | null>(
    null,
  );
  const [lastRoleChangeEventId, setLastRoleChangeEventId] = React.useState<
    string | null
  >(null);
  const [eventLog, setEventLog] = React.useState<TraceEvent[]>([]);
  const eventCounterRef = React.useRef(44020);
  const traceDedupeRef = React.useRef<Set<string>>(new Set());

  const nextEventId = React.useCallback((prefix: string) => {
    eventCounterRef.current += 1;
    return `${prefix}_${eventCounterRef.current}`;
  }, []);

  const appendTraceBatch = React.useCallback(
    (
      entries: Array<Omit<TraceEvent, "eventId" | "timestamp">>,
      dedupeKey?: string,
    ) => {
      if (entries.length === 0) return;
      if (dedupeKey) {
        if (traceDedupeRef.current.has(dedupeKey)) {
          return;
        }
        traceDedupeRef.current.add(dedupeKey);
      }

      const baseTime = Date.now();
      const stamped = entries.map((entry, index) => ({
        ...entry,
        eventId: nextEventId(entry.action.replace(".", "_")),
        timestamp: formatUtc(new Date(baseTime + index * 1000)),
      }));
      setEventLog((current) => [...current, ...stamped].slice(-MAX_TRACE_EVENTS));
    },
    [nextEventId],
  );

  const appendTraceEvent = React.useCallback((event: TraceEvent) => {
    setEventLog((current) => [...current, event].slice(-MAX_TRACE_EVENTS));
  }, []);

  React.useEffect(() => {
    appendTraceBatch(
      [
        {
          actor: role,
          action: "session.opened",
          targetId: sessionId,
          reason: "role-aware diligence session initialized",
        },
      ],
      `session:${sessionId}`,
    );
  }, [appendTraceBatch, role, sessionId]);

  const setRoleWithTrace = React.useCallback(
    (next: Role) => {
      if (next === role) return;
      setRole(next);
      const stamp = formatUtc(new Date());
      const eventId = nextEventId("evt_role_changed");
      setLastRoleChangeAt(stamp);
      setLastRoleChangeEventId(eventId);
      appendTraceEvent({
        eventId,
        timestamp: stamp,
        actor: next,
        action: "role.changed",
        targetId: next,
        reason: `session switched into ${next}`,
      });
    },
    [appendTraceEvent, nextEventId, role],
  );

  const setLastViewedDocIdWithTrace = React.useCallback(
    (id: string | null) => {
      setLastViewedDocId(id);
      if (!id) return;
      const stamp = formatUtc(new Date());
      const eventId = nextEventId("evt_document_opened");
      setLastViewedAt(stamp);
      setLastViewedEventId(eventId);
      appendTraceEvent({
        eventId,
        timestamp: stamp,
        actor: role,
        action: "document.opened",
        targetId: id,
        docId: id,
        reason: `document ${id} opened in current session`,
      });
    },
    [appendTraceEvent, nextEventId, role],
  );

  const value = React.useMemo<RoleContextValue>(
    () => ({
      role,
      setRole: setRoleWithTrace,
      sessionId,
      sessionOpenedAt,
      policyVersion: POLICY_VERSION,
      eventLog,
      lastViewedDocId,
      lastViewedAt,
      lastViewedEventId,
      lastRoleChangeAt,
      lastRoleChangeEventId,
      setLastViewedDocId: setLastViewedDocIdWithTrace,
      appendTraceBatch,
    }),
    [
      role,
      setRoleWithTrace,
      sessionId,
      sessionOpenedAt,
      eventLog,
      lastViewedDocId,
      lastViewedAt,
      lastViewedEventId,
      lastRoleChangeAt,
      lastRoleChangeEventId,
      setLastViewedDocIdWithTrace,
      appendTraceBatch,
    ],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRoleContext(): RoleContextValue {
  const ctx = React.useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRoleContext must be used within RoleProvider");
  }
  return ctx;
}

function formatUtc(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate(),
  ).padStart(2, "0")} ${String(date.getUTCHours()).padStart(2, "0")}:${String(
    date.getUTCMinutes(),
  ).padStart(2, "0")}:${String(date.getUTCSeconds()).padStart(2, "0")} UTC`;
}
