// app/api/mcp/route.js
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { db } from "@/db";
import { products, categories, customers, orders, reviews } from "@/db/schema";
import { count, eq, desc, gte, lt, and, sql } from "drizzle-orm";

const total = async (table) =>
  (await db.select({ value: count() }).from(table))[0]?.value ?? 0;

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "count_products",
      {
        title: "Count Products",
        description:
          "Returns the total number of products currently in the store inventory. Use this when the user asks how many products exist, total product count, or size of the catalog.",
        inputSchema: {
          random_string: z
            .string()
            .optional()
            .describe("Not used. Always omit or pass any string."),
        },
      },
      async () => ({
        content: [
          {
            type: "text",
            text: `There are ${await total(products)} products.`,
          },
        ],
      }),
    );

    server.registerTool(
      "count_categories",
      {
        title: "Count Categories",
        description:
          "Returns the total number of product categories in the store. Use this when the user asks how many categories exist or how the catalog is organized by category.",
        inputSchema: {},
      },
      async () => ({
        content: [
          {
            type: "text",
            text: `There are ${await total(categories)} categories.`,
          },
        ],
      }),
    );

    server.registerTool(
      "count_orders",
      {
        title: "Count Orders",
        description:
          "Returns the total number of orders ever placed, across all time. Use this for questions about overall/lifetime order volume — NOT for 'today's orders', which has its own tool.",
        inputSchema: {},
      },
      async () => ({
        content: [
          { type: "text", text: `There are ${await total(orders)} orders.` },
        ],
      }),
    );

    server.registerTool(
      "orders_today",
      {
        title: "Orders Placed Today",
        description:
          "Returns the count of orders placed today (based on the server's current date). Use this specifically when the user asks about 'today's orders', 'orders today', or how many orders came in today.",
        inputSchema: {},
      },
      async () => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

        const rows = await db
          .select({ value: count() })
          .from(orders)
          .where(
            and(
              gte(orders.createdAt, startOfToday),
              lt(orders.createdAt, startOfTomorrow),
            ),
          );

        const todayCount = rows[0]?.value ?? 0;
        return {
          content: [
            {
              type: "text",
              text: `There ${todayCount === 1 ? "is" : "are"} ${todayCount} order${todayCount === 1 ? "" : "s"} placed today.`,
            },
          ],
        };
      },
    );

    server.registerTool(
      "count_customers",
      {
        title: "Count Customers",
        description:
          "Returns the total number of registered customers. Use this when the user asks how many customers or users the store has.",
        inputSchema: {},
      },
      async () => ({
        content: [
          {
            type: "text",
            text: `There are ${await total(customers)} customers.`,
          },
        ],
      }),
    );

    server.registerTool(
      "count_reviews",
      {
        title: "Count Reviews",
        description:
          "Returns the total number of product reviews submitted by customers. Use this when the user asks how many reviews exist or about review volume.",
        inputSchema: {},
      },
      async () => ({
        content: [
          { type: "text", text: `There are ${await total(reviews)} reviews.` },
        ],
      }),
    );

    server.registerTool(
      "low_stock_products",
      {
        title: "Low Stock Products",
        description:
          "Lists all products currently flagged as low stock, with their remaining quantities. Use this when the user asks which products are running low, need restocking, or about inventory shortages.",
        inputSchema: {},
      },
      async () => {
        const rows = await db
          .select({ name: products.name, stock: products.stock })
          .from(products)
          .where(eq(products.status, "Low stock"));

        const text = rows.length
          ? rows.map((x) => `${x.name} (${x.stock})`).join(", ")
          : "No low-stock products.";
        return { content: [{ type: "text", text }] };
      },
    );

    server.registerTool(
      "recent_orders",
      {
        title: "Recent Orders",
        description:
          "Returns the 3 most recently placed orders with their order number and status. Use this when the user asks about the latest, most recent, or newest orders.",
        inputSchema: {},
      },
      async () => {
        const rows = await db
          .select({ number: orders.orderNumber, status: orders.status })
          .from(orders)
          .orderBy(desc(orders.createdAt))
          .limit(3);

        const text =
          rows.map((x) => `${x.number}: ${x.status}`).join(", ") ||
          "No orders.";
        return { content: [{ type: "text", text }] };
      },
    );
  },
  {},
  { basePath: "/api", verboseLogs: true },
);

export { handler as GET, handler as POST };
