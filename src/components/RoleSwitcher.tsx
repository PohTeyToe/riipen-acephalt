"use client";

import * as React from "react";
import { ROLES } from "@/lib/mockData";
import { useRoleContext } from "@/lib/roleContext";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

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
    <div
      role="radiogroup"
      aria-label="Active diligence role"
      onKeyDown={onKeyDown}
      className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-950/60 p-1"
    >
      <span className="hidden md:flex items-center gap-1.5 px-2 text-xs uppercase tracking-wider text-slate-500">
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
              "relative rounded-sm px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              active
                ? "bg-slate-800 text-slate-50 shadow-inner"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900",
            )}
          >
            <span className="hidden sm:inline">{r.label}</span>
            <span className="sm:hidden">{r.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
