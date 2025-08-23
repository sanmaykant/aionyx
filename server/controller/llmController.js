import { ChatCompletion } from "@google-ai/generative";
import { LLMChain, PromptTemplate } from "langchain";

const client = new ChatCompletion({
  model: "gemini-2.0-flash-thinking-exp-1219",
  apiKey: process.env.GEMINI_API,
});

// Define your prompt template
const prompt = new PromptTemplate({
  template: "Extract appointment details from the text: {text}",
  inputVariables: ["text"],
});

const llmChain = new LLMChain({ llm: client, prompt });

async function parseAppointments(text) {
  const response = await llmChain.call({ text });
  console.log(response.text); // parse response as needed
}

parseAppointments("Let's have a meeting at 2 PM to 3 PM today")
