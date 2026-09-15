# Deployment Guide

## Prerequisites

- Terraform 1.6 or later
- AWS CLI or another approved AWS authentication method
- An AWS account where you are authorized to create the resources in this project
- Short-lived credentials from AWS IAM Identity Center, role assumption, or another approved mechanism

## Validate locally

```bash
cd projects/terraform-aws-landing-zone/terraform
terraform fmt -recursive
terraform init -backend=false
terraform validate
```

## Prepare variables

```bash
cp terraform.tfvars.example terraform.tfvars
```

Review the AWS Region, Availability Zones, VPC CIDRs, and allowed Regions. Do not enable the AWS Organizations resources until you have confirmed you are operating from the management account and have reviewed the example SCP.

## Plan

```bash
terraform init
terraform plan -out=tfplan
```

Review the plan carefully, especially:

- VPC and subnet CIDRs
- KMS key creation
- CloudTrail and audit-bucket policy
- Security Hub and GuardDuty enablement
- IAM account password policy
- any AWS Organizations resources

## Apply

```bash
terraform apply tfplan
```

## Recommended first deployment

Use the default:

```hcl
enable_organizations = false
```

This builds the account-level landing-zone controls without modifying AWS Organizations.

## Optional organization governance

Only after reviewing the impact, set:

```hcl
enable_organizations = true
```

The configuration will create a workload Organizational Unit under the organization root and attach the example approved-Regions SCP to that OU.

Service Control Policies do not grant permissions. They set the maximum permissions available to principals in affected accounts. Always test SCP changes with a non-production OU before broad rollout.

## State management for production

This portfolio project does not force a backend configuration. For production use, configure a remote Terraform backend with:

- encryption at rest
- state locking
- versioning
- tightly controlled IAM access
- separate state per environment or account boundary

## Destroy considerations

The audit bucket has `force_destroy = false` by default. This is intentional. Terraform will not silently delete retained audit logs. For real environments, preserve logs according to your retention and compliance requirements before removing the stack.
