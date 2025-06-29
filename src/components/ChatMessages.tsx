import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isGenerating: boolean;
}

const ChatMessages = ({ messages, isGenerating }: ChatMessagesProps) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0 && !isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyber-primary bg-opacity-20 flex items-center justify-center">
            <Bot size={32} className="text-cyber-primary" />
          </div>
          <h3 className="text-cyber-accent text-xl font-bold mb-2">Welcome to DASSH</h3>
          <p className="text-cyber-muted">
            Start a conversation by typing a message below. I'm here to help with any questions or tasks you have.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex space-x-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-cyber-primary bg-opacity-20 flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-cyber-primary" />
            </div>
          )}
          
          <div className={`max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
            <div
              className={`rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-cyber-primary bg-opacity-20 border border-cyber-primary'
                  : 'bg-cyber-terminal border border-cyber-border'
              }`}
            >
              <div className="prose prose-invert max-w-none">
                <p className="text-cyber-text whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-cyber-border border-opacity-30">
                <span className="text-cyber-muted text-xs">
                  {formatTime(message.timestamp)}
                </span>
                
                {message.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="text-cyber-muted hover:text-cyber-accent transition-colors p-1 rounded"
                    title="Copy message"
                  >
                    {copiedMessageId === message.id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {message.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-cyber-accent bg-opacity-20 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-cyber-accent" />
            </div>
          )}
        </div>
      ))}
      
      {isGenerating && (
        <div className="flex space-x-4 justify-start">
          <div className="w-8 h-8 rounded-full bg-cyber-primary bg-opacity-20 flex items-center justify-center flex-shrink-0">
            <Bot size={18} className="text-cyber-primary" />
          </div>
          
          <div className="max-w-3xl">
            <div className="bg-cyber-terminal border border-cyber-border rounded-lg p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;