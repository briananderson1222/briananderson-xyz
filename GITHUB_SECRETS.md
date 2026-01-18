# GitHub Secrets Setup Guide

## Required GitHub Secrets

For the UI validation and PostHog integration to work in GitHub Actions, you need to add the following secrets to your GitHub repository:

### 1. PostHog Configuration (Public)

These are `PUBLIC_` environment variables that will be embedded in the build output:

- **`PUBLIC_POSTHOG_KEY`**: Your PostHog project key (starts with `phc_`)
  - Example: `phc_JzGTNvOErubkhQCLSK2Nz1lGOBrq9z7Rc33NjPsfHYT`
  - Find in: PostHog Dashboard → Project Settings → Project API Key
  
- **`PUBLIC_POSTHOG_HOST`**: Your PostHog instance URL
  - Example: `https://us.i.posthog.com` (or `https://app.posthog.com`)
  - Find in: PostHog Dashboard → Project Settings → Application URL

## Adding Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret from the list above

## Important Notes

### Security
- These are `PUBLIC_` environment variables, meaning they are embedded in the client-side JavaScript bundle
- This is **intentional and safe** for PostHog - the project key is meant to be public
- PostHog project keys are safe to expose in frontend code
- **Never** add non-prefixed secrets like `POSTHOG_KEY` (without PUBLIC_) - those would be server-only

### Static Site Architecture
- Your site is **static** (GCP bucket + Cloudflare)
- No server-side code runs, so server-side PostHog tracking is not needed
- Only `posthog-js` (client-side) is required
- `posthog-node` package has been removed

### Build Process
- GitHub Actions builds the site using these secrets
- The secrets are embedded in `build/_app/env.js`
- The built static files are then deployed to GCP bucket
- Cloudflare serves these files to users

## Workflow Triggers

The following workflows will use these secrets:

1. **Validate UI** (`validate-ui.yml`) - Runs on push/PR
2. **Deploy Site (Static Only)** (`deploy-static.yml`) - Runs on push to main

Both workflows will fail if secrets are not configured.

## Testing Locally

For local development, these are already configured in `site/.env`:

```
PUBLIC_POSTHOG_KEY=phc_JzGTNvOErubkhQCLSK2Nz1lGOBrq9z7Rc33NjPsfHYT
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The `.env` file is gitignored and won't be committed.

## Verification

After adding secrets, push to `main` branch and verify:
1. GitHub Actions workflows run successfully
2. UI validation passes
3. PostHog validation passes
4. Site deploys to production

## Additional Secrets for Other Workflows

### Deploy (Site + Auth Proxy) - DISABLED
This workflow is currently disabled and won't run unless manually triggered with `enable_auth_proxy` input.
If you enable it later, you'll need additional secrets for GCP authentication.

### Terraform Workflows - DISABLED
These workflows are currently disabled and won't run unless manually triggered.
If you enable them later, you'll need additional secrets for Terraform state and GCP authentication.
