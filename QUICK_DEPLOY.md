# Quick Setup for Static Site Deployment

## Required GitHub Secrets

Go to: https://github.com/briananderson1222/briananderson-xyz/settings/secrets/actions

Add these secrets:

1. **GCP_PROJECT_ID**
   ```
   briananderson-xyz-468620
   ```

2. **GCS_BUCKET**
   ```
   briananderson.xyz
   ```

3. **GCP_SA_KEY** (Service account JSON key)

## GCP Setup Steps

### 1. Create GCS Bucket
```bash
gsutil mb gs://briananderson.xyz
```

### 2. Enable Website Configuration
```bash
gsutil web set -m index.html -e 404.html gs://briananderson.xyz
```

### 3. Make Public Readable
```bash
gsutil iam ch allUsers:objectViewer gs://briananderson.xyz
```

### 4. Create Service Account
```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --description="GitHub Actions deploy" \
    --display-name="GitHub Actions"

# Give Storage Admin role
gcloud projects add-iam-policy-binding briananderson-xyz-468620 \
    --member="serviceAccount:github-actions@briananderson-xyz-468620.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Download JSON key
gcloud iam service-accounts keys create ~/github-actions-key.json \
    --iam-account=github-actions@briananderson-xyz-468620.iam.gserviceaccount.com
```

### 5. Copy JSON key content
```bash
cat ~/github-actions-key.json | pbcopy  # macOS
# or manually copy the content
```

Paste the entire JSON as the `GCP_SA_KEY` secret in GitHub.

### 6. Test Deployment
Push to main branch or run the workflow manually from GitHub Actions tab.

## DNS Setup (after successful deploy)

Once deployed, point your domain to the GCS bucket:
- Create CNAME record: `www.briananderson.xyz` → `c.storage.googleapis.com`
- Create A record for root domain with your registrar's DNS settings

Or use Cloudflare for easier setup:
- CNAME: `briananderson.xyz` → `c.storage.googleapis.com` 
- Cloudflare will handle root domain automatically