import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const MODEL_NAME = "gpt-3.5-turbo";

function createModel() {
  const model = new ChatOpenAI({
    model: MODEL_NAME,
    temperature: 0,
  });
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an assistant for question-answering tasks. " +
        "Use the following pieces of retrieved context to answer " +
        "the question. If you don't know the answer, say that you " +
        "don't know. Use three sentences maximum and keep the " +
        "answer concise.",
    ],
    new MessagesPlaceholder("messages"),
  ]);

  return prompt.pipe(model);
}

export default createModel;
