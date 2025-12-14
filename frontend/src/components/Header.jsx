import React from 'react';
import { Menu, Settings } from 'lucide-react';
import Logo from '../assets/Logo color - azul.png';
import LogoWhite from '../assets/Logo color - blanco.png';

const Header = ({ onMenuClick, onSettingsClick }) => {
  return (
    <header className="bg-gray-100 dark:bg-black border-b border-gray-300 dark:border-gray-800 px-4 py-2 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-lg text-blue-600 dark:text-[#FCD34D] transition-colors">
          <Menu size={28} strokeWidth={2.5} />
        </button>
        {/* logo modo claro */}
        <img src={Logo} alt="Logo UCB" className="h-12 w-auto object-contain dark:hidden" />
        {/* logo modo oscuro */}
        <img src={LogoWhite} alt="Logo UCB" className="h-12 w-auto object-contain hidden dark:block" />
      </div>
      
      <h1 className="text-xl font-bold text-black dark:text-white text-center flex-1 truncate px-4 hidden md:block font-merriweather transition-colors duration-300">
        Constitución Política del Estado - Versión Pedagógica
      </h1>

      <div className="flex items-center">
        <button onClick={onSettingsClick} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-lg text-blue-500 dark:text-[#FCD34D] transition-colors">
          <Settings size={28} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
};

export default Header;
