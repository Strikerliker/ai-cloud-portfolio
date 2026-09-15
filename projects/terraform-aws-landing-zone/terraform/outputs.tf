output "vpc_id" {
  description = "ID of the landing-zone VPC."
  value       = aws_vpc.foundation.id
}

output "private_subnet_ids" {
  description = "Private workload subnet IDs."
  value       = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  description = "Public subnet IDs."
  value       = aws_subnet.public[*].id
}

output "audit_bucket_name" {
  description = "Encrypted CloudTrail audit bucket."
  value       = aws_s3_bucket.audit.id
}

output "cloudtrail_name" {
  description = "Multi-region CloudTrail trail name."
  value       = aws_cloudtrail.foundation.name
}

output "audit_kms_key_arn" {
  description = "KMS key ARN used for audit-log encryption."
  value       = aws_kms_key.audit.arn
}

output "workload_kms_key_arn" {
  description = "Default KMS key ARN used for EBS workload encryption."
  value       = aws_kms_key.workload.arn
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID."
  value       = aws_guardduty_detector.foundation.id
}

output "workload_ou_id" {
  description = "Optional workload Organizational Unit ID."
  value       = var.enable_organizations ? aws_organizations_organizational_unit.workloads[0].id : null
}
