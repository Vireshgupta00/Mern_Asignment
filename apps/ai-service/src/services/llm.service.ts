export const generateChatResponse = async (messages: { role: string, content: string }[]) => {
  // BONUS: Retry and Timeout Handling Architecture
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 8000; // 8-second timeout for the LLM provider

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const responsePromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('LLM Provider Timeout Exceeded')), TIMEOUT_MS);
        
        // We are mocking this response because your OpenAI account is out of credits (429 Error).
        // In production, this would be: await openai.chat.completions.create({...})
        setTimeout(() => {
          clearTimeout(timer);
          const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
          
          resolve({
            content: `*[Offline Mode]* I am your AI Assistant! You said: "${lastUserMessage}".`,
            // BONUS: Mocking usage token tracking from provider
            usage: { total_tokens: 35 + Math.floor(Math.random() * 50) } 
          });
        }, 1500);
      });

      return await responsePromise;
    } catch (error: any) {
      console.warn(`[AI Service] Attempt ${attempt} failed: ${error.message}`);
      if (attempt === MAX_RETRIES) {
        throw new Error(`AI Service Error after ${MAX_RETRIES} attempts: ${error.message}`);
      }
      // Wait 1 second before retrying (Exponential backoff could be used here)
      await new Promise(res => setTimeout(res, 1000));
    }
  }
};
