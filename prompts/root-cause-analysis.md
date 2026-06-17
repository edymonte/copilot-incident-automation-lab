# Root Cause Analysis Prompt — Phase 3

Use this prompt to ask GitHub Copilot Agent to perform an AI-driven Root Cause Analysis from logs and metrics.

---

## Prompt Template

```
Analyze the following logs, metrics, and events and produce a structured Root Cause Analysis report.

### Inputs
- Logs: [paste content of monitoring/logs/sample-error.log]
- Metrics: [paste content of monitoring/metrics/sample-metrics.json]
- Incident description: [paste the GitHub Issue body]

### Required Output Format

#### 1. Summary
One paragraph describing what happened, when it started, and what was impacted.

#### 2. Evidence
List each piece of evidence found in the logs and metrics that supports the analysis.
Format: `[timestamp] source: evidence description`

#### 3. Impact
- Services affected
- Number of users impacted (estimate from metrics)
- Data integrity risk (yes/no and why)
- SLA breach (yes/no)

#### 4. Probable Root Cause
Clear statement of the most likely root cause, with supporting evidence references.

#### 5. Proposed Fix
- Code-level fix (file, function, line range)
- Configuration change (if applicable)
- Operational mitigation (immediate action to reduce impact)

#### 6. Risk Level
- Change risk: Low / Medium / High
- Rollback plan: [describe how to roll back if the fix causes regression]

#### 7. Prevention
What should be added (tests, monitoring, alerts, validation) to prevent recurrence?
```

---

## Usage

1. Open a GitHub Issue or Copilot Chat
2. Copy this prompt
3. Replace the `[paste ...]` placeholders with actual data from `monitoring/`
4. Submit to Copilot Agent
