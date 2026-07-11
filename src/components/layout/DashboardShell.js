"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  ChartNoAxesCombined,
  Star,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Search,
  Command,
  LogOut,
} from "lucide-react";
import { logout } from "@/actions/auth";
const nav = [
  ["Dashboard", "/", LayoutDashboard],
  ["Products", "/products", Package],
  ["Categories", "/categories", Tags],
  ["Orders", "/orders", ShoppingBag],
  ["Customers", "/customers", Users],
  ["Analytics", "/analytics", ChartNoAxesCombined],
  ["Reviews", "/reviews", Star],
];
export default function DashboardShell({ children, active = "Dashboard" }) {
  const [open, setOpen] = useState(false),
    [dark, setDark] = useState(false);
  const sidebar = (
    <aside className="flex h-full w-[248px] flex-col bg-[var(--sidebar)] px-4 py-6 text-slate-300">
      <div className="mb-10 flex items-center gap-3 px-2 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 font-bold">
          N
        </span>
        <span className="text-lg font-bold tracking-tight">
          nexa<span className="text-indigo-300">.</span>
        </span>
      </div>
      <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">
        Workspace
      </p>
      <nav className="space-y-1">
        {nav.map(([name, href, Icon]) => (
          <Link
            key={name}
            href={href}
            onClick={() => setOpen(false)}
            className={
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition " +
              (active === name
                ? "bg-white/12 text-white shadow-sm"
                : "hover:bg-white/8 hover:text-white")
            }
          >
            <Icon size={18} />
            {name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-white/7 p-4">
        <p className="text-sm font-semibold text-white">Need a hand?</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Meet your AI commerce assistant.
        </p>
        <button className="mt-3 text-xs font-semibold text-indigo-300">
          Explore assistant →
        </button>
      </div>
      <form action={logout} className="mt-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/8 hover:text-white">
          <LogOut size={18} /> Log out
        </button>
      </form>
    </aside>
  );
  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
          {sidebar}
        </div>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
              />
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
              >
                {sidebar}
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-[var(--line)] bg-[var(--bg)]/85 px-4 backdrop-blur lg:ml-[248px] lg:px-8">
          <div className="ml-auto flex items-center gap-2">
            <button
              className="icon-btn"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="ml-1 flex items-center gap-2 border-l border-[var(--line)] pl-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300 text-sm font-bold text-orange-800">
                AC
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Alex Chen</p>
                <p className="text-xs muted">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:ml-[248px] lg:p-8">{children}</main>
      </div>
    </div>
  );
}
