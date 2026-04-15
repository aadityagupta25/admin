# API Integration Debugging Guide

## What Changed
1. ✅ **API_URL Logic** — Now automatically uses `/api` in dev mode (Vite will proxy it)
2. ✅ **Console Logging** — Added detailed logs at every step
3. ✅ **Vite Proxy** — Configured to forward `/api` requests to backend
4. ✅ **Env Files** — `.env.local` sets up dev environment

## How to Test

### Step 1: Open Browser DevTools
1. Open http://localhost:5173/users
2. Press `F12` or `Ctrl+Shift+I` to open DevTools
3. Go to **Console** tab

### Step 2: Look for These Logs
You should see logs in this order:

```
[API Config] Environment: DEV API_URL: /api
API_URL from constants: /api
import.meta.env.VITE_API_URL: /api
[Users Page] Fetching users...
[UserService] Getting all users...
[UserService] Request URL: /users
```

### Step 3: Check Network Tab
1. Go to **Network** tab in DevTools
2. Look for requests to `http://localhost:5173/api/users`
3. Should show:
   - Status: 200 (OK) or whatever backend returns
   - Response: JSON with user data

### Step 4: If Network Shows Requests
Then check **Console** for any errors. You should see:
```
[UserService] Response: {success: true, count: 12, data: [...]}
[Users Page] Response received: {success: true, count: 12, data: [...]}
```

### Step 5: If No Network Requests
It means fetchUsers() is not being called. Check:
1. Are there any JavaScript errors in Console?
2. Is the component mounting (check if "Fetching users..." log appears)?
3. Try clicking the "Refresh" button manually

## Common Issues & Fixes

### Issue: No logs appearing at all
**Solution:** 
- Hard refresh: `Ctrl+Shift+R` (clear cache)
- Restart dev server: Stop and run `npm run dev` again
- Check dev server terminal for HMR updates

### Issue: Logs show but no Network requests
**Solution:**
- Check for JavaScript errors in Console
- Verify API_URL is `/api` (not `/api/` with trailing slash)
- Check that axios is properly configured

### Issue: Network shows 404 error
**Solution:**
- The proxy is working but backend doesn't have `/api/users` endpoint
- Verify backend is running at `http://31.97.62.250:3000`
- Try: `curl http://31.97.62.250:3000/api/users`

### Issue: Network shows CORS error
**Solution:**
- This shouldn't happen in dev with proxy
- Try hard refresh and restart dev server
- Check that proxy configuration in `vite.config.js` is correct

### Issue: Shows error "Cannot POST to /api/users" or similar
**Solution:**
- Check that the backend method is POST for create
- Verify request body is correctly formatted
- Check auth token is being sent

## Files with Logging

### 1. `src/lib/constants.js`
Logs:
```
[API Config] Environment: DEV API_URL: /api
```

### 2. `src/services/api.js`
Logs:
```
API_URL from constants: /api
import.meta.env.VITE_API_URL: /api
```

### 3. `src/services/userService.js`
Logs:
```
[UserService] Getting all users...
[UserService] Request URL: /users
[UserService] Response: {...}
```

### 4. `src/pages/users/Users.jsx`
Logs:
```
[Users Page] Fetching users...
[Users Page] Response received: {...}
```

## Quick Test Commands

### Test if backend is accessible
```powershell
curl http://31.97.62.250:3000/api/users
```

### Test if dev server proxy works
```powershell
curl http://localhost:5173/api/users
```

### Restart dev server
```powershell
npm run dev
```

## Expected Flow

```
User opens /users page
       ↓
useEffect calls fetchUsers()
       ↓
fetchUsers() calls userService.getAll()
       ↓
userService calls apiService.get('/users')
       ↓
axios makes request to: http://localhost:5173/api/users
       ↓
Vite proxy intercepts and forwards to: http://31.97.62.250:3000/api/users
       ↓
Backend responds with user data
       ↓
Response flows back through proxy to browser
       ↓
React state updated with user data
       ↓
Table renders with users
```

## Next Actions

1. **Open browser and check Console tab** for the logs listed above
2. **Share screenshot of Console output** — this will show exactly where it's failing
3. **Check Network tab** — share if you see API requests or not
4. **If requests visible** — share the response (check Status and Response body)

With these logs, we can pinpoint exactly where the issue is!
