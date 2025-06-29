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
  name = 'OpenAI GPT-3.5';
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
      ...conversationHistory.slice(-8).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    console.log('🤖 OpenAI: Sending request with', messages.length, 'messages');

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
      const errorText = await response.text();
      console.error('OpenAI API Error:', response.status, errorText);
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI: Response received');
    return data.choices[0].message.content;
  }
}

class GeminiProvider implements LLMProvider {
  name = 'Google Gemini 1.5 Flash';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    // Build conversation context for Gemini
    let contextPrompt = 'You are DASSH, a helpful AI assistant. Provide clear, comprehensive, and engaging responses. Be conversational but informative.\n\n';
    
    if (conversationHistory.length > 0) {
      contextPrompt += 'Previous conversation:\n';
      conversationHistory.slice(-6).forEach(msg => {
        contextPrompt += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }
    
    contextPrompt += `Human: ${prompt}\nAssistant:`;

    console.log('🤖 Gemini: Sending request');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
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
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }

    const candidate = data.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
      throw new Error('Response blocked by safety filters');
    }

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Invalid response format from Gemini API');
    }

    console.log('✅ Gemini: Response received');
    return candidate.content.parts[0].text;
  }
}

class LLMService {
  private providers: LLMProvider[] = [];
  private currentProviderIndex = 0;
  private isInitialized = false;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Use fallback values if environment variables are not available
    const geminiKey = import.meta.env?.VITE_GEMINI_API_KEY || 'AIzaSyB1XxKTeuQWoU7fABqM00_US7jC233bREQ';
    const openaiKey = import.meta.env?.VITE_OPENAI_API_KEY || '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';
    const preferredProvider = import.meta.env?.VITE_LLM_PROVIDER || 'auto';

    console.log('🔧 Initializing LLM providers...');
    console.log('Environment check:', {
      hasImportMeta: typeof import.meta !== 'undefined',
      hasEnv: typeof import.meta?.env !== 'undefined',
      geminiKeyLength: geminiKey?.length || 0,
      openaiKeyLength: openaiKey?.length || 0
    });

    // Initialize available providers
    if (geminiKey && geminiKey.trim() && geminiKey !== 'undefined') {
      try {
        this.providers.push(new GeminiProvider(geminiKey.trim()));
        console.log('✅ Gemini provider initialized');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini provider:', error);
      }
    }
    
    if (openaiKey && openaiKey.trim() && openaiKey !== 'undefined') {
      try {
        this.providers.push(new OpenAIProvider(openaiKey.trim()));
        console.log('✅ OpenAI provider initialized');
      } catch (error) {
        console.error('❌ Failed to initialize OpenAI provider:', error);
      }
    }

    // Set preferred provider if specified
    if (preferredProvider !== 'auto') {
      const preferredIndex = this.providers.findIndex(p => 
        p.name.toLowerCase().includes(preferredProvider.toLowerCase())
      );
      if (preferredIndex !== -1) {
        this.currentProviderIndex = preferredIndex;
        console.log(`🎯 Using preferred provider: ${this.providers[preferredIndex].name}`);
      }
    }

    if (this.providers.length === 0) {
      console.warn('⚠️ No LLM providers configured. Using fallback responses.');
    } else {
      console.log(`🚀 LLM service initialized with ${this.providers.length} provider(s)`);
    }

    this.isInitialized = true;
  }

  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    if (!this.isInitialized) {
      this.initializeProviders();
    }

    if (this.providers.length === 0) {
      return this.getFallbackResponse(prompt);
    }

    console.log(`🎯 Generating response for: "${prompt.slice(0, 50)}..."`);

    // Try each provider in order until one succeeds
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.providers.length; attempt++) {
      const provider = this.providers[this.currentProviderIndex];
      
      try {
        console.log(`🔄 Attempt ${attempt + 1}: Using ${provider.name}`);
        const response = await provider.generateResponse(prompt, conversationHistory);
        
        if (response && response.trim()) {
          console.log(`✅ Success with ${provider.name}`);
          return response.trim();
        } else {
          throw new Error('Empty response received');
        }
        
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ ${provider.name} failed:`, error);
        
        // Try next provider
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
      }
    }

    // All providers failed
    console.error('💥 All LLM providers failed');
    throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  private getFallbackResponse(prompt: string): string {
    const fallbackResponses = [
      "I apologize, but I'm experiencing technical difficulties connecting to AI services right now. This could be due to API key issues or network problems. Please check the console for more details and try again.",
      
      "I'm currently unable to process your request due to AI service connectivity issues. Please verify that the API keys are properly configured and try again in a moment.",
      
      "There seems to be an issue with the AI service configuration. Please check that your API keys are valid and the services are accessible, then try your request again.",
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return `${randomResponse}\n\n**Your message:** "${prompt.slice(0, 100)}${prompt.length > 100 ? '...' : ''}"`;
  }

  // Get current provider info for debugging
  getCurrentProvider(): string {
    if (!this.isInitialized) {
      return 'Not initialized';
    }
    if (this.providers.length === 0) {
      return 'No providers available';
    }
    return this.providers[this.currentProviderIndex].name;
  }

  // Get all available providers
  getAvailableProviders(): string[] {
    if (!this.isInitialized) {
      return [];
    }
    return this.providers.map(p => p.name);
  }

  // Force re-initialization (useful for debugging)
  reinitialize(): void {
    this.providers = [];
    this.currentProviderIndex = 0;
    this.isInitialized = false;
    this.initializeProviders();
  }
}

// Export singleton instance
export const llmService = new LLMService();

// Export for debugging
export const debugLLM = {
  getCurrentProvider: () => llmService.getCurrentProvider(),
  getAvailableProviders: () => llmService.getAvailableProviders(),
  reinitialize: () => llmService.reinitialize(),
  testConnection: async (prompt = "Hello, are you working?") => {
    try {
      console.log('🧪 Testing LLM connection...');
      const response = await llmService.generateResponse(prompt);
      console.log('✅ LLM Test successful:', response.slice(0, 100) + '...');
      return { success: true, response };
    } catch (error) {
      console.error('❌ LLM Test failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

// Auto-test on load in development
if (typeof window !== 'undefined' && import.meta.env?.VITE_DEBUG === 'true') {
  console.log('🧪 Debug mode enabled - testing LLM connection...');
  setTimeout(() => {
    debugLLM.testConnection().then(result => {
      if (result.success) {
        console.log('🎉 LLM service is working correctly!');
      } else {
        console.error('🚨 LLM service test failed:', result.error);
      }
    });
  }, 1000);
}