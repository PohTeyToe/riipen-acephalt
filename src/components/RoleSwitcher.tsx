"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { ROLES } from "@/lib/mockData";
import { useRoleContext } from "@/lib/roleContext";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLE_DOT: Record<Role, string> = {
  investor_analyst: "var(--role-investor)",
  compliance_reviewer: "var(--role-compliance)",
  external_counterparty: "var(--role-counterparty)",
};

export function RoleSwitcher() {
  const { role, setRole } = useRoleContext();
  const buttonRefs = React.useRef<Record<Role, HTMLButtonElement | null>>({
    investor_analyst: null,
    compliance_reviewer: null,
    external_counterparty: null,
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const order: Role[] = [
      "investor_analyst",
      "compliance_reviewer",
      "external_counterparty",
    ];
    const idx = order.indexOf(role);
    const nextIdx =
      e.key === "ArrowRight"
        ? (idx + 1) % order.length
        : (idx - 1 + order.length) % order.length;
    const nextRole = order[nextIdx];
    setRole(nextRole);
    buttonRefs.current[nextRole]?.focus();
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-500 lg:inline"
        aria-hidden
      >
        Arrow keys cycle
      </span>
      <div
        role="radiogroup"
        aria-label="Active diligence role"
        onKeyDown={onKeyDown}
        className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-950/60 p-1"
      >
        <span className="hidden items-center gap-1.5 px-2 text-xs uppercase tracking-wider text-slate-500 md:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Role
        </span>
        {ROLES.map((r) => {
          const active = role === r.id;
          return (
            <button
              key={r.id}
              ref={(el) => {
                buttonRefs.current[r.id] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setRole(r.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                active
                  ? "bg-slate-800 text-slate-50 shadow-inner"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
              )}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ROLE_DOT[r.id] }}
              />
              <span className="hidden sm:inline">{r.label}</span>
              <span className="sm:hidden">{r.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
