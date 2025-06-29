# Deployment Guide

## Overview
This guide covers deploying the DASSH AI chat application to production with Supabase backend and various hosting options.

## Prerequisites

### Required Accounts
- [Supabase](https://supabase.com) account
- [Netlify](https://netlify.com) or [Vercel](https://vercel.com) account (for hosting)
- LLM API account (OpenAI, Google AI, or DeepSeek)

### Required Tools
- Node.js 18+ and npm
- Git
- Supabase CLI (optional, for local development)

## Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details
4. Wait for project provisioning (2-3 minutes)

### 2. Configure Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Google** provider:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

3. Enable **GitHub** provider:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create new OAuth App
   - Set Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

### 3. Configure Site URL
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain: `https://your-app.netlify.app`
3. Add **Additional Redirect URLs**:
   - `http://localhost:8080` (for local development)
   - Any other domains you'll use

### 4. Database Setup
The database migrations will be applied automatically. The following tables will be created:
- `profiles` - User profile information
- `conversations` - Chat conversations
- `messages` - Individual messages in conversations

### 5. Get Project Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret)

## Environment Configuration

### Production Environment Variables
Create these environment variables in your hosting platform:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# LLM API Configuration (choose one)
VITE_OPENAI_API_KEY=sk-your-openai-key
# OR
VITE_GEMINI_API_KEY=your-gemini-key
# OR
VITE_DEEPSEEK_API_KEY=your-deepseek-key

# Optional: Specify which LLM provider to use
VITE_LLM_PROVIDER=openai
```

### Local Development
Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=sk-your-openai-key
```

## Hosting Options

### Option 1: Netlify (Recommended)

#### Automatic Deployment
1. Push your code to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com/)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables in **Site settings** → **Environment variables**
7. Deploy the site

#### Manual Deployment
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option 2: Vercel

#### Automatic Deployment
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings (auto-detected for Vite)
6. Add environment variables
7. Deploy

#### Manual Deployment
```bash
# Build the project
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### Option 3: Custom Server

#### Using Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the app
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

```bash
# Build and run
docker build -t dassh-app .
docker run -p 3000:3000 dassh-app
```

## LLM API Setup

### OpenAI Setup
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing information
3. Go to **API Keys** and create a new key
4. Add the key to your environment variables as `VITE_OPENAI_API_KEY`

### Google Gemini Setup
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create a new project or select existing one
3. Enable the Generative AI API
4. Create an API key
5. Add the key to your environment variables as `VITE_GEMINI_API_KEY`

### DeepSeek Setup
1. Go to [DeepSeek Platform](https://platform.deepseek.com/)
2. Create an account
3. Generate an API key
4. Add the key to your environment variables as `VITE_DEEPSEEK_API_KEY`

## Security Configuration

### Content Security Policy
Add to your hosting platform's headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.openai.com https://generativelanguage.googleapis.com https://api.deepseek.com;
```

### HTTPS Configuration
Ensure your site is served over HTTPS:
- Netlify and Vercel provide automatic HTTPS
- For custom servers, use Let's Encrypt or similar

### API Key Security
- Never expose API keys in client-side code
- Use environment variables for all sensitive data
- Consider implementing a backend proxy for API calls
- Rotate API keys regularly

## Performance Optimization

### Build Optimization
```bash
# Optimize build for production
npm run build

# Analyze bundle size
npm install -g vite-bundle-analyzer
npx vite-bundle-analyzer
```

### CDN Configuration
Configure your hosting platform to use CDN:
- Netlify: Automatic global CDN
- Vercel: Automatic Edge Network
- Custom: Use Cloudflare or AWS CloudFront

### Caching Headers
Configure appropriate cache headers:
```
# Static assets
Cache-Control: public, max-age=31536000, immutable

# HTML files
Cache-Control: public, max-age=0, must-revalidate

# API responses
Cache-Control: private, max-age=300
```

## Monitoring and Analytics

### Error Tracking
Add error tracking service:

```typescript
// src/lib/errorTracking.ts
export const trackError = (error: Error, context?: any) => {
  // Send to your error tracking service
  console.error('Application error:', error, context);
  
  // Example: Sentry integration
  // Sentry.captureException(error, { extra: context });
};
```

### Performance Monitoring
```typescript
// src/lib/analytics.ts
export const trackPageView = (page: string) => {
  // Send to analytics service
  // Example: Google Analytics 4
  // gtag('config', 'GA_MEASUREMENT_ID', { page_title: page });
};

export const trackEvent = (event: string, parameters?: any) => {
  // Track user interactions
  // gtag('event', event, parameters);
};
```

### Health Checks
Create health check endpoints:

```typescript
// src/lib/healthCheck.ts
export const checkSystemHealth = async () => {
  const checks = {
    supabase: await checkSupabaseConnection(),
    llm: await checkLLMService(),
    timestamp: new Date().toISOString(),
  };
  
  return checks;
};
```

## Backup and Recovery

### Database Backups
Supabase provides automatic backups:
- Daily backups for 7 days (free tier)
- Point-in-time recovery (paid tiers)
- Manual backup exports available

### Code Backups
- Use Git for version control
- Tag releases for easy rollback
- Maintain staging environment

### Environment Recovery
Document all environment variables and configurations for quick recovery.

## Scaling Considerations

### Database Scaling
- Monitor connection usage
- Implement connection pooling
- Consider read replicas for high traffic

### API Rate Limiting
```typescript
// Implement rate limiting for LLM APIs
const rateLimiter = {
  requests: new Map(),
  
  async checkLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests (older than 1 hour)
    const recentRequests = userRequests.filter(time => now - time < 3600000);
    
    if (recentRequests.length >= 100) { // 100 requests per hour
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    return true;
  }
};
```

### CDN and Caching
- Use CDN for static assets
- Implement response caching
- Consider edge computing for global users

## Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### Environment Variable Issues
- Verify all required variables are set
- Check variable names (case-sensitive)
- Ensure no trailing spaces in values

#### Authentication Issues
- Verify OAuth redirect URLs
- Check Supabase site URL configuration
- Test with different browsers/incognito mode

#### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Review Supabase logs

### Debugging Tools
```typescript
// Add debug logging
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

export const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data);
  }
};
```

## Maintenance

### Regular Tasks
- Monitor error rates and performance
- Update dependencies monthly
- Review and rotate API keys quarterly
- Check for security updates
- Monitor usage and costs

### Update Process
1. Test updates in staging environment
2. Create backup/snapshot
3. Deploy during low-traffic periods
4. Monitor for issues post-deployment
5. Have rollback plan ready

### Cost Monitoring
- Set up billing alerts for all services
- Monitor API usage and costs
- Optimize based on usage patterns
- Consider cost-effective alternatives as you scale

This deployment guide ensures a robust, secure, and scalable production deployment of your DASSH AI chat application.