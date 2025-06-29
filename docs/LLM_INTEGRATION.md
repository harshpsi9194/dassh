# LLM Integration Guide

## Overview
This guide covers integrating various Large Language Model (LLM) APIs with the DASSH chat system.

## Supported LLM Providers

### 1. OpenAI GPT Models
**Recommended for**: High-quality responses, wide language support
**Cost**: Moderate to high
**Setup complexity**: Low

#### Configuration
```typescript
// src/lib/llmService.ts
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export const llmService = {
  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    const messages = [
      { 
        role: 'system', 
        content: 'You are DASSH, a helpful AI assistant. Provide clear, comprehensive, and engaging responses.' 
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // or 'gpt-4' for better quality
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false, // Set to true for streaming responses
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
};
```

#### Environment Variables
```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Google Gemini
**Recommended for**: Cost-effective, good performance
**Cost**: Low to moderate
**Setup complexity**: Low

#### Configuration
```typescript
// src/lib/llmService.ts
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export const llmService = {
  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    // Build conversation context
    let contextPrompt = 'You are DASSH, a helpful AI assistant.\n\n';
    
    if (conversationHistory.length > 0) {
      contextPrompt += 'Previous conversation:\n';
      conversationHistory.forEach(msg => {
        contextPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }
    
    contextPrompt += `User: ${prompt}\nAssistant:`;

    const response = await fetch(`${GEMINI_BASE_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
};
```

#### Environment Variables
```env
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. DeepSeek API
**Recommended for**: Cost-effective, coding tasks
**Cost**: Very low
**Setup complexity**: Low

#### Configuration
```typescript
// src/lib/llmService.ts
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

export const llmService = {
  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    const messages = [
      { 
        role: 'system', 
        content: 'You are DASSH, a helpful AI assistant specialized in providing detailed and accurate responses.' 
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
};
```

#### Environment Variables
```env
VITE_DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

## Advanced Features

### Streaming Responses
For real-time response generation:

```typescript
export const llmService = {
  async generateStreamingResponse(
    prompt: string, 
    conversationHistory: Message[] = [],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: buildMessages(prompt, conversationHistory),
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }

    return fullResponse;
  }
};
```

### Error Handling and Retry Logic
```typescript
export const llmService = {
  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    const maxRetries = 3;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.makeAPICall(prompt, conversationHistory);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  },

  async makeAPICall(prompt: string, conversationHistory: Message[]): Promise<string> {
    // Your API call implementation here
  }
};
```

### Rate Limiting
```typescript
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number, timeWindowMs: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

export const llmService = {
  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    await rateLimiter.checkLimit();
    // Continue with API call...
  }
};
```

## Cost Optimization

### Token Management
```typescript
function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

function truncateConversationHistory(messages: Message[], maxTokens: number): Message[] {
  let totalTokens = 0;
  const truncated: Message[] = [];

  // Keep recent messages within token limit
  for (let i = messages.length - 1; i >= 0; i--) {
    const messageTokens = estimateTokens(messages[i].content);
    if (totalTokens + messageTokens > maxTokens) break;
    
    totalTokens += messageTokens;
    truncated.unshift(messages[i]);
  }

  return truncated;
}
```

### Response Caching
```typescript
class ResponseCache {
  private cache = new Map<string, { response: string; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  get(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.response;
  }

  set(key: string, response: string): void {
    this.cache.set(key, { response, timestamp: Date.now() });
  }

  private generateKey(prompt: string, history: Message[]): string {
    const historyStr = history.map(m => `${m.role}:${m.content}`).join('|');
    return btoa(`${prompt}|${historyStr}`);
  }
}
```

## Security Best Practices

### API Key Management
```typescript
// Never expose API keys in client-side code
// Use environment variables and server-side proxy

// Example server-side proxy (if using Node.js backend)
app.post('/api/chat', async (req, res) => {
  const { prompt, history } = req.body;
  
  // Validate user authentication
  const user = await validateAuthToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Rate limiting per user
  await checkUserRateLimit(user.id);

  // Make API call with server-side key
  const response = await llmService.generateResponse(prompt, history);
  res.json({ response });
});
```

### Input Sanitization
```typescript
function sanitizeInput(input: string): string {
  // Remove potentially harmful content
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, 4000); // Limit length
}
```

## Testing

### Unit Tests
```typescript
// src/lib/__tests__/llmService.test.ts
import { llmService } from '../llmService';

describe('LLM Service', () => {
  test('generates response for simple prompt', async () => {
    const response = await llmService.generateResponse('Hello');
    expect(response).toBeTruthy();
    expect(typeof response).toBe('string');
  });

  test('handles conversation history', async () => {
    const history = [
      { id: '1', content: 'What is AI?', role: 'user' as const, timestamp: new Date() },
      { id: '2', content: 'AI stands for Artificial Intelligence...', role: 'assistant' as const, timestamp: new Date() }
    ];
    
    const response = await llmService.generateResponse('Tell me more', history);
    expect(response).toBeTruthy();
  });

  test('handles API errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));
    
    await expect(llmService.generateResponse('test')).rejects.toThrow();
  });
});
```

## Monitoring and Analytics

### Response Quality Metrics
```typescript
interface ResponseMetrics {
  responseTime: number;
  tokenCount: number;
  userSatisfaction?: number;
  errorRate: number;
}

class LLMAnalytics {
  async trackResponse(metrics: ResponseMetrics): Promise<void> {
    // Send to analytics service
    await fetch('/api/analytics/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    });
  }
}
```

## Deployment Considerations

### Environment Configuration
```typescript
// src/lib/config.ts
export const LLM_CONFIG = {
  provider: import.meta.env.VITE_LLM_PROVIDER || 'openai',
  apiKey: import.meta.env.VITE_LLM_API_KEY,
  model: import.meta.env.VITE_LLM_MODEL || 'gpt-3.5-turbo',
  maxTokens: parseInt(import.meta.env.VITE_LLM_MAX_TOKENS || '1000'),
  temperature: parseFloat(import.meta.env.VITE_LLM_TEMPERATURE || '0.7'),
};
```

### Production Checklist
- [ ] API keys stored securely (not in client-side code)
- [ ] Rate limiting implemented
- [ ] Error handling and fallbacks configured
- [ ] Response caching enabled
- [ ] Monitoring and logging set up
- [ ] Cost tracking implemented
- [ ] User feedback collection enabled
- [ ] Performance optimization applied
- [ ] Security measures in place
- [ ] Backup LLM provider configured