import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import MenuPlanner from './components/MenuPlanner';
import DailyInspiration from './components/DailyInspiration';
import PremiumShop from './components/PremiumShop';
import Hero from './components/Hero';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  useEffect(() => {
      const handleOpenShop = () => setCurrentView(ViewState.SHOP);
      window.addEventListener('OPEN_SHOP', handleOpenShop);
      return () => window.removeEventListener('OPEN_SHOP', handleOpenShop);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Hero onStart={() => setCurrentView(ViewState.CHAT)} />;
      case ViewState.CHAT:
        return <ChatInterface />;
      case ViewState.MENU:
        return <MenuPlanner />;
      case ViewState.INSPIRATION:
        return <DailyInspiration />;
      case ViewState.SHOP:
        return <PremiumShop />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;