# Authentication Documentation

## Overview
DASSH uses Supabase for authentication, providing secure user management with Google and GitHub OAuth integration. The system includes automatic session management, real-time auth state updates, and seamless integration with the chat interface.

## Current Configuration

### OAuth Providers Configured
- **Google OAuth**: Enabled with client credentials
- **GitHub OAuth**: Enabled with client credentials
- **Email/Password**: Available but OAuth is recommended

### Supabase Configuration
- **Project URL**: `https://txhcadkcdvbwysrwpdvd.supabase.co`
- **Anon Key**: Configured in environment variables
- **Site URL**: Set to production domain
- **Redirect URLs**: Configured for both development and production

## Authentication Flow

### 1. Landing Page Experience
- User visits `/` and sees welcome page with DASSH introduction
- "Get Started - Sign In" button opens authentication modal
- Clean, cyberpunk-themed interface with background game animation

### 2. OAuth Authentication
- Users can sign in with Google or GitHub
- One-click authentication with proper redirect handling
- Automatic account creation and profile setup

### 3. Post-Authentication
- Automatic redirect to `/chat` interface
- Session persistence across browser refreshes
- Real-time authentication state management

### 4. Chat Interface Access
- Protected route requiring authentication
- Automatic redirect to landing page if not authenticated
- Seamless logout with proper cleanup

## Technical Implementation

### Authentication Service (`src/lib/supabase.ts`)
```typescript
export const auth = {
  signUp: async (email: string, password: string) => { ... },
  signIn: async (email: string, password: string) => { ... },
  signOut: async () => { ... },
  signInWithOAuth: async (provider: 'google' | 'github') => { ... },
  getSession: async () => { ... },
  onAuthStateChange: (callback) => { ... }
}
```

### Key Features
- **Session Management**: Automatic session restoration and cleanup
- **Real-time Updates**: Auth state changes propagate immediately
- **Error Handling**: Comprehensive error handling with user feedback
- **Security**: JWT-based authentication with automatic token refresh

### Database Integration
- **Profiles Table**: Automatically created for each user
- **Row Level Security**: All data properly secured per user
- **Foreign Key Constraints**: Proper data relationships maintained

## User Experience Features

### Seamless Authentication
- **One-Click OAuth**: Google and GitHub sign-in
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Clear error messages for failed attempts
- **Auto-Redirect**: Smooth transition to chat interface

### Session Management
- **Persistent Sessions**: Users stay logged in across browser sessions
- **Auto-Logout**: Secure logout with proper token cleanup
- **Real-time Updates**: Authentication state updates immediately

### Responsive Design
- **Mobile-Friendly**: Touch-optimized authentication modal
- **Accessibility**: Keyboard navigation and screen reader support
- **Visual Feedback**: Loading states and success/error indicators

## Security Features

### Built-in Security
- **JWT Authentication**: Secure token-based authentication
- **HTTPS Only**: All authentication traffic encrypted
- **CSRF Protection**: Built-in cross-site request forgery protection
- **Rate Limiting**: Automatic rate limiting on auth endpoints

### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own conversations"
  ON conversations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
```

### Data Protection
- **User Isolation**: Complete data separation between users
- **Secure Tokens**: Automatic token rotation and validation
- **Privacy**: No sensitive data exposed to client-side code

## OAuth Provider Setup

### Google OAuth Configuration
1. **Google Cloud Console**: Create OAuth 2.0 Client ID
2. **Authorized Domains**: Add your production domain
3. **Redirect URIs**: `https://txhcadkcdvbwysrwpdvd.supabase.co/auth/v1/callback`
4. **Supabase Integration**: Client ID and Secret configured

### GitHub OAuth Configuration
1. **GitHub Developer Settings**: Create new OAuth App
2. **Application Name**: DASSH AI Chat
3. **Authorization Callback URL**: `https://txhcadkcdvbwysrwpdvd.supabase.co/auth/v1/callback`
4. **Supabase Integration**: Client ID and Secret configured

