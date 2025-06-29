import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ChatSidebar from '@/components/ChatSidebar';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import { conversationService } from '@/lib/conversationService';
import { llmService, debugLLM } from '@/lib/llmService';

interface User {
  email: string;
  id: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: Date;
  updated_at: Date;
}

const ChatInterface = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await auth.getSession();
        if (!session?.user) {
          console.log('No session found, redirecting to home');
          navigate('/');
          return;
        }
        
        console.log('User authenticated:', session.user.email);
        setUser({
          email: session.user.email!,
          id: session.user.id,
        });
        
        // Load conversations
        await loadConversations(session.user.id);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        console.log('Auth state changed: no user, redirecting');
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const loadConversations = async (userId: string) => {
    try {
      console.log('Loading conversations for user:', userId);
      const userConversations = await conversationService.getUserConversations(userId);
      console.log('Loaded conversations:', userConversations.length);
      setConversations(userConversations);
      
      // Set the most recent conversation as current if none selected
      if (userConversations.length > 0 && !currentConversation) {
        setCurrentConversation(userConversations[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    }
  };

  const createNewConversation = async () => {
    if (!user) return;

    try {
      console.log('Creating new conversation');
      const newConversation = await conversationService.createConversation(user.id, "New Chat");
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      console.log('New conversation created:', newConversation.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
    }
  };

  const selectConversation = (conversation: Conversation) => {
    console.log('Selecting conversation:', conversation.id);
    setCurrentConversation(conversation);
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      console.log('Deleting conversation:', conversationId);
      await conversationService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversation?.id === conversationId) {
        const remaining = conversations.filter(c => c.id !== conversationId);
        setCurrentConversation(remaining.length > 0 ? remaining[0] : null);
      }
      
      toast({
        title: "Success",
        description: "Conversation deleted",
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      setIsGenerating(true);
      console.log('Sending message:', content.slice(0, 50) + '...');

      // Create conversation if none exists
      let conversation = currentConversation;
      if (!conversation) {
        console.log('No current conversation, creating new one');
        conversation = await conversationService.createConversation(user.id, content.slice(0, 50) + "...");
        setConversations(prev => [conversation!, ...prev]);
        setCurrentConversation(conversation);
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: new Date(),
      };

      console.log('Adding user message to conversation');
      await conversationService.addMessage(conversation.id, userMessage);
      
      // Update local state immediately for better UX
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, userMessage]
      } : null);

      // Get AI response
      try {
        console.log('Requesting AI response...');
        console.log('Available providers:', debugLLM.getAvailableProviders());
        console.log('Current provider:', debugLLM.getCurrentProvider());
        
        const aiResponse = await llmService.generateResponse(content, conversation.messages);
        console.log('AI response received:', aiResponse.slice(0, 100) + '...');
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          role: 'assistant',
          timestamp: new Date(),
        };

        await conversationService.addMessage(conversation.id, assistantMessage);
        
        // Update local state
        setCurrentConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, assistantMessage]
        } : null);

        // Update conversation title if it's the first message
        if (conversation.messages.length === 0) {
          const updatedTitle = content.slice(0, 50) + (content.length > 50 ? "..." : "");
          await conversationService.updateConversationTitle(conversation.id, updatedTitle);
          setConversations(prev => prev.map(c => 
            c.id === conversation!.id ? { ...c, title: updatedTitle } : c
          ));
        }

      } catch (aiError) {
        console.error('AI response error:', aiError);
        
        // Add error message to conversation
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I apologize, but I encountered an error while generating a response: ${aiError instanceof Error ? aiError.message : 'Unknown error'}. Please try again.`,
          role: 'assistant',
          timestamp: new Date(),
        };

        await conversationService.addMessage(conversation.id, errorMessage);
        
        setCurrentConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, errorMessage]
        } : null);

        toast({
          title: "AI Response Error",
          description: "There was an issue generating the AI response. Please try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user');
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-accent mx-auto mb-4"></div>
          <p className="text-cyber-text">Loading DASSH...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-cyber-dark">
      {/* Sidebar */}
      <ChatSidebar
        user={user}
        conversations={conversations}
        currentConversation={currentConversation}
        onNewConversation={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <ChatMessages 
            messages={currentConversation?.messages || []}
            isGenerating={isGenerating}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-cyber-border bg-cyber-card">
          <ChatInput 
            onSendMessage={sendMessage}
            disabled={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
