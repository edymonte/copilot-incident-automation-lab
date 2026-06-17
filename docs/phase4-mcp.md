# Phase 4 — MCP Server

## Setup

```bash
cd mcp-server
npm install
```

## Configuration

Set environment variables (or add a `.env` file — never commit it):

```bash
# ServiceNow
export SNOW_INSTANCE=dev12345.service-now.com
export SNOW_USER=admin
export SNOW_PASSWORD=your-password

# Jira
export JIRA_HOST=yourorg.atlassian.net
export JIRA_USER=your-email@org.com
export JIRA_TOKEN=your-api-token
```

VS Code will use `.vscode/mcp.json` to start the server automatically.

## Demo Commands (in Copilot Chat)

```
Get incident INC00012345
```

```
Update incident INC00012345 status to In Progress and add note: Copilot Agent is analyzing the fix
```

```
Show all Jira issues related to ticket API status validation
```

> **Note:** Without credentials, the server returns mock data for demo purposes.
