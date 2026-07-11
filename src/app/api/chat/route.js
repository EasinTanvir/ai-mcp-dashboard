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
      model: groq("llama-3.3-70b-versatile"),
      tools: myMcpTools,
      stopWhen: stepCountIs(4),
      system:
        "You have tools that take no parameters. Call the relevant tool exactly once with no arguments, then answer in one concise sentence using only the tool result. Do not call the same tool twice.",
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
