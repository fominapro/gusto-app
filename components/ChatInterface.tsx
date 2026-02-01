import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { createNastyaChat, sendMessageToAI } from '../services/geminiService';
import { Chat } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Send, Utensils, Coffee, CloudSun } from 'lucide-react';
import { FREE_MESSAGE_LIMIT } from '../constants';

const SUGGESTIONS = [
  { text: "Что приготовить?", icon: <Utensils size={14} /> },
  { text: "Мне грустно...", icon: <Coffee size={14} /> },
  { text: "Быстрый обед", icon: <CloudSun size={14} /> },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Привет! Я Настя. Чего тебе хочется сегодня? 🌿" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load message count from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('nastya_msg_count');
    if (storedCount) {
      setMessageCount(parseInt(storedCount, 10));
    }
    if (!chatSession.current) {
      chatSession.current = createNastyaChat();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    // CHECK LIMIT
    if (messageCount >= FREE_MESSAGE_LIMIT) {
        setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'model', 
                text: "Ох, я немного устала. 🥱 \n\nМы так хорошо поболтали! Чтобы продолжить общение, оформи, пожалуйста, подписку в Магазине.",
                isError: true 
            }]);
        }, 500);
        return;
    }

    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    // Increment count
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    localStorage.setItem('nastya_msg_count', newCount.toString());

    try {
      if (chatSession.current) {
          const response = await sendMessageToAI(chatSession.current, textToSend);
          setMessages(prev => [...prev, { 
            role: 'model', 
            text: response.text, 
            groundingSources: response.sources 
          }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "На кухне какой-то хаос. Попробуешь спросить еще раз?", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const remaining = Math.max(0, FREE_MESSAGE_LIMIT - messageCount);
  const isLimitReached = remaining === 0;

  return (
    <div className="flex flex-col h-full bg-stone-50">
      
      {/* Limit Counter Banner (only visible when low or reached) */}
      {(remaining <= 2) && (
          <div className={`text-center py-1 text-[10px] font-medium uppercase tracking-widest ${isLimitReached ? 'bg-terracotta-600 text-white' : 'bg-stone-200 text-stone-500'}`}>
              {isLimitReached ? 'Лимит исчерпан' : `Осталось сообщений: ${remaining}`}
          </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            <div 
              className={`max-w-[85%] px-5 py-3 shadow-sm relative ${
                msg.role === 'user' 
                  ? 'bg-emerald-900 text-white rounded-2xl rounded-tr-sm' 
                  : msg.isError 
                    ? 'bg-red-50 border border-red-100 text-red-800 rounded-2xl rounded-tl-sm'
                    : 'bg-white border border-stone-100 text-stone-800 rounded-2xl rounded-tl-sm'
              }`}
            >
              {msg.role === 'model' ? (
                <div className="prose prose-stone prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-stone-100">
                      <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">Источники</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.groundingSources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-800 underline hover:text-emerald-600"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {msg.isError && isLimitReached && (
                      <div className="mt-4">
                          <button 
                            onClick={() => document.getElementById('shop-trigger')?.click()}
                            className="bg-terracotta-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-terracotta-500 transition-colors"
                          >
                              Перейти в магазин
                          </button>
                      </div>
                  )}
                </div>
              ) : (
                <span className="whitespace-pre-wrap font-sans">{msg.text}</span>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-1 px-4 py-3 bg-white border border-stone-100 rounded-2xl rounded-tl-sm items-center">
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-stone-100 px-4 py-3 pb-safe">
        {messages.length < 3 && !isLimitReached && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {SUGGESTIONS.map((s, i) => (
                <button 
                key={i}
                onClick={() => handleSend(s.text)}
                className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 rounded-full text-xs font-medium transition-colors text-stone-600"
                >
                {s.icon}
                {s.text}
                </button>
            ))}
            </div>
        )}
        
        <div className="flex items-end gap-2 bg-stone-50 p-1.5 rounded-3xl border border-stone-200 focus-within:border-emerald-800/30 focus-within:ring-1 focus-within:ring-emerald-800/10 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isLimitReached ? "Лимит исчерпан..." : "Спроси Настю..."}
            disabled={isLimitReached}
            className="w-full bg-transparent border-none px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 resize-none max-h-32 min-h-[44px] disabled:opacity-50 font-sans"
            rows={1}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || isLimitReached}
            className={`p-2.5 rounded-full transition-all duration-200 flex-none ${
                input.trim() && !isLimitReached
                 ? 'bg-emerald-900 text-white shadow-md hover:bg-emerald-800 transform hover:scale-105' 
                 : 'bg-stone-200 text-stone-400'
            }`}
          >
             <Send size={18} />
          </button>
        </div>
      </div>
      {/* Hidden trigger for layout to switch view */}
      <button id="shop-trigger" className="hidden" onClick={() => window.dispatchEvent(new CustomEvent('OPEN_SHOP'))}></button>
    </div>
  );
};

export default ChatInterface;