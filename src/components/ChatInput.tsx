import { useState, useRef, useEffect } from 'react';
import { Send, Zap, AlertCircle } from 'lucide-react';
import { debugLLM } from '@/lib/llmService';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const currentProvider = debugLLM.getCurrentProvider();
  const availableProviders = debugLLM.getAvailableProviders();
  const hasProviders = availableProviders.length > 0;

  const testConnection = async () => {
    console.log('🧪 Testing LLM connection...');
    const result = await debugLLM.testConnection();
    if (result.success) {
      alert('✅ LLM connection test successful!\n\nResponse: ' + result.response);
    } else {
      alert('❌ LLM connection test failed!\n\nError: ' + result.error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-3">
          {/* AI Provider indicator */}
          <div className="flex flex-col items-center space-y-1">
            <button
              type="button"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className={`p-3 rounded-lg transition-colors ${
                hasProviders 
                  ? 'text-cyber-accent hover:text-cyber-primary hover:bg-cyber-terminal' 
                  : 'text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20'
              }`}
              title={hasProviders ? `Current AI: ${currentProvider}` : 'No AI providers configured'}
            >
              {hasProviders ? <Zap size={20} /> : <AlertCircle size={20} />}
            </button>
            
            {!hasProviders && (
              <button
                type="button"
                onClick={testConnection}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Test
              </button>
            )}
          </div>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasProviders 
                ? "Type your message... (Press Enter to send, Shift+Enter for new line)" 
                : "AI services not configured. Check console for details."
              }
              disabled={disabled || !hasProviders}
              className="w-full bg-cyber-terminal border border-cyber-border rounded-lg px-4 py-3 pr-12 text-cyber-text placeholder-cyber-muted resize-none focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                minHeight: '52px',
                maxHeight: '200px',
                lineHeight: '1.5'
              }}
            />
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled || !hasProviders}
              className="absolute right-2 bottom-2 p-2 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyber-primary"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
        {/* Debug info and tips */}
        <div className="flex justify-between items-center mt-2 text-xs text-cyber-muted">
          <div className="flex items-center space-x-4">
            {showDebugInfo && (
              <div className="space-y-1">
                <div className={hasProviders ? 'text-cyber-accent' : 'text-red-400'}>
                  AI: {currentProvider} ({availableProviders.length} available)
                </div>
                {!hasProviders && (
                  <div className="text-red-400">
                    Check console for API key configuration
                  </div>
                )}
              </div>
            )}
            {message.length > 0 && (
              <span>{message.length} characters</span>
            )}
          </div>
          <span>
            Press Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;