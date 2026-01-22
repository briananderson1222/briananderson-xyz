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

## Debugging and Self-Debugging Guide

### Overview

This section provides guidance for debugging issues in this repository, particularly for GitHub Actions workflows, CI/CD pipeline, and local development issues.

### Available Debugging Tools

#### 1. GitHub CLI (`gh`)

The `gh` CLI is installed and configured for this repository (`briananderson-xyz/briananderson-xyz`).

**Key Commands for Debugging Workflows:**
```bash
# List recent workflow runs
gh run list --workflow=build-and-deploy.yml --limit=10

# List with details (JSON output)
gh run list --workflow=build-and-deploy.yml --limit=5 --json conclusion,status,displayTitle,databaseId

# View specific run logs
gh run view <run-id> --log

# View specific run with logs and summary
gh run view <run-id>

# Watch a running workflow
gh run watch <run-id>

# List GitHub secrets (to verify they're set)
gh secret list
```

**Common Issues and Solutions:**

**Issue:** "To get started with GitHub CLI, please run: gh auth login"
**Solution:** The current token has the right permissions. To verify:
```bash
gh auth status
# Should show: Logged in to github.com account <username>
```

**Issue:** "failed to get secrets: HTTP 404 Not Found"
**Solution:** Environment name might be wrong. Try:
```bash
gh secret list --env <environment-name>
```

#### 2. Local Development Tools

**PostHog Environment Variables:**
```bash
# Set up local PostHog testing (optional)
cd site

# Create .env file for testing
cat > .env << 'EOF'
PUBLIC_POSTHOG_KEY=your-test-key
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
EOF

# Build with PostHog
pnpm run build
```

**Terraform:**
```bash
# Terraform is installed via mise
~/.local/share/mise/installs/terraform/1.14.3/bin/terraform --version

# Initialize Terraform (after fixing ADC)
cd infra/terraform
terraform init

# Plan changes
terraform plan

# Import resources (e.g., existing GCS bucket)
terraform import google_storage_bucket.site_dev dev.briananderson.xyz
```

#### 3. Build and Test Locally

**Full validation pipeline:**
```bash
cd site

# Run all validations
pnpm run validate
```

**Individual components:**
```bash
# TypeScript check
pnpm run check

# Build only
pnpm run build

# UI validation
pnpm run test:ui

# PostHog validation (needs PostHog secrets)
pnpm run test:posthog
```

#### 4. GitHub Actions Workflow Debugging

**Check Workflow Syntax:**
```bash
# Validate YAML syntax
cat .github/workflows/build-and-deploy.yml

# Or use yamllint if installed
yamllint .github/workflows/*.yml
```

**Test Workflow Locally (if possible):**
```bash
# You can test build step locally
cd site
pnpm run validate

# You cannot test deployment steps locally (require GCP access)
```

**Analyze Failed Workflow Runs:**

When a workflow fails, use this process:

1. **Get run ID:** From GitHub UI or `gh run list`
2. **View logs:** `gh run view <run-id> --log`
3. **Search for errors:** `gh run view <run-id> --log | grep -i error\|fail\|Error`
4. **Identify the failing step:** Note the job name and step that failed
5. **Check recent commits:** See if a recent change broke the workflow

**Common Workflow Issues:**

**Issue:** "unknown option '--base-url=https://dev.briananderson.xyz'"
**Solution:** Use environment variable with proper syntax:
```yaml
env:
  BASE_URL: https://dev.briananderson.xyz
run: |
  npx playwright test --base-url=$BASE_URL
```

**Issue:** "secrets not found" or "not configured"
**Solution:** Check that secrets are set in GitHub repository settings:
- Go to: https://github.com/briananderson-xyz/briananderson-xyz/settings/secrets/actions
- Verify both `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` are present
- Check which environment they're set for (usually `production` environment for this repo)

**Issue:** Playwright installation fails with "sudo: command not found"
**Solution:** Already fixed in workflow - using `npx playwright install chromium` without sudo

#### 5. Environment Secrets Management

**How secrets are used in workflows:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      PUBLIC_POSTHOG_KEY: ${{ secrets.PUBLIC_POSTHOG_KEY }}
      PUBLIC_POSTHOG_HOST: ${{ secrets.PUBLIC_POSTHOG_HOST }}
    steps:
      - name: Build
        env:
          PUBLIC_DEPLOYMENT_ENV: dev
        run: pnpm run build
```

**Adding secrets via gh CLI:**
```bash
# Add a single secret
echo "your-secret-value" | gh secret set SECRET_NAME --body

# Verify it was added
gh secret list
```

**Important:** Never commit actual secrets to the repository. All secrets in this repo are already public (PostHog keys) or placeholder values.

#### 6. Terraform Debugging

**Common Terraform Issues:**

**Issue:** "storage.buckets.list access denied"
**Solution:** Your GCP account needs `roles/storage.objectViewer` or higher. Ask GCP admin or use a service account.

**Issue:** "could not find default credentials"
**Solution:** Set up Application Default Credentials:
```bash
# Interactive (recommended)
gcloud auth application-default login

