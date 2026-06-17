# Phase 5 — Autonomous Operations

## The 03:00 AM Scenario

A production incident occurs. Nobody is awake. The entire resolution cycle happens autonomously.

```
Monitoring → GitHub Issue → Copilot Agent → Fix → PR → CI → Approval → Deploy
```

## Run the Incident Simulator

```bash
GITHUB_TOKEN=your-pat GITHUB_REPO=edymonte/copilot-incident-automation-lab \
  node monitoring/simulate-incident.js
```

This creates a GitHub Issue automatically, simulating a monitoring alert.

## Trigger via GitHub Actions

Go to **Actions → Monitoring — Auto Create Incident Issue → Run workflow**

Fill in:
- Alert title
- Severity (P1/P2/P3)
- Affected service

## Workshop Demonstration — 10 Steps

1. `npm start` — run the API
2. `curl` to simulate the incident (invalid status)
3. Run `simulate-incident.js` — Issue created automatically
4. Copilot Agent assigned — begins analysis
5. PR opened by Copilot with the fix
6. Tests generated and passing
7. CI pipeline runs automatically
8. Engineer receives notification (Teams + email)
9. Engineer approves the PR
10. Deploy to production via GitHub Actions
