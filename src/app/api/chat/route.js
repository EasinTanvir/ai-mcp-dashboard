import { NextResponse } from "next/server";
import { generateText, stepCountIs } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createMCPClient } from "@ai-sdk/mcp";
import { getCurrentAdmin } from "@/actions/auth";
const groq = createGroq({ apiKey: process.env.MCP_KEY });

export async function POST(request) {
  // 1. Auth Guard
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await request.json();
  console.log("message", message);
  // 2. Point to your local MCP server route
  const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: `http://localhost:3000/api/mcp`,
    },
  });

  try {
    // 3. Dynamically read tools from your MCP server
    const myMcpTools = await mcpClient.tools();

    // 4. Let Groq automatically select, invoke, and summarize the tool execution!
    const response = await generateText({
      model: groq("openai/gpt-oss-20b"),
      tools: myMcpTools,
      stopWhen: stepCountIs(4),
      system:
        "You are a store analytics assistant. You have tools that answer questions or perform actions on the store — call the single most relevant tool with the correct arguments extracted from the user's message. " +
        "For 'add product' requests, pull the name, category, price, and stock directly from what the user typed. For 'dummy/sample/fake product' requests, use the dummy product tool with no need to ask for details. " +
        "Never call the same tool twice for one question. Answer in one concise sentence using only the tool result. " +
        "If the user's question does not match any available tool, reply exactly: \"I don't have information about this.\"",
      prompt: message,
    });

    console.log(
      JSON.stringify(
        response.steps.map((s) => s.content),
        null,
        2,
      ),
    );

    return NextResponse.json({ answer: response.text });
  } catch (error) {
    console.error("AI/MCP Loop failed:", error);
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 },
    );
  } finally {
    // 5. Always cleanly sever client hooks
    await mcpClient.close();
  }
}
