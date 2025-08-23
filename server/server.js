// gemini-test.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp-1219' });

  const prompt = `Extract appointment info from this message. The date parameter should have an actual date:
  "Hey can we meet tomorrow at 3pm to discuss the project? Let's finish by 4:30pm."`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("🧠 Gemini Output:\n", text);
  } catch (err) {
    console.error("❌ Error calling Gemini:", err);
  }
}

run();
