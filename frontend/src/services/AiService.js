
const AiService = {
  /**
   * @param {string} pregunta
   * @param {Array} historial o contexto
   * @returns {Promise<string>} respuesta de la api
   */
  async askAi(question, contextHistory = []) {
    try {
      
      let historyText = "";
      if (contextHistory.length > 0) {
        historyText = contextHistory.map(item => `Human: ${item.question}\nAI: ${item.answer}`).join('\n\n');
      }

      const payload = {
        question: question,
        chat_history: historyText || null
      };

      const response = await fetch('http://100.113.154.56:3000/api/rag/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return { 
        answer: data.answer,
        sources: data.context || []
      }; 
    } catch (error) {
      console.error('Error asking AI:', error);
      throw error;
    }
  }
};

export default AiService;
