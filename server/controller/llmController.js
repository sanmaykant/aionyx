import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
import { buildPrompt, generateClarificationPrompt, generateFinalJsonPrompt } from '../utils/prompts/GeminiPrompt.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateInsight(inputText) {
  const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

  const prompt = buildPrompt(inputText);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
   // console.log("🧠 Gemini Output:\n", text);

    return text;

  } catch (err) {
    console.error("❌ Error calling Gemini:", err);
  }
}

export async function recieveMissingInfo(missingFields, inputText) {
  const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

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
  const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

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

//gemini-2.0-flash-thinking-exp-1219





