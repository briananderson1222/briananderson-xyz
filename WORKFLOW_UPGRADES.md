# Modern Development Workflow

## 1. Testing Setup
```json
// Add to package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui", 
  "test:e2e": "playwright test",
  "lint": "eslint . --ext .js,.svelte,.ts",
  "lint:fix": "eslint . --ext .js,.svelte,.ts --fix",
  "type-check": "svelte-check --tsconfig ./tsconfig.json"
}

"devDependencies": {
  "vitest": "^1.0.0",
  "@testing-library/svelte": "^4.0.0",
  "playwright": "^1.40.0",
  "eslint": "^8.50.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0"
}
```

## 2. Pre-commit Hooks
```bash
# Setup husky
npm install --save-dev husky lint-staged

# package.json
"scripts": {
  "prepare": "husky install",
  "lint-staged": "lint-staged"
}

"lint-staged": {
  "*.{js,svelte,ts}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,md}": [
    "prettier --write"
  ]
}
```

## 3. CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - name: Install deps
        run: pnpm i
      - name: Type check
        run: pnpm type-check
      - name: Lint
        run: pnpm lint
      - name: Test
        run: pnpm test
      - name: E2E Test
        run: pnpm test:e2e
```

## 4. Local Development
```bash
# Docker for consistent dev environment
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]
```

## 5. Performance Budget
```js
// Add to vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/assets/${filename}` };
      }
      return { relative: true };
    }
  }
});
```

## 6. Monitoring & Analytics
```json
"dependencies": {
  "@vercel/analytics": "^1.3.0",
  "@sentry/sveltekit": "^8.0.0",
  "web-vitals": "^3.5.0"
}

// Create src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```