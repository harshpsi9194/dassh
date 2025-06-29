# Authentication Documentation

## Overview
DASSH uses Supabase for authentication, providing secure user management with email/password and social login options.

## Setup Instructions

### 1. Supabase Project Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to Settings > API to get your project credentials

### 2. Environment Variables
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Social Authentication Setup (Optional)

#### Google OAuth
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

#### GitHub OAuth
1. In Supabase Dashboard, go to Authentication > Providers
2. Enable GitHub provider
3. Add your GitHub OAuth credentials
4. Set redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

## Implementation Details

### Authentication Service (`src/lib/supabase.ts`)
- Centralized Supabase client configuration
- Helper functions for common auth operations
- Error handling and session management

### AuthModal Component (`src/components/AuthModal.tsx`)
- Tabbed interface for login/signup
- Real-time form validation
- Social login integration
- Loading states and error handling

### Authentication State Management (`src/pages/Index.tsx`)
- Session persistence across page reloads
- Real-time auth state changes
- Automatic user data synchronization

## Features

### Email/Password Authentication
- User registration with email confirmation
- Secure password-based login
- Password strength validation (minimum 6 characters)
- Form validation with user feedback

### Social Authentication
- Google OAuth integration
- GitHub OAuth integration
- Automatic account linking
- Seamless redirect handling

### Session Management
- Automatic session restoration
- Real-time auth state updates
- Secure logout functionality
- Session expiration handling

## Security Features

### Built-in Security
- JWT-based authentication
- Secure password hashing
- CSRF protection
- Rate limiting on auth endpoints

### Email Verification
- Automatic email confirmation for new accounts
- Secure email verification links
- Resend verification functionality

### Password Security
- Minimum password requirements
- Secure password reset flow
- Password confirmation for sensitive operations

## User Experience

### Loading States
- Visual feedback during authentication
- Disabled buttons during processing
- Clear error messages for failed attempts

### Form Validation
- Real-time field validation
- Clear error messaging
- Accessibility-compliant form design

### Responsive Design
- Mobile-optimized modal design
- Touch-friendly interface elements
- Consistent styling across devices

## API Reference

### Authentication Functions

#### `auth.signUp(email, password)`
Creates a new user account
```typescript
const { data, error } = await auth.signUp('user@example.com', 'password123');
```

#### `auth.signIn(email, password)`
Authenticates existing user
```typescript
const { data, error } = await auth.signIn('user@example.com', 'password123');
```

#### `auth.signOut()`
Logs out current user
```typescript
const { error } = await auth.signOut();
```

#### `auth.signInWithOAuth(provider)`
Social authentication
```typescript
const { error } = await auth.signInWithOAuth('google');
```

#### `auth.getSession()`
Retrieves current session
```typescript
const { data: { session } } = await auth.getSession();
```

#### `auth.onAuthStateChange(callback)`
Listens for auth state changes
```typescript
const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
  // Handle auth state change
});
```

## Error Handling

### Common Error Types
- Invalid credentials
- Email already registered
- Network connectivity issues
- Session expired
- Rate limiting

### Error Display
- Toast notifications for user feedback
- Form-specific error messages
- Graceful fallback for network issues

## Testing

### Manual Testing Checklist
- [ ] User registration with email confirmation
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Social login (Google/GitHub)
- [ ] Session persistence across page reloads
- [ ] Logout functionality
- [ ] Password validation
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states

### Test Accounts
For development testing, create test accounts with various scenarios:
- Valid user account
- Unverified email account
- Social login accounts

## Troubleshooting

### Common Issues

#### Environment Variables Not Loading
- Ensure `.env` file is in project root
- Restart development server after adding variables
- Check variable names match exactly

#### Social Login Not Working
- Verify OAuth app configuration
- Check redirect URLs match exactly
- Ensure providers are enabled in Supabase

#### Session Not Persisting
- Check browser local storage
- Verify Supabase URL and key are correct
- Clear browser cache and cookies

#### Email Confirmation Issues
- Check spam folder for confirmation emails
- Verify email templates in Supabase
- Test with different email providers

## Future Enhancements

### Planned Features
- Password reset functionality
- Two-factor authentication
- Account deletion
- Profile management
- Admin user roles

### Security Improvements
- Enhanced password requirements
- Account lockout after failed attempts
- Suspicious activity detection
- Security audit logging

## Support

For authentication-related issues:
1. Check Supabase dashboard for error logs
2. Verify environment variables are correct
3. Test with different browsers/devices
4. Check network connectivity
5. Review Supabase documentation for updates