"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products, categories, customers, reviews, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  productSchema,
  categorySchema,
  customerSchema,
  reviewSchema,
  orderStatusSchema,
} from "@/lib/validation";
const paths = [
  "/",
  "/products",
  "/categories",
  "/customers",
  "/orders",
  "/analytics",
  "/reviews",
];
const refresh = () => paths.forEach(revalidatePath);
const result = (s) =>
  s.success
    ? { ok: true }
    : { ok: false, errors: s.error.flatten().fieldErrors };
export async function createProduct(_, formData) {
  const p = productSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return result(p);
  await db.insert(products).values(p.data);
  refresh();
  return { ok: true };
}
export async function createCategory(_, formData) {
  const p = categorySchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return result(p);
  await db.insert(categories).values(p.data);
  refresh();
  return { ok: true };
}
export async function createCustomer(_, formData) {
  const p = customerSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return result(p);
  await db.insert(customers).values(p.data);
  refresh();
  return { ok: true };
}
export async function updateOrderStatus(_, formData) {
  const p = orderStatusSchema.safeParse(Object.fromEntries(formData));
  if (!p.success) return result(p);
  await db
    .update(orders)
    .set({ status: p.data.status, updatedAt: new Date() })
    .where(eq(orders.id, p.data.id));
  refresh();
  return { ok: true };
}
