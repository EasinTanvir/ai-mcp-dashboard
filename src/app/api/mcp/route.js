// app/api/mcp/route.js
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { db } from "@/db";
import { products, categories, customers, orders, reviews } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";

const total = async (table) =>
  (await db.select({ value: count() }).from(table))[0]?.value ?? 0;

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "count_products",
      {
        title: "Count Products",
        description: "Get the total count of products in the store inventory.",
        inputSchema: {},
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
        description: "Get the total number of product categories.",
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
        description: "Get the total count of all customer orders.",
        inputSchema: {},
      },
      async () => ({
        content: [
          { type: "text", text: `There are ${await total(orders)} orders.` },
        ],
      }),
    );

    server.registerTool(
      "count_customers",
      {
        title: "Count Customers",
        description: "Get the total number of registered customers.",
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
        description: "Get the total number of product reviews.",
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
        description: "List all items that are running low on stock.",
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
        description: "Get a list of the 3 most recently placed orders.",
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
