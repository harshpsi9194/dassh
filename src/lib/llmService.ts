interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Mock LLM service - replace with actual API integration
export const llmService = {
  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock responses based on prompt content
    const responses = [
      "I understand your question. Let me provide you with a comprehensive response that addresses your specific needs and concerns.",
      
      "That's an interesting point you've raised. Based on the context of our conversation, I can offer several perspectives on this topic.",
      
      "I'd be happy to help you with that. Here's a detailed explanation that should clarify the concepts you're asking about.",
      
      "Thank you for that question. Let me break this down into manageable parts to give you the most useful information.",
      
      "I can see why you might be curious about this. Let me provide you with some insights and practical guidance on this matter.",
      
      "That's a great question that touches on several important aspects. I'll walk you through the key points you should consider.",
      
      "I appreciate you bringing this up. Based on current best practices and available information, here's what I recommend.",
      
      "This is definitely worth exploring further. Let me share some thoughts and suggestions that might be helpful for your situation.",
    ];

    // Simple keyword-based response selection
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('code') || lowerPrompt.includes('programming')) {
      return "I'd be happy to help you with coding! Here's a solution that addresses your programming question:\n\n```javascript\n// Example code structure\nfunction example() {\n  console.log('This is a sample response');\n}\n```\n\nThis approach should work well for your use case. Let me know if you need any clarification or have additional questions!";
    }
    
    if (lowerPrompt.includes('explain') || lowerPrompt.includes('what is')) {
      return "Let me explain this concept clearly:\n\n1. **Definition**: This refers to the fundamental principles and core concepts\n2. **Key Components**: The main elements that make up this topic\n3. **Practical Applications**: How this applies in real-world scenarios\n4. **Important Considerations**: Things to keep in mind when working with this\n\nWould you like me to elaborate on any of these points?";
    }
    
    if (lowerPrompt.includes('help') || lowerPrompt.includes('how to')) {
      return "I'm here to help! Here's a step-by-step approach to address your question:\n\n**Step 1**: Start by understanding the core requirements\n**Step 2**: Gather the necessary resources and information\n**Step 3**: Implement the solution systematically\n**Step 4**: Test and refine your approach\n**Step 5**: Document your process for future reference\n\nFeel free to ask for more specific guidance on any of these steps!";
    }

    // Return a random response for general queries
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add some context if there's conversation history
    if (conversationHistory.length > 0) {
      return `${randomResponse}\n\nBuilding on our previous discussion, I want to make sure this information connects well with what we've already covered. Is there a particular aspect you'd like me to focus on more?`;
    }
    
    return randomResponse;
  }
};

// TODO: Replace with actual LLM API integration
// Example integration with OpenAI GPT or Google Gemini:
/*
export const llmService = {
  async generateResponse(prompt: string, conversationHistory: Message[] = []): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // or VITE_GEMINI_API_KEY
    
    const messages = [
      { role: 'system', content: 'You are DASSH, a helpful AI assistant.' },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: prompt }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }
};
*/