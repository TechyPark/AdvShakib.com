import { GoogleGenAI } from "@google/genai";

export async function generateLegalVisuals(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Professional, high-end, luxury legal photography. ${prompt}. Cinematic lighting, shallow depth of field, 8k resolution, prestigious atmosphere.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
  return null;
}
