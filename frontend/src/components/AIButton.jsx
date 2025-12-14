import React from 'react';
import { Sparkles } from 'lucide-react';

const AIButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="fixed bottom-20 right-8 bg-white dark:bg-[#1A1D21] rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 z-50 flex items-center justify-center border border-gray-100 dark:border-gray-800 group">
      <Sparkles className="w-8 h-8 text-blue-600 dark:text-[#FCD34D] group-hover:scale-110 transition-transform duration-200" strokeWidth={2} />
    </button>
  );
};

export default AIButton;
