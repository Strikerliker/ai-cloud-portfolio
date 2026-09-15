# Secure CI/CD Architecture

## Goal

Provide a compact reference implementation for a secure delivery pipeline that separates continuous integration from production deployment and avoids long-lived AWS credentials.

## Control flow

1. A developer pushes a change or opens a pull request.
2. GitHub Actions runs unit tests and Python static security analysis.
3. Terraform configuration is formatted, initialized without a backend, and validated.
4. Only after both validation jobs succeed is a versioned ZIP artifact created.
5. The artifact is retained by GitHub Actions for traceability.
6. Production deployment is available only through a manual workflow dispatch.
7. GitHub requests a short-lived AWS session through OIDC and an IAM role.
8. The immutable ZIP artifact is copied to an encrypted, non-public S3 bucket.

## Security design decisions

### OIDC instead of access keys

The workflow uses GitHub's OIDC token to assume an AWS IAM role. This removes the need to store long-lived AWS access keys as repository secrets.

### Least privilege

The deployment role should only be able to write objects to the designated deployment bucket path and read the bucket location if required.

### CI/CD separation

Build and validation happen automatically. Production deployment is a separate job that only becomes eligible during a manual `workflow_dispatch` run and can also be protected with GitHub Environment approval rules.

### Immutable artifacts

The ZIP file includes the Git commit SHA in its name so a deployed artifact can be traced back to the exact source revision.

### Infrastructure checks

Terraform formatting and validation execute before artifact packaging. In a larger implementation this stage could also include Checkov, tfsec, or policy-as-code checks.

## Production extensions

A production implementation could add:

- Signed artifacts and provenance attestations
- SAST, SCA, container, and IaC scanning
- Automated SBOM generation
- AWS KMS customer-managed encryption keys
- Separate dev, test, and production AWS accounts
- GitHub Environment required reviewers
- Canary or blue/green deployment
- Automated rollback
- CloudTrail, GuardDuty, Security Hub, and CloudWatch monitoring
- OPA or Sentinel policy gates
