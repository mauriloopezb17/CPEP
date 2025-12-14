import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, BookOpen } from 'lucide-react';
import AiService from '../services/AiService';
import CircularQueue from '../utils/CircularQueue';


const formatMessage = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[\s\S]*?\*\*|\\\\[\s\S]*?\\\\)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('\\\\') && part.endsWith('\\\\') && part.length >= 4) {
      return <span key={index} className="italic">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};

const AIPanel = ({ isOpen, onClose, data, onNavigateToArticle }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Mantener la cola de contexto entre renders
  const contextQueue = useRef(new CircularQueue(5));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const findArticleByDocId = (docId) => {
    if (!data) return null;
    
    // Logica de mapeo basada en el backend
    // if i < 2: doc_id = f"introduccion_{i + 1}"
    if (docId.startsWith('introduccion_')) {
      const num = parseInt(docId.replace('introduccion_', ''));
      const introItems = data.filter(item => item.tipo === 'introduccion');
      return { item: introItems[num - 1], label: `Introducción ${num}` };
    }
    
    // elif i == 399: doc_id = "articulo_398_A"
    if (docId === 'articulo_398_A') {
      const art398 = data.filter(item => item.art_num === 398);
      return { item: art398[0], label: 'Artículo 398 (A)' };
    }
    
    // elif i == 400: doc_id = "articulo_398_B"
    if (docId === 'articulo_398_B') {
      const art398 = data.filter(item => item.art_num === 398);
      return { item: art398[1] || art398[0], label: 'Artículo 398 (B)' };
    }

    // ASUMIMOS que el ID refleja el NUMERO DE ARTICULO real, salvo excepciones.
    if (docId.startsWith('articulo_')) {
      const numStr = docId.replace('articulo_', '');
      const num = parseInt(numStr);
       // Buscar por art_num
      const article = data.find(item => item.tipo === 'articulo' && item.art_num === num);
      if (article) return { item: article, label: `Artículo ${article.art_num}` };
    }
    
    // else: doc_id = f"disposicion_{cont_disposiciones}"
    if (docId.startsWith('disposicion_')) {
      const num = parseInt(docId.replace('disposicion_', ''));
      const dispositions = data.filter(item => item.tipo === 'disposición');
      // Probablemente sea el n-esimo item de disposiciones
      const disp = dispositions[num - 1];
      if (disp) return { item: disp, label: `Disposición ${num}` };
    }

    return null;
  };

  const handleSourceClick = (source) => {
    const found = findArticleByDocId(source.doc_id || source.id); // x si acaso
    if (found && found.item) {
      onNavigateToArticle(found.item);
      // opcional: onFocus o resaltado
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const currentQuestion = inputValue.trim();
    const userMessage = {
      id: Date.now(),
      text: currentQuestion,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Obtener historial de contexto actual
      const history = contextQueue.current.getItems();
      
      // Llamar a la API
      const { answer, sources } = typeof response === 'object' ? response : { answer: response, sources: [] };

      // Detectar errores del backend basados en el texto
      const lowerAnswer = answer.toLowerCase();
      const isBackendError = 
        lowerAnswer.includes("sistema sobrecargado") ||
        lowerAnswer.includes("bloqueada por los filtros") ||
        lowerAnswer.includes("error interno al conectar");

      const aiMessageId = Date.now() + 1;
      const aiMessage = {
        id: aiMessageId,
        text: '',
        sender: 'ai',
        sources: sources,
        isError: isBackendError
      };

      // Agregar mensaje vacio y quitar loading para empezar efecto de escritura
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);

      let currentText = '';
      for (let i = 0; i < answer.length; i++) {
        currentText += answer[i];
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: currentText } : msg
        ));
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      // Actualizar el contexto con la nueva interacción
      contextQueue.current.enqueue({
        question: currentQuestion,
        answer: answer
      });

      console.log("Contexto Actual:", contextQueue.current.getItems());

    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Lo siento, hubo un problema al conectar con el asistente. Por favor intenta de nuevo.",
        sender: 'ai',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    } finally {
      // Asegurarse de q isLoading este false (aunque ya lo seteamos antes en exito)
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className={`
        fixed top-20 right-4 bottom-16 w-[400px] bg-gray-100 dark:bg-[#1A1D21] border border-gray-200 dark:border-gray-800 shadow-2xl z-50 rounded-2xl
        flex flex-col transition-transform duration-300 ease-in-out overflow-hidden font-sans
        ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}
      `}
    >
      {/* cabecera */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1D21]">
        <h3 className="text-gray-700 dark:text-gray-200 font-semibold font-sans">Preguntale a la IA...</h3>
        <button 
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* los msjs */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Sparkles size={48} className="text-blue-400 dark:text-[#FCD34D] mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px]">
              Haz una pregunta sobre la Constitución y obtén una respuesta al instante con contexto inteligente.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="mt-1 mr-2 flex-shrink-0">
                    <Sparkles size={16} className="text-blue-500 dark:text-[#FCD34D]" />
                  </div>
                )}
                <div 
                  className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                    ${msg.sender === 'user' 
                      ? 'bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 rounded-tr-none' 
                      : msg.isError 
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800'
                        : 'text-gray-800 dark:text-gray-300'
                    }
                  `}
                >
                  {formatMessage(msg.text)}
                  
                  {/* las fuentes */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Fuentes consultadas:</p>
                      <div className="flex flex-col gap-2">
                        {msg.sources.map((source, idx) => {
                           // ver q nombre ponerle
                           // el backend manda 'id', antes era 'doc_id', y 'source' capaz llega como string
                           const docId = source.id || source.doc_id || source;  
                           const resolved = findArticleByDocId(docId);
                           
                           if (!resolved) return null;

                           return (
                             <button
                               key={idx}
                               onClick={() => handleSourceClick({ doc_id: docId })}
                               className="flex items-center gap-2 p-2 w-full text-left bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800"
                             >
                               <BookOpen size={14} className="flex-shrink-0" />
                               <span className="truncate font-medium">{resolved.label}</span>
                             </button>
                           );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* cargando */}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="mt-1 mr-2 flex-shrink-0">
                    <Sparkles size={16} className="text-blue-500 dark:text-[#FCD34D]" />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                    <span className="text-xs text-gray-400">Pensando...</span>
                  </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* pa escribir */}
      <div className="p-4 bg-white dark:bg-[#1A1D21] border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu pregunta aquí..."}
            disabled={isLoading}
            className="w-full p-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#FCD34D]/50 text-sm text-gray-800 dark:text-gray-200 h-24 custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 dark:bg-[#FCD34D] hover:bg-blue-700 dark:hover:bg-yellow-400 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isLoading ? 'Enviando...' : 'Enviar'} <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
