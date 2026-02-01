import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  
  const handleReset = () => {
    if (confirm('Сбросить счетчик сообщений? (Это для тестирования)')) {
        localStorage.removeItem('nastya_msg_count');
        window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 md:py-20 animate-fade-in relative min-h-full px-6">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-8 relative">
        <img 
            src="https://picsum.photos/300/300?grayscale" 
            alt="Abstract Food Texture" 
            className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center">
            <span className="font-serif text-4xl text-white drop-shadow-md">N</span>
        </div>
      </div>
      
      <h1 className="font-serif text-4xl md:text-5xl text-emerald-900 leading-tight mb-6">
        Я — Настя.<br/>
        <span className="italic text-terracotta-600 text-3xl md:text-4xl">Твой голос вкуса.</span>
      </h1>
      
      <p className="max-w-lg text-stone-600 text-lg leading-relaxed mb-10">
        Если ты не знаешь, что съесть, но хочешь, чтобы еда отозвалась в душе.
        Я подберу блюдо под твое настроение, погоду за окном и твои желания.
      </p>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-emerald-900 text-white rounded-full font-medium text-lg shadow-lg hover:bg-emerald-800 hover:scale-105 transition-all duration-300"
      >
        Поговорить с Настей
      </button>

      <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 opacity-70 w-full max-w-sm">
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-2">🌍</span>
          <span className="text-[10px] uppercase tracking-widest text-stone-500">Путешествия</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-2">🍋</span>
          <span className="text-[10px] uppercase tracking-widest text-stone-500">Вкусы</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-2">🕯️</span>
          <span className="text-[10px] uppercase tracking-widest text-stone-500">Уют</span>
        </div>
      </div>

      {/* Test Button */}
      <button 
        onClick={handleReset}
        className="absolute bottom-0 mb-4 text-[10px] text-stone-300 hover:text-stone-400 uppercase tracking-widest"
      >
        Сброс лимита (Тест)
      </button>
    </div>
  );
};

export default Hero;