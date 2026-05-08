"use client";

import * as React from "react";
import type { Role } from "./types";

type RoleContextValue = {
  role: Role;
  setRole: (next: Role) => void;
  sessionId: string;
  lastViewedDocId: string | null;
  setLastViewedDocId: (id: string | null) => void;
};

const RoleContext = React.createContext<RoleContextValue | null>(null);

function generateSessionId(): string {
  // Mock session id, purely cosmetic for the audit ribbon.
  const part = (n: number) =>
    Math.floor(Math.random() * Math.pow(16, n))
      .toString(16)
      .padStart(n, "0")
      .toUpperCase();
  return `cdr-${part(4)}-${part(4)}-${part(6)}`;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<Role>("investor_analyst");
  const [sessionId, setSessionId] = React.useState<string>("cdr-0000-0000-000000");
  const [lastViewedDocId, setLastViewedDocId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    // Generated client-side to keep SSR markup stable. The session id is purely
    // cosmetic for the audit ribbon and does not feed any data flow.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(generateSessionId());
  }, []);

  const value = React.useMemo<RoleContextValue>(
    () => ({ role, setRole, sessionId, lastViewedDocId, setLastViewedDocId }),
    [role, sessionId, lastViewedDocId],
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
