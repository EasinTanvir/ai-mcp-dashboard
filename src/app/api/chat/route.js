import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getCurrentAdmin } from "@/actions/auth";
import { runMcpTool } from "@/lib/mcp/tools";
const select = (q) =>
  q.includes("low stock")
    ? "low_stock_products"
    : q.includes("recent order")
      ? "recent_orders"
      : q.includes("categor")
        ? "count_categories"
        : q.includes("customer")
          ? "count_customers"
          : q.includes("review")
            ? "count_reviews"
            : q.includes("order")
              ? "count_orders"
              : "count_products";
export async function POST(request) {
  if (!(await getCurrentAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { message } = await request.json();
  const source = await runMcpTool(select((message || "").toLowerCase()));
  try {
    const groq = new Groq({ apiKey: process.env.MCP_KEY });
    const r = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 60,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Answer in one concise sentence using this MCP tool result only.",
        },
        {
          role: "user",
          content: `Question: ${message}\nMCP result: ${source}`,
        },
      ],
    });
    return NextResponse.json({
      answer: r.choices[0]?.message?.content || source,
    });
  } catch {
    return NextResponse.json({ answer: source });
  }
}
