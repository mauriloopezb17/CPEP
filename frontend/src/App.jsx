import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ConstitutionCard from './components/ConstitutionCard';
import AIButton from './components/AIButton';
import Sidebar from './components/Sidebar';
import SettingsMenu from './components/SettingsMenu';
import AIPanel from './components/AIPanel';
import cpeData from './assets/cpe.json';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('light');
  
  // estado inicial sin seleccion pantalla de bienvenida
  const [selectedArticle, setSelectedArticle] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleAIPanel = () => setIsAIPanelOpen(!isAIPanelOpen);

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    // la barra lateral se queda abierta al seleccionar como se pidio
  };

  // logica de modo oscuro implementacion basica aplicada al contenedor principalmente
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // fondo dinamico basado en el tema
  const bgClass = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#E5ECF5]';

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${bgClass} overflow-hidden`}>
      <Header onMenuClick={toggleSidebar} onSettingsClick={toggleSettings} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        data={cpeData}
        onSelectArticle={handleArticleSelect}
        selectedArticle={selectedArticle}
      />

      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        theme={theme}
        setTheme={setTheme}
      />

      <AIPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />

      {/* contenedor principal */}
      <div 
        className="flex-grow flex items-center justify-center p-4 relative"
      >
        <ConstitutionCard article={selectedArticle} fontSize={fontSize} />
        
        {/* ocultar boton de ia cuando el panel esta abierto para evitar solapamiento */}
        <div className={`transition-opacity duration-300 ${isAIPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <AIButton onClick={toggleAIPanel} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
