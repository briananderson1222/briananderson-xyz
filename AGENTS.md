# Agents Notes

This file contains notes for AI agents working on this repository.

## Site Development

The SvelteKit site is located in the `site/` directory.

### Building and Previewing

To build the site:
```bash
cd site
npm run build
```

To preview the site locally:
```bash
cd site
npm run preview -- --host
```

**Important:** Always use the `--host` flag when running the preview server to ensure it's accessible via Tailscale URLs (e.g., `http://brian-media.tailcfcb40.ts.net:4173/`).

When making changes to the site:
1. Stop any running preview server: `pkill -f "vite preview"`
2. Build the site: `cd site && npm run build`
3. Start preview with host flag: `cd site && npm run preview -- --host &`

**Note:** You may see a warning: `Cannot find base config file "./.svelte-kit/tsconfig.json"`. This is expected and harmless - the `.svelte-kit` directory is generated during the build process and is listed in `.gitignore`.

### Key Files

- `site/content/resume.yaml` - Resume data source (name, title, tagline, mission, summary, skills, experience, etc.)
- `site/src/routes/+page.svelte` - Home page
- `site/src/routes/resume/+page.svelte` - Resume page
- `site/src/lib/types.ts` - TypeScript type definitions

### Type Definitions

When adding new fields to `resume.yaml`, update the `Resume` interface in `site/src/lib/types.ts` to avoid TypeScript errors.

## Deployment Pipeline

The site uses a dev → prod deployment pipeline with artifact promotion. See [DEPLOYMENT_PIPELINE.md](../DEPLOYMENT_PIPELINE.md) for complete setup and usage documentation.

### Quick Overview

- **Push to main:** Auto-build → Auto-deploy to dev → Run E2E tests
- **Manual workflow dispatch:** Deploy to prod (requires approval) → Run E2E tests
- **Automatic rollback:** If prod tests fail, rollback to last successful deployment
- **Manual rollback:** On-demand rollback to any previous successful deployment
- **Artifact retention:** 30 days

### Running E2E Tests Locally

```bash
cd site
pnpm build
pnpm preview -- --host
# In another terminal:
npx playwright test --base-url=http://localhost:4173
```

### Key Deployment Commands

```bash
# Deploy to dev (automatic on push to main)
git push origin main

# Deploy to prod (manual via GitHub UI)
# 1. Go to Actions → Build and Deploy workflow
# 2. Click "Run workflow"
# 3. Check "deploy_prod" checkbox
# 4. Approve when prompted

# Rollback (manual via GitHub UI)
# 1. Go to Actions → Build and Deploy workflow
# 2. Click "Run workflow"
# 3. Check "rollback" checkbox
# 4. Select "target_env" (dev or prod)
```

### Important Notes

- Use `pnpm` instead of `npm` (installed globally)
- Always run `pnpm i` if you see package warnings
- E2E tests use Playwright (Chromium browser)
- PostHog tracks `deployment_environment` property to distinguish dev vs prod traffic
