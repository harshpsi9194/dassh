# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank Page in Production

#### Symptoms
- Local development works fine
- Deployed site shows blank page
- No visible errors in the UI

#### Causes and Solutions

**Missing Environment Variables**
```bash
# Check if these are set in your hosting platform:
VITE_SUPABASE_URL=https://txhcadkcdvbwysrwpdvd.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
VITE_OPENAI_API_KEY=your-openai-key
```

**JavaScript Errors**
- Open browser dev tools (F12)
- Check Console tab for errors
- Look for import/module errors

**Build Issues**
```bash
# Test build locally
npm run build
npm run preview

# Check for build errors
npm run build 2>&1 | tee build.log
```

### 2. Environment Variable Issues

#### For Netlify
1. Go to Site Settings → Environment Variables
2. Add all required variables
3. Redeploy the site

#### For Vercel
1. Go to Project Settings → Environment Variables
2. Add variables for Production environment
3. Redeploy

#### For Other Platforms
- Ensure variables are prefixed with `VITE_`
- Variables must be available at build time
- Check platform-specific documentation

### 3. Supabase Connection Issues

#### Check Supabase Configuration
```javascript
// Add this to your console to debug
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

#### Common Fixes
- Verify Supabase project is active
- Check API keys are correct
- Ensure RLS policies are properly configured
- Test connection in Supabase dashboard

### 4. OAuth Authentication Issues

#### Redirect URL Configuration
1. In Supabase Dashboard → Authentication → URL Configuration
2. Set Site URL to your production domain
3. Add redirect URLs:
   - `https://your-domain.com`
   - `https://your-domain.com/auth/callback`

#### OAuth Provider Setup
**Google OAuth:**
- Authorized domains must include your production domain
- Redirect URI: `https://your-supabase-ref.supabase.co/auth/v1/callback`

**GitHub OAuth:**
- Authorization callback URL must match Supabase callback
- Application URL should be your production domain

### 5. Build and Deployment Fixes

#### Clear Build Cache
```bash
# Clear all caches
rm -rf node_modules
rm -rf dist
rm package-lock.json
npm install
npm run build
```

#### Check Build Output
```bash
# Verify build creates dist folder with files
ls -la dist/
# Should contain: index.html, assets/, etc.
```

#### Test Production Build Locally
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

### 6. Network and CORS Issues

#### Check Network Requests
1. Open browser dev tools
2. Go to Network tab
3. Look for failed requests (red entries)
4. Check if API calls are being blocked

#### CORS Configuration
- Supabase handles CORS automatically
- For custom APIs, ensure CORS headers are set
- Check if requests are going to correct URLs

### 7. Performance Issues

#### Bundle Size Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

#### Code Splitting
- Large dependencies should be code-split
- Check if all imports are necessary
- Use dynamic imports for heavy components

### 8. Database Migration Issues

#### Check Migration Status
1. Go to Supabase Dashboard → Database → Migrations
2. Verify all migrations have been applied
3. Check for any failed migrations

#### Manual Migration
If migrations fail, run them manually:
```sql
-- In Supabase SQL Editor
-- Copy and paste migration content
```

### 9. API Key and Rate Limiting

#### OpenAI Issues
- Check API key is valid and has credits
- Monitor usage in OpenAI dashboard
- Implement rate limiting if needed

#### Gemini Issues
- Verify API key is enabled for Gemini API
- Check quota limits in Google Cloud Console
- Ensure billing is set up if required

### 10. Debugging Tools

#### Enable Debug Mode
```env
VITE_DEBUG=true
```

#### Console Debugging
```javascript
// Add to any component for debugging
console.log('Environment:', import.meta.env);
console.log('Current URL:', window.location.href);
console.log('User Agent:', navigator.userAgent);
```

#### Network Debugging
```javascript
// Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch request:', args);
  return originalFetch.apply(this, args);
};
```

## Step-by-Step Deployment Checklist

### Pre-Deployment
- [ ] Test build locally (`npm run build && npm run preview`)
- [ ] Verify all environment variables are set
- [ ] Check Supabase configuration
- [ ] Test OAuth providers
- [ ] Verify database migrations

### Deployment
- [ ] Set environment variables in hosting platform
- [ ] Configure build settings
- [ ] Set up custom domain (if applicable)
- [ ] Configure redirects for SPA routing

### Post-Deployment
- [ ] Test authentication flow
- [ ] Verify chat functionality
- [ ] Check all pages load correctly
- [ ] Test on different devices/browsers
- [ ] Monitor error logs

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor performance metrics
- [ ] Set up uptime monitoring
- [ ] Configure alerts for critical issues

## Platform-Specific Instructions

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=dist
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Custom Server
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
```

## Emergency Rollback

If deployment fails:

1. **Revert to Previous Version**
   - Use hosting platform's rollback feature
   - Or redeploy previous Git commit

2. **Quick Fix**
   ```bash
   # Revert to last working commit
   git revert HEAD
   git push origin main
   ```

3. **Hotfix Process**
   - Create hotfix branch
   - Make minimal necessary changes
   - Test thoroughly
   - Deploy hotfix

## Getting Help

1. **Check Logs**
   - Hosting platform build logs
   - Browser console errors
   - Supabase logs

2. **Community Resources**
   - Supabase Discord
   - Netlify/Vercel support
   - Stack Overflow

3. **Debug Information to Collect**
   - Error messages (full stack traces)
   - Browser and OS information
   - Network request details
   - Environment configuration (without sensitive data)

Remember: Most deployment issues are related to environment variables or build configuration. Start with these areas when troubleshooting.