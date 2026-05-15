"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { cn } from "@/lib/utils";

export function TopBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
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
          <nav className="hidden items-center gap-1 md:flex">
            <TopNavLink href="/" label="Data room" active={pathname === "/"} />
            <TopNavLink
              href="/memo"
              label="Memo draft"
              active={pathname === "/memo"}
            />
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 md:hidden">
            <TopNavLink href="/" label="Room" active={pathname === "/"} />
            <TopNavLink
              href="/memo"
              label="Memo"
              active={pathname === "/memo"}
            />
          </nav>
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}

function TopNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
        active
          ? "border-slate-600 bg-slate-900 text-slate-100"
          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200",
      )}
    >
      {label}
    </Link>
  );
}
