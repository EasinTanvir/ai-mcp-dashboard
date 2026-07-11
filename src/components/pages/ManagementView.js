"use client";
import { motion } from "framer-motion";
import {
  Plus,
  Package,
  Users,
  Tags,
  ShoppingBag,
  MoreHorizontal,
  Star,
} from "lucide-react";
import { PageTitle, AIButton, Toolbar, Badge } from "@/components/ui/Atoms";
import {
  products,
  categories,
  customers,
  orders,
  reviews,
} from "@/data/dashboard";
const config = {
  Products: {
    rows: products,
    headers: ["Product", "Category", "Sold", "Availability", "Price"],
    icon: Package,
    stats: [
      ["Products", "124"],
      ["In stock", "110"],
      ["Low stock", "8"],
    ],
  },
  Categories: {
    rows: categories,
    headers: ["Category", "Products", "Revenue share", "Theme"],
    icon: Tags,
    stats: [
      ["Categories", "24"],
      ["Products listed", "124"],
      ["Growing", "8"],
    ],
  },
  Orders: {
    rows: orders,
    headers: ["Order", "Customer", "Product", "Total", "Status"],
    icon: ShoppingBag,
    stats: [
      ["Orders", "1,284"],
      ["Completed", "932"],
      ["Average order", "$126.40"],
    ],
  },
  Customers: {
    rows: customers,
    headers: ["Customer", "Email", "Location", "Status", "Lifetime value"],
    icon: Users,
    stats: [
      ["Customers", "3,491"],
      ["Premium", "486"],
      ["Repeat rate", "68.2%"],
    ],
  },
};
export function ManagementView({ type }) {
  let d = config[type],
    Icon = d.icon;
  return (
    <>
      <PageTitle title={type} eyebrow="Commerce management">
        <div className="flex gap-2">
          <AIButton label="Create with AI" />
          <button className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold">
            <Plus size={16} /> Create {type.slice(0, -1)}
          </button>
        </div>
      </PageTitle>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {d.stats.map(([n, v], i) => (
          <div className="card p-5" key={n}>
            <div className="flex justify-between">
              <span className="text-sm muted">{n}</span>
              <span className="rounded-xl bg-[var(--soft)] p-2 text-[var(--primary)]">
                <Icon size={17} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold">{v}</p>
            <p className="mt-1 text-xs text-emerald-600">
              ↑ 12.4% <span className="muted">from last month</span>
            </p>
          </div>
        ))}
      </div>
      {type === "Categories" && (
        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map(([n, p, r, c]) => (
            <div className="card p-5" key={n}>
              <span
                className={
                  "grid h-11 w-11 place-items-center rounded-xl bg-" +
                  c +
                  "-100 text-" +
                  c +
                  "-600"
                }
              >
                <Tags size={20} />
              </span>
              <h3 className="mt-5 font-semibold">{n}</h3>
              <p className="mt-1 text-sm muted">{p}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="muted">Revenue share</span>
                <b>{r}</b>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="card overflow-hidden">
        <div className="p-5">
          <Toolbar placeholder={"Search " + type.toLowerCase() + "..."} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-y border-[var(--line)] bg-[var(--bg)] text-xs uppercase tracking-wide muted">
              <tr>
                {d.headers.map((h) => (
                  <th className="px-5 py-3 font-medium" key={h}>
                    {h}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {d.rows.map((row, i) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  key={row[0]}
                  className="border-b border-[var(--line)] last:border-0"
                >
                  {row.map((v, j) => (
                    <td className="px-5 py-4" key={j}>
                      {j === 0 ? (
                        <span className="font-semibold">{v}</span>
                      ) : j === row.length - 2 &&
                        [
                          "In stock",
                          "Low stock",
                          "Premium",
                          "Active",
                          "New",
                          "Completed",
                          "Processing",
                          "Shipped",
                          "Pending",
                        ].includes(v) ? (
                        <Badge
                          type={
                            v === "Low stock" || v === "Pending"
                              ? "warning"
                              : "success"
                          }
                        >
                          {v}
                        </Badge>
                      ) : (
                        <span className={j === 1 ? "muted" : ""}>{v}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-5">
                    <button className="icon-btn h-8 w-8">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--line)] px-5 py-4 text-sm">
          <span className="muted">
            Showing 1–{d.rows.length} of {type === "Products" ? 124 : "1,284"}{" "}
            results
          </span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[var(--line)] px-3 py-1.5">
              Previous
            </button>
            <button className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-white">
              1
            </button>
            <button className="rounded-lg border border-[var(--line)] px-3 py-1.5">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export function ReviewsView() {
  return (
    <>
      <PageTitle title="Reviews" eyebrow="Customer sentiment">
        <AIButton label="Ask Nexa AI" />
      </PageTitle>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm muted">Average rating</p>
          <p className="mt-3 text-3xl font-bold">
            4.8 <span className="text-amber-400">★</span>
          </p>
          <p className="mt-2 text-xs muted">Based on 1,248 reviews</p>
        </div>
        <div className="card p-5">
          <p className="text-sm muted">Positive sentiment</p>
          <p className="mt-3 text-3xl font-bold">92.6%</p>
          <p className="mt-2 text-xs text-emerald-600">↑ 4.1% this month</p>
        </div>
        <div className="card p-5">
          <p className="text-sm muted">Response rate</p>
          <p className="mt-3 text-3xl font-bold">87%</p>
          <p className="mt-2 text-xs muted">Target: 90%</p>
        </div>
      </div>
      <Toolbar placeholder="Search reviews..." />
      <div className="grid gap-4 lg:grid-cols-3">
        {reviews.map((r) => (
          <article className="card p-5" key={r[0]}>
            <div className="flex justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--soft)] text-sm font-bold text-[var(--primary)]">
                {r[0]
                  .split(" ")
                  .map((x) => x[0])
                  .join("")}
              </div>
              <span className="text-amber-400">{"★".repeat(r[2])}</span>
            </div>
            <h2 className="mt-4 font-semibold">{r[0]}</h2>
            <p className="text-sm muted">on {r[1]}</p>
            <p className="mt-4 text-sm leading-6">“{r[3]}”</p>
            <p className="mt-5 text-xs muted">{r[4]}</p>
          </article>
        ))}
      </div>
    </>
  );
}
