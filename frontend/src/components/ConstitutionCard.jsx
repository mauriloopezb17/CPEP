import Escudo from '../assets/Escudo_de_Bolivia.svg.png';

const ConstitutionCard = ({ article, fontSize = 'medium' }) => {
  // mapeo de tamanos de fuente
  const textSizeClasses = {
    small: {
      content: 'text-xl',
      title: 'text-3xl'
    },
    medium: {
      content: 'text-2xl',
      title: 'text-4xl'
    },
    large: {
      content: 'text-3xl',
      title: 'text-5xl'
    }
  };

  const currentSize = textSizeClasses[fontSize];

  if (!article) {
    return (
      <div className="bg-white dark:bg-[#1A1D21] rounded-3xl shadow-xl w-[900px] h-[650px] p-16 flex flex-col items-center justify-center mx-auto transition-colors duration-300 border border-transparent dark:border-gray-800 text-center">
        <img 
          src={Escudo} 
          alt="Escudo de Bolivia" 
          className="w-48 h-auto mb-8 opacity-90 drop-shadow-lg"
        />
        <h1 className="text-3xl font-bold font-merriweather text-gray-800 dark:text-gray-100 mb-2">
          Constitución Política del Estado
        </h1>
        <h2 className="text-xl font-merriweather italic text-gray-500 dark:text-gray-400">
          Versión Pedagógica
        </h2>
        <h2 className="text-m font-merriweather italic text-gray-500 dark:text-gray-400">
          (Seleccione un artículo del indíce para empezar)
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1A1D21] rounded-3xl shadow-xl w-[900px] h-[650px] p-16 relative flex flex-col justify-between mx-auto transform hover:scale-[1.01] transition-all duration-300 overflow-hidden border border-transparent dark:border-gray-800">
       {/* etiqueta superior */}
      <div className="text-right">
        <p className="text-gray-500 dark:text-gray-400 text-sm italic mb-1 font-merriweather">
          {article.parte_nom}
        </p>
        <h3 className="text-black dark:text-white font-bold text-base uppercase tracking-wide font-merriweather">
          {article.titulo_nom}
        </h3>
      </div>

      <div className="flex flex-col flex-grow mt-8 overflow-y-auto custom-scrollbar pr-4">
        <div className="my-auto">
          <h2 className="text-gray-700 dark:text-gray-300 text-2xl font-normal mb-3 font-merriweather">
            Artículo {article.art_num}°
          </h2>
          <h1 className={`text-black dark:text-white font-bold mb-10 font-merriweather leading-tight transition-all duration-300 ${currentSize.title}`}>
            {article.nombre_juridico}
          </h1>
          
          <p className={`text-gray-800 dark:text-gray-300 leading-relaxed italic font-merriweather font-light transition-all duration-300 text-justify ${currentSize.content}`}>
            “{article.contenido}”
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionCard;
