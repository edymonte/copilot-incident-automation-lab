# ADR-001 — Node.js as the Primary Runtime

**Status:** Accepted  
**Date:** 2026-06-16

## Context

The lab requires a simple, widely-understood technology stack to maximize accessibility in workshop settings.

## Decision

Use Node.js (v20 LTS) as the primary runtime for the API (`app/`), MCP Server (`mcp-server/`), and all utility scripts.

## Rationale

- Zero additional setup for participants who already have Node.js installed
- Native support in GitHub Actions without extra configuration
- MCP SDK is available as an npm package
- Familiar to the majority of the target audience

## Consequences

- All scripts are in JavaScript (no TypeScript to keep it simple for Phase 1)
- Docker image is based on `node:20-alpine`
