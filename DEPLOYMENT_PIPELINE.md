# Dev → Prod Deployment Pipeline Setup Guide

This document covers the setup and usage of the new dev → prod deployment pipeline.

## Architecture Overview

The pipeline uses **trunk-based development** with artifact promotion:

```
Push to main → Build & Test → Deploy to Dev (auto) → Run E2E Tests
                                                    ↓
                                      If tests pass → Ready for Prod (manual approval)
                                                    ↓
                                      Manual Deploy to Prod → Run E2E Tests → Live
```

### Key Features

1. **Single artifact promotion:** Same build artifact deployed to dev then prod (ensures parity)
2. **Dev auto-deploy:** Every push to `main` automatically deploys to dev
3. **Prod manual approval:** Prod deployment requires explicit approval
4. **E2E testing:** Playwright tests run in both dev and prod
5. **Automatic rollback:** If prod tests fail, auto-rollback to last successful deployment
6. **Manual rollback:** On-demand rollback to any previous successful deployment
7. **30-day artifact retention:** Artifacts kept for 30 days
8. **PostHog environment tracking:** Distinguishes dev vs prod traffic

---

## Prerequisites

### 1. Install Terraform

Choose one of these methods:

**Option A: Using apt (recommended)**
```bash
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt install terraform
```

**Option B: Using mise (if you prefer mise)**
```bash
mise plugins install terraform
mise install terraform latest
```

**Option C: Manual binary download**
```bash
wget https://releases.hashicorp.com/terraform/1.7.5/terraform_1.7.5_linux_amd64.zip
unzip terraform_1.7.5_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

Verify installation:
```bash
terraform --version
```

### 2. Install Google Cloud CLI (gcloud)

```bash
curl https://sdk.cloud.google.com | bash
# Follow prompts to install
exec -l $SHELL
gcloud init
```

### 3. Install Playwright Browsers (sudo required)

```bash
cd site
sudo pnpm exec playwright install --with-deps chromium
```

---

## Step 1: Update Terraform Infrastructure

### 1.1 Import Existing Dev Bucket

The `dev.briananderson.xyz` bucket already exists and needs to be imported into Terraform:

```bash
cd infra/terraform
terraform import google_storage_bucket.site_dev dev.briananderson.xyz
```

### 1.2 Apply Terraform Changes

Terraform has been updated to:
- ✅ Add dev GCS bucket
- ✅ Remove Cloud Run resources (not needed for static site)
- ✅ Remove Artifact Registry (not needed for static site)
- ✅ Update CI IAM roles

Apply the changes:

```bash
cd infra/terraform
terraform init -backend-config="bucket=$TF_STATE_BUCKET" -backend-config="prefix=gcp/infra"
terraform plan
terraform apply
```

---

## Step 2: Create GitHub Environments

### 2.1 Create `dev` Environment

1. Go to: https://github.com/briananderson-xyz/briananderson-xyz/settings/environments
2. Click "New environment"
3. Name: `dev`
4. Environment URL: `https://dev.briananderson.xyz`
5. Protection rules: None (auto-deploy, no approval needed)
6. Click "Save environment"

### 2.2 Create `prod` Environment

1. Go to: https://github.com/briananderson-xyz/briananderson-xyz/settings/environments
2. Click "New environment"
3. Name: `prod`
4. Environment URL: `https://briananderson.xyz`
5. Protection rules:
   - **Required reviewers:** Add your GitHub username
   - **Wait timer:** 0
6. Click "Save environment"

---

## Step 3: Configure DNS for Dev

Add a CNAME record for the dev environment:

| Type | Name | Target | TTL |
|------|------|---------|-----|
| CNAME | dev | c.storage.googleapis.com | 300 |

**Where to configure:** Your DNS provider (Cloudflare, Google Domains, etc.)

---

## Step 4: Configure Branch Protection (Recommended)

To enforce best practices and prevent accidental deployments, configure branch protection:

**Current Protection Settings:**
- Direct push to `main` is blocked (requires pull request)
- Force push to `main` is allowed (for emergency rollbacks)
- Requires 1 approving review before merging
- Admins can bypass these rules

