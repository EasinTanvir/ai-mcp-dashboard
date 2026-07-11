"use client";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { monthly } from "@/data/dashboard";
export function RevenueChart({ compact = false }) {
  return (
    <ResponsiveContainer width="100%" height={compact ? 190 : 290}>
      <AreaChart data={monthly}>
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#635bff" stopOpacity=".3" />
            <stop offset="1" stopColor="#635bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="m"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8b96a8", fontSize: 12 }}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e7eaf0" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#635bff"
          strokeWidth={3}
          fill="url(#g)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={monthly}>
        <XAxis
          dataKey="m"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#8b96a8", fontSize: 12 }}
        />
        <Tooltip cursor={{ fill: "#f1f0ff" }} />
        <Bar dataKey="orders" fill="#19b899" radius={[7, 7, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
