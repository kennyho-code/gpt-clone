import { NextRequest, NextResponse } from "next/server";
import langchainApp, { getChatHistory } from "@/services/langchain/langchain";

export async function POST(request: NextRequest) {
  const { message: inputMessage } = await request.json();

  const config = {
    configurable: { sessionId: "1" },
    streamMode: "values" as const,
  };

  for await (const event of await langchainApp.stream(
    { messages: [inputMessage] },
    config,
  )) {
    const lastMessage = event.messages[event.messages.length - 1];
    console.log(lastMessage.content);
  }

  return NextResponse.json({ message: "success" });
}

export async function GET(request: NextRequest) {
  const { sessionId } = await request.json();

  const chatHistory = await getChatHistory(sessionId);

  console.log("chatHistory: ", chatHistory);
  return NextResponse.json({ message: "success" });
}
