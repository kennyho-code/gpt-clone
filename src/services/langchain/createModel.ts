import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const MODEL_NAME = "gpt-3.5-turbo";

function creatModel() {
  const model = new ChatOpenAI({
    model: MODEL_NAME,
    temperature: 0,
  });
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant. Please answer the following questions accurately and concisely.",
    ],
    new MessagesPlaceholder("history"),
    ["human", "{question}"],
  ]);
  return prompt.pipe(model);
}

export default creatModel;
