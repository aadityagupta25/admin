# Production Deployment Checklist

## ✅ Pre-Deployment

### Environment Configuration
- [ ] Configure production API URL in `.env.production`
- [ ] Set up proper error tracking service (Sentry, LogRocket, etc.)
- [ ] Configure analytics (Google Analytics, Mixpanel, etc.)
- [ ] Set up monitoring and logging

### Security
- [ ] Ensure all API endpoints use HTTPS
- [ ] Implement rate limiting on API
- [ ] Configure CORS properly
- [ ] Review and remove any console.log statements with sensitive data
- [ ] Enable Content Security Policy (CSP)
- [ ] Set up secure headers

### Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images (use WebP, lazy loading)
- [ ] Review bundle size (`npm run build`)
- [ ] Enable compression on server (gzip/brotli)
- [ ] Configure CDN for static assets
- [ ] Implement service worker for offline support (if needed)

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Fix all ESLint warnings
- [ ] Review all TODO/FIXME comments
- [ ] Remove unused dependencies
- [ ] Update dependencies to latest stable versions

### Testing
- [ ] Test all user flows
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test with different screen sizes
- [ ] Test with slow network connection
- [ ] Test error scenarios and error boundaries

### SEO & Meta Tags
- [ ] Add proper meta tags in `index.html`
- [ ] Configure Open Graph tags
- [ ] Add Twitter Card meta tags
- [ ] Create sitemap.xml
- [ ] Configure robots.txt
- [ ] Add favicon and app icons

## 🚀 Deployment

### Build
```bash
# Clean previous builds
rm -rf dist

# Build for production
npm run build

# Test production build locally
npm run preview
```

### Hosting Options
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3 + CloudFront**: Upload `dist/` folder
- **Firebase Hosting**: `firebase deploy`
- **GitHub Pages**: Deploy `dist/` folder

### Post-Deployment
- [ ] Verify all pages load correctly
- [ ] Test all API integrations
- [ ] Check error tracking is working
- [ ] Verify analytics tracking
- [ ] Test authentication flow
- [ ] Check responsive design on real devices
- [ ] Monitor initial user feedback

## 📊 Monitoring

### Metrics to Track
- [ ] Page load time
- [ ] Time to Interactive (TTI)
- [ ] First Contentful Paint (FCP)
- [ ] Largest Contentful Paint (LCP)
- [ ] Cumulative Layout Shift (CLS)
- [ ] Error rates
- [ ] API response times
- [ ] User engagement metrics

### Tools
- Google Analytics / GA4
- Google Search Console
- Vercel Analytics / Netlify Analytics
- Sentry for error tracking
- Lighthouse CI

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm run preview # Test build
```

## 📝 Documentation

- [ ] Update README.md with production URLs
- [ ] Document API endpoints and authentication
- [ ] Create user documentation
- [ ] Document deployment process
- [ ] Create troubleshooting guide

## 🔐 Backup & Recovery

- [ ] Set up automated backups
- [ ] Document rollback procedure
- [ ] Test disaster recovery plan
- [ ] Keep previous build artifacts

## 🎯 Performance Budget

Target Metrics:
- Bundle size: < 250KB (gzipped)
- First Load: < 3s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

## ⚠️ Common Issues

1. **White screen on deployment**
   - Check browser console for errors
   - Verify base path in vite.config.js
   - Check .env variables are loaded

2. **API calls failing**
   - Verify CORS configuration
   - Check API_URL in production environment
   - Ensure authentication tokens are properly set

3. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify theme variables are loaded

4. **Routing issues**
   - Configure server for SPA routing
   - Add redirect rules for all routes to index.html

---

**Last Updated**: February 9, 2026
