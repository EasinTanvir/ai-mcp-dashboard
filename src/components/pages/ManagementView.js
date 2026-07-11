"use client";
import { motion } from "framer-motion";
import {
  Plus,
  Package,
  Users,
  Tags,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";
import { PageTitle, AIButton, Toolbar, Badge } from "@/components/ui/Atoms";
const icons = {
  Products: Package,
  Categories: Tags,
  Orders: ShoppingBag,
  Customers: Users,
};
const columns = {
  Products: ["Product", "Category", "Sold", "Availability", "Price"],
  Categories: ["Category", "Description", "Color"],
  Orders: ["Order", "Customer", "Product", "Total", "Status"],
  Customers: ["Customer", "Email", "Location", "Status", "Lifetime value"],
};
const rowFor = (type, x) =>
  type === "Products"
    ? [
        x.name,
        x.categoryName || "Uncategorized",
        x.sold,
        x.status,
        "$" + x.price,
      ]
    : type === "Categories"
      ? [x.name, x.description || "—", x.color]
      : type === "Orders"
        ? [
            x.orderNumber,
            x.customerName || "—",
            x.productName || "—",
            "$" + Number(x.total).toFixed(2),
            x.status,
          ]
        : [
            x.name,
            x.email,
            x.location || "—",
            x.status,
            "$" + Number(x.lifetimeValue || 0).toFixed(2),
          ];
export function ManagementView({ type, data }) {
  const Icon = icons[type],
    rows = data.map((x) => rowFor(type, x));
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
        {[
          ["Total", data.length],
          [
            "Active",
            data.filter(
              (x) => x.status !== "Out of stock" && x.status !== "Cancelled",
            ).length,
          ],
          ["Source", "Neon"],
        ].map(([n, v]) => (
          <div className="card p-5" key={n}>
            <div className="flex justify-between">
              <span className="text-sm muted">
                {n} {type}
              </span>
              <span className="rounded-xl bg-[var(--soft)] p-2 text-[var(--primary)]">
                <Icon size={17} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold">{v}</p>
            <p className="mt-1 text-xs text-emerald-600">
              Live database result
            </p>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="p-5">
          <Toolbar placeholder={"Search " + type.toLowerCase() + "..."} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-y border-[var(--line)] bg-[var(--bg)] text-xs uppercase tracking-wide muted">
              <tr>
                {columns[type].map((h) => (
                  <th className="px-5 py-3 font-medium" key={h}>
                    {h}
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  key={data[i].id}
                  className="border-b border-[var(--line)] last:border-0"
                >
                  {row.map((v, j) => (
                    <td className="px-5 py-4" key={j}>
                      {[
                        "In stock",
                        "Low stock",
                        "Out of stock",
                        "Premium",
                        "Active",
                        "New",
                        "Completed",
                        "Processing",
                        "Shipped",
                        "Pending",
                        "Cancelled",
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
                        <span
                          className={
                            j === 0 ? "font-semibold" : j === 1 ? "muted" : ""
                          }
                        >
                          {v}
                        </span>
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
      </div>
    </>
  );
}
export function ReviewsView({ data }) {
  const avg = data.length
    ? (data.reduce((a, x) => a + x.rating, 0) / data.length).toFixed(1)
    : "—";
  return (
    <>
      <PageTitle title="Reviews" eyebrow="Customer sentiment">
        <AIButton label="Ask Nexa AI" />
      </PageTitle>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm muted">Average rating</p>
          <p className="mt-3 text-3xl font-bold">
            {avg} <span className="text-amber-400">★</span>
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm muted">Published reviews</p>
          <p className="mt-3 text-3xl font-bold">{data.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm muted">Live source</p>
          <p className="mt-3 text-3xl font-bold">Neon</p>
        </div>
      </div>
      <Toolbar placeholder="Search reviews..." />
      <div className="grid gap-4 lg:grid-cols-3">
        {data.map((r) => (
          <article className="card p-5" key={r.id}>
            <div className="flex justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--soft)] text-sm font-bold text-[var(--primary)]">
                {r.customerName
                  ?.split(" ")
                  .map((x) => x[0])
                  .join("")}
              </div>
              <span className="text-amber-400">{"★".repeat(r.rating)}</span>
            </div>
            <h2 className="mt-4 font-semibold">{r.customerName}</h2>
            <p className="text-sm muted">on {r.productName}</p>
            <p className="mt-4 text-sm leading-6">“{r.body}”</p>
          </article>
        ))}
      </div>
    </>
  );
}
