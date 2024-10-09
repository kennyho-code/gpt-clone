import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { RunnableLambda } from "@langchain/core/runnables";
const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
});

// prompt
const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}");

const res = { promptResponse: "", analysisResponse: "" };

console.log(prompt);

const chain = prompt.pipe(model).pipe(new StringOutputParser());
const promptResponse = await chain.invoke({ topic: "chicken" });

res.promptResponse = promptResponse;

// coercion

const analysisPrompt = ChatPromptTemplate.fromTemplate(
  "Is this a funny joke? {joke}",
);

const composedChain = new RunnableLambda({
  func: async (input: { topic: string }) => {
    const result = await chain.invoke({ topic: input.topic });
    return { joke: result };
  },
})
  .pipe(analysisPrompt)
  .pipe(model)
  .pipe(new StringOutputParser());

const analysisResponse = await composedChain.invoke({ topic: "chicken" });
