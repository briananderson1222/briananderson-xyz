variable "project_id"        { type = string }
variable "region"            { type = string  default = "us-central1" }
variable "bucket_name"       { type = string }
variable "auth_proxy_domain" { type = string  default = "" } # e.g., auth.briananderson.xyz
variable "site_domain"       { type = string  default = "briananderson.xyz" }
variable "github_org"        { type = string }
variable "github_repo"       { type = string }
variable "github_branch"     { type = string  default = "main" }
variable "wif_pool_id"       { type = string  default = "github-pool" }
variable "wif_provider_id"   { type = string  default = "github-oidc" }
variable "wif_sa_name"       { type = string  default = "github-ci-deployer" }
variable "auth_proxy_image"  { type = string  default = "" } # e.g., us-central1-docker.pkg.dev/PROJECT/containers/decap-auth-proxy:SHA
