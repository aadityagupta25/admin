# CSP & API Proxy Configuration Fix

## Problem
The app was blocked by Content Security Policy (CSP) when trying to make requests to the external API endpoint `http://31.97.62.250:3000/api/users`. The error was:

```
Connecting to 'http://31.97.62.250:3000/api/users' violates the following 
Content Security Policy directive: "connect-src 'self' https://aadiicart-backend.onrender.com https:"
```

This happened because the CSP's `connect-src` directive only allows same-origin requests ('self') and specific whitelisted domains.

## Solution

### 1. Dev Server Proxy Configuration
Updated `vite.config.js` to proxy `/api` requests to the backend:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://31.97.62.250:3000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

**How it works:**
- Browser makes request to `http://localhost:5173/api/users` (same-origin, allowed by CSP)
- Vite dev server intercepts and proxies it to `http://31.97.62.250:3000/api/users`
- Backend response is returned to browser
- No CSP violations!

### 2. API URL Configuration
Changed `src/lib/constants.js`:

**Before:**
```javascript
export const API_URL = "http://31.97.62.250:3000/api"
```

**After:**
```javascript
export const API_URL = import.meta.env.VITE_API_URL || '/api'
```

**Environment files:**

`.env.local` (development):
```
VITE_API_URL=/api
```

`.env.production` (production build):
```
VITE_API_URL=http://31.97.62.250:3000/api
```

### 3. Image URL Handling
Created helper function `getFullImageUrl()` in `src/lib/utils.js` to handle image URLs correctly in both dev and prod:

```javascript
export function getFullImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  
  if (apiUrl.startsWith('http')) {
    // Production: remove /api suffix and append image path
    const baseUrl = apiUrl.replace(/\/api$/, '');
    return `${baseUrl}${imagePath}`;
  } else {
    // Development: use relative path (proxy will handle it)
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }
}
```

Updated both `src/pages/users/Users.jsx` and `src/pages/gifts/GiftCatalog.jsx` to use this helper instead of inline logic.

## Files Modified
- `vite.config.js` - Added proxy configuration
- `src/lib/constants.js` - Changed API_URL to use environment variable
- `src/lib/utils.js` - Added `getFullImageUrl()` helper
- `.env.local` - Created with VITE_API_URL=/api
- `.env.production` - Updated with correct production API URL
- `src/pages/users/Users.jsx` - Use new image URL helper
- `src/pages/gifts/GiftCatalog.jsx` - Use new image URL helper

## Testing

### Development (localhost:5173)
1. API requests go through proxy: `localhost:5173/api/*` → `http://31.97.62.250:3000/api/*`
2. Images: relative paths like `/uploads/users/profile.png` work via proxy
3. No CSP violations

### Production Build
1. Set `VITE_API_URL=http://31.97.62.250:3000/api` in production environment
2. API requests go directly to backend (no proxy)
3. Images: full URLs constructed correctly using `getFullImageUrl()`

## How to Deploy

### Development
```bash
npm run dev
# App runs on http://localhost:5173 with proxy enabled
```

### Production Build
```bash
npm run build
# Creates optimized build in dist/
# Ensure server environment has VITE_API_URL set, or it will default to /api
```

### Production Deployment Options

**Option 1: Using same host (Recommended)**
Deploy to a server and configure it to:
- Serve static files from `dist/`
- Proxy `/api/*` to `http://31.97.62.250:3000/api/*`
- This way, no CSP issues and no need for VITE_API_URL

**Option 2: Using different host**
- Build with `VITE_API_URL=http://31.97.62.250:3000/api`
- May face CSP issues on different domains
- Backend may need CORS headers configured

## Browser Network Flow

### Development
```
Browser Request: GET http://localhost:5173/api/users
         ↓
    Vite Dev Server (proxy)
         ↓
Backend: http://31.97.62.250:3000/api/users
```

### Production (with proxy)
```
Browser Request: GET https://yourapp.com/api/users
         ↓
    Web Server (nginx/apache proxy)
         ↓
Backend: http://31.97.62.250:3000/api/users
```

## Troubleshooting

### Still seeing API errors?
1. **Dev server restart required**: After changing env files, restart `npm run dev`
2. **Browser cache**: Clear localStorage and browser cache
3. **Network tab**: Check DevTools Network tab to see actual requests

### CORS errors?
- If seeing CORS errors in production, backend may need:
```javascript
res.header('Access-Control-Allow-Origin', 'https://yourapp.com');
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
```

### Images not loading?
- Check browser console for full image URL being requested
- Verify `getFullImageUrl()` is being used for all image paths
- Check that image paths from API start with `/uploads/`

## Environment Setup Summary

| Environment | VITE_API_URL | Request Path | Actual Target |
|------------|-------------|-------------|---------------|
| Dev | `/api` | `http://localhost:5173/api/users` | `http://31.97.62.250:3000/api/users` (via proxy) |
| Prod (proxy) | `/api` | `https://yourapp.com/api/users` | `http://31.97.62.250:3000/api/users` (web server proxy) |
| Prod (direct) | `http://31.97.62.250:3000/api` | Direct to backend | `http://31.97.62.250:3000/api/users` |

**Recommended:** Use proxy setup for both dev and prod to avoid CSP issues.
