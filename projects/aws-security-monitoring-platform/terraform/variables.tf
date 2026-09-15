variable "aws_region" {
  description = "AWS Region for the security monitoring stack."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short project name used in resource naming."
  type        = string
  default     = "security-monitoring"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "portfolio"
}

variable "tags" {
  description = "Additional tags to apply to supported resources."
  type        = map(string)
  default     = {}
}
