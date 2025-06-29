import { supabase } from './supabase';

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

export const conversationService = {
  async createConversation(userId: string, title: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      messages: [],
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  },

  async getUserConversations(userId: string): Promise<Conversation[]> {
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (conversationsError) throw conversationsError;

    // Get messages for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        return {
          id: conv.id,
          title: conv.title,
          messages: messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            timestamp: new Date(msg.created_at),
          })),
          created_at: new Date(conv.created_at),
          updated_at: new Date(conv.updated_at),
        };
      })
    );

    return conversationsWithMessages;
  },

  async addMessage(conversationId: string, message: Message): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: message.content,
        role: message.role,
        created_at: message.timestamp.toISOString(),
      });

    if (error) throw error;

    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
  },

  async deleteConversation(conversationId: string): Promise<void> {
    // Delete messages first (due to foreign key constraint)
    await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    // Then delete conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
  },

  async updateConversationTitle(conversationId: string, title: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({ 
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    if (error) throw error;
  },
};