import Escudo from '../assets/Escudo_de_Bolivia.svg.png';

import React, { forwardRef } from 'react';

const ConstitutionCard = forwardRef(({ article, fontSize = 'medium' }, ref) => {
  // tamaños de letra
  const textSizeClasses = {
    small: {
      content: 'text-base',
      title: 'text-2xl'
    },
    medium: {
      content: 'text-lg',
      title: 'text-3xl'
    },
    large: {
      content: 'text-xl',
      title: 'text-4xl'
    }
  };

  const currentSize = textSizeClasses[fontSize];

  /* logica segun contenido */
  const isDisposicion = article.tipo === 'disposición';
  const isIntro = article.tipo === 'introduccion';

  /* etiquetas arriba */
  let topLabel = '';
  let subLabel = '';

  if (isIntro) {
    topLabel = 'Introducción';
    subLabel = '';
  } else if (isDisposicion) {
    topLabel = article.disposicion || 'Disposición';
    subLabel = article.parte || '';
  } else {
    topLabel = article.parte_nom;
    subLabel = article.titulo_nom || '';
  }

  /* titulo principal */
  let mainTitlePrefix = '';
  let mainTitleNumber = '';

  if (isIntro) {
    mainTitlePrefix = article.titulo;
    mainTitleNumber = '';
  } else if (isDisposicion) {
    mainTitlePrefix = article.disposicion === 'Transitorias' ? 'Disposición Transitoria' : 'Disposición';
    mainTitleNumber = article.parte || '';
  } else {
    mainTitlePrefix = 'Artículo';
    mainTitleNumber = `${article.art_num}°`;
  }

  // usa subtitulo si es intro
  const displayTitle = isIntro ? article.subtitulo : article.nombre_juridico;

  return (
    <div ref={ref} className="bg-white dark:bg-[#1A1D21] rounded-3xl shadow-xl w-full max-w-[900px] min-h-[500px] p-6 md:p-16 relative flex flex-col justify-between mx-auto transform transition-all duration-300 overflow-hidden border border-transparent dark:border-gray-800 mb-12 scroll-mt-32">
       {/* etiqueta arriba */}
      <div className="text-right">
        <p className="text-gray-500 dark:text-gray-400 text-sm italic mb-1 font-merriweather">
          {topLabel}
        </p>
        <h3 className="text-black dark:text-white font-bold text-base uppercase tracking-wide font-merriweather whitespace-pre-line">
          {subLabel}
        </h3>
      </div>

      <div className="flex flex-col flex-grow mt-8 pr-4">
        <div className="my-auto">
          <h2 className="text-gray-700 dark:text-gray-300 text-2xl font-normal mb-3 font-merriweather">
            {mainTitlePrefix} {mainTitleNumber}
          </h2>
          {displayTitle && (
            <h1 className={`text-black dark:text-white font-bold mb-10 font-merriweather leading-tight transition-all duration-300 ${currentSize.title}`}>
              {displayTitle}
            </h1>
          )}
          
          <p className={`text-gray-800 dark:text-gray-300 leading-relaxed italic font-merriweather font-light transition-all duration-300 text-justify whitespace-pre-line ${currentSize.content}`}>
            “{article.contenido}”
          </p>
        </div>
      </div>
    </div>
  );
});

ConstitutionCard.displayName = 'ConstitutionCard';

export default ConstitutionCard;
