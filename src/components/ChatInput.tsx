import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
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

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-3">
          {/* Attachment button (placeholder) */}
          <button
            type="button"
            className="p-3 text-cyber-muted hover:text-cyber-accent transition-colors rounded-lg hover:bg-cyber-terminal"
            title="Attach file (coming soon)"
          >
            <Paperclip size={20} />
          </button>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              disabled={disabled}
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
              disabled={!message.trim() || disabled}
              className="absolute right-2 bottom-2 p-2 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyber-primary"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
        {/* Character count and tips */}
        <div className="flex justify-between items-center mt-2 text-xs text-cyber-muted">
          <span>
            {message.length > 0 && `${message.length} characters`}
          </span>
          <span>
            Press Shift+Enter for new line
          </span>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;