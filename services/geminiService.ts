
import { GoogleGenAI } from "@google/genai";

export async function getHabitInsights(habitName: string, checks: string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    I am tracking my habit "${habitName}". 
    My completed days are: ${checks.join(', ')}.
    Please provide a short, motivating insight (2 sentences) about my progress or a tip to stay consistent.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep going! Consistency is the key to mastery.";
  }
}
