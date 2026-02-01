import React from 'react';
import { ViewState } from '../types';
import { MessageCircle, BookOpen, Sparkles, ShoppingBag } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="h-screen flex flex-col bg-stone-50 font-sans text-stone-900 overflow-hidden">
      {/* Mobile App Header */}
      <header className="flex-none bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-3 flex items-center justify-between z-20">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView(ViewState.HOME)}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200">
             <img src="https://picsum.photos/100/100?grayscale" alt="Nastya" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif text-lg font-bold text-emerald-900">Настя</span>
        </div>
        
        <button 
          onClick={() => setView(ViewState.SHOP)}
          className={`p-2 rounded-full transition-colors ${currentView === ViewState.SHOP ? 'bg-terracotta-50 text-terracotta-600' : 'text-stone-400 hover:bg-stone-50'}`}
        >
           <ShoppingBag size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative overflow-hidden bg-stone-50"> 
        <div className="h-full w-full overflow-y-auto max-w-2xl mx-auto bg-white md:shadow-xl md:border-x md:border-stone-100">
             {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="flex-none bg-white border-t border-stone-100 px-6 py-2 pb-safe flex justify-between items-center z-50">
          <MobileNavButton 
            active={currentView === ViewState.CHAT} 
            onClick={() => setView(ViewState.CHAT)}
            icon={<MessageCircle size={22} />}
            label="Чат"
          />
          <MobileNavButton 
            active={currentView === ViewState.MENU} 
            onClick={() => setView(ViewState.MENU)}
            icon={<BookOpen size={22} />}
            label="План"
          />
          <MobileNavButton 
            active={currentView === ViewState.INSPIRATION} 
            onClick={() => setView(ViewState.INSPIRATION)}
            icon={<Sparkles size={22} />}
            label="Идея"
          />
           <MobileNavButton 
            active={currentView === ViewState.SHOP} 
            onClick={() => setView(ViewState.SHOP)}
            icon={<ShoppingBag size={22} />}
            label="Магазин"
          />
      </div>
    </div>
  );
};

const MobileNavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-16 py-1 rounded-lg transition-colors ${
      active ? 'text-emerald-900' : 'text-stone-400 hover:text-stone-600'
    }`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
    </div>
    <span className={`text-[10px] font-medium tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export default Layout;