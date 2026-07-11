"use client";
import { PageTitle, AIButton } from "@/components/ui/Atoms";
import { RevenueChart, SalesChart } from "@/components/dashboard/Charts";
export default function AnalyticsView() {
  return (
    <>
      <PageTitle title="Analytics" eyebrow="Performance intelligence">
        <AIButton label="Generate insight" />
      </PageTitle>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Revenue", "$48,294", "+12.5%"],
          ["Orders", "1,284", "+8.2%"],
          ["Visitors", "26,491", "+18.6%"],
        ].map((x) => (
          <div className="card p-5" key={x[0]}>
            <p className="text-sm muted">{x[0]}</p>
            <p className="mt-3 text-2xl font-bold">{x[1]}</p>
            <p className="mt-2 text-xs text-emerald-600">
              ↑ {x[2]} vs last month
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Revenue growth</h2>
          <p className="mt-1 text-sm muted">Monthly sales performance</p>
          <div className="mt-5">
            <RevenueChart />
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold">Order velocity</h2>
          <p className="mt-1 text-sm muted">Completed orders by month</p>
          <div className="mt-5">
            <SalesChart />
          </div>
        </div>
      </div>
    </>
  );
}
