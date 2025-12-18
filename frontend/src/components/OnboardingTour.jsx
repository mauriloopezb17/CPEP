import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';

const OnboardingTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState(null);

  // Pasos del tour
  const steps = [
    {
      id: 'tour-index-button',
      title: 'El Índice',
      text: 'Explora el índice para navegar rápidamente por las partes y artículos de la Constitución.',
      position: 'bottom-right'
    },
    {
      id: 'tour-ai-button',
      title: 'IA Pedagógica',
      text: 'Consulta a nuestra IA para resolver dudas o resumir artículos complejos con simples oraciones.',
      position: 'top-left'
    },
    {
      id: 'tour-settings-button',
      title: 'Configuración',
      text: 'Personaliza tu experiencia: cambia el tamaño de letra o el tema visual a tu gusto.',
      position: 'bottom-left'
    },
    {
      id: 'tour-pdf-button',
      title: 'PDF Original',
      text: 'Descarga o visualiza la versión original en PDF de la Constitución Política del Estado cuando quieras.',
      position: 'bottom-left'
    }
  ];

  useEffect(() => {
    // Chequeo de primer ingreso o modo dev
    const hasSeenTour = localStorage.getItem('cpep-tour-seen');
    const isDevMode = new URLSearchParams(window.location.search).get('tour') === 'true';
    
    if (!hasSeenTour || isDevMode) {
      // Un pequeño delay para que cargue todo bien
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Actualiza la posición del highlight cuando cambia el paso
  useLayoutEffect(() => {
    if (isVisible && steps[currentStep]) {
      const updatePosition = () => {
        const element = document.getElementById(steps[currentStep].id);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isVisible, currentStep]);

  // Eleva el z-index del elemento actual para que no se vea borroso
  useEffect(() => {
    if (isVisible && steps[currentStep]) {
      const element = document.getElementById(steps[currentStep].id);
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const originalZIndex = element.style.zIndex;
        const originalPosition = element.style.position;
        const originalPointerEvents = element.style.pointerEvents;
        
        // Lo subimos por encima del overlay (z-100)
        element.style.zIndex = '110';
        // Desactivamos clicks para que no sea "buggy"
        element.style.pointerEvents = 'none';

        // Nos aseguramos que tenga posición para que el z-index funcione
        // Usamos computedStyle para no pisar fixed o absolute
        if (computedStyle.position === 'static') {
          element.style.position = 'relative';
        }

        // Si está en el header, tenemos que elevar el header también
        // porque crea su propio stacking context con z-50
        const header = element.closest('header');
        let originalHeaderZ = '';
        let originalHeaderPointer = '';
        if (header) {
          originalHeaderZ = header.style.zIndex;
          originalHeaderPointer = header.style.pointerEvents;
          header.style.zIndex = '110';
          // No bloqueamos el header entero porque el tooltip podría estar dentro (si cambiamos el DOM)
          // Pero como el tooltip está en un portal/root diferente, podemos bloquearlo
          header.style.pointerEvents = 'none';
        }

        // Si es el botón de IA, el padre (en App.jsx) tiene fixed y z-index bajo
        const aiContainer = element.closest('.fixed.bottom-20.right-8');
        let originalAiContainerZ = '';
        let originalAiContainerPointer = '';
        if (steps[currentStep].id === 'tour-ai-button' && aiContainer) {
           originalAiContainerZ = aiContainer.style.zIndex;
           originalAiContainerPointer = aiContainer.style.pointerEvents;
           aiContainer.style.zIndex = '110';
           aiContainer.style.pointerEvents = 'none';
        }

        return () => {
          element.style.zIndex = originalZIndex;
          element.style.position = originalPosition;
          element.style.pointerEvents = originalPointerEvents;
          if (header) {
            header.style.zIndex = originalHeaderZ;
            header.style.pointerEvents = originalHeaderPointer;
          }
          if (aiContainer) {
            aiContainer.style.zIndex = originalAiContainerZ;
            aiContainer.style.pointerEvents = originalAiContainerPointer;
          }
        };
      }
    }
  }, [isVisible, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('cpep-tour-seen', 'true');
  };

  if (!isVisible || !targetRect) return null;

  const step = steps[currentStep];

  // Cálculo de posición del tooltip
  const getTooltipStyle = () => {
    const gap = 20;
    if (step.position === 'bottom-right') {
      return {
        top: `${targetRect.bottom + gap}px`,
        left: `${targetRect.left}px`,
      };
    }
    if (step.position === 'top-left') {
      return {
        bottom: `${window.innerHeight - targetRect.top + gap}px`,
        right: `${window.innerWidth - targetRect.right}px`,
      };
    }
    if (step.position === 'bottom-left') {
      return {
        top: `${targetRect.bottom + gap}px`,
        right: `${window.innerWidth - targetRect.right}px`,
      };
    }
    return {
      top: `${targetRect.bottom + gap}px`,
      left: `${targetRect.left}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Fondo borroso con hueco */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto">
        <svg className="w-full h-full">
          <defs>
            <mask id="mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - 5}
                y={targetRect.top - 5}
                width={targetRect.width + 10}
                height={targetRect.height + 10}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="currentColor" mask="url(#mask)" className="text-black/40" />
        </svg>
      </div>

      {/* Tooltip y Flecha */}
      <div 
        className="absolute pointer-events-auto animate-in fade-in zoom-in duration-300 max-w-xs w-full"
        style={getTooltipStyle()}
      >
        {/* Flecha (CSS simple) */}
        <div className={`absolute w-4 h-4 bg-white dark:bg-[#1A1D21] rotate-45 transform 
          ${step.position.startsWith('bottom') ? '-top-2' : '-bottom-2'} 
          ${step.position.endsWith('right') ? 'left-6' : 'right-6'}`} 
        />

        <div className="bg-white dark:bg-[#1A1D21] p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-blue-600 dark:text-[#FCD34D] font-bold text-lg font-sans">
              {step.title}
            </h4>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-sans">
            {step.text}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-4 bg-blue-600 dark:bg-[#FCD34D]' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`} 
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 dark:bg-[#FCD34D] text-white dark:text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform font-sans"
            >
              {currentStep === steps.length - 1 ? '¡Listo!' : 'Siguiente'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
