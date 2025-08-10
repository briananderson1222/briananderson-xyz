# Decap CMS GitHub OAuth Proxy (Cloud Run)

Env vars:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `BASE_URL` — public HTTPS URL of this service (e.g., `https://auth.briananderson.xyz`)

Deploy:
```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/decap-auth-proxy
gcloud run deploy decap-auth-proxy   --image gcr.io/$PROJECT_ID/decap-auth-proxy   --platform managed   --region us-central1   --allow-unauthenticated   --set-env-vars GITHUB_CLIENT_ID=xxx,GITHUB_CLIENT_SECRET=yyy,BASE_URL=https://YOUR_URL
```
