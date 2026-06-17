# Copilot Incident Automation Lab — Enterprise Edition

> Transform GitHub Copilot from a code assistant into an engineering agent capable of participating in the entire incident management lifecycle.

## Architecture Overview

```
Application → Monitoring → GitHub Issue → Copilot Agent → Pull Request → CI/CD → Approval → Deploy
                                    ↓
                          ServiceNow / Microsoft Teams
```

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [Phase 1 — MVP](docs/phase1-mvp.md) | Issue → Copilot Agent → PR → CI/CD | ✅ Ready |
| [Phase 2 — Enterprise](docs/phase2-enterprise.md) | ServiceNow + Teams + Docker | 🔧 Setup required |
| [Phase 3 — AI RCA](docs/phase3-rca.md) | AI Root Cause Analysis | 🔧 Setup required |
| [Phase 4 — MCP Server](docs/phase4-mcp.md) | MCP Server integration | 🔧 Setup required |
| [Phase 5 — Autonomous](docs/phase5-autonomous.md) | Fully autonomous operations | 🔧 Setup required |

## Repository Structure

```
copilot-incident-automation-lab/
├── app/               ← Node.js API with intentional bug (Phase 1)
├── tests/             ← Unit tests
├── monitoring/        ← Logs, metrics, incident simulator
├── servicenow/        ← ServiceNow integration scripts
├── teams/             ← Microsoft Teams notifications
├── mcp-server/        ← MCP Server (Phase 4)
├── prompts/           ← Copilot prompts for each phase
├── docs/              ← Phase documentation
├── architecture/      ← Architecture decision records
├── diagrams/          ← Mermaid architecture diagrams
├── workshops/         ← Workshop demo scripts
└── .github/
    ├── workflows/     ← GitHub Actions CI/CD pipelines
    └── ISSUE_TEMPLATE ← Standardized incident issue template
```

## Quick Start — Phase 1

```bash
# Install dependencies
npm install

# Start the API (with the intentional bug)
npm start

# Run tests
npm test
```

Then:
1. Create a GitHub Issue using the [Incident Template](.github/ISSUE_TEMPLATE/incident.md)
2. Assign it to **GitHub Copilot**
3. Review the generated PR
4. Approve and merge after CI passes

## Prerequisites

- GitHub Copilot (Business or Enterprise plan) with Agent enabled
- Node.js 18+
- Docker (Phase 2+)
- ServiceNow sandbox — [developer.servicenow.com](https://developer.servicenow.com) (Phase 2+)
- Microsoft Teams webhook (Phase 2+)

## Learning Objectives

- GitHub Copilot Agent mode
- Agentic Software Development
- GitHub Actions
- ServiceNow Integration
- MCP Servers
- AI Root Cause Analysis
- Autonomous Operations
- Enterprise DevOps

## License

MIT
