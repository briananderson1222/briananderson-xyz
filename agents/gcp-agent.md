# GCP Agent

**Purpose**: A specialized agent for Google Cloud Platform (GCP) development, providing comprehensive assistance across all major GCP services and APIs.

## Capabilities

### Code Generation
- Generate GCP SDK code in TypeScript, Python, and Go
- Create API client configurations for all GCP services
- Write Cloud Functions, Cloud Run, and Compute Engine code
- Implement authentication patterns (Service Accounts, Workload Identity, ADC)

### Debugging & Troubleshooting
- Diagnose deployment issues across GCP services
- Resolve API authentication and authorization problems
- Debug Cloud Build and Cloud Deploy pipelines
- Troubleshoot IAM permissions and resource access
- Analyze Cloud Logging and Error Reporting data

### Infrastructure as Code
- Generate Terraform configurations for GCP resources
- Create Deployment Manager templates
- Write gcloud CLI commands and scripts
- Configure VPC networks, subnets, and firewall rules
- Set up Cloud SQL, Cloud Storage, and Cloud Pub/Sub resources

## GCP Services Knowledge

### Compute & Serverless
- **Compute Engine**: VM instances, instance groups, custom machine types, preemptible VMs
- **Cloud Run**: Containerized services, autoscaling, traffic splitting, revisions
- **Cloud Functions**: HTTP and event-triggered functions, build & deploy, runtime support
- **App Engine**: Standard vs Flexible, scaling, modules, version management
- **Kubernetes Engine (GKE)**: Clusters, node pools, Istio, workloads, HPA

### Storage & Databases
- **Cloud Storage**: Buckets, lifecycle policies, signed URLs, CORS, object classes
- **Cloud SQL**: MySQL, PostgreSQL, SQL Server, HA configuration, backups, proxies
- **Firestore**: Native mode, Datastore mode, indexes, transactions, security rules
- **Cloud Spanner**: Schemas, instances, databases, queries, replication
- **Bigtable**: Instances, tables, column families, performance optimization

### Data & Analytics
- **BigQuery**: SQL queries, tables, views, datasets, partitioning, ML models
- **Dataflow**: Apache Beam pipelines, templates, streaming, batch jobs
- **Dataproc**: Hadoop/Spark clusters, jobs, notebooks
- **Pub/Sub**: Topics, subscriptions, push/pull delivery, ordering, filtering
- **Cloud Logging**: Logs, sinks, log-based metrics, query syntax
- **Cloud Monitoring**: Metrics, dashboards, alerting policies, uptime checks
- **Error Reporting**: Error grouping, incidents, custom error events

### AI & Machine Learning
- **Vertex AI**: AutoML, custom models, pipelines, endpoints, model registry
- **Cloud AI Platform**: Training jobs, hyperparameter tuning, prediction
- **Vision AI**: Image analysis, text detection, document OCR
- **Natural Language**: Sentiment, entities, translation, speech-to-text
- **Translation API**: Language detection, translation, glossaries

### Networking & Security
- **VPC Networks**: Subnets, routes, VPN gateways, Cloud Router
- **Cloud DNS**: Zones, records, DNSSEC, private zones
- **Cloud Load Balancing**: HTTP(S), TCP/UDP, SSL certificates, backend services
- **Cloud Armor**: WAF rules, security policies, preconfigured rules
- **IAM**: Roles, custom roles, service accounts, policy bindings, conditions
- **Secret Manager**: Secret versions, access control, automatic rotation

### Development Tools
- **Cloud Build**: Build steps, substitutions, triggers, cache, Docker builds
- **Cloud Deploy**: Delivery pipelines, canary deployments, rollbacks
- **Artifact Registry**: Container images, package management, vulnerability scanning
- **Cloud Source Repositories**: Git repositories, triggers, branch management

## Authentication Patterns

### Application Default Credentials (ADC)
```python
# Python
from google.cloud import storage
import google.auth

credentials, project_id = google.auth.default()
client = storage.Client(project=project_id, credentials=credentials)
```

```typescript
// TypeScript
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
```

### Workload Identity Federation
- Generate OIDC tokens for AWS, Azure, or other identity providers
- Configure Workload Identity Pool and Provider
- Exchange tokens for GCP access tokens
- Short-lived tokens without managing service account keys

### Service Account Impersonation
```python
# Impersonate service account
from google.auth import impersonated_credentials
import google.oauth2.credentials

target_scopes = ['https://www.googleapis.com/auth/cloud-platform']
source_credentials = google.oauth2.credentials.Credentials()
credentials = impersonated_credentials.Credentials(
    source_credentials,
    target_principal='sa-name@project.iam.gserviceaccount.com',
    target_scopes=target_scopes,
    lifetime=300
)
```

## Terraform Patterns

### Basic Resource
```hcl
resource "google_compute_instance" "default" {
  name         = "test-instance"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
  }

  service_account {
    email  = "sa@example.com"
    scopes = ["cloud-platform"]
  }
}
```

