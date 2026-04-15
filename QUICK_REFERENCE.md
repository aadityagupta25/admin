# 🚀 Quick Reference Guide

## Project Structure
```
src/
├── components/
│   ├── common/          # ErrorBoundary, Loading, NotFound
│   ├── layout/          # AdminLayout, Navbar, Sidebar
│   └── ui/              # Button, Card, Input, Badge, Alert, Label
├── hooks/               # useAuth, useLocalStorage, useDebounce, useMediaQuery
├── lib/
│   ├── utils.js         # cn(), formatCurrency(), truncate(), etc.
│   └── constants.js     # API_URL, ROUTES, STORAGE_KEYS, etc.
├── pages/               # Dashboard, Users, Banners, Feeds, Party, SoundEffects
├── routes/              # AppRoutes configuration
├── services/
│   └── api.js           # Axios instance with interceptors
└── main.jsx             # Entry point
```

## Common Commands
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Check for errors
npm run lint:fix         # Auto-fix linting issues
```

## Import Shortcuts
```jsx
// UI Components
import { Button, Card, Input, Badge, Alert } from '@/components/ui'

// Common Components
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { LoadingScreen, Spinner } from '@/components/common/Loading'

// Hooks
import { useAuth, useLocalStorage, useDebounce, useIsMobile } from '@/hooks'

// Utils & Constants
import { cn, formatCurrency, truncate } from '@/lib/utils'
import { API_ENDPOINTS, ROUTES, STORAGE_KEYS } from '@/lib/constants'

// API Service
import { apiService } from '@/services/api'
```

## Component Examples

### Button
```jsx
<Button>Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="lg">Large</Button>
<Button variant="ghost" size="icon">🔍</Button>
```

### Card
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Input & Label
```jsx
<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</div>
```

### Badge
```jsx
<Badge>New</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Draft</Badge>
```

### Alert
```jsx
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong!</AlertDescription>
</Alert>
```

## Hooks Examples

### useLocalStorage
```jsx
const [user, setUser] = useLocalStorage('user', null)
setUser({ name: 'John', email: 'john@example.com' })
```

### useDebounce
```jsx
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 500)

useEffect(() => {
  // API call with debouncedSearch
}, [debouncedSearch])
```

### useMediaQuery
```jsx
const isMobile = useIsMobile()
const isTablet = useIsTablet()
const isDesktop = useIsDesktop()

return isMobile ? <MobileView /> : <DesktopView />
```

## API Service Examples

### GET Request
```jsx
const fetchUsers = async () => {
  try {
    const users = await apiService.get('/users')
    console.log(users)
  } catch (error) {
    console.error(error.message)
  }
}
```

### POST Request
```jsx
const createUser = async (userData) => {
  try {
    const newUser = await apiService.post('/users', userData)
    return newUser
  } catch (error) {
    console.error(error.message)
  }
}
```

### File Upload
```jsx
const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    await apiService.upload('/upload', formData, (progress) => {
      console.log(`Upload: ${progress}%`)
    })
  } catch (error) {
    console.error(error.message)
  }
}
```

### File Download
```jsx
const downloadFile = async () => {
  await apiService.download('/files/document.pdf', 'document.pdf')
}
```

## Utility Functions

### cn() - Merge Classes
```jsx
<div className={cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
)} />
```

### formatCurrency()
```jsx
formatCurrency(1999.99)  // "$1,999.99"
formatCurrency(1999.99, 'EUR')  // "€1,999.99"
```

### formatNumber()
```jsx
formatNumber(1000000)  // "1,000,000"
```

### truncate()
```jsx
truncate('Very long text here...', 20)  // "Very long text here..."
```

### getInitials()
```jsx
getInitials('John Doe')  // "JD"
```

### isEmpty()
```jsx
isEmpty('')  // true
isEmpty([])  // true
isEmpty({})  // true
isEmpty(null)  // true
```

## Constants

### API Endpoints
```jsx
import { API_ENDPOINTS } from '@/lib/constants'

apiService.get(API_ENDPOINTS.USERS.LIST)
apiService.get(API_ENDPOINTS.USERS.GET(userId))
apiService.put(API_ENDPOINTS.USERS.UPDATE(userId), data)
```

### Routes
```jsx
import { ROUTES } from '@/lib/constants'
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate(ROUTES.DASHBOARD)
```

### Storage Keys
```jsx
import { STORAGE_KEYS } from '@/lib/constants'

localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
```

## Environment Variables
```jsx
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

## Tailwind CSS Classes

### Colors
```jsx
bg-primary text-primary-foreground
bg-secondary text-secondary-foreground
bg-destructive text-destructive-foreground
bg-muted text-muted-foreground
bg-accent text-accent-foreground
```

### Spacing
```jsx
p-4 px-6 py-2    // padding
m-4 mx-auto      // margin
gap-4 space-y-4  // spacing
```

### Layout
```jsx
flex items-center justify-between
grid grid-cols-3 gap-4
w-full h-screen
```

### Responsive
```jsx
hidden md:block        // Hide on mobile, show on desktop
grid-cols-1 md:grid-cols-3  // 1 col mobile, 3 cols desktop
```

## Common Patterns

### Protected Route
```jsx
import { useAuth } from '@/hooks'
import { Navigate } from 'react-router-dom'

function ProtectedPage() {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return <div>Protected content</div>
}
```

### Form with Validation
```jsx
import { useState } from 'react'
import { Input, Label, Button } from '@/components/ui'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validation and submit
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  )
}
```

### Loading State
```jsx
import { useState, useEffect } from 'react'
import { LoadingScreen } from '@/components/common/Loading'

function DataPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await apiService.get('/data')
      setData(result)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <LoadingScreen />
  
  return <div>{/* Render data */}</div>
}
```

## 🎯 Tips

1. **Always use `@/` imports** for cleaner code
2. **Use `cn()` for conditional classes** instead of template literals
3. **Wrap components in ErrorBoundary** for production safety
4. **Use constants** instead of hardcoded strings
5. **Debounce search inputs** to reduce API calls
6. **Check responsive design** with useMediaQuery hooks
7. **Handle loading states** for better UX
8. **Use environment variables** for API URLs

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Docs](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

**Quick Help**: See `SETUP_COMPLETE.md` for full setup details
