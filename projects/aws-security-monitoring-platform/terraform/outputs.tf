output "cloudtrail_name" {
  description = "Name of the multi-Region CloudTrail trail."
  value       = aws_cloudtrail.security.name
}

output "cloudtrail_log_bucket" {
  description = "S3 bucket receiving CloudTrail logs."
  value       = aws_s3_bucket.cloudtrail.id
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID."
  value       = aws_guardduty_detector.security.id
}

output "security_alert_topic_arn" {
  description = "SNS topic ARN for routed security findings."
  value       = aws_sns_topic.security_alerts.arn
}
