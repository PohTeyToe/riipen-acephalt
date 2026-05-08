import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "muted" | "warning" | "danger" | "success" | "info";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-slate-800 text-slate-100 border-slate-700",
  muted: "bg-slate-900 text-slate-400 border-slate-800",
  warning: "bg-amber-950 text-amber-200 border-amber-900",
  danger: "bg-red-950 text-red-200 border-red-900",
  success: "bg-emerald-950 text-emerald-200 border-emerald-900",
  info: "bg-blue-950 text-blue-200 border-blue-900",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tracking-wide",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
