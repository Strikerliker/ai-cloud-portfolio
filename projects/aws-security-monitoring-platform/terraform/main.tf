terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.6"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_partition" "current" {}

resource "random_id" "suffix" {
  byte_length = 4
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  trail_name  = "${local.name_prefix}-trail"
  trail_arn   = "arn:${data.aws_partition.current.partition}:cloudtrail:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:trail/${local.trail_name}"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

resource "aws_s3_bucket" "cloudtrail" {
  bucket = "${local.name_prefix}-cloudtrail-${random_id.suffix.hex}"
  tags   = local.common_tags
}

resource "aws_s3_bucket_public_access_block" "cloudtrail" {
  bucket = aws_s3_bucket.cloudtrail.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "cloudtrail" {
  bucket = aws_s3_bucket.cloudtrail.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudtrail" {
  bucket = aws_s3_bucket.cloudtrail.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

data "aws_iam_policy_document" "cloudtrail_bucket" {
  statement {
    sid    = "AWSCloudTrailAclCheck"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudtrail.amazonaws.com"]
    }

    actions   = ["s3:GetBucketAcl"]
    resources = [aws_s3_bucket.cloudtrail.arn]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [local.trail_arn]
    }
  }

  statement {
    sid    = "AWSCloudTrailWrite"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudtrail.amazonaws.com"]
    }

    actions = ["s3:PutObject"]
    resources = [
      "${aws_s3_bucket.cloudtrail.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "s3:x-amz-acl"
      values   = ["bucket-owner-full-control"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [local.trail_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "cloudtrail" {
  bucket = aws_s3_bucket.cloudtrail.id
  policy = data.aws_iam_policy_document.cloudtrail_bucket.json
}

resource "aws_cloudtrail" "security" {
  name                          = local.trail_name
  s3_bucket_name                = aws_s3_bucket.cloudtrail.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true
  enable_logging                = true

  event_selector {
    include_management_events = true
    read_write_type           = "All"
  }

  depends_on = [aws_s3_bucket_policy.cloudtrail]
  tags       = local.common_tags
}

resource "aws_guardduty_detector" "security" {
  enable                       = true
  finding_publishing_frequency = "FIFTEEN_MINUTES"
  tags                         = local.common_tags
}

resource "aws_securityhub_account" "security" {}

resource "aws_securityhub_standards_subscription" "fsbp" {
  standards_arn = "arn:${data.aws_partition.current.partition}:securityhub:${data.aws_region.current.name}::standards/aws-foundational-security-best-practices/v/1.0.0"

  depends_on = [aws_securityhub_account.security]
}

resource "aws_sns_topic" "security_alerts" {
  name              = "${local.name_prefix}-alerts"
  kms_master_key_id = "alias/aws/sns"
  tags              = local.common_tags
}

data "aws_iam_policy_document" "sns_topic" {
  statement {
    sid    = "AllowEventBridgePublish"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    actions   = ["sns:Publish"]
    resources = [aws_sns_topic.security_alerts.arn]
  }
}

resource "aws_sns_topic_policy" "security_alerts" {
  arn    = aws_sns_topic.security_alerts.arn
  policy = data.aws_iam_policy_document.sns_topic.json
}

resource "aws_cloudwatch_event_rule" "guardduty_findings" {
  name        = "${local.name_prefix}-guardduty-findings"
  description = "Route medium-and-higher GuardDuty findings to the security alert topic"

  event_pattern = jsonencode({
    source      = ["aws.guardduty"]
    detail-type = ["GuardDuty Finding"]
    detail = {
      severity = [{
        numeric = [">=", 4]
      }]
    }
  })

  tags = local.common_tags
}

resource "aws_cloudwatch_event_target" "guardduty_to_sns" {
  rule      = aws_cloudwatch_event_rule.guardduty_findings.name
  target_id = "security-alerts"
  arn       = aws_sns_topic.security_alerts.arn
}

resource "aws_cloudwatch_event_rule" "securityhub_findings" {
  name        = "${local.name_prefix}-securityhub-findings"
  description = "Route active high and critical Security Hub findings to the security alert topic"

  event_pattern = jsonencode({
    source      = ["aws.securityhub"]
    detail-type = ["Security Hub Findings - Imported"]
    detail = {
      findings = {
        Severity = {
          Label = ["HIGH", "CRITICAL"]
        }
        RecordState = ["ACTIVE"]
      }
    }
  })

  tags = local.common_tags
}

resource "aws_cloudwatch_event_target" "securityhub_to_sns" {
  rule      = aws_cloudwatch_event_rule.securityhub_findings.name
  target_id = "security-alerts"
  arn       = aws_sns_topic.security_alerts.arn
}
