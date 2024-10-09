import {
  Annotation,
  END,
  MemorySaver,
  MessagesAnnotation,
  messagesStateReducer,
  START,
  StateGraph,
} from "@langchain/langgraph";
import {
  RunnableConfig,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";

import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import createModel from "./createModel";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

// Define the State interface

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const model = createModel();
  const response = await model.invoke(state);
  return { messages: [response] };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

export default app;
