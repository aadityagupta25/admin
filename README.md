# Polo Live Admin Dashboard

A modern, production-ready admin dashboard built with React, Vite, and shadcn/ui.

## 🚀 Features

- ⚡️ **Vite** - Lightning-fast development and optimized builds
- ⚛️ **React 19** - Latest React features
- 🎨 **Tailwind CSS v4** - Modern CSS-first configuration
- 🧩 **shadcn/ui** - Beautiful, accessible UI components
- 🔐 **Authentication** - Secure auth with token refresh
- 📱 **Responsive** - Mobile-first design
- 🌙 **Dark Mode** - Theme support with next-themes
- 📊 **Charts** - Data visualization with Recharts
- 🎯 **TypeScript Ready** - Easy migration path to TypeScript
- 🔄 **API Integration** - Axios with interceptors
- 📁 **File Upload** - Drag & drop file uploads
- 🧪 **Production Ready** - Error boundaries, loading states, and optimizations

## 📦 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Handling**: Day.js
- **Charts**: Recharts
- **File Upload**: React Dropzone

## 🛠️ Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd Polo_Live

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 📝 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Polo Live
VITE_APP_VERSION=1.0.0
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/         # Shared components (ErrorBoundary, Loading, etc.)
│   ├── layout/         # Layout components (Navbar, Sidebar, etc.)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and constants
├── pages/              # Page components
├── routes/             # Route configuration
├── services/           # API services
└── main.jsx            # App entry point
```

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors

# Analysis
npm run build:analyze    # Build with bundle analysis
```

## 📚 Component Usage

### Button Component

```jsx
import { Button } from '@/components/ui/button';

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button size="lg">Large Button</Button>
```

### Card Component

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Custom Hooks

```jsx
import { useLocalStorage, useDebounce, useMediaQuery } from '@/hooks';

// Local storage
const [value, setValue] = useLocalStorage('key', 'default');

// Debounce
const debouncedValue = useDebounce(searchTerm, 500);

// Media queries
const isMobile = useMediaQuery('(max-width: 768px)');
```

## 🔒 Authentication

The app includes a production-ready authentication system with:
- Token-based auth
- Automatic token refresh
- Protected routes
- Persistent login state

## 🎨 Theming

Customize colors in `src/index.css`:

```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  /* ... more colors */
}
```

## 📱 Responsive Design

All components are mobile-first and fully responsive. Use the provided hooks for responsive behavior:

```jsx
import { useIsMobile, useIsTablet } from '@/hooks';

const isMobile = useIsMobile();
```

## 🧪 Production Build

```bash
# Build for production
npm run build

# The build output will be in the `dist` directory
# Deploy the contents of `dist` to your hosting provider
```

## 📄 License

MIT

## 👨‍💻 Author

Your Name / Your Team

---

**Built with ❤️ using React + Vite + shadcn/ui**
