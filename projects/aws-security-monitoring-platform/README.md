# AWS Security Monitoring Platform

A production-style cloud security portfolio project that demonstrates centralized AWS security telemetry, threat detection, finding aggregation, alert routing, and incident-response workflows using native AWS services and Terraform.

## What this project demonstrates

- Multi-Region AWS CloudTrail logging with log-file validation
- Centralized, versioned, encrypted S3 log storage with public access blocked
- Amazon GuardDuty threat detection
- AWS Security Hub finding aggregation
- Amazon EventBridge rules for high-value security findings
- Encrypted Amazon SNS alert routing
- Terraform-based infrastructure as code
- CloudTrail threat-hunting queries
- Incident-response runbook and architecture documentation

## Architecture

```text
AWS Accounts / Workloads
        |
        +----------------------------+
        |                            |
        v                            v
   AWS CloudTrail               Amazon GuardDuty
        |                            |
        v                            v
Encrypted S3 Log Archive       AWS Security Hub
                                     |
                                     v
                              Amazon EventBridge
                               /              \
                              /                \
                     GuardDuty Findings   High/Critical
                              \                /
                               \              /
                                v            v
                              Encrypted SNS Topic
                                      |
                                      v
                              Security Operations
                                      |
                                      v
                               Incident Response
```

## Repository contents

- `terraform/main.tf` — CloudTrail, S3, GuardDuty, Security Hub, EventBridge, and SNS
- `terraform/variables.tf` — project inputs
- `terraform/outputs.tf` — useful deployment outputs
- `docs/architecture.md` — design decisions and security controls
- `docs/incident-response-runbook.md` — triage and escalation workflow
- `queries/cloudtrail-threat-hunting.sql` — example CloudTrail hunting queries
- Root workflow: `.github/workflows/aws-security-monitoring-platform.yml`

## Security controls

- S3 Block Public Access enabled
- S3 server-side encryption enabled
- S3 versioning enabled
- CloudTrail log-file validation enabled
- Multi-Region management-event collection
- GuardDuty enabled
- Security Hub enabled
- EventBridge filtering for actionable findings
- SNS encryption using the AWS managed SNS KMS key
- No hardcoded credentials or account IDs

## Deploy

```bash
cd projects/aws-security-monitoring-platform/terraform
terraform init
terraform plan
terraform apply
```

A unique suffix is automatically added to the CloudTrail log bucket name.

## Portfolio note

This project is a reference implementation designed to demonstrate AWS cloud-security architecture, monitoring, detection engineering, IaC, and incident-response patterns. Deploying it creates billable AWS resources and should be tested in a non-production account first.
