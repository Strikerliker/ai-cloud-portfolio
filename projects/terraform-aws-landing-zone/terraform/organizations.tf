data "aws_organizations_organization" "current" {
  count = var.enable_organizations ? 1 : 0
}

resource "aws_organizations_organizational_unit" "workloads" {
  count = var.enable_organizations ? 1 : 0

  name      = var.organizational_unit_name
  parent_id = data.aws_organizations_organization.current[0].roots[0].id
}

resource "aws_organizations_policy" "region_guardrail" {
  count = var.enable_organizations ? 1 : 0

  name        = "${local.name_prefix}-approved-regions"
  description = "Restrict regional AWS activity to approved Regions while allowing global services."
  type        = "SERVICE_CONTROL_POLICY"

  content = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DenyUnapprovedRegions"
        Effect = "Deny"
        NotAction = [
          "account:*",
          "billing:*",
          "budgets:*",
          "cloudfront:*",
          "iam:*",
          "organizations:*",
          "route53:*",
          "support:*",
          "waf:*"
        ]
        Resource = "*"
        Condition = {
          StringNotEquals = {
            "aws:RequestedRegion" = var.allowed_regions
          }
        }
      }
    ]
  })
}

resource "aws_organizations_policy_attachment" "region_guardrail" {
  count = var.enable_organizations ? 1 : 0

  policy_id = aws_organizations_policy.region_guardrail[0].id
  target_id = aws_organizations_organizational_unit.workloads[0].id
}