# Or use service account key
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

**Terraform State Management:**
```bash
# Initialize with GCS backend (for production)
terraform init -backend-config="bucket=briananderson-xyz-tfstate" -backend-config="prefix=gcp/infra"

# Import existing resources
terraform import google_storage_bucket.site_dev dev.briananderson.xyz

# Plan before applying
terraform plan

# Apply changes
terraform apply
```

#### 7. Self-Debugging Checklist

Before asking for help, try these steps:

**For Workflow Issues:**
- [ ] Checked recent workflow run logs for the specific error
- [ ] Verified the error message and which step failed
- [ ] Checked if secrets are properly set in GitHub UI
- [ ] Verified workflow YAML syntax
- [ ] Checked if recent code changes could have caused the issue

**For Build/Test Issues:**
- [ ] Ran `pnpm run validate` locally to see if it passes
- [ ] Checked if all dependencies are installed (`pnpm i`)
- [ ] Verified TypeScript errors in terminal
- [ ] Checked build output for errors

**For Deployment Issues:**
- [ ] Verified GCP authentication (`gcloud auth status`)
- [ ] Checked GCP project is correct (`gcloud config list`)
- [ ] Verified GCS bucket exists and is accessible
- [ ] Verified Terraform state is up to date
- [ ] Checked if dev/prod domains are properly configured

**For Secret Issues:**
- [ ] Verified secrets exist in GitHub repository settings
- [ ] Checked which environment they're set for
- [ ] Tried adding secrets via `gh secret set` if needed
- [ ] Verified secrets with `gh secret list`

#### 8. Quick Reference Commands

```bash
# GitHub Actions - Workflow management
gh run list --workflow=build-and-deploy.yml --limit=10
gh run view <run-id> --log
gh workflow run build-and-deploy.yml --ref main

# GitHub Actions - Secrets
gh secret list
gh secret delete <secret-name>

# GCP - Authentication
gcloud auth status
gcloud auth list
gcloud auth application-default login

# GCP - Operations
gcloud storage ls
gcloud storage buckets list
gcloud config list

# Site development
cd site && pnpm run validate
cd site && pnpm run build
cd site && pnpm preview -- --host

# Git operations
git status
git diff
git log --oneline -10
```

### Common Error Messages and Solutions

| Error | Solution |
|--------|----------|
| "PUBLIC_POSTHOG_KEY not configured" | Add `PUBLIC_POSTHOG_KEY` secret in GitHub Actions settings |
| "gcloud: command not found" | Run `source ~/.bashrc` or log out and back in |
| "terraform: could not find default credentials" | Run `gcloud auth application-default login` |
| "gh: authentication required" | Run `gh auth login` (you may need a new token with proper scopes) |
| "permission denied" | Check GCP IAM roles and permissions |
| "Workflow syntax error" | Check YAML indentation and quote usage |
| "Artifact not found" | Verify artifact name matches upload name |
| "playwright: command not found" | Ensure Playwright is installed in package.json |

### Debugging Workflow for Complex Issues

**Step 1: Identify the scope**
- Is this a workflow issue? (GitHub Actions)
- Is this a build issue? (local compilation/validation)
- Is this a deployment issue? (GCP, Terraform, DNS)
- Is this a runtime issue? (PostHog, tracking)

**Step 2: Gather relevant logs**
```bash
# Get recent workflow runs with context
gh run list --workflow=build-and-deploy.yml --limit=5 --json conclusion,status,displayTitle,databaseId,name,createdAt

# View logs for a specific run
gh run view <run-id> --log | grep -A 10 -B 5 "error\|fail\|Error"
```

**Step 3: Isolate the issue**
- Try to reproduce locally (if possible)
- Comment out problematic steps temporarily
- Add debug output (`echo` or `gh run view`) to understand what's happening
- Use `set -x` in bash scripts to trace execution

**Step 4: Test the fix**
- Make one change at a time
- Run workflow again after each change
- Verify the fix addresses the issue without introducing new problems

**Step 5: Document the solution**
- Add a comment in the workflow explaining the fix
- Update AGENTS.md with lessons learned
- Consider adding a test to prevent regression

### When to Ask for Help

**Use this debugging guide first** before asking for help. Try the following:

1. Run the relevant command from this guide
2. Check the output/error message
3. Consult the "Common Error Messages and Solutions" table
4. Try the suggested fix

**Still stuck?** Provide this information when asking:

1. What command or operation are you trying?
2. What is the exact error message (copy-paste it)?
3. What steps have you already tried?
4. What does the relevant section of this guide say?
5. Any additional context that might help?

This helps in providing efficient, targeted assistance.
