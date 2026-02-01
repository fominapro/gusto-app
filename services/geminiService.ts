import { GoogleGenerativeAI } from "@google/generative-ai";
import { NASTYA_SYSTEM_INSTRUCTION } from "../constants";

// Берем ключ из настроек Vercel
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error("❌ API Key не найден!");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Устанавливаем СТАБИЛЬНУЮ модель
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Эта модель сейчас самая быстрая и рабочая
  systemInstruction: NASTYA_SYSTEM_INSTRUCTION,
});

export const createNastyaChat = () => {
  return model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
};

export const sendMessageToAI = async (chat: any, message: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return { text: response.text(), sources: [] };
  } catch (error) {
    console.error("❌ Ошибка ИИ:", error);
    return { 
        text: "На кухне небольшой переполох (ошибка связи). Попробуй включить VPN или спроси еще раз через минуту! 🌿", 
        sources: [] 
    };
  }
};

export const generateMenuPlan = async (params: { days: number; diet: string; mood: string; allergies: string }): Promise<string | undefined> => {
  const prompt = `Составь меню на ${params.days} дней. Тон: теплый, как Настя.`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return undefined;
  }
};

export const getDailyInspiration = async (): Promise<string | undefined> => {
  try {
    const result = await model.generateContent("Предложи вдохновляющее блюдо на сегодня.");
    return result.response.text();
  } catch (error) {
     return undefined;
  }
};
