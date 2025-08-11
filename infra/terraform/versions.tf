terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google      = { source = "hashicorp/google", version = "~> 5.35" }
    google-beta = { source = "hashicorp/google-beta", version = "~> 5.35" }
  }

  # Configure in CI with -backend-config="bucket=..." -backend-config="prefix=..."
  backend "gcs" {}
}
