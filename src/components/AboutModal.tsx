"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AboutModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs text-slate-500 hover:text-slate-200 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm">
          About this concept
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About this concept</DialogTitle>
          <DialogDescription>
            Scoped prototype built as a Riipen proof-of-work artifact. Project Cedar,
            the deal data, and all parties are invented. The prototype demonstrates
            policy outcomes in a diligence room. It does not rely on internal Acephalt
            data or imply affiliation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            The point is one narrow product argument: a diligence workspace becomes
            more trustworthy when access policy is visible at the field level instead
            of being hidden behind broad room permissions.
          </p>
          <p>
            Three roles see the same data room differently. An investor analyst
            underwrites the credit and sees most fields. A compliance reviewer sees
            everything plus a watermark for the audit log. An external counterparty
            sees only top-level deal terms and clauses tied to their party.
          </p>
          <p className="text-slate-400">
            In production, policy would be enforced server-side and written to a real
            audit log. This prototype visualizes those outcomes with seeded data and a
            deterministic policy engine.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
