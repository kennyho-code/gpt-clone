import { ChatOpenAI } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";

import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

// const userInvoke = await model.invoke([
//   { role: "user", content: "Hi! I'm Bob" },
//   { role: "assistant", content: "Hello Bob! How can I assist you today?" },
//   { role: "user", content: "What's my name?" },
// ]);

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
  ],
  new MessagesPlaceholder("messages"),
]);
// need persistence

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const chain = prompt.pipe(model);
  const response = await chain.invoke(state);
  return { messages: [response] };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const config = { configurable: { thread_id: uuidv4 } };

const input = [
  {
    role: "user",
    content: "Hi! I'm Bob.",
  },
];
const output = await app.invoke({ messages: input }, config);

const input5 = [
  {
    role: "user",
    content: "What is my name?",
  },
];
const output6 = await app.invoke({ messages: input5 }, config);
console.log(output6.messages[output6.messages.length - 1]);

console.log(output.messages);

// const input2 = [
//   {
//     role: "user",
//     content: "What's my name?",
//   },
// ];
// const output2 = await app.invoke({ messages: input2 }, config);
// // shares the memory betwee input1 and input2

// const config2 = { configurable: { thread_id: uuidv4() } };
// const input3 = [
//   {
//     role: "user",
//     content: "What's my name?",
//   },
// ];
// const output3 = await app.invoke({ messages: input3 }, config2);

// const output4 = await app.invoke({ messages: input2 }, config);
// console.log(output4.messages[output4.messages.length - 1]);
