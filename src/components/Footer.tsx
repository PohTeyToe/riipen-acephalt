"use client";

import * as React from "react";
import { AboutModal } from "@/components/AboutModal";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/60">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
        <div>
          Concept-level mock. Project Cedar is invented. Not affiliated with Acephalt.
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/PohTeyToe"
            className="hover:text-slate-200 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <AboutModal />
        </div>
      </div>
    </footer>
  );
}
