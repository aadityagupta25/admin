# Quick Checklist - API Integration Verification

## ✅ Changes Made
- [x] `vite.config.js` - Proxy configured for `/api`
- [x] `src/lib/constants.js` - Smart API_URL (dev=`/api`, prod=backend URL)
- [x] `src/services/api.js` - Logging added
- [x] `src/services/userService.js` - Logging added  
- [x] `src/pages/users/Users.jsx` - Logging added
- [x] `.env.local` - Created with VITE_API_URL=/api
- [x] `.env.production` - Updated with backend URL
- [x] Dev server restarted

## 🔍 Test These Now

### Test 1: Console Logs
- [ ] Open http://localhost:5173/users
- [ ] Open DevTools (F12) → Console tab
- [ ] Look for `[API Config]` log showing `API_URL: /api`
- [ ] Look for `[Users Page] Fetching users...` log
- [ ] Look for `[UserService]` logs
- **✅ If all visible:** API code is executing
- **❌ If missing:** Component not loading or error before API call

### Test 2: Network Requests
- [ ] Same page, switch to Network tab
- [ ] You should see request to `http://localhost:5173/api/users`
- [ ] Click on the request
- [ ] Check Status (should be 200 or similar, not 404/500)
- [ ] Check Response tab (should see JSON with user data)
- **✅ If 200 status:** Backend is responding
- **❌ If 404:** Proxy not working or endpoint doesn't exist
- **❌ If 500:** Backend error
- **❌ If request missing:** Axios not making request

### Test 3: Data Display
- [ ] Check if table shows any rows
- [ ] Look for user data in Response tab
- [ ] Check if console shows `[UserService] Response:` with data
- **✅ If table has rows:** Everything working!
- **❌ If still empty:** Data received but not rendering

## 📋 Troubleshooting Tree

```
START
├─ Are you at http://localhost:5173/users?
│  ├─ NO  → Navigate there
│  └─ YES → Continue
│
├─ Any JavaScript errors in Console?
│  ├─ YES → Fix the error shown
│  └─ NO  → Continue
│
├─ Do you see [API Config] log?
│  ├─ NO  → Hard refresh (Ctrl+Shift+R), restart dev server
│  └─ YES → Continue
│
├─ Do you see [Users Page] Fetching users... log?
│  ├─ NO  → useEffect not running, check for errors
│  └─ YES → Continue
│
├─ Do you see [UserService] logs?
│  ├─ NO  → userService.getAll() not called
│  └─ YES → Continue
│
├─ Do you see request in Network tab?
│  ├─ NO  → Axios not making request, check api.js
│  └─ YES → Continue
│
├─ Is Network request status 200?
│  ├─ NO (404/500)  → Backend/proxy issue
│  ├─ YES → Continue
│  └─ PENDING → Request still loading
│
├─ Does Response tab show user data?
│  ├─ NO  → Endpoint wrong or backend not returning data
│  └─ YES → Continue
│
├─ Do you see [UserService] Response: log?
│  ├─ NO  → Response interceptor issue
│  └─ YES → Continue
│
└─ Do you see data in Console?
   ├─ NO  → Check response format
   └─ YES → Continue
   
   └─ Does table show users?
      ├─ YES → ✅ SUCCESS!
      └─ NO  → Data received but UI not updating
```

## 🚨 Common Error Fixes

### Error: "Failed to fetch users"
1. [ ] Check Network tab - do you see the request?
2. [ ] Check request Status - is it an error code?
3. [ ] Check Response - what error message?
4. [ ] Check backend is running: `ping 31.97.62.250`

### Error: "Cannot GET /api/users"
1. [ ] Proxy not working
2. [ ] Restart dev server: Stop and run `npm run dev`
3. [ ] Check `vite.config.js` proxy section exists
4. [ ] Hard refresh browser (Ctrl+Shift+R)

### Error: "Network Error"
1. [ ] Backend not accessible
2. [ ] Try: `curl http://31.97.62.250:3000/api/users`
3. [ ] Check backend is running
4. [ ] Check firewall isn't blocking

### Table Shows "No results" But Logs Show Success
1. [ ] Response format wrong - check API response structure
2. [ ] Check if `response.success` is true
3. [ ] Check if `response.data` is an array
4. [ ] Add more console logs to see actual data

## 📸 Screenshots to Share

If still stuck, share screenshots of:

1. **Console Tab** showing:
   - All [API Config], [Users Page], [UserService] logs
   - Any error messages
   - What the actual logs say

2. **Network Tab** showing:
   - If `/api/users` request exists
   - Status code of request
   - Response body (user data)

3. **Table** showing:
   - "No results" or actual data
   - Any error messages above table

## ✅ Success Indicators

You'll know it's working when:
- [ ] Console shows `[API Config] API_URL: /api`
- [ ] Console shows `[Users Page] Fetching users...`
- [ ] Network shows request to `http://localhost:5173/api/users` with status 200
- [ ] Response contains JSON array of users
- [ ] Console shows `[UserService] Response:` with user data
- [ ] Table displays list of users with columns

## 🎯 Final Test

Once working:
1. Click "Refresh" button
2. Should reload users
3. Try clicking on a user row
4. Should show details modal
5. Try clicking "Deactivate" button
6. Should update user status via API
7. Try clicking "Delete" button
8. Should delete user from table

If all above work → **Full API Integration is Complete! ✅**
