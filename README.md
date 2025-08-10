# briananderson.xyz — Everything Bundle (Stable)

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
