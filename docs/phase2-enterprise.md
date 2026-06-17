# Phase 2 — Enterprise Incident Management

## Additional Components

- ServiceNow sandbox
- Microsoft Teams incoming webhook
- Docker

## Setup

### ServiceNow Sandbox
1. Go to [developer.servicenow.com](https://developer.servicenow.com)
2. Create a free developer instance
3. Note your instance URL (e.g. `dev12345.service-now.com`)
4. Add to GitHub Secrets:
   - `SNOW_INSTANCE`
   - `SNOW_USER`
   - `SNOW_PASSWORD`

### Microsoft Teams Webhook
1. In Teams, open a channel → **Connectors → Incoming Webhook**
2. Create and copy the webhook URL
3. Add to GitHub Secrets: `TEAMS_WEBHOOK_URL`

### Docker
```bash
cd app
docker build -t ticket-api .
docker run -p 3000:3000 ticket-api
```

## GitHub Actions Secrets Required

| Secret | Description |
|--------|-------------|
| `SNOW_INSTANCE` | ServiceNow instance hostname |
| `SNOW_USER` | ServiceNow username |
| `SNOW_PASSWORD` | ServiceNow password |
| `TEAMS_WEBHOOK_URL` | Teams incoming webhook URL |
