#!/bin/bash

# Minimal required secrets for Terraform workflows
echo "Setting up minimal GitHub secrets..."

# Only these are required (others have defaults in variables.tf)
gh secret set GCP_PROJECT_ID --body "your-gcp-project-id"
gh secret set TF_STATE_BUCKET --body "your-terraform-state-bucket"

# These are needed for WIF authentication (set after terraform creates them)
gh secret set GCP_WIF_PROVIDER --body "projects/PROJECT_NUM/locations/global/workloadIdentityPools/github-pool/providers/github-oidc"
gh secret set GCP_WIF_SA_EMAIL --body "github-ci-deployer@your-project.iam.gserviceaccount.com"

# Optional overrides (have defaults)
# gh secret set GCP_REGION --body "us-central1"
# gh secret set GH_ORG --body "briananderson-xyz" 
# gh secret set GH_REPO --body "briananderson-xyz"
# gh secret set SITE_BUCKET_NAME --body "briananderson.xyz"

echo "Minimal secrets set! Verify with: gh secret list"
