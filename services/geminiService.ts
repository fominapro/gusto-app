import { GoogleGenerativeAI } from "@google/generative-ai";
import { NASTYA_SYSTEM_INSTRUCTION } from "../constants";

// БЕРЕМ КЛЮЧ ИЗ VERCEL
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error("❌ ОШИБКА: API Key не найден!");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ИСПОЛЬЗУЕМ САМУЮ СТАБИЛЬНУЮ МОДЕЛЬ
const model = genAI.getGenerativeModel({
  model: "gemini-pro", // Стабильная модель Google
  systemInstruction: NASTYA_SYSTEM_INSTRUCTION,
});

// --- Chat Service ---

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
    const result = await chat.sendMessage({ message });
    const response = await result.response;
    return { text: response.text(), sources: [] };
  } catch (error) {
    console.error("❌ Ошибка Google Gemini:", error);
    // Ошибку Google мы вернем как "попробуйте с VPN"
    return { 
        text: "На кухне небольшой переполох (Google не отвечает). Попробуй включить VPN или спроси меня еще раз через минуту! 🌿", 
        sources: [] 
    };
  }
};

// --- Остальные функции (Оставлены для работы кнопок) ---

export const generateMenuPlan = async (params: any): Promise<string | undefined> => {
    try {
        const result = await model.generateContent(`Составь меню на 7 дней. Тон: теплый, как Настя. Оформи красиво.`);
        return result.response.text();
    } catch (error) { return undefined; }
};

export const getDailyInspiration = async (): Promise<string | undefined> => {
    try {
        const result = await model.generateContent("Предложи вдохновляющее блюдо на сегодня.");
        return result.response.text();
    } catch (error) { return undefined; }
};
