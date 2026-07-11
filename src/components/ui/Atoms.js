"use client";
import { ChevronDown, Search, Sparkles } from "lucide-react";
export function Badge({ children, type = "success" }) {
  let c = {
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
    warning:
      "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    info: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
  }[type];
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold " +
        c
      }
    >
      {children}
    </span>
  );
}
export function PageTitle({ title, eyebrow, children }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 text-sm font-medium text-[var(--primary)]">
          {eyebrow || "Workspace overview"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
}
export function AIButton({ label = "Ask AI" }) {
  return (
    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
      <Sparkles size={16} />
      {label}
    </button>
  );
}
export function Toolbar({ placeholder = "Search anything..." }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1">
        <Search
          className="absolute left-3 top-3 text-[var(--muted)]"
          size={18}
        />
        <input
          aria-label="Search"
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[var(--primary)]"
          placeholder={placeholder}
        />
      </label>
      <button className="flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium">
        This month <ChevronDown size={16} />
      </button>
    </div>
  );
}
