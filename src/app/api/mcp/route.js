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
      "add_product",
      {
        title: "Add Product",
        description:
          "Creates a new product in the store inventory with a given name, category, price, and stock. Use this when the user explicitly asks to add, create, or list a new product and provides its details in the message. If the named category doesn't already exist, it will be created automatically.",
        inputSchema: {
          name: z
            .string()
            .min(1)
            .describe("The product's name/title, e.g. 'Wireless Mouse'."),
          categoryName: z
            .string()
            .min(1)
            .describe(
              "The category this product belongs to, e.g. 'Electronics'. Matched case-insensitively; created automatically if it doesn't exist.",
            ),
          price: z
            .number()
            .positive()
            .describe("The product's price, e.g. 29.99."),
          stock: z
            .number()
            .int()
            .min(0)
            .optional()
            .describe(
              "Initial stock quantity. Defaults to 0 if the user doesn't mention it.",
            ),
        },
      },
      async ({ name, categoryName, price, stock }) => {
        let [category] = await db
          .select()
          .from(categories)
          .where(sql`lower(${categories.name}) = lower(${categoryName})`);

        if (!category) {
          [category] = await db
            .insert(categories)
            .values({ name: categoryName })
            .returning();
        }

        const [product] = await db
          .insert(products)
          .values({
            name,
            categoryId: category.id,
            price: price.toFixed(2),
            stock: stock ?? 0,
          })
          .returning();

        return {
          content: [
            {
              type: "text",
              text: `Created product "${product.name}" in category "${category.name}" at $${product.price}, with ${product.stock} in stock.`,
            },
          ],
        };
      },
    );

    server.registerTool(
      "create_dummy_products",
      {
        title: "Create Dummy Products",
        description:
          "Creates one or more sample/placeholder products with randomly generated name, category, price, and stock — for testing or demo purposes. Use this when the user asks to create dummy, sample, test, fake, or placeholder product(s).",
        inputSchema: {
          count: z
            .number()
            .int()
            .min(1)
            .max(5)
            .optional()
            .describe(
              "How many dummy products to create. Defaults to 1 if not specified. Max 5 per call.",
            ),
        },
      },
      async ({ count: howMany }) => {
        const num = howMany ?? 1;

        const adjectives = [
          "Sleek",
          "Compact",
          "Rugged",
          "Wireless",
          "Premium",
          "Portable",
          "Smart",
          "Eco",
        ];
        const nouns = [
          "Backpack",
          "Headphones",
          "Charger",
          "Lamp",
          "Mug",
          "Speaker",
          "Keyboard",
          "Bottle",
        ];
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const existingCategories = await db.select().from(categories);

        const created = [];
        for (let i = 0; i < num; i++) {
          let category;
          if (existingCategories.length > 0) {
            category = pick(existingCategories);
          } else {
            [category] = await db
              .insert(categories)
              .values({ name: "General" })
              .returning();
            existingCategories.push(category);
          }

          const name = `${pick(adjectives)} ${pick(nouns)}`;
          const price = (Math.random() * 195 + 5).toFixed(2); // $5 - $200
          const stock = Math.floor(Math.random() * 100);

          const [product] = await db
            .insert(products)
            .values({ name, categoryId: category.id, price, stock })
            .returning();

          created.push(
            `${product.name} ($${product.price}, ${category.name}, stock ${product.stock})`,
          );
        }

        return {
          content: [
            {
              type: "text",
              text: `Created ${num} dummy product(s): ${created.join("; ")}.`,
            },
          ],
        };
      },
    );

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
      "recent_orders",
      {
        title: "Recent Orders",
        description:
          "Returns the 3 most recently placed orders, including each order's number, status, and the customer's name and email. Use this when the user asks about the latest, most recent, or newest orders.",
        inputSchema: {
          random_string: z
            .string()
            .optional()
            .describe("Not used. Always omit or pass any string."),
        },
      },
      async () => {
        const rows = await db
          .select({
            orderNumber: orders.orderNumber,
            status: orders.status,
            customerName: customers.name,
            customerEmail: customers.email,
          })
          .from(orders)
          .leftJoin(customers, eq(orders.customerId, customers.id))
          .orderBy(desc(orders.createdAt))
          .limit(3);

        const summary = rows.length
          ? `Here are the ${rows.length} most recent orders.`
          : "There are no orders yet.";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ summary, type: "orders", items: rows }),
            },
          ],
        };
      },
    );

    server.registerTool(
      "low_stock_products",
      {
        title: "Low Stock Products",
        description:
          "Returns up to the 3 products with the lowest stock, each with name and remaining quantity. Use this when the user asks which products are running low, need restocking, or about inventory shortages.",
        inputSchema: {
          random_string: z
            .string()
            .optional()
            .describe("Not used. Always omit or pass any string."),
        },
      },
      async () => {
        const rows = await db
          .select({ name: products.name, stock: products.stock })
          .from(products)
          .where(eq(products.status, "Low stock"))
          .orderBy(products.stock)
          .limit(3);

        const summary = rows.length
          ? `Here are the ${rows.length} lowest stock products.`
          : "No low-stock products.";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ summary, type: "products", items: rows }),
            },
          ],
        };
      },
    );
  },
  {},
  { basePath: "/api", verboseLogs: true },
);

export { handler as GET, handler as POST };
