import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import AiService from '../services/AiService';
import CircularQueue from '../utils/CircularQueue';

const AIPanel = ({ isOpen, onClose }) => {
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
      const answer = await AiService.askAi(currentQuestion, history);

      const aiMessage = {
        id: Date.now() + 1,
        text: answer,
        sender: 'ai',
      };

      setMessages(prev => [...prev, aiMessage]);
      
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
    } finally {
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
      {/* header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1D21]">
        <h3 className="text-gray-700 dark:text-gray-200 font-semibold font-sans">Preguntale a la IA...</h3>
        <button 
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* chat */}
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
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
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

      {/* input */}
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
