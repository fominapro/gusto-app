import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { createNastyaChat, sendMessageToAI } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Send, Utensils, Coffee, CloudSun } from 'lucide-react';
import { NASTYA_SYSTEM_INSTRUCTION } from '../constants'; // Используем только константы

// Временный лимит для демонстрации
const MAX_FREE_MESSAGES = 500; // Это мы берем из кода, не импортируя
const CHAT_MODEL_ROLE = 'Настя'; 
const CHAT_MODEL_INITIAL_TEXT = 'Привет! Я Настя. Твой голос вкуса. Чего тебе хочется сегодня? 🌿';

// КНОПКИ (можно менять)
const SUGGESTIONS = [
  { text: "Что приготовить?", icon: <Utensils size={14} /> },
  { text: "Мне грустно...", icon: <Coffee size={14} /> },
  { text: "Быстрый обед", icon: <CloudSun size={14} /> },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: CHAT_MODEL_INITIAL_TEXT },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const chatSession = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load message count from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('nastya_msg_count');
    if (storedCount) {
      const count = parseInt(storedCount, 10);
      setMessageCount(count);
      if (count >= MAX_FREE_MESSAGES) {
        setIsLimitReached(true);
      }
    }
  }, []);

  // Save message count to localStorage
  useEffect(() => {
    localStorage.setItem('nastya_msg_count', messageCount.toString());
  }, [messageCount]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading || isLimitReached) return;

    // Check limit
    if (messageCount >= MAX_FREE_MESSAGES) {
      setIsLimitReached(true);
      return;
    }

    setIsLoading(true);
    setInput('');

    const newUserMessage: Message = { role: 'user', text: messageText };
    setMessages(prev => [...prev, newUserMessage]);
    setMessageCount(prev => prev + 1);

    try {
        const response = await sendMessageToAI(messageText);

        const newAIMessage: Message = {
            role: 'model',
            text: response.text,
            sources: (response as any).sources,
        };
        setMessages(prev => [...prev, newAIMessage]);

    } catch (error) {
        console.error("Failed to send message:", error);
        setMessages(prev => [...prev, {
            role: 'model',
            text: 'Ой, произошла техническая ошибка. Пожалуйста, попробуйте еще раз!',
        }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut (Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Reset button (for testing)
  const handleReset = () => {
    localStorage.setItem('nastya_msg_count', '0');
    setMessageCount(0);
    setIsLimitReached(false);
    setMessages([{ role: 'model', text: CHAT_MODEL_INITIAL_TEXT }]);
    alert("Счетчик сообщений сброшен до 0!");
  };


  return (
    <div className="flex flex-col h-full bg-stone-50">
      <header className="flex items-center justify-between p-4 border-b border-stone-200 bg-white shadow-md">
        <h1 className="text-xl font-bold text-emerald-800">{CHAT_MODEL_ROLE}</h1>
        <button onClick={handleReset} className="text-sm text-stone-500 hover:text-stone-800">
          Сброс (Тест)
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-sm ${
              message.role === 'user' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white text-stone-800 border border-stone-200'
            }`}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isLimitReached && (
        <div className="text-center p-2 bg-red-100 text-red-700 text-sm">
          Лимит {MAX_FREE_MESSAGES} бесплатных сообщений исчерпан. Оформите подписку.
        </div>
      )}

      <div className="p-4 border-t border-stone-200 bg-white">
        <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
            {SUGGESTIONS.map((s, index) => (
                <button 
                    key={index}
                    onClick={() => handleSend(s.text)}
                    disabled={isLoading || isLimitReached}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50 transition-colors"
                >
                    {s.icon}
                    <span>{s.text}</span>
                </button>
            ))}
        </div>
        
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isLimitReached}
            rows={1}
            placeholder={isLimitReached ? "Лимит исчерпан..." : "Спроси Настю..."}
            className="flex-1 resize-none p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || isLimitReached || input.trim().length === 0}
            className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-stone-400 transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-2 border-t-white border-emerald-300 rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
