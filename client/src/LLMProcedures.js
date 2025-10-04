import { GoogleGenAI } from "@google/genai";
import { extractActivities } from "./prompts"

const GEMINI_API_KEY = ""

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

export const textToActivity = async (text) => {
    const response = await ai.models.generateContent({
        model: "models/gemma-3-27b-it",
        contents: extractActivities(text)
    })
    console.log(response.text)
}
