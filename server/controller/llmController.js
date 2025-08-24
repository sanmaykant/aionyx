import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
import { buildPrompt, generateClarificationPrompt, generateFinalJsonPrompt } from '../utils/prompts/GeminiPrompt.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateInsight(inputText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp-1219' });

  const prompt = buildPrompt(inputText);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;

    console.log("🧠 Gemini Output:\n", text);
  } catch (err) {
    console.error("❌ Error calling Gemini:", err);
  }
}

export async function recieveMissingInfo(missingFields, inputText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp-1219' });

  const prompt = generateClarificationPrompt(missingFields, inputText);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    //return text

    console.log("🧠 Gemini Output:\n", text);
  } catch (err) {
    console.error("❌ Error calling Gemini:", err);
  }
}

export async function regenerateInsight(inputText, clarificationMessage) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp-1219' });

  const prompt = generateFinalJsonPrompt(inputText, clarificationMessage);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("🧠 Gemini Output:\n", text);
  } catch (err) {
    console.error("❌ Error calling Gemini:", err);
  }
}





