"use client";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Box,
  ShoppingCart,
  Users,
  Activity,
  Send,
} from "lucide-react";
import { PageTitle, AIButton, Badge } from "@/components/ui/Atoms";
import { RevenueChart, SalesChart } from "./Charts";
import AssistantPanel from "./AssistantPanel";
export default function DashboardView({ data }) {
  const metrics = [
    [
      "Total revenue",
      "$" +
        Number(data.stats.revenue).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        }),
      "Revenue",
      ArrowUpRight,
      "#635bff",
    ],
    ["Total orders", data.stats.orders, "Orders", ShoppingCart, "#19b899"],
    ["Active customers", data.stats.customers, "Customers", Users, "#ef8a4c"],
    ["Products", data.stats.products, "Catalog", Activity, "#5d8ee8"],
  ];
  return (
    <>
      <motion.section
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.07 } },
        }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(([label, value, sub, Icon, color]) => (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 },
            }}
            key={label}
            className="card p-5"
          >
            <div className="mb-5 flex items-start justify-between">
              <span className="text-sm muted">{label}</span>
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ backgroundColor: color + "18", color }}
              >
                <Icon size={18} />
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>{sub}</span>
              <span className="ml-1 font-normal muted">from live data</span>
            </p>
          </motion.div>
        ))}
      </motion.section>

      <section className="card mt-5 overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <div>
            <h2 className="font-semibold">Recent products</h2>
            <p className="mt-1 text-sm muted">
              The five latest additions to your catalog
            </p>
          </div>
          <span className="rounded-lg bg-[var(--soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
            Latest 5
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-y border-[var(--line)] text-xs uppercase tracking-wide muted">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="py-3 font-medium">Stock</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium">Added</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.products.slice(0, 5).map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[var(--line)] last:border-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--soft)] text-[var(--primary)]">
                        <Box size={16} />
                      </span>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{product.stock}</td>
                  <td className="py-4 font-medium">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="py-4 muted">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      type={
                        product.status === "Low stock" ? "warning" : "success"
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-5">
        <div className="card overflow-hidden xl:col-span-3">
          <div className="p-5">
            <h2 className="font-semibold">Recent orders</h2>
            <p className="mt-1 text-sm muted">Your latest customer activity</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead className="border-y border-[var(--line)] text-xs uppercase tracking-wide muted">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.slice(0, 4).map((o) => (
                  <tr key={o.id} className="border-b border-[var(--line)]">
                    <td className="px-5 py-4 font-semibold">{o.orderNumber}</td>
                    <td>
                      <p>{o.customerName}</p>
                      <p className="text-xs muted">{o.productName}</p>
                    </td>
                    <td>${Number(o.total).toFixed(2)}</td>
                    <td className="px-5">
                      <Badge type={o.status}>{o.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
