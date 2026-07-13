import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  ChartNoAxesCombined,
} from "lucide-react";

export const nav = [
  ["Dashboard", "/", LayoutDashboard],
  ["Products", "/products", Package],
  ["Categories", "/categories", Tags],
  ["Orders", "/orders", ShoppingBag],
  ["Customers", "/customers", Users],
  ["Analytics", "/analytics", ChartNoAxesCombined],
];
