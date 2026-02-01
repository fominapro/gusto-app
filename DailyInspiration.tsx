import React, { useState } from 'react';
import { getDailyInspiration } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Loader2, RefreshCw, Heart } from 'lucide-react';

const DailyInspiration: React.FC = () => {
  const [inspiration, setInspiration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInspiration = async () => {
    setIsLoading(true);
    try {
      const text = await getDailyInspiration();
      setInspiration(text || "Не удалось найти вдохновение. Попробуй позже.");
    } catch (e) {
      setInspiration("Кухня временно закрыта. Загляни попозже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="font-serif text-3xl md:text-4xl text-emerald-900 mb-4">Блюдо Дня</h2>
      <p className="text-stone-600 mb-8">Не знаешь, чего хочется? Доверься вселенной (и Насте).</p>

      {!inspiration && !isLoading && (
        <button
          onClick={fetchInspiration}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-terracotta-600 px-8 py-4 font-medium text-white shadow-lg transition duration-300 hover:bg-terracotta-500 hover:scale-105"
        >
          <span className="mr-2 text-xl">✨</span> Узнать Блюдо
        </button>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-terracotta-600 mb-4" size={32} />
            <p className="text-stone-500 font-serif italic">Советуюсь с духами кулинарии...</p>
        </div>
      )}

      {inspiration && !isLoading && (
        <div className="animate-fade-in-up mt-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-800 via-emerald-600 to-terracotta-500"></div>
            
            <div className="prose prose-lg prose-stone prose-headings:font-serif prose-headings:text-emerald-900 mx-auto">
              <ReactMarkdown>{inspiration}</ReactMarkdown>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex justify-center gap-4">
               <button 
                onClick={fetchInspiration}
                className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-emerald-900 transition-colors"
               >
                 <RefreshCw size={16} /> Другое
               </button>
               <button className="flex items-center gap-2 text-sm font-medium text-terracotta-600 hover:text-terracotta-500 transition-colors">
                 <Heart size={16} /> Сохранить
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyInspiration;