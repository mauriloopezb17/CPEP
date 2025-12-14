import React, { useEffect, useRef } from 'react';
import ConstitutionCard from './ConstitutionCard';
import Escudo from '../assets/Escudo_de_Bolivia.svg.png';

const ConstitutionFeed = ({ data, scrollTarget, onArticleVisible, fontSize }) => {
  const itemRefs = useRef({});
  const landingRef = useRef(null);

  // maneja el scroll cuando navegas
  useEffect(() => {
    if (scrollTarget) {
      // usa el navid calculado o lo hace al vuelo
      const navId = scrollTarget.navId || (scrollTarget.art_num ? `art-${scrollTarget.art_num}` : null); // fallback basico
      // ojo: mejor si la data ya viene con navid pero bueno
      
      const element = itemRefs.current[navId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // scroll al principio si no hay target
      if (landingRef.current && !scrollTarget) {
        landingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollTarget]);

  // config del observer para el scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // busca el articulo de este elemento
      const navId = entry.target.getAttribute('data-nav-id');
            // busca en data generando id al vuelo, medio lento pero funca
            const article = data.find((a, index) => {
                let id;
                 if (a.tipo === 'introduccion') {
                    id = `intro-${index}`;
                  } else if (a.art_num === 398) {
                    id = `art-${a.art_num}-${index}`;
                  } else {
                     id = a.art_num ? `art-${a.art_num}` : `disp-${index}`;
                  }
                return id === navId;
            });

            if (article) {
                // mete el navid para el sidebar
                onArticleVisible({ ...article, navId }); 
            }
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: '-45% 0px -45% 0px', // se activa cuando esta al medio
        threshold: 0
      }
    );

    // ojea todos los elementos
    Object.values(itemRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data, onArticleVisible]);

  // agrupa para meter separadores
  const renderContent = () => {
    const content = [];
    let lastParte = '';
    let lastTitulo = '';
    let lastCapitulo = '';
    let lastSeccion = '';
    let lastDisposicionGroup = '';

    // mete el landing al principio
    content.push(
      <div 
        key="landing" 
        ref={landingRef}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center mb-16 scroll-mt-32"
      >
        <img 
          src={Escudo} 
          alt="Escudo de Bolivia" 
          className="w-64 h-auto mb-12 opacity-90 drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
        />
        <h1 className="text-5xl font-bold font-merriweather text-gray-900 dark:text-gray-50 mb-4 tracking-tight">
          Constitución Política del Estado
        </h1>
        <h2 className="text-3xl font-merriweather italic text-gray-600 dark:text-gray-300 font-light">
          Versión Pedagógica
        </h2>
        <div className="mt-12 animate-bounce text-gray-400 dark:text-gray-500">
            ↓ Desliza para leer
        </div>
      </div>
    );

    data.forEach((item, index) => {
      // genera navid consistente
      let navId;
      if (item.tipo === 'introduccion') {
        navId = `intro-${index}`;
      } else if (item.art_num === 398) {
        navId = `art-${item.art_num}-${index}`;
      } else {
         navId = item.art_num ? `art-${item.art_num}` : `disp-${index}`;
      }

      if (item.tipo === 'articulo') {
           // ... (separadores existentes code) ...
          // 1. separador parte
          if (item.parte_nom && item.parte_nom !== lastParte) {
            content.push(
              <div key={`part-${navId}`} className="w-full md:w-[900px] mx-auto mb-12 mt-24 text-center">
                 <div className="h-1 w-32 bg-blue-600 dark:bg-[#FCD34D] mx-auto mb-6 rounded-full"></div>
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest font-merriweather">
                   {item.parte_nom}
                 </h2>
              </div>
            );
            lastParte = item.parte_nom;
            lastTitulo = '';
            lastCapitulo = '';
            lastSeccion = '';
          }
    
          // 2. separador titulo
          if (item.titulo_nom && item.titulo_nom !== lastTitulo) {
            content.push(
              <div key={`title-${navId}`} className="w-full md:w-[900px] mx-auto mb-8 mt-16 text-center">
                 <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-4"></div>
                 <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 uppercase tracking-[0.15em] font-sans">
                   TÍTULO {item.titulo_num} <br/> {item.titulo_nom}
                 </h3>
                 <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mt-4"></div>
              </div>
            );
            lastTitulo = item.titulo_nom;
            lastCapitulo = '';
            lastSeccion = '';
          }
    
          // 3. separador capitulo
          if (item.capitulo_nom && item.capitulo_nom !== lastCapitulo) {
            content.push(
              <div key={`cap-${navId}`} className="w-full md:w-[900px] mx-auto mb-6 mt-12 pl-8 border-l-4 border-blue-500 dark:border-yellow-500">
                 <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide font-sans">
                   CAPÍTULO {item.capitulo_num} <br/> {item.capitulo_nom}
                 </h4>
              </div>
            );
            lastCapitulo = item.capitulo_nom;
            lastSeccion = '';
          }
    
          // 4. separador seccion
          if (item.seccion_nom && item.seccion_nom !== lastSeccion) {
            content.push(
              <div key={`sec-${navId}`} className="w-full md:w-[900px] mx-auto mb-4 mt-8 pl-10 border-l-2 border-blue-300 dark:border-yellow-700">
                 <h5 className="text-base font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide font-sans">
                   SECCIÓN {item.seccion_num} <br/> {item.seccion_nom}
                 </h5>
              </div>
            );
            lastSeccion = item.seccion_nom;
          }

      } else if (item.tipo === 'disposición') {
          // separador para disposiciones
          if (item.disposicion && item.disposicion !== lastDisposicionGroup) {
             content.push(
              <div key={`disp-group-${navId}`} className="w-full md:w-[900px] mx-auto mb-12 mt-24 text-center">
                 <div className="h-1 w-32 bg-blue-600 dark:bg-[#FCD34D] mx-auto mb-6 rounded-full"></div>
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest font-merriweather">
                   {item.disposicion === 'Transitorias' ? 'DISPOSICIONES TRANSITORIAS' : `DISPOSICIÓN ${item.disposicion.toUpperCase()}`}
                 </h2>
              </div>
            );
            lastDisposicionGroup = item.disposicion;
          }
      }

      // renderiza tarjeta (comun para ambos)
      content.push(
        <div key={navId} data-nav-id={navId} ref={(el) => (itemRefs.current[navId] = el)}>
          <ConstitutionCard 
            article={item}
            fontSize={fontSize}
          />
        </div>
      );
    });

    return content;
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32">
       {renderContent()}
    </div>
  );
};

export default ConstitutionFeed;
