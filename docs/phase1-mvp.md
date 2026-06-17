# Phase 1 — MVP

## Objective

Prove that GitHub Copilot Agent can analyze an incident, generate a fix, generate tests, and open a Pull Request — fully autonomously.

## Flow

```
GitHub Issue → Copilot Agent → Branch → Fix → Tests → Pull Request → CI/CD → Merge
```

## Steps

### 1. Start the API
```bash
npm install
npm start
# API running on http://localhost:3000
```

### 2. Verify the bug
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "status": "invalid-status"}'
# Bug: returns 201 instead of 400
```

### 3. Run the failing tests
```bash
npm test
# Two tests will fail — this is intentional
```

### 4. Create a GitHub Issue
1. Go to **Issues → New Issue**
2. Select **Incident Report** template
3. Fill in:
   - Title: `[INCIDENT] API accepting invalid ticket status values`
   - Description: paste the curl output above
   - Severity: P1
4. Submit the issue

### 5. Assign to GitHub Copilot Agent
1. On the Issue sidebar, click **Assignees**
2. Select **Copilot** from the list
3. Wait for Copilot to create a branch and PR

### 6. Review the Pull Request
- Check the fix in `app/index.js`
- Check the new/updated tests
- Verify CI passes

### 7. Approve and Merge
- Add your approval
- Merge the PR

## Validation Criteria

- [ ] Issue created
- [ ] Copilot opens a PR within minutes
- [ ] PR contains the fix for status validation
- [ ] Tests cover the `invalid-status` scenario
- [ ] CI pipeline passes
- [ ] Merged to main
