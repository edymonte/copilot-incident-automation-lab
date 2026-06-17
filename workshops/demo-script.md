# Workshop Script — 10-Step Demo

## Prerequisites Checklist

- [ ] Node.js installed
- [ ] `npm install` completed
- [ ] GitHub Copilot enabled on this repository
- [ ] Copilot Agent mode enabled in VS Code

---

## Step 1 — Start the API

```bash
npm start
```

Expected output:
```
Ticket API running on port 3000
```

---

## Step 2 — Demonstrate the Bug

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"title": "Payment service down", "status": "invalid-status"}'
```

Expected (buggy) response:
```json
{"id":"...","title":"Payment service down","status":"invalid-status","priority":"medium"}
```

---

## Step 3 — Run Failing Tests

```bash
npm test
```

Two tests should fail:
- `should return 400 when status is invalid`
- `should return 400 when patching with an invalid status`

---

## Step 4 — Create Incident Issue

Go to GitHub Issues → New Issue → **Incident Report**

Fill in with the bug details and submit.

---

## Step 5 — Assign to Copilot Agent

On the issue sidebar, click **Assignees → Copilot**

---

## Step 6 — Watch Copilot Work

Copilot will:
- Create branch `fix/incident-<number>`
- Analyze `app/index.js`
- Apply the fix
- Update `tests/api.test.js`
- Open a Pull Request

---

## Step 7 — Review the PR

Check the PR:
- Fix is in `app/index.js` (status validation added)
- Tests cover the invalid status scenario
- CI is green

---

## Step 8 — Approve

Add your review approval.

---

## Step 9 — Merge

Merge the PR to `main`.

---

## Step 10 — Verify

```bash
git pull origin main
npm test
# All tests pass

curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "status": "invalid-status"}'
# Returns 400 Bad Request
```

---

## Q&A Topics

- How does Copilot Agent understand the codebase?
- What context does it need in the Issue?
- How to tune the prompts?
- What are the limits of agentic workflows?
- How to scale this to a real enterprise?
