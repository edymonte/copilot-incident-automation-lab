# Incident Analysis Prompt — Phase 1

Use this prompt when assigning an incident issue to GitHub Copilot Agent.

---

## Prompt Template

```
Analyze this incident and perform the following steps:

### 1. Root Cause Analysis
- Review the code in `app/index.js` and `tests/api.test.js`
- Identify which lines/logic are responsible for the reported behavior
- Explain the root cause clearly

### 2. Proposed Fix
- Implement the minimal code change needed to fix the issue
- Follow existing code style and conventions
- Do not introduce breaking changes to other endpoints

### 3. Test Coverage
- Add or update tests in `tests/api.test.js` to cover the bug scenario
- Ensure all existing tests still pass
- Aim for edge cases (boundary values, empty inputs, invalid types)

### 4. Pull Request
- Create a branch named `fix/incident-<issue-number>`
- Commit with message: `fix: resolve [brief description] (closes #<issue-number>)`
- Open a PR targeting `main` with a description that includes:
  - What was the bug
  - What was changed
  - How to verify the fix

### Risk Assessment
- Rate the risk of this change: Low / Medium / High
- List any potential side effects
```

---

## Example Issue Body

```
## Incident Summary
The Ticket API is accepting invalid status values such as "hacked" or "invalid-status",
which corrupts data integrity and breaks downstream processing.

## Affected Service
POST /tickets and PATCH /tickets/:id

## Error Logs
No runtime error is thrown. The invalid status is silently accepted and persisted.

## Steps to Reproduce
1. POST /tickets with body { "title": "Test", "status": "invalid-status" }
2. Response is 201 Created with status "invalid-status"
3. Expected: 400 Bad Request with error message

## Expected Behavior
Only statuses in ['open', 'in-progress', 'resolved', 'closed'] should be accepted.
Any other value should return HTTP 400.
```
