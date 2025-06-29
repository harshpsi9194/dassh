# Chat System Documentation

## Overview
The DASSH chat system provides a Claude-like interface for AI conversations with persistent storage, conversation management, and a responsive design.

## Architecture

### Frontend Components

#### ChatInterface (`src/pages/ChatInterface.tsx`)
- Main chat page that orchestrates the entire chat experience
- Handles authentication checks and redirects
- Manages conversation state and message flow
- Coordinates between sidebar, messages, and input components

#### ChatSidebar (`src/components/ChatSidebar.tsx`)
- Collapsible sidebar with conversation history
- New conversation creation
- User profile and logout functionality
- Responsive design (collapses on mobile)

#### ChatMessages (`src/components/ChatMessages.tsx`)
- Displays conversation messages with proper formatting
- Shows typing indicators during AI response generation
- Copy-to-clipboard functionality for AI responses
- Empty state for new conversations

#### ChatInput (`src/components/ChatInput.tsx`)
- Auto-expanding textarea with proper line handling
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Character count and visual feedback
- Disabled state during message generation

### Backend Services

#### Conversation Service (`src/lib/conversationService.ts`)
- CRUD operations for conversations and messages
- Supabase integration with proper error handling
- Real-time conversation updates
- Message persistence and retrieval

#### LLM Service (`src/lib/llmService.ts`)
- AI response generation (currently mock implementation)
- Conversation context management
- Ready for integration with OpenAI, Gemini, or DeepSeek APIs
- Streaming response capability (planned)

### Database Schema

#### Conversations Table
```sql
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### Messages Table
```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  content text NOT NULL,
  role text CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);
```

## Features

### Authentication Integration
- Seamless integration with existing Supabase auth
- Automatic redirect to chat interface after login
- Session persistence and real-time auth state management
- Secure logout with proper cleanup

### Conversation Management
- Create new conversations with auto-generated titles
- View conversation history in chronological order
- Delete conversations with confirmation
- Automatic conversation title updates based on first message

### Message Handling
- Real-time message sending and receiving
- Proper message formatting with timestamps
- Copy functionality for AI responses
- Loading states and error handling

### Responsive Design
- Mobile-first approach with collapsible sidebar
- Touch-friendly interface elements
- Proper keyboard navigation
- Accessibility compliance

### UI/UX Features
- Claude-like interface design
- Smooth animations and transitions
- Visual feedback for user actions
- Empty states and loading indicators

## Setup Instructions

### 1. Database Migration
Run the chat system migration to create necessary tables:
```bash
# The migration file is already created: supabase/migrations/20250629020000_chat_system.sql
# It will be applied automatically when you deploy to Supabase
```

### 2. Environment Variables
No additional environment variables needed for basic functionality. For LLM integration, add:
```env
VITE_OPENAI_API_KEY=your_openai_key
# OR
VITE_GEMINI_API_KEY=your_gemini_key
```

### 3. LLM Integration
Replace the mock implementation in `src/lib/llmService.ts` with your preferred AI service:

#### OpenAI Integration
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: conversationMessages,
    max_tokens: 1000,
    temperature: 0.7,
  }),
});
```

#### Google Gemini Integration
```typescript
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  }),
});
```

## User Flow

### 1. Authentication
- User visits `/` and sees landing page
- User clicks "Get Started - Sign In"
- User authenticates via Google/GitHub OAuth
- User is redirected to `/chat`

### 2. Chat Interface
- User sees sidebar with conversation history (if any)
- User can create new conversation or select existing one
- User types message and presses Enter to send
- AI responds with generated content
- Conversation is automatically saved

### 3. Conversation Management
- User can switch between conversations
- User can delete conversations they no longer need
- User can collapse sidebar for more screen space
- User can logout from the sidebar

## API Reference

### Conversation Service Methods

#### `createConversation(userId: string, title: string)`
Creates a new conversation for the user.

#### `getUserConversations(userId: string)`
Retrieves all conversations for a user, ordered by most recent.

#### `addMessage(conversationId: string, message: Message)`
Adds a new message to a conversation and updates the conversation timestamp.

#### `deleteConversation(conversationId: string)`
Deletes a conversation and all its messages.

#### `updateConversationTitle(conversationId: string, title: string)`
Updates the title of a conversation.

### LLM Service Methods

#### `generateResponse(prompt: string, conversationHistory: Message[])`
Generates an AI response based on the prompt and conversation context.

## Security

### Row Level Security (RLS)
- All database operations are secured with RLS policies
- Users can only access their own conversations and messages
- Proper foreign key constraints ensure data integrity

### Authentication
- JWT-based authentication via Supabase
- Automatic session management and renewal
- Secure logout with token cleanup

### Data Validation
- Input sanitization for all user content
- Proper error handling and user feedback
- Rate limiting considerations for AI API calls

## Performance Optimizations

### Database
- Indexed queries for conversation and message retrieval
- Efficient pagination for large conversation histories
- Optimized foreign key relationships

### Frontend
- Lazy loading of conversation history
- Debounced input handling
- Efficient re-rendering with React optimization

### API
- Connection pooling for database operations
- Caching strategies for frequently accessed data
- Error retry mechanisms with exponential backoff

## Future Enhancements

### Planned Features
- Real-time streaming responses from AI
- File upload and attachment support
- Conversation search and filtering
- Export conversations to various formats
- Conversation sharing and collaboration
- Custom AI model selection
- Voice input and output
- Mobile app development

### Technical Improvements
- WebSocket integration for real-time updates
- Progressive Web App (PWA) capabilities
- Offline support with sync when online
- Advanced caching strategies
- Performance monitoring and analytics

## Troubleshooting

### Common Issues

#### "Database error saving user"
- Check Supabase connection and credentials
- Verify RLS policies are correctly configured
- Ensure migrations have been applied

#### "Failed to load conversations"
- Check user authentication status
- Verify database permissions
- Check network connectivity

#### "AI response generation failed"
- Verify LLM API credentials
- Check API rate limits and quotas
- Review error logs for specific issues

### Debug Mode
Enable debug logging by setting:
```typescript
const DEBUG = true; // in relevant service files
```

## Support

For issues related to the chat system:
1. Check browser console for error messages
2. Verify Supabase dashboard for database issues
3. Test authentication flow in incognito mode
4. Review network requests in browser dev tools
5. Check Supabase logs for backend errors