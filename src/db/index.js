import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const globalForDb = globalThis;
const client =
  globalForDb.__postgresClient ||
  postgres(process.env.DATABASE_URL, { prepare: false });
if (process.env.NODE_ENV !== "production")
  globalForDb.__postgresClient = client;
export const db = drizzle(client, { schema });
