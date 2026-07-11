import "server-only";
import { db } from "./index";
import { categories, customers, products, orders, reviews } from "./schema";
import { desc, eq, sql, count } from "drizzle-orm";
const money = (v) => Number(v || 0);
export async function getDashboardData() {
  const [productRows, customerRows, orderRows, reviewRows, categoryRows] =
    await Promise.all([
      db.select().from(products).orderBy(desc(products.createdAt)),
      db.select().from(customers).orderBy(desc(customers.createdAt)),
      db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          total: orders.total,
          status: orders.status,
          createdAt: orders.createdAt,
          customerName: customers.name,
          productName: products.name,
        })
        .from(orders)
        .leftJoin(customers, eq(orders.customerId, customers.id))
        .leftJoin(products, eq(orders.productId, products.id))
        .orderBy(desc(orders.createdAt)),
      db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          body: reviews.body,
          createdAt: reviews.createdAt,
          customerName: customers.name,
          productName: products.name,
        })
        .from(reviews)
        .leftJoin(customers, eq(reviews.customerId, customers.id))
        .leftJoin(products, eq(reviews.productId, products.id))
        .orderBy(desc(reviews.createdAt)),
      db.select().from(categories),
    ]);
  const revenue = orderRows
    .filter((x) => x.status === "Completed")
    .reduce((sum, x) => sum + money(x.total), 0);
  return {
    stats: {
      revenue,
      orders: orderRows.length,
      customers: customerRows.length,
      products: productRows.length,
    },
    products: productRows,
    categories: categoryRows,
    customers: customerRows,
    orders: orderRows,
    reviews: reviewRows,
  };
}
export async function getManagementData(type) {
  const data = await getDashboardData();
  return data[type];
}
