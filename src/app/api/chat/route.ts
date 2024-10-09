import { NextRequest, NextResponse } from "next/server";
import langchainApp from "@/services/langchain/langchain";

export async function POST(request: NextRequest) {
  const { message: inputMessage } = await request.json();

  const config = {
    configurable: { thread_id: "1" },
  };

  const result = await langchainApp.invoke({ messages: inputMessage }, config);

  const messages = result.messages;
  const responseMesssage = messages.at(-1).content;

  return NextResponse.json({ message: "success", responseMesssage });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const threadId = url.searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json(
      { message: "sessionId not found" },
      { status: 400 },
    );
  }

  const config = {
    configurable: { thread_id: "1" },
  };
  const chatState = await langchainApp.getState(config);
  const chatHistory = chatState.values.messages;

  return NextResponse.json({ data: { chatHistory } });
}
