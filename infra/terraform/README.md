# GCP Infra (Terraform + GCS backend + WIF)

Creates:
- GCS bucket (public objects) for static site hosting via CDN
- Artifact Registry (Docker) for auth proxy image
- Cloud Run service (Decap OAuth proxy)
- Workload Identity Federation (GitHub OIDC) + CI service account + IAM

## Backend
Initialize Terraform with GCS backend:
```bash
terraform init   -backend-config="bucket=$TF_STATE_BUCKET"   -backend-config="prefix=gcp/infra"
```

## Plan / Apply
```bash
terraform plan   -var="project_id=$GCP_PROJECT_ID"   -var="region=$GCP_REGION"   -var="bucket_name=$SITE_BUCKET_NAME"   -var="auth_proxy_domain=$AUTH_PROXY_DOMAIN"   -var="github_org=$GH_ORG"   -var="github_repo=$GH_REPO"

terraform apply -auto-approve   -var="project_id=$GCP_PROJECT_ID"   -var="region=$GCP_REGION"   -var="bucket_name=$SITE_BUCKET_NAME"   -var="auth_proxy_domain=$AUTH_PROXY_DOMAIN"   -var="github_org=$GH_ORG"   -var="github_repo=$GH_REPO"   -var="auth_proxy_image=$IMAGE # from CI build"
```
