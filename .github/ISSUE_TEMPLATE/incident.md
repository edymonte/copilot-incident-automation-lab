---
name: 🚨 Incident Report
about: Report a production incident for Copilot Agent analysis
title: "[INCIDENT] "
labels: ["incident"]
assignees: []
---

## Incident Summary

<!-- One-line description of the incident -->


## Severity

- [ ] P1 — Critical (production down, data loss risk)
- [ ] P2 — High (major functionality broken)
- [ ] P3 — Medium (degraded performance / partial outage)
- [ ] P4 — Low (minor issue, workaround available)

## Affected Service

<!-- Which service / endpoint / component is impacted? -->


## Symptoms

<!-- What is happening? What is the user impact? -->


## Error Logs / Evidence

```
Paste relevant logs, stack traces, or error messages here
```

## Steps to Reproduce

1. 
2. 
3. 

## Expected Behavior

<!-- What should happen? -->


## Actual Behavior

<!-- What is actually happening? -->


## Environment

- **Environment:** (production / staging / dev)
- **Version / Commit SHA:**
- **Timestamp (UTC):**

## Additional Context

<!-- Screenshots, metrics dashboards, related issues -->


---

> **Copilot Agent Instructions:**
> Please analyze this incident and:
> 1. Identify the root cause in the codebase
> 2. Propose a fix with code changes
> 3. Generate or update tests to cover the scenario
> 4. Open a Pull Request with your changes
