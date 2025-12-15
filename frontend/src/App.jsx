import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ConstitutionFeed from './components/ConstitutionFeed';
import AIButton from './components/AIButton';
import Sidebar from './components/Sidebar';
import SettingsMenu from './components/SettingsMenu';
import AIPanel from './components/AIPanel';
import cpeData from './assets/cpe.json';
import './App.css';

function App() {
  // detecta si es cel al inicio
  //const isMobileInitial = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');
  
  // para la navegacion
  const [highlightedArticle, setHighlightedArticle] = useState(null); // el q esta activo en el sidebar
  const [scrollTargetArticle, setScrollTargetArticle] = useState(null); // a donde scrollear

  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

  const toggleSidebar = () => {
    if (isMobile() && !isSidebarOpen) {
       setIsAIPanelOpen(false);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSettings = () => {
    if (isMobile() && !isSettingsOpen) {
      setIsSidebarOpen(false);
      setIsAIPanelOpen(false);
    }
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  const toggleAIPanel = () => {
    if (isMobile() && !isAIPanelOpen) {
      setIsSidebarOpen(false);
      setIsSettingsOpen(false);
    }
    setIsAIPanelOpen(!isAIPanelOpen);
  };

  // cuando le das al sidebar
  const handleSidebarSelect = (article) => {
    setHighlightedArticle(article);
    setScrollTargetArticle(article);
  };

  // cuando el scroll spy pilla articulo nuevo
  const handleArticleVisible = (article) => {
    // solo el highlight, sin forzar scroll
    setHighlightedArticle(article);
  };

  // modo oscuro y eye care
  useEffect(() => {
    // limpia clases viejas
    document.body.classList.remove('dark', 'eye-care');

    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else if (theme === 'eye-care') {
      document.body.classList.add('eye-care');
    }
  }, [theme]);

  // fondo segun el tema
  const bgClass = {
    dark: 'bg-[#0a0a0a]',
    light: 'bg-[#E5ECF5]',
    'eye-care': 'bg-[#F0EAD6]' // Eggshell / Parchment color
  }[theme] || 'bg-[#E5ECF5]';

  return (
    <div className={`flex flex-col h-[100dvh] transition-colors duration-300 ${bgClass} overflow-hidden`}>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          (isSidebarOpen || isAIPanelOpen || isSettingsOpen) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setIsSidebarOpen(false);
          setIsAIPanelOpen(false);
          setIsSettingsOpen(false);
        }}
      />

      <Header onMenuClick={toggleSidebar} onSettingsClick={toggleSettings} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        data={cpeData}
        onSelectArticle={handleSidebarSelect}
        selectedArticle={highlightedArticle}
      />

      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        theme={theme}
        setTheme={setTheme}
      />

      <AIPanel 
        isOpen={isAIPanelOpen} 
        onClose={() => setIsAIPanelOpen(false)} 
        data={cpeData}
        onNavigateToArticle={handleSidebarSelect}
      />

      {/* contenedor principal con su propio scroll */}
      <div className="flex-grow flex justify-center overflow-hidden relative pt-16">
        <div 
          className="w-full max-w-5xl h-full overflow-y-auto custom-scrollbar p-4 scroll-smooth"
        >
          <ConstitutionFeed 
            data={cpeData} 
            scrollTarget={scrollTargetArticle}
            onArticleVisible={handleArticleVisible}
            fontSize={fontSize} 
          />
        </div>
        
        {/* esconde el boton ia si el panel esta abierto para q no estorbe */}
        <div className={`fixed bottom-20 right-8 transition-opacity duration-300 ${isAIPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <AIButton onClick={toggleAIPanel} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
