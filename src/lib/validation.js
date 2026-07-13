import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(140),
  categoryId: z.coerce.number().int().positive(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  status: z.enum(["In stock", "Low stock", "Out of stock"]).default("In stock"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  color: z.string().trim().max(30).optional(),
});

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email(),
  location: z.string().trim().max(100).optional(),
  status: z.enum(["Active", "Premium", "New", "Inactive"]).default("Active"),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(3).max(1000),
  published: z.coerce.boolean().default(true),
});

export const orderStatusSchema = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum([
    "Pending",
    "Processing",
    "Shipped",
    "Completed",
    "Cancelled",
  ]),
});
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().max(100).optional(),
});
