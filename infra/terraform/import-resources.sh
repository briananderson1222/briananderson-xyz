#!/bin/bash
# Import existing GCP resources into Terraform
# Run from infra/terraform directory

set -e

echo "=== Importing existing resources into Terraform ==="
echo ""

# 1. Import dev GCS bucket public read binding
echo "1/8: Importing dev bucket public read binding..."
terraform import google_storage_bucket_iam_binding.public_read_dev dev.briananderson.xyz roles/storage.objectViewer allUsers

# 2. Import artifact registry repository
echo "2/8: Importing artifact registry repository..."
terraform import google_artifact_registry_repository.containers projects/briananderson-xyz-468620/locations/us-central1/repositories/containers

# 3. Import Cloud Run v2 service
echo "3/8: Importing Cloud Run service..."
terraform import google_cloud_run_v2_service.auth_proxy projects/briananderson-xyz-468620/locations/us-central1/services/decap-auth-proxy

# 4. Import Cloud Run v2 service IAM binding
echo "4/8: Importing Cloud Run service IAM binding..."
terraform import google_cloud_run_v2_service_iam_member.auth_proxy_invoker projects/briananderson-xyz-468620/locations/us-central1/services/decap-auth-proxy/roles/run.invoker/allUsers

# 5. Import auth proxy service account
echo "5/8: Importing auth proxy service account..."
terraform import google_service_account.auth_proxy projects/briananderson-xyz-468620/serviceAccounts/decap-auth-proxy

# 6. Import artifact registry writer IAM binding
echo "6/8: Importing artifact registry writer IAM binding..."
terraform import google_project_iam_member.ci_artifact_writer briananderson-xyz-468620/roles/artifactregistry.writer/serviceAccount:github-ci-deployer@briananderson-xyz-468620.iam.gserviceaccount.com

# 7. Import Cloud Run admin IAM binding
echo "7/8: Importing Cloud Run admin IAM binding..."
terraform import google_project_iam_member.ci_run_admin briananderson-xyz-468620/roles/run.admin/serviceAccount:github-ci-deployer@briananderson-xyz-468620.iam.gserviceaccount.com

# NOTE: OLD WIF binding uses attribute.repository_owner_id
# Your Terraform config now uses attribute.repository_owner_id (matches GCP)
# The OLD binding in GCP has 2 members (two repository owner IDs)
# Terraform will create a NEW binding with the updated format
echo ""
echo "8/8: Skipping OLD WIF binding import..."
echo "   GCP has binding with attribute.repository_owner_id and 2 owner IDs"
echo "   Terraform config uses attribute.repository_owner_id with both IDs"
echo "   No import needed - Terraform plan will handle the update"
echo "   Terraform will see the old binding as 'incompatible' and create a new one"
echo ""
echo "=== Import complete! ==="
echo ""
echo "Next steps:"
echo "1. Run 'terraform plan' to verify state"
echo "2. Review the plan - the old WIF binding should be replaced"
echo "3. If plan looks good, run 'terraform apply'"
echo ""
echo "Note: The plan will show 'destroy' for old WIF binding + 'create' for new one."
echo "This is normal - the new binding format replaces the old one."
