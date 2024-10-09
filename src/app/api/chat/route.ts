import { NextRequest, NextResponse } from "next/server";
import langchainApp, { getChatHistory } from "@/services/langchain/langchain";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(request: NextRequest) {
  const { message: inputMessage } = await request.json();

  const config = {
    configurable: { sessionId: "1" },
  };

  const response = await langchainApp.invoke(
    { messages: [inputMessage] },
    config,
  );
  const messages = response.messages;
  const responseMessage = messages.at(-1);
  return NextResponse.json({ message: "success", responseMessage });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json(
      { message: "sessionId not found" },
      { status: 400 },
    );
  }

  const chatHistory = getChatHistory(sessionId);

  console.log("chatHistory", chatHistory);

  return NextResponse.json({ data: { chatHistory } });
}