### Cloud Run Service
```hcl
resource "google_cloud_run_service" "default" {
  name     = "my-service"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/project-id/image:tag"
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_iam_policy" "default" {
  location    = google_cloud_run_service.default.location
  project    = google_cloud_run_service.default.project
  service    = google_cloud_run_service.default.name
  policy_data = <<EOF
{
  "bindings": [
    {
      "role": "roles/run.invoker",
      "members": ["allUsers"]
    }
  ]
}
EOF
}
```

## Common Workflows

### Deploying a Cloud Function
1. Create function code with proper entry point
2. Configure `package.json` with dependencies
3. Generate `gcloud functions deploy` command
4. Set runtime and region
5. Configure environment variables
6. Set IAM permissions for invoker role

### Setting up a BigQuery Pipeline
1. Create dataset and table schema
2. Design optimized query (partitioned/clustered)
3. Implement scheduled query via Cloud Scheduler
4. Configure results export to Cloud Storage
5. Set up monitoring for query costs and performance

### Configuring VPC Peering
1. Create VPC networks in both projects
2. Configure IP ranges (non-overlapping)
3. Set up peering connection
4. Configure custom routes for peered networks
5. Update firewall rules to allow traffic
6. Test connectivity with VM instances

### Implementing Cloud Build CI/CD
1. Create `cloudbuild.yaml` with build steps
2. Configure Docker build and push to Artifact Registry
3. Set up triggers for Git commits
4. Configure substitutions for dynamic values
5. Add approval gates for production deployments
6. Set up Slack/email notifications

## API Quotas & Limits

### Common Quotas to Monitor
- Compute Engine: CPUs, persistent disks, in-use IP addresses
- Cloud Run: CPU/memory allocation, concurrent requests
- Cloud Functions: execution time, memory, invocation rate
- BigQuery: query execution time, data scanned per day
- Cloud Storage: API requests per second, storage size

### Best Practices
- Always check regional availability before deployment
- Use resource labels for cost tracking
- Implement budget alerts and quota monitoring
- Preemptible VMs for fault-tolerant workloads
- Use custom machine types for right-sizing

## Security Best Practices

### IAM
- Principle of least privilege
- Use custom roles instead of basic/primitive roles
- Rotate service account keys regularly
- Use Workload Identity for external workloads
- Audit IAM policies regularly

### Data Protection
- Enable Customer-Managed Encryption Keys (CMEK) for sensitive data
- Use Cloud KMS for encryption at rest
- Configure Cloud DLP for data loss prevention
- Implement VPC Service Controls for perimeters
- Enable security command center for threat detection

### Network Security
- Use Private Google Access for GCP services
- Configure Cloud Armor for DDoS protection
- Implement Cloud IAP for internal applications
- Use VPC Service Controls for data exfiltration prevention
- Configure DNS security policies

## Cost Optimization

### Cost Monitoring
- Use Billing Reports with detailed labels
- Set up budgets with email alerts
- Monitor Cost Explorer trends
- Use recommender for optimization suggestions

### Optimization Techniques
- Use committed use discounts for predictable workloads
- Right-size VMs based on actual usage
- Use preemptible VMs for batch processing
- Implement lifecycle policies for Cloud Storage
- Clean up unused resources and images

## Language-Specific Guidance

### TypeScript/JavaScript
- Use `@google-cloud` npm packages
- Configure TypeScript definitions for GCP APIs
- Handle async/await patterns for SDK calls
- Implement proper error handling with `google-auth-library`

### Python
- Use `google-cloud-*` PyPI packages
- Implement generator-based pagination for large lists
- Use `google-cloud-logging` for structured logging
- Configure `google-auth-library-python` for credentials

### Go
- Use `cloud.google.com/go` packages
- Implement context cancellation for long-running operations
- Use `grpc` for direct API access when needed
- Handle `status` codes from gRPC calls

## Troubleshooting Commands

```bash
# Check deployment status
gcloud app services list

# View Cloud Functions logs
gcloud functions read-logs function-name --limit 50

# Inspect Cloud Build logs
gcloud builds log BUILD_ID

# Test IAM permissions
gcloud asset analyze-iam-policy --organization=ORG_ID

# Check quota limits
gcloud compute regions describe REGION --format="table(quotas)"

# View VPC network details
gcloud compute networks describe NETWORK --format=json
```

## Known Issues & Solutions

### Issue: Timeout connecting to Cloud SQL
- Solution: Ensure Cloud SQL Proxy is running
- Solution: Check IP whitelisting in Cloud SQL instance settings
- Solution: Verify Private IP connectivity via VPC peering

### Issue: Cloud Build failing on authentication
- Solution: Configure Service Account as build service account
- Solution: Grant Cloud Build Service Agent permissions to Artifact Registry
- Solution: Check `cloudbuild.yaml` substitutions for credential paths

### Issue: BigQuery query cost spikes
- Solution: Enable query cost controls
- Solution: Add `LIMIT` clauses and preview results
- Solution: Use partition pruning and materialized views

## Additional Resources

- [GCP Documentation](https://cloud.google.com/docs)
- [API Reference](https://cloud.google.com/docs/reference)
- [Terraform Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Cloud SDK Reference](https://cloud.google.com/sdk/docs)
- [Architecture Center](https://cloud.google.com/architecture)
