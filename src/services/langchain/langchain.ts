import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import {
  RunnableConfig,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";

import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import createModel from "./createModel";

// In Memory Storage
const chatsBySessionId: Record<string, InMemoryChatMessageHistory> = {};
export const getChatHistory = (sessionId: string) => {
  let chatHistory: InMemoryChatMessageHistory | undefined =
    chatsBySessionId[sessionId];
  if (!chatHistory) {
    chatHistory = new InMemoryChatMessageHistory();
    chatsBySessionId[sessionId] = chatHistory;
  }
  return chatHistory;
};

const callModel = async (
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig,
): Promise<Partial<typeof MessagesAnnotation.State>> => {
  if (!config.configurable?.sessionId) {
    throw new Error(
      "Make sure that the config includes the following information: {'configurable': {'sessionId': 'some_value'}}",
    );
  }
  const chatHistory = getChatHistory(config.configurable.sessionId as string);
  const messages = [...(await chatHistory.getMessages()), ...state.messages];
  const chainWithHistory = new RunnableWithMessageHistory({
    runnable: createModel(),
    getMessageHistory: getChatHistory,
    inputMessagesKey: "question",
    historyMessagesKey: "history",
  });
  const question = messages[messages.length - 1];
  const aiMessage = await chainWithHistory.invoke({ question });
  return { messages: [aiMessage] };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

export default workflow.compile();