**To update protection rules:**
1. Go to: https://github.com/briananderson-xyz/briananderson-xyz/settings/branches
2. Click "Add rule" or edit existing rule for `main`
3. Configure:
   - Require pull request before merging
   - Require approvals (recommended: 1)
   - Dismiss stale PRs (optional)
   - Allow force pushes (for emergencies)
4. Save changes

**Bypass protection (if needed):**
```bash
git push origin main --force
```

**Note:** As an admin, you can bypass protection rules. For team collaboration, consider requiring all changes to go through PRs for better code review.

---

## Step 4: Deploy to Dev (First Time)

After pushing to `main`, the workflow will:
1. Build the site
2. Run validation tests (lint, typecheck, build, UI validation, PostHog validation)
3. Upload artifact (retained for 30 days)
4. Deploy to `dev.briananderson.xyz`
5. Run E2E tests

Check the deployment:
```bash
open https://dev.briananderson.xyz
```

---

## Step 5: Deploy to Prod (First Time)

### First Production Deployment ⚠️

**Important:** The first prod deployment has special handling for rollback:

1. Go to: https://github.com/briananderson-xyz/briananderson-xyz/actions
2. Select "Build and Deploy" workflow
3. Click "Run workflow"
4. Check "deploy_prod" checkbox
5. Click "Run workflow"
6. **Wait for your approval** (you'll receive a notification)
7. Approve the deployment
8. Deployment runs and executes E2E tests

**If E2E tests fail on first prod deployment:**
- No rollback will occur (no previous successful prod deployment exists)
- You'll see a warning message
- Manual intervention required (either fix the issue or manually deploy via gcloud)

---

## Workflow Usage

### Automatic Dev Deployment

Every push to `main` triggers automatic dev deployment:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

**Workflow automatically:**
1. Builds and tests
2. Deploys to dev
3. Runs E2E tests

### Manual Prod Deployment

1. Go to: https://github.com/briananderson-xyz/briananderson-xyz/actions
2. Click "Build and Deploy" workflow
3. Click "Run workflow"
4. Check "deploy_prod" checkbox
5. Click "Run workflow"
6. Wait for approval
7. Approve when ready

### Manual Rollback

1. Go to: https://github.com/briananderson-xyz/briananderson-xyz/actions
2. Click "Build and Deploy" workflow
3. Click "Run workflow"
4. Check "rollback" checkbox
5. Select "target_env" (dev or prod)
6. Click "Run workflow"
7. Workflow finds last successful deployment and rolls back

---

## Artifacts and Rollback Tracking

### Artifact Retention

- **Retention period:** 30 days
- **Artifact name format:** `build-artifact-{commit-sha}`
- **Download artifacts:** Can download from any workflow run for 30 days

### Rollback Behavior

**Automatic rollback:**
- Triggered when prod E2E tests fail
- Rolls back to **last successful prod deployment**
- Requires at least one previous successful prod deployment
- If first prod deployment fails, manual intervention required

**Manual rollback:**
- Triggered via workflow dispatch
- Can rollback dev or prod
- Always rolls back to last successful deployment for that environment

---

## PostHog Environment Tracking

PostHog now tracks `deployment_environment` property with all events:

- **Dev deployments:** `deployment_environment = "dev"`
- **Prod deployments:** `deployment_environment = "production"`

### PostHog Configuration

The setup in `site/src/routes/+layout.svelte`:

```svelte
if (browser && import.meta.env.PUBLIC_POSTHOG_KEY) {
  posthog.init(
    import.meta.env.PUBLIC_POSTHOG_KEY,
    {
      api_host: import.meta.env.PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: false,  // Manual capture via SvelteKit hooks
      capture_pageleave: false,
      capture_exceptions: true,
      loaded: (ph) => {
        ph.register({
          deployment_environment: import.meta.env.PUBLIC_DEPLOYMENT_ENV || 'unknown'
        });
      }
    }
  );
}
```

### Filter Events by Environment

In PostHog, you can filter by `deployment_environment`:

```
deployment_environment == "dev"        # Dev traffic only
deployment_environment == "production" # Prod traffic only
```

---

## E2E Tests

### Test Location

All E2E tests are in `site/e2e/smoke.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Brian Anderson/);
  });

  test('homepage has name and title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Brian Anderson');
  });

  test('navigation to resume works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Resume');
    await expect(page).toHaveURL(/\/resume/);
  });

  test('resume page loads', async ({ page }) => {
    await page.goto('/resume');
    await expect(page.locator('h1')).toContainText('Brian Anderson');
  });
});
```

### Run E2E Tests Locally

```bash
cd site

# Build the site first
pnpm build

# Start preview server
pnpm preview -- --host

# In another terminal, run tests
pnpm test:e2e

# Or run with custom base URL
npx playwright test --base-url=https://dev.briananderson.xyz
```

---

## Troubleshooting

### Issue: Terraform import fails

**Error:** `Error: google_storage_bucket.site_dev: import of dev.briananderson.xyz into google_storage_bucket.site_dev failed`

**Solution:**
1. Verify the bucket exists: `gsutil ls`
2. Check bucket name matches exactly: `dev.briananderson.xyz`
3. Ensure you have `roles/storage.admin` on the project

### Issue: Playwright browsers fail to install in CI

**Error:** `Failed to install browsers`

**Solution:** This is expected in CI without sudo. The workflow installs browsers with sudo:
```yaml
- name: Install Playwright browsers
  working-directory: site
  run: sudo pnpm exec playwright install --with-deps chromium
```

### Issue: First prod deployment has no rollback target

**Warning:** `⚠️  Smoke tests failed but no previous successful prod deployment found for rollback.`

**Solution:** This is expected for the first prod deployment. Options:
1. Fix the issue and push a new commit
2. Manually deploy via gcloud: `gcloud storage rsync build/ gs://briananderson.xyz/`

### Issue: GitHub CLI authentication in workflow

**Error:** `gh: authentication required`

**Solution:** The workflow uses `GITHUB_TOKEN` which is automatically available. Ensure:
1. Workflow has `permissions: contents: read` (already set)
2. No custom `GH_TOKEN` secret is conflicting

---

## Workflow Files

### New Files

- `.github/workflows/build-and-deploy.yml` - Main deployment pipeline
- `site/e2e/smoke.spec.ts` - E2E test suite
- `site/playwright.config.ts` - Playwright configuration

### Modified Files

- `site/package.json` - Added `@playwright/test` dependency and `test:e2e` script
- `site/src/routes/+layout.svelte` - Added PostHog environment tracking
- `infra/terraform/main.tf` - Added dev bucket, removed Cloud Run/Artifact Registry

### Archived Files

- `.github/workflows/deploy-static.yml.archive` - Old static deployment workflow
- `.github/workflows/deploy.yml.archive` - Old Cloud Run deployment workflow

---

## Next Steps

1. ✅ Install Terraform and gcloud (see Prerequisites above)
2. ✅ Import dev bucket: `terraform import google_storage_bucket.site_dev dev.briananderson.xyz`
3. ✅ Apply Terraform: `terraform plan && terraform apply`
4. ✅ Create GitHub environments (dev and prod)
5. ✅ Configure DNS: `dev.briananderson.xyz` → `c.storage.googleapis.com`
6. ✅ Push to main: Test automatic dev deployment
7. ✅ Deploy to prod: Test manual prod deployment with approval
8. ✅ Verify E2E tests run in both environments
9. ✅ Test rollback (manual and automatic)

---

## Questions?

If you encounter issues:
1. Check workflow run logs: https://github.com/briananderson-xyz/briananderson-xyz/actions
2. Verify GCP permissions: Ensure CI service account has `roles/storage.admin`
3. Check GitHub environment protection: Ensure prod environment has required approvers
4. Verify DNS: Ensure `dev.briananderson.xyz` resolves correctly

For detailed workflow logs, see the specific workflow run page in GitHub Actions.
