import React from 'react';
import { Menu, Settings, FileText } from 'lucide-react';
import Logo from '../assets/Logo color - azul.png';
import LogoWhite from '../assets/Logo color - blanco.png';
import Escudo from '../assets/escudo.png';
import PdfFile from '../assets/Libro Constitución CC.pdf';

const Header = ({ onMenuClick, onSettingsClick }) => {
  return (
    <header className="bg-gray-100 dark:bg-black border-b border-gray-300 dark:border-gray-800 px-4 py-2 flex items-center justify-between fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button id="tour-index-button" onClick={onMenuClick} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-lg text-blue-600 dark:text-[#FCD34D] transition-colors">
          <Menu size={28} strokeWidth={2.5} />
        </button>
        {/* logo cel */}
        <img src={Escudo} alt="Escudo Bolivia" className="h-12 w-auto object-contain md:hidden" />
        {/* logo claro pc */}
        <img src={Logo} alt="Logo UCB" className="h-12 w-auto object-contain hidden md:block dark:hidden" />
        {/* logo oscuro pc */}
        <img src={LogoWhite} alt="Logo UCB" className="h-12 w-auto object-contain hidden dark:md:block" />
      </div>
      
      <div className="flex-1 px-2 flex flex-col items-center justify-center transition-colors duration-300 text-center">
        <h1 className="text-xs md:text-lg font-bold text-black dark:text-white font-merriweather leading-tight">
          Constitución Política del Estado
        </h1>
        <h2 className="text-[10px] md:text-xs italic font-light text-gray-600 dark:text-gray-400 font-merriweather leading-tight">
          Versión Pedagógica
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button 
          id="tour-pdf-button"
          onClick={() => window.open(PdfFile, '_blank')} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-lg text-blue-500 dark:text-[#FCD34D] transition-colors"
          title="Ver PDF Original"
        >
          <FileText size={28} strokeWidth={2.5} />
        </button>
        <button id="tour-settings-button" onClick={onSettingsClick} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-lg text-blue-500 dark:text-[#FCD34D] transition-colors">
          <Settings size={28} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
};

export default Header;
