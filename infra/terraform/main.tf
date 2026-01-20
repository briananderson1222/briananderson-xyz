# Artifact Registry for container images
resource "google_artifact_registry_repository" "containers" {
  repository_id = "containers"
  format        = "DOCKER"
  location      = var.region
}

# GCS site bucket
resource "google_storage_bucket" "site" {
  name          = var.bucket_name
  location      = "US"
  force_destroy = false

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["https://${var.site_domain}", "https://www.${var.site_domain}"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  uniform_bucket_level_access = true
}

# Public read for objects (so CDN can cache)
resource "google_storage_bucket_iam_binding" "public_read" {
  bucket  = google_storage_bucket.site.name
  role    = "roles/storage.objectViewer"
  members = ["allUsers"]
}

# Cloud Run (Decap OAuth proxy)
resource "google_service_account" "auth_proxy" {
  account_id   = "decap-auth-proxy"
  display_name = "Decap OAuth Proxy"
}

resource "google_cloud_run_v2_service" "auth_proxy" {
  name     = "decap-auth-proxy"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.auth_proxy.email
    containers {
      image = length(var.auth_proxy_image) > 0 ? var.auth_proxy_image : "us-docker.pkg.dev/cloudrun/container/hello"
      env {
        name  = "BASE_URL"
        value = "https://${var.auth_proxy_domain}"
      }
      # Set GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET via console or secret manager (managed outside TF)
    }
  }

  lifecycle { ignore_changes = [template[0].containers[0].env] }
}

resource "google_cloud_run_service_iam_member" "auth_proxy_invoker" {
  location = google_cloud_run_v2_service.auth_proxy.location
  project  = var.project_id
  service  = google_cloud_run_v2_service.auth_proxy.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Workload Identity Federation (GitHub OIDC)
resource "google_iam_workload_identity_pool" "pool" {
  workload_identity_pool_id = var.wif_pool_id
  display_name              = "GitHub OIDC"
}

resource "google_iam_workload_identity_pool_provider" "provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.pool.workload_identity_pool_id
  workload_identity_pool_provider_id = var.wif_provider_id
  display_name                       = "GitHub OIDC Provider"

  attribute_mapping = {
    "google.subject"              = "assertion.sub"
    "attribute.repository"        = "assertion.repository"
    "attribute.repository_owner_id" = "assertion.repository_owner_id"
    "attribute.ref"               = "assertion.ref"
    "attribute.actor"             = "assertion.actor"
  }

  # Limit which GitHub repo/branch can assume this identity
  attribute_condition = "attribute.repository_owner_id in ${jsonencode(var.allowed_repository_owner_ids)} && attribute.ref == \"refs/heads/main\""

  oidc { issuer_uri = "https://token.actions.githubusercontent.com" }
}

# CI service account impersonated by GitHub via WIF
resource "google_service_account" "github_ci" {
  account_id   = var.wif_sa_name
  display_name = "GitHub CI Deployer"
}

resource "google_service_account_iam_member" "wif_bind" {
  service_account_id = google_service_account.github_ci.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.pool.name}/attribute.repository/${var.github_org}/${var.github_repo}"
}

# Minimum roles for CI
resource "google_project_iam_member" "ci_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.github_ci.email}"
}

resource "google_project_iam_member" "ci_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_ci.email}"
}

resource "google_project_iam_member" "ci_artifact_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_ci.email}"
}

output "wif_pool_name" { value = google_iam_workload_identity_pool.pool.name }
output "wif_provider_name" { value = google_iam_workload_identity_pool_provider.provider.name }
output "ci_service_account" { value = google_service_account.github_ci.email }
output "auth_proxy_url" { value = google_cloud_run_v2_service.auth_proxy.uri }
output "site_bucket" { value = google_storage_bucket.site.url }
