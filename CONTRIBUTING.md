# Contributing to Polo Live

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Run linting: `npm run lint`
7. Commit your changes: `git commit -m "Add your message"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a Pull Request

## Code Standards

### JavaScript/React
- Use functional components with hooks
- Follow ESLint rules
- Use meaningful variable and function names
- Keep components small and focused
- Avoid prop drilling (use context when needed)

### File Naming
- Components: PascalCase (e.g., `UserCard.jsx`)
- Utilities: camelCase (e.g., `formatDate.js`)
- Constants: UPPER_SNAKE_CASE in files (e.g., `API_URL`)

### Component Structure
```jsx
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui/button';

// 2. Component
export function MyComponent({ prop1, prop2 }) {
  // 3. State and hooks
  const [state, setState] = useState();
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Styling
- Use Tailwind CSS utility classes
- Use `cn()` helper for conditional classes
- Follow mobile-first approach
- Use theme colors from `index.css`

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- First line should be concise (50 chars or less)
- Reference issues and pull requests when applicable

Examples:
- `feat: Add user authentication`
- `fix: Resolve login redirect issue`
- `docs: Update README with new features`
- `style: Format code with Prettier`
- `refactor: Simplify API error handling`
- `test: Add tests for UserCard component`

## Pull Request Process

1. Update README.md with details of changes if needed
2. Ensure all tests pass and linting is clean
3. Update documentation for any API changes
4. PR will be merged once reviewed by maintainers

## Questions?

Feel free to open an issue for any questions or concerns.
