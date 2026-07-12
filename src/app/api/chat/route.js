import { NextResponse } from "next/server";
import { generateText, stepCountIs } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createMCPClient } from "@ai-sdk/mcp";
import { getCurrentAdmin } from "@/actions/auth";

const groq = createGroq({ apiKey: process.env.MCP_KEY });

async function generateWithRetry(params, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await generateText(params);
    } catch (err) {
      const isToolFormatError = err?.data?.error?.code === "tool_use_failed";
      if (isToolFormatError && i < retries) continue;
      throw err;
    }
  }
}

function extractListData(response) {
  for (const step of response.steps) {
    for (const item of step.content) {
      if (item.type !== "tool-result") continue;
      const raw = item.output?.content?.[0]?.text;
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.items) return parsed; // { summary, type, items }
      } catch {
        // not JSON — a plain-sentence tool result, ignore
      }
    }
  }
  return null;
}

export async function POST(request) {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();

  const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/mcp`,
    },
  });

  try {
    const myMcpTools = await mcpClient.tools();

    const response = await generateWithRetry({
      model: groq("openai/gpt-oss-20b"),
      tools: myMcpTools,
      temperature: 0,
      stopWhen: stepCountIs(4),
      system:
        "You are Nexa, a sharp and respectful personal assistant speaking to your boss. Always address them as 'Sir' naturally in your reply, and keep a warm, brief, professional tone — never robotic, never long-winded, one sentence only. " +
        "For counts and facts, phrase it like a trusted assistant reporting in, e.g. 'Sir, we currently have 5 products.' " +
        "For actions the user asks you to perform, acknowledge briefly and confirm the result in the same reply, e.g. 'Sure Sir, I've added that.' or 'Done, Sir — order NEX-1048 is now marked Completed.' " +
        "When updating an order status, map casual phrasing to the closest valid status: 'done'/'complete'/'finished' → Completed, 'shipped'/'sent' → Shipped, 'processing'/'in progress' → Processing, 'pending'/'not started' → Pending. " +
        "Some tool results are plain sentences you should rephrase in this voice; others are JSON objects with a 'summary' field and an 'items' array — for those, your final answer must be exactly the 'summary' text as given, since the full list is displayed separately in the UI. " +
        "Call the single most relevant tool with the correct arguments extracted from the user's message. Never call the same tool twice. " +
        "If the user's question does not match any available tool, reply exactly: \"I don't have information about this, Sir.\"",
      prompt: message,
    });

    const data = extractListData(response);

    return NextResponse.json({ answer: response.text, data });
  } catch (error) {
    console.error("AI/MCP Loop failed:", error.message, error.cause ?? "");
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 },
    );
  } finally {
    await mcpClient.close();
  }
}
