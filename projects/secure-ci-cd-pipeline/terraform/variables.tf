variable "aws_region" {
  description = "AWS region for the deployment artifact bucket."
  type        = string
  default     = "us-east-1"
}

variable "artifact_bucket_name" {
  description = "Globally unique S3 bucket name used for deployment artifacts."
  type        = string
}

variable "environment" {
  description = "Deployment environment label."
  type        = string
  default     = "production"
}
