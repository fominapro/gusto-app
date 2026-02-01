import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { NASTYA_SYSTEM_INSTRUCTION } from "../constants";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from process.env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD_CHECK' });

// --- Chat Service ---

export const createNastyaChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: NASTYA_SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });
};

export const sendMessageToAI = async (chat: Chat, message: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    
    // Extract text
    const text = response.text || "Извини, я замечталась о пасте. Повтори, пожалуйста?";
    
    // Extract grounding sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let sources: { title: string; uri: string }[] = [];
    
    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title || 'Источник', uri: chunk.web.uri || '#' });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// --- Additional Services ---

export const generateMenuPlan = async (params: { days: number; diet: string; mood: string; allergies: string }): Promise<string | undefined> => {
  const prompt = `Составь меню на ${params.days} дней.
  Диета/Предпочтения: ${params.diet || 'Нет'}.
  Настроение: ${params.mood}.
  Аллергии: ${params.allergies || 'Нет'}.
  Оформи красиво с помощью Markdown. Используй теплый тон, как Настя.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: NASTYA_SYSTEM_INSTRUCTION,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating menu plan:", error);
    return undefined;
  }
};

export const getDailyInspiration = async (): Promise<string | undefined> => {
  const prompt = "Предложи одно уникальное, вдохновляющее блюдо, которое можно приготовить сегодня. Опиши его страстно. Добавь краткую суть рецепта. Используй Markdown.";
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            systemInstruction: NASTYA_SYSTEM_INSTRUCTION,
        }
    });
    return response.text;
  } catch (error) {
     console.error("Error getting daily inspiration:", error);
     return undefined;
  }
};