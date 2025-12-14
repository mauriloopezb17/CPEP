import React from 'react';
import { Moon, Sun, Type } from 'lucide-react';

const SettingsMenu = ({ isOpen, onClose, fontSize, setFontSize, theme, setTheme }) => {
  if (!isOpen) return null;

  const fontSizes = [
    { label: 'A-', value: 'small' },
    { label: 'A', value: 'medium' },
    { label: 'A+', value: 'large' },
  ];
  return (
    <>
      {/* telon de fondo invisible para cerrar al hacer clic fuera */}
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose}
      />

      {/* panel de configuracion posicionado con fixed para simplicidad */}
      <div 
        className="fixed top-16 right-4 w-64 bg-white dark:bg-[#1A1D21] rounded-2xl shadow-2xl z-50 p-4 border border-gray-100 dark:border-gray-800 font-sans animate-in fade-in zoom-in-95 duration-200 transition-colors"
      >
        <h3 className="text-gray-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Configuración</h3>
        
        {/* control de tamano de fuente */}
        <div className="mb-6">
          <label className="text-xs text-gray-500 font-medium mb-2 block flex items-center gap-2">
            <Type size={14} />
            Tamaño de texto
          </label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setFontSize(size.value)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                  fontSize === size.value 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* control de tema */}
        <div>
          <label className="text-xs text-gray-500 font-medium mb-2 block flex items-center gap-2">
            {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
            Tema
          </label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex justify-center items-center gap-2 ${
                theme === 'light' 
                  ? 'bg-white text-yellow-500 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sun size={16} />
              Claro
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex justify-center items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-purple-400 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Moon size={16} />
              Oscuro
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsMenu;
