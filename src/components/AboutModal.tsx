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
            Concept-level mock built solo as a Riipen application artifact. Mock deal,
            mock parties, mock documents. Project Cedar is invented. Not derived from
            any internal source. Not affiliated with Acephalt. Visual styling is
            generic-fintech-shaped, not a clone of their product.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            The point of the mock is to argue for one specific scoping choice: a
            role-aware diligence workspace with field-level redaction, instead of a
            broader AI-for-data-rooms copilot.
          </p>
          <p>
            Three roles see the same data room differently. An investor analyst
            underwrites the credit and sees most fields. A compliance reviewer sees
            everything plus a watermark for the audit log. An external counterparty
            sees only top-level deal terms and clauses tied to their party.
          </p>
          <p className="text-slate-400">
            Built in Next.js, TypeScript, Tailwind. No backend. Mock data lives in a
            single TypeScript file. The redaction engine is a pure function over the
            current role and the field-level visibility list.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
