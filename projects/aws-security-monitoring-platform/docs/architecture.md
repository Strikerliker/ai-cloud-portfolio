# Architecture and Security Design

## Objective

Provide a compact AWS-native security monitoring reference architecture that captures management activity, detects threats, aggregates findings, and routes actionable events to a security operations workflow.

## Components

### AWS CloudTrail

- Multi-Region trail
- Global service events included
- Management read/write events enabled
- Log-file validation enabled
- Logs delivered to a dedicated S3 bucket

### Amazon S3 log archive

- Public access blocked
- Versioning enabled
- Server-side encryption enabled
- Bucket policy restricts CloudTrail delivery by `aws:SourceArn`
- CloudTrail write permissions limited to the current AWS account log prefix

### Amazon GuardDuty

GuardDuty continuously analyzes AWS telemetry for suspicious activity and publishes findings. The Terraform configuration routes findings with severity 4.0 or greater through EventBridge.

### AWS Security Hub

Security Hub is enabled with AWS Foundational Security Best Practices. Active HIGH and CRITICAL findings are selected by EventBridge for alert routing.

### Amazon EventBridge

Two rules provide simple detection-routing examples:

1. GuardDuty findings with severity >= 4
2. Active Security Hub findings with HIGH or CRITICAL severity

The rules publish to a dedicated SNS security-alert topic.

### Amazon SNS

The SNS topic provides a decoupled notification target for security operations integrations. It uses the AWS managed SNS KMS key and a resource policy that allows EventBridge to publish.

## Security principles demonstrated

- Centralized audit logging
- Defense in depth
- Least-privilege service policies
- Encryption at rest
- No public log storage
- Detection aggregation
- Event-driven alerting
- Infrastructure as code
- Separation of telemetry, detection, and response

## Production expansion path

A production implementation could extend this reference architecture with AWS Organizations, delegated GuardDuty/Security Hub administration, organization-wide CloudTrail, cross-account log aggregation, AWS Config, centralized CloudWatch Logs, automated Lambda remediation, ticketing/SIEM integrations, and Security Lake.
