/**
 * simulate-incident.js — Phase 5: Autonomous Operations
 *
 * Simulates a production alert at 03:00 AM and triggers
 * an automatic GitHub Issue creation via the GitHub API.
 *
 * Usage:
 *   GITHUB_TOKEN=<token> GITHUB_REPO=edymonte/copilot-incident-automation-lab node monitoring/simulate-incident.js
 */

const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'edymonte/copilot-incident-automation-lab';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

const incident = {
  title: '[INCIDENT] High error rate — Ticket API accepting invalid status values',
  body: `## 🚨 Automated Incident Alert

**Severity:** P1
**Service:** Ticket API
**Detected at:** ${new Date().toISOString()}
**Simulated by:** simulate-incident.js (Phase 5 Demo)

## Description

The monitoring system detected a high error rate of **8.07%** (threshold: 1%) in the Ticket API.
42 errors in the last 60 seconds.

Affected endpoints:
- \`POST /tickets\`
- \`PATCH /tickets/:id\`

## Evidence

\`\`\`
ERROR [ticket-api] POST /tickets - Unhandled status value: "invalid-status" accepted without validation
ERROR [processor] Ticket INC-8821 - Unknown status "invalid-status" cannot be routed to queue
ALERT [monitor]   P1 alert triggered — Ticket API — invalid status acceptance
\`\`\`

## Metrics

- Error rate: 8.07% (threshold: 1%)
- P99 latency: 1240ms
- 500 responses: 30 in last 60s

## Expected Actions

- [ ] Analyze root cause
- [ ] Propose a fix
- [ ] Generate tests
- [ ] Open a Pull Request

_This issue was automatically created by the monitoring system at 03:00 AM._`,
  labels: ['incident', 'p1', 'automated'],
};

function createGitHubIssue() {
  const [owner, repo] = GITHUB_REPO.split('/');
  const body = JSON.stringify({
    title: incident.title,
    body: incident.body,
    labels: incident.labels,
  });

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/issues`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'User-Agent': 'copilot-incident-automation-lab',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (res.statusCode === 201) {
          resolve(parsed);
        } else {
          reject(new Error(`GitHub API error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log('🚨 Simulating production incident at 03:00 AM...');
  console.log(`   Repo: ${GITHUB_REPO}`);

  try {
    const issue = await createGitHubIssue();
    console.log(`✅ Incident issue created: ${issue.html_url}`);
    console.log('   Waiting for Copilot Agent to respond...');
  } catch (err) {
    console.error('❌ Failed to create issue:', err.message);
    process.exit(1);
  }
})();
