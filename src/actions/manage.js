"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products, categories, customers } from "@/db/schema";
import { eq } from "drizzle-orm";

import {
  productSchema,
  categorySchema,
  customerSchema,
} from "@/lib/validation";
import { getCurrentAdmin } from "@/actions/auth";
import { hasPermission, permissionMessage } from "@/lib/permissions";
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
const guard = async (permission) => {
  const admin = await getCurrentAdmin();
  return admin && hasPermission(admin.role, permission);
};
const validation = (schema, data) => {
  const parsed = schema.safeParse(data);
  return parsed.success ? parsed.data : null;
};
async function create(table, schema, formData) {
  if (!(await guard("create")))
    return { ok: false, message: permissionMessage };
  const data = validation(schema, Object.fromEntries(formData));
  if (!data) return { ok: false, message: "Please check the form fields." };
  await db.insert(table).values(data);
  refresh();
  return { ok: true };
}
async function update(table, schema, formData) {
  if (!(await guard("update")))
    return { ok: false, message: permissionMessage };
  const raw = Object.fromEntries(formData),
    id = Number(raw.id),
    data = validation(schema, raw);
  if (!id || !data)
    return { ok: false, message: "Please check the form fields." };
  await db
    .update(table)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(table.id, id));
  refresh();
  return { ok: true };
}
async function remove(table, id) {
  if (!(await guard("delete")))
    return { ok: false, message: permissionMessage };
  await db.delete(table).where(eq(table.id, Number(id)));
  refresh();
  return { ok: true };
}
export async function createProduct(formData) {
  return create(products, productSchema, formData);
}
export async function updateProduct(formData) {
  return update(products, productSchema, formData);
}
export async function deleteProduct(id) {
  return remove(products, id);
}
export async function createCategory(formData) {
  return create(categories, categorySchema, formData);
}
export async function updateCategory(formData) {
  return update(categories, categorySchema, formData);
}
export async function deleteCategory(id) {
  return remove(categories, id);
}
export async function createCustomer(formData) {
  return create(customers, customerSchema, formData);
}
export async function updateCustomer(formData) {
  return update(customers, customerSchema, formData);
}
export async function deleteCustomer(id) {
  return remove(customers, id);
}
