"use client";

import * as React from "react";
import Link from "next/link";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="grid h-7 w-7 grid-cols-2 gap-1 rounded-md border border-slate-700 bg-slate-900 p-1.5 group-hover:border-slate-500">
            <span className="col-span-2 rounded-full bg-[var(--role-investor)]" />
            <span className="rounded-full bg-[var(--role-compliance)]" />
            <span className="rounded-full bg-[var(--role-counterparty)]" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-100 group-hover:text-white">
              Acephalt Diligence Workspace
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Project Cedar / trust-boundary enforcement for V3 deal rooms
            </div>
          </div>
        </Link>
        <RoleSwitcher />
      </div>
    </header>
  );
}