## Error Handling

### Common Authentication Errors
- **Invalid Credentials**: Clear error message with retry option
- **Network Issues**: Graceful handling with user feedback
- **OAuth Failures**: Specific error messages for OAuth issues
- **Session Expired**: Automatic redirect to login

### Error Recovery
- **Automatic Retry**: Built-in retry logic for transient failures
- **Fallback Options**: Multiple authentication methods available
- **User Guidance**: Clear instructions for resolving issues

## Development vs Production

### Development Environment
- **Local Testing**: `http://localhost:8080` configured as redirect URL
- **Debug Mode**: Additional logging for troubleshooting
- **Hot Reload**: Authentication state preserved during development

### Production Environment
- **Secure Domains**: HTTPS-only authentication
- **Performance**: Optimized for production load
- **Monitoring**: Error tracking and performance metrics

## API Reference

### Authentication Methods

#### `auth.signInWithOAuth(provider)`
Initiates OAuth flow with specified provider.
```typescript
await auth.signInWithOAuth('google');
await auth.signInWithOAuth('github');
```

#### `auth.getSession()`
Retrieves current user session.
```typescript
const { data: { session } } = await auth.getSession();
```

#### `auth.onAuthStateChange(callback)`
Listens for authentication state changes.
```typescript
const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
  // Handle auth state change
});
```

#### `auth.signOut()`
Logs out current user and clears session.
```typescript
await auth.signOut();
```

## User Profile Management

### Automatic Profile Creation
- **Trigger Function**: Automatically creates profile on user signup
- **Profile Data**: Email, creation timestamp, update timestamp
- **Error Handling**: Graceful handling of profile creation failures

### Profile Structure
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Testing and Validation

### Authentication Testing Checklist
- [ ] Google OAuth sign-in works correctly
- [ ] GitHub OAuth sign-in works correctly
- [ ] Session persistence across page refreshes
- [ ] Automatic redirect to chat after authentication
- [ ] Proper logout functionality
- [ ] Error handling for failed authentication
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

### Test Scenarios
1. **First-time User**: OAuth sign-up creates profile automatically
2. **Returning User**: Existing users can sign in seamlessly
3. **Session Expiry**: Expired sessions redirect to login
4. **Network Issues**: Graceful handling of connectivity problems
5. **Multiple Tabs**: Authentication state syncs across tabs

## Monitoring and Analytics

### Authentication Metrics
- **Sign-up Rate**: Track new user registrations
- **Sign-in Success Rate**: Monitor authentication success/failure
- **Provider Preferences**: Track OAuth provider usage
- **Session Duration**: Monitor user engagement

### Error Tracking
- **Failed Authentications**: Track and analyze failures
- **OAuth Errors**: Monitor provider-specific issues
- **Session Issues**: Track session-related problems

## Troubleshooting

### Common Issues

#### "Authentication failed"
- Check OAuth provider configuration
- Verify redirect URLs are correct
- Test with different browsers/incognito mode

#### "Session not found"
- Clear browser cache and cookies
- Check Supabase project status
- Verify environment variables

#### "Redirect loop"
- Check site URL configuration in Supabase
- Verify redirect URL configuration
- Test authentication flow step by step

### Debug Tools
```typescript
// Check current session
const { data: { session } } = await auth.getSession();
console.log('Current session:', session);

// Monitor auth state changes
auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

## Future Enhancements

### Planned Features
- **Multi-Factor Authentication**: Add 2FA support
- **Social Login Expansion**: Add more OAuth providers
- **Profile Customization**: Allow users to update profiles
- **Account Deletion**: Self-service account deletion

### Security Improvements
- **Advanced Rate Limiting**: Per-user rate limiting
- **Suspicious Activity Detection**: Monitor for unusual patterns
- **Enhanced Session Security**: Additional session validation
- **Audit Logging**: Comprehensive authentication logs

The authentication system provides a secure, user-friendly experience with enterprise-grade security features and seamless integration with the chat interface.