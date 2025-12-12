import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFoodDescription = async (name: string, ingredients: string[]): Promise<string> => {
  try {
    const ingredientsList = ingredients.join(", ");
    const prompt = `
      Write a short, mouth-watering, appetizing description (max 40 words) for a food item named "${name}".
      The main ingredients are: ${ingredientsList}.
      Make it sound irresistible to a hungry customer. 
      Do not include the name of the dish in the beginning, just describe it directly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "A delicious meal waiting for you.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Freshly prepared with the finest ingredients.";
  }
};