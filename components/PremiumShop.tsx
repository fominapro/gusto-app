import React from 'react';
import { PRODUCTS } from '../constants';
import { Sparkles, ArrowRight, Heart, Calendar } from 'lucide-react';

const PremiumShop: React.FC = () => {
  
  const handleBuy = (productTitle: string) => {
    if (window.Telegram?.WebApp) {
        // Here you would integrate with Telegram Payments
        window.Telegram.WebApp.openLink('https://example.com/buy/' + productTitle); 
    } else {
        alert(`Это демо-режим. Вы выбрали: ${productTitle}`);
    }
  };

  return (
    <div className="pb-20 bg-stone-50 min-h-full">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white p-8 pb-12 rounded-b-[2rem] relative overflow-hidden shadow-lg">
        <div className="relative z-10">
            <h2 className="font-serif text-3xl mb-2 flex items-center gap-3">
                <Sparkles size={28} className="text-terracotta-500" />
                Клуб Насти
            </h2>
            <p className="text-emerald-100 text-sm max-w-xs leading-relaxed">
                Оформи подписку, чтобы общаться с Настей без ограничений. 
                Вдохновение и рецепты — каждый день.
            </p>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-terracotta-500/20 rounded-full translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {/* Products List */}
      <div className="px-4 -mt-8 space-y-6">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 overflow-hidden border border-stone-100 transform transition-all hover:scale-[1.02]">
            <div className="h-40 overflow-hidden relative">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-serif text-2xl leading-none mb-1">{product.title}</h3>
                  <p className="text-stone-200 text-sm font-medium flex items-center gap-1">
                      {product.price}
                  </p>
              </div>

              {product.isPopular && (
                  <div className="absolute top-3 right-3 bg-terracotta-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Heart size={10} fill="currentColor" /> ПОПУЛЯРНО
                  </div>
              )}
            </div>
            
            <div className="p-5">
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>
              
              <button 
                onClick={() => handleBuy(product.title)}
                className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors"
              >
                <span>{product.isSubscription ? 'Оформить подписку' : 'Купить навсегда'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8 px-8 mb-8">
          <p className="text-xs text-stone-400">
              Платежи обрабатываются безопасно через Telegram. 
              <br/>Это демонстрационный интерфейс.
          </p>
      </div>
    </div>
  );
};

export default PremiumShop;