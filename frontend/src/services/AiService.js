/**
 * Service for interacting with the backend RAG API.
 */
const AiService = {
  /**
   * Sends a question to the RAG API.
   * @param {string} question - The user's question.
   * @param {Array} contextHistory - Array of previous { question, answer } objects.
   * @returns {Promise<string>} The API response answer.
   */
  async askAi(question, contextHistory = []) {
    try {
      // Format the context history into a string the LLM can understand, or send as array if backend supports it.
      // Based on request "we will add all the quesitons and answers contained inside in the order they were asked to the question we will send to the rag"
      // I will construct a prompt preamble or payload that includes this context.
      
      // Since the backend snippet showed:
      // { "question": "..." }
      // I will assume for now I should append the context to the question or send it as part of the payload.
      // The user said: "we will add all the quesitons and answers contained inside ... to the question we will send to the rag"
      // So I will prepend the history to the question string.
      
      let historyText = "";
      if (contextHistory.length > 0) {
        historyText = contextHistory.map(item => `Human: ${item.question}\nAI: ${item.answer}`).join('\n\n');
      }

      const payload = {
        question: question,
        chat_history: historyText || null
      };

      const response = await fetch('http://localhost:3000/api/rag/ask', {
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
      return data.answer; 
    } catch (error) {
      console.error('Error asking AI:', error);
      throw error;
    }
  }
};

export default AiService;
