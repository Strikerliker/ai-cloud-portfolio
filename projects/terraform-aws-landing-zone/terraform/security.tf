resource "aws_kms_key" "workload" {
  description             = "Default KMS key for encrypted landing-zone workload storage"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_kms_alias" "workload" {
  name          = "alias/${local.name_prefix}-workload"
  target_key_id = aws_kms_key.workload.key_id
}

resource "aws_ebs_encryption_by_default" "foundation" {
  enabled = true
}

resource "aws_ebs_default_kms_key" "foundation" {
  key_arn = aws_kms_key.workload.arn
}

resource "aws_guardduty_detector" "foundation" {
  enable                       = true
  finding_publishing_frequency = "FIFTEEN_MINUTES"
}

resource "aws_securityhub_account" "foundation" {
  enable_default_standards = true
}

resource "aws_iam_account_password_policy" "break_glass" {
  minimum_password_length        = 14
  require_lowercase_characters   = true
  require_numbers                = true
  require_symbols                = true
  require_uppercase_characters   = true
  allow_users_to_change_password = true
  max_password_age               = 90
  password_reuse_prevention      = 24
}
