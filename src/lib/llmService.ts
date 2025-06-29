interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface LLMProvider {
  name: string;
  generateResponse(prompt: string, conversationHistory: Message[]): Promise<string>;
}

class OpenAIProvider implements LLMProvider {
  name = 'OpenAI GPT';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    const messages = [
      { 
        role: 'system', 
        content: 'You are DASSH, a helpful AI assistant. Provide clear, comprehensive, and engaging responses. Be conversational but informative.' 
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

class GeminiProvider implements LLMProvider {
  name = 'Google Gemini';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    // Build conversation context for Gemini
    let contextPrompt = 'You are DASSH, a helpful AI assistant. Provide clear, comprehensive, and engaging responses. Be conversational but informative.\n\n';
    
    if (conversationHistory.length > 0) {
      contextPrompt += 'Previous conversation context:\n';
      conversationHistory.slice(-8).forEach(msg => {
        contextPrompt += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }
    
    contextPrompt += `Human: ${prompt}\nAssistant:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
          stopSequences: ['Human:', 'User:']
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    const candidate = data.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
      throw new Error('Response blocked by safety filters');
    }

    return candidate.content.parts[0].text;
  }
}

class LLMService {
  private providers: LLMProvider[] = [];
  private currentProviderIndex = 0;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const preferredProvider = import.meta.env.VITE_LLM_PROVIDER || 'auto';

    // Initialize available providers
    if (geminiKey) {
      this.providers.push(new GeminiProvider(geminiKey));
    }
    
    if (openaiKey) {
      this.providers.push(new OpenAIProvider(openaiKey));
    }

    // Set preferred provider if specified
    if (preferredProvider !== 'auto') {
      const preferredIndex = this.providers.findIndex(p => 
        p.name.toLowerCase().includes(preferredProvider.toLowerCase())
      );
      if (preferredIndex !== -1) {
        this.currentProviderIndex = preferredIndex;
      }
    }

    if (this.providers.length === 0) {
      console.warn('No LLM providers configured. Using fallback responses.');
    }
  }

  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    if (this.providers.length === 0) {
      return this.getFallbackResponse(prompt);
    }

    // Try each provider in order until one succeeds
    for (let attempt = 0; attempt < this.providers.length; attempt++) {
      const provider = this.providers[this.currentProviderIndex];
      
      try {
        console.log(`Generating response using ${provider.name}...`);
        const response = await provider.generateResponse(prompt, conversationHistory);
        
        // Success! Return the response
        return response;
        
      } catch (error) {
        console.error(`Error with ${provider.name}:`, error);
        
        // Try next provider
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
        
        // If this was the last provider, throw the error
        if (attempt === this.providers.length - 1) {
          throw new Error(`All LLM providers failed. Last error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Fallback if all providers fail
    return this.getFallbackResponse(prompt);
  }

  private getFallbackResponse(prompt: string): string {
    const fallbackResponses = [
      "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment.",
      
      "I'm currently unable to process your request due to a temporary service issue. Please try again shortly.",
      
      "There seems to be a connectivity issue with my AI services. Your message is important to me, so please try again in a few moments.",
      
      "I'm experiencing some technical challenges at the moment. Please bear with me and try your request again.",
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return `${randomResponse}\n\nYour message: "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"`;
  }

  // Get current provider info for debugging
  getCurrentProvider(): string {
    if (this.providers.length === 0) return 'No providers available';
    return this.providers[this.currentProviderIndex].name;
  }

  // Get all available providers
  getAvailableProviders(): string[] {
    return this.providers.map(p => p.name);
  }
}

// Export singleton instance
export const llmService = new LLMService();

// Export for debugging
export const debugLLM = {
  getCurrentProvider: () => llmService.getCurrentProvider(),
  getAvailableProviders: () => llmService.getAvailableProviders(),
};