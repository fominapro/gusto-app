import React, { useState } from 'react';
import { generateMenuPlan } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Loader2, Calendar, Leaf, Smile, AlertCircle, ChevronRight, Check } from 'lucide-react';

const MenuPlanner: React.FC = () => {
  const [days, setDays] = useState(3);
  const [diet, setDiet] = useState('');
  const [mood, setMood] = useState('');
  const [allergies, setAllergies] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const plan = await generateMenuPlan({ days, diet, mood, allergies });
      setResult(plan || "Не удалось составить меню. Попробуем снова?");
    } catch (error) {
      setResult("Прости, я немного запуталась. Давай попробуем еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
      return (
          <div className="p-4 bg-white min-h-full">
               <div className="flex items-center justify-between mb-4">
                   <h2 className="font-serif text-2xl text-emerald-900">Твое Меню</h2>
                   <button 
                    onClick={() => setResult(null)} 
                    className="text-xs font-medium text-stone-500 uppercase tracking-wide border px-3 py-1 rounded-full"
                   >
                       Новое
                   </button>
               </div>
               <div className="prose prose-stone prose-emerald prose-sm max-w-none pb-20">
                    <ReactMarkdown>{result}</ReactMarkdown>
               </div>
          </div>
      )
  }

  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-4">
          <h2 className="font-serif text-2xl text-emerald-900 mb-1">Составим план</h2>
          <p className="text-stone-500 text-sm">Расскажи, чего хочется, и я придумаю меню.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
             Длительность
          </label>
          <div className="flex gap-2">
            {[1, 3, 5, 7].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setDays(num)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  days === num 
                    ? 'bg-emerald-900 text-white shadow-md' 
                    : 'bg-stone-50 text-stone-600 border border-stone-200'
                }`}
              >
                {num} {num === 1 ? 'День' : 'Дн.'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 space-y-4">
            <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">
                Диета / Предпочтения
                </label>
                <input
                type="text"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                placeholder="Вегетарианство, без сахара..."
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-900/20"
                />
            </div>
            <div className="h-px bg-stone-100"></div>
            <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">
                Настроение
                </label>
                 <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 text-stone-900 focus:ring-1 focus:ring-emerald-900/20 appearance-none"
                    >
                    <option value="" disabled>Выбери вайб...</option>
                    <option value="Уют и тепло">Уют и тепло</option>
                    <option value="Легкость и энергия">Легкость и энергия</option>
                    <option value="Дешево и сердито">Дешево и сердито</option>
                    <option value="Романтический ужин">Романтический ужин</option>
                    <option value="Гастро-путешествие">Гастро-путешествие</option>
                </select>
            </div>
             <div className="h-px bg-stone-100"></div>
             <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">
                Аллергии
                </label>
                <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Орехи, мед..."
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:ring-emerald-900/20"
                />
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !mood}
          className="w-full bg-terracotta-600 text-white font-medium py-4 rounded-2xl hover:bg-terracotta-500 active:scale-95 transition-all shadow-lg shadow-terracotta-600/20 flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Создать меню'}
        </button>
      </form>
      <div className="h-20"></div> {/* Spacer for bottom nav */}
    </div>
  );
};

export default MenuPlanner;