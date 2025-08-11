# briananderson.xyz

- `site/` — SvelteKit static site with blog + projects, Markdown via mdsvex, dark mode, RSS, sitemap, Decap CMS.
- `auth-proxy/` — Minimal GitHub OAuth proxy for Decap CMS (Cloud Run).

## Quick start
```bash
cd site
pnpm i
pnpm dev
```

## Deploy
Add GitHub repo secrets:
- `GCP_PROJECT_ID`
- `GCP_SA_KEY` (Storage Admin + Cloud Run Admin + Cloud Build Service Account User)
- `GCS_BUCKET`
- `GCP_REGION` (e.g., `us-central1`)
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `AUTH_PROXY_BASE_URL` (e.g., `https://decap-auth.yourdomain.tld`)

# Infra + CI

This bundle gives you:
- Terraform **GCS backend**
- **WIF/OIDC** from GitHub to Google (no long-lived keys)
- GCP infra: **GCS site bucket**, **Artifact Registry**, **Cloud Run** (Decap OAuth proxy), **WIF pool/provider**, **CI service account**
- GitHub Actions for **plan/apply**; (add your SvelteKit site later and use a separate site deploy workflow or keep it here)

## Required GitHub Secrets
- `GCP_PROJECT_ID`, `GCP_REGION`
- `GCP_WIF_PROVIDER` (e.g., projects/NUM/locations/global/workloadIdentityPools/github-pool/providers/github-oidc)
- `GCP_WIF_SA_EMAIL` (CI SA email created by TF; paste after first apply)
- `TF_STATE_BUCKET` (pre-created GCS bucket for Terraform state)
- `SITE_BUCKET_NAME` (e.g., briananderson-xyz-site)
- `AUTH_PROXY_DOMAIN` (e.g., auth.briananderson.xyz)
- `GH_ORG`, `GH_REPO`

## Flow
1) Create the GCS bucket for Terraform state.
2) Set repo secrets above.
3) Open a PR → **plan** runs (WIF, no keys).
4) Merge to main → **apply** builds & pushes the Cloud Run image, then applies infra.
5) Point Cloudflare at GCS as origin with host header `<bucket>.storage.googleapis.com` and set cache rules.

## Terraform deploy (two-phase)

We enable required Google APIs first (Phase 1), then provision all resources (Phase 2). This avoids API-disabled errors during creation of resources like Artifact Registry and Cloud Run.

### Prereqs
- Install: Terraform, gcloud
- Auth: `gcloud auth application-default login`
- Ensure `GOOGLE_PROJECT` is set or provide `-var` values.

### Variables
These are defined in `infra/terraform/variables.tf`.

Required:
- `project_id` (no default)

Common defaults (override as needed):
- `region` (default `us-central1`)
- `bucket_name` (default `briananderson.xyz`)
- `auth_proxy_domain` (default `auth.briananderson.xyz`)
- `github_org`, `github_repo`, `github_branch`

Set via environment or `terraform.tfvars`:

Examples:
```powershell
# PowerShell (Windows)
$env:TF_VAR_project_id = "<PROJECT_ID>"
$env:TF_VAR_region = "us-central1"
$env:TF_VAR_bucket_name = "briananderson.xyz"
```

```bash
# bash
export TF_VAR_project_id=<PROJECT_ID>
export TF_VAR_region=us-central1
export TF_VAR_bucket_name=briananderson.xyz
```

### Phase 0 (once): init
```bash
cd infra/terraform
terraform init
```

### Phase 1: enable required services
Terraform file `infra/terraform/services.tf` manages:
- artifactregistry.googleapis.com
- run.googleapis.com
- iam.googleapis.com
- iamcredentials.googleapis.com
- sts.googleapis.com

Apply only the services first:
```bash
terraform apply -target=google_project_service.required
```

Wait ~1–3 minutes for activation to propagate.

### Phase 2: full apply
```bash
terraform apply
```

### Outputs of interest
- `wif_pool_name`, `wif_provider_name`
- `ci_service_account` (email for GitHub Actions WIF)
- `auth_proxy_url` (Cloud Run service URL)
- `site_bucket` (GCS Website bucket URL)

### Notes
- WIF provider is restricted to `${var.github_org}/${var.github_repo}` on branch `${var.github_branch}` via `attribute_condition` in `main.tf`.
- Cloud Run container image defaults to a placeholder unless `var.auth_proxy_image` is provided.
