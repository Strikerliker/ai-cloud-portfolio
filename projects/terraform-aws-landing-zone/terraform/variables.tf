variable "aws_region" {
  description = "AWS Region used for regional landing-zone resources."
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Name prefix used for landing-zone resources."
  type        = string
  default     = "portfolio-landing-zone"
}

variable "environment" {
  description = "Environment tag applied to resources."
  type        = string
  default     = "foundation"
}

variable "vpc_cidr" {
  description = "CIDR block for the landing-zone VPC."
  type        = string
  default     = "10.20.0.0/16"
}

variable "availability_zones" {
  description = "Availability Zones used by the VPC."
  type        = list(string)
  default     = ["us-east-2a", "us-east-2b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets."
  type        = list(string)
  default     = ["10.20.110.0/24", "10.20.120.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private workload subnets."
  type        = list(string)
  default     = ["10.20.10.0/24", "10.20.20.0/24"]
}

variable "log_retention_days" {
  description = "Number of days before current CloudTrail objects transition to lower-cost storage."
  type        = number
  default     = 90
}

variable "log_expiration_days" {
  description = "Number of days before noncurrent audit-log versions expire."
  type        = number
  default     = 365
}

variable "enable_organizations" {
  description = "Create an Organizational Unit and attach the example SCP. Enable only from an Organizations management account."
  type        = bool
  default     = false
}

variable "organizational_unit_name" {
  description = "Name of the optional workload Organizational Unit."
  type        = string
  default     = "Workloads"
}

variable "allowed_regions" {
  description = "AWS Regions permitted by the optional region guardrail SCP."
  type        = list(string)
  default     = ["us-east-1", "us-east-2", "us-west-2"]
}

variable "force_destroy_log_bucket" {
  description = "Allow deletion of the audit bucket when objects exist. Keep false for real environments."
  type        = bool
  default     = false
}
