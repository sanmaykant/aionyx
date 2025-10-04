import { GoogleGenAI } from "@google/genai";
import { extractActivities } from "../prompts/extractActivities.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const identifyActivities = async (req, res) => {
    try {
        const { text } = req.body
        const response = await ai.models.generateContent({
            model: "models/gemma-3-27b-it",
            contents: extractActivities(text)
        })

        const activitiesString = response.text.replace(/```json/g, '')
                                        .replace(/```/g, '')
                                        .trim()
        const activitiesObject = JSON.parse(activitiesString)

        res.status(200).json({ success: true, activities: activitiesObject })
    } catch (error) {
        console.error(error)
        res.status(400).json({ success: false, message: error })
    }
}
