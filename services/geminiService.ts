import { GoogleGenerativeAI } from "@google/generative-ai";
import { NASTYA_SYSTEM_INSTRUCTION } from "../constants";

// 1. ИСПРАВЛЕНИЕ: Правильный доступ к ключу в Vite/Vercel
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Лог для проверки (будет виден в консоли браузера, но ключ скроем)
if (!apiKey) {
  console.error("❌ ОШИБКА: API Key не найден! Проверь настройки Vercel (VITE_GEMINI_API_KEY).");
} else {
  console.log("✅ API Key найден. Подключаемся к ИИ...");
}

// 2. Инициализация стандартного SDK
const genAI = new GoogleGenerativeAI(apiKey);

// 3. ИСПРАВЛЕНИЕ: Используем стабильную модель gemini-1.5-flash
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
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
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    return { text, sources: [] };
  } catch (error) {
    console.error("❌ Ошибка при отправке сообщения:", error);
    // Возвращаем вежливое сообщение, если ИИ упал
    return { 
        text: "На кухне небольшой переполох (ошибка связи с Google). Попробуй включить VPN или спроси меня еще раз через минуту! 🌿", 
        sources: [] 
    };
  }
};

// --- Additional Services ---

export const generateMenuPlan = async (params: { days: number; diet: string; mood: string; allergies: string }): Promise<string | undefined> => {
  const prompt = `Составь меню на ${params.days} дней.
  Диета: ${params.diet || 'Нет'}. Настроение: ${params.mood}. Аллергии: ${params.allergies || 'Нет'}.
  Тон: теплый, как Настя. Используй Markdown.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating menu:", error);
    return undefined;
  }
};

export const getDailyInspiration = async (): Promise<string | undefined> => {
  try {
    const result = await model.generateContent("Предложи одно вдохновляющее блюдо на сегодня. Кратко и страстно.");
    return result.response.text();
  } catch (error) {
     console.error("Error daily inspiration:", error);
     return undefined;
  }
};
