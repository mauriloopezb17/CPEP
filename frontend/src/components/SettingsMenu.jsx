import React from 'react';
import { Moon, Sun, Type, Eye } from 'lucide-react';

const SettingsMenu = ({ isOpen, onClose, fontSize, setFontSize, theme, setTheme }) => {
  if (!isOpen) return null;

  const fontSizes = [
    { label: 'A-', value: 'small' },
    { label: 'A', value: 'medium' },
    { label: 'A+', value: 'large' },
  ];
  return (
    <>
      {/* fondo invisible pa cerrar si clickeas fuera */}
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose}
      />

      {/* panel config fixed */}
      <div 
        className="fixed top-16 right-4 w-72 bg-white dark:bg-[#1A1D21] rounded-2xl shadow-2xl z-[60] p-4 border border-gray-100 dark:border-gray-800 font-sans animate-in fade-in zoom-in-95 duration-200 transition-colors"
      >
        <h3 className="text-gray-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Configuración</h3>
        
        {/* control tamano letra */}
        <div className="mb-6">
          <label className="text-xs text-gray-500 font-medium mb-2 block flex items-center gap-2">
            <Type size={14} />
            Tamaño de texto
          </label>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg transition-colors">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setFontSize(size.value)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  fontSize === size.value 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-[#FCD34D] shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* control tema */}
        <div>
          <label className="text-xs text-gray-500 font-medium mb-2 block flex items-center gap-2">
            {theme === 'light' ? <Sun size={14} /> : (theme === 'dark' ? <Moon size={14} /> : <Eye size={14} />)}
            Tema
          </label>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg transition-colors gap-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex justify-center items-center gap-1 ${
                theme === 'light' 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Sun size={14} />
              Claro
            </button>
            <button
              onClick={() => setTheme('eye-care')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex justify-center items-center gap-1 ${
                theme === 'eye-care' 
                  ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Eye size={14} />
              Eye-Care
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex justify-center items-center gap-1 ${
                theme === 'dark' 
                  ? 'bg-white dark:bg-gray-700 text-yellow-600 dark:text-[#FCD34D] shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Moon size={14} />
              Oscuro
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsMenu;
