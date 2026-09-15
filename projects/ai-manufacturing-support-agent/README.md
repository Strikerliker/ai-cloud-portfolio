# AI Manufacturing Support Agent

A grounded AI support assistant for manufacturing IT operations and ERP troubleshooting.

## What it demonstrates

- Retrieval of approved manufacturing IT support procedures
- ERP troubleshooting guidance grounded in source material
- Source citations in generated answers
- Optional Amazon Bedrock integration
- Secure configuration without hardcoded secrets
- Practical AI support workflows for manufacturing environments

## Example use cases

- ERP login and access troubleshooting
- Workstation and application support procedures
- Manufacturing IT escalation guidance
- Approved SOP lookup and response generation
- Support-agent assistance with cited source material

## Architecture

The assistant searches a controlled knowledge base of approved support procedures, retrieves relevant passages, and uses those passages as context for a generated response. The design keeps answers grounded in the source material and can be connected to Amazon Bedrock for model inference.

## Portfolio note

This is a portfolio/lab project demonstrating secure AI support-agent design for manufacturing IT operations.