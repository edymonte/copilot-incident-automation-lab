/**
 * notify.js — Phase 2: Microsoft Teams Notification
 *
 * Sends an Adaptive Card notification to Microsoft Teams
 * when a GitHub incident issue is created.
 *
 * Required environment variables:
 *   TEAMS_WEBHOOK_URL — Incoming Webhook URL from Teams channel
 *   ISSUE_TITLE       — GitHub Issue title
 *   ISSUE_URL         — GitHub Issue URL
 *   ISSUE_NUMBER      — GitHub Issue number
 *   ISSUE_SEVERITY    — Severity label (P1/P2/P3/P4)
 */

const https = require('https');
const { URL } = require('url');

const {
  TEAMS_WEBHOOK_URL,
  ISSUE_TITLE,
  ISSUE_URL,
  ISSUE_NUMBER,
  ISSUE_SEVERITY = 'P2',
} = process.env;

if (!TEAMS_WEBHOOK_URL) {
  console.error('❌ TEAMS_WEBHOOK_URL environment variable is required');
  process.exit(1);
}

const severityColor = {
  P1: 'FF0000',
  P2: 'FF8C00',
  P3: 'FFD700',
  P4: '00B050',
};

const card = {
  type: 'message',
  attachments: [
    {
      contentType: 'application/vnd.microsoft.card.adaptive',
      content: {
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.4',
        body: [
          {
            type: 'TextBlock',
            text: `🚨 Incident ${ISSUE_SEVERITY} — GitHub Issue #${ISSUE_NUMBER}`,
            weight: 'bolder',
            size: 'medium',
            color: 'attention',
          },
          {
            type: 'TextBlock',
            text: ISSUE_TITLE,
            wrap: true,
          },
          {
            type: 'FactSet',
            facts: [
              { title: 'Severity', value: ISSUE_SEVERITY },
              { title: 'Issue', value: `#${ISSUE_NUMBER}` },
              { title: 'Time', value: new Date().toISOString() },
            ],
          },
        ],
        actions: [
          {
            type: 'Action.OpenUrl',
            title: 'View GitHub Issue',
            url: ISSUE_URL,
          },
        ],
      },
    },
  ],
};

function sendTeamsNotification() {
  const body = JSON.stringify(card);
  const webhookUrl = new URL(TEAMS_WEBHOOK_URL);

  const options = {
    hostname: webhookUrl.hostname,
    path: webhookUrl.pathname + webhookUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log(`Sending Teams notification for GitHub Issue #${ISSUE_NUMBER}...`);
  try {
    const result = await sendTeamsNotification();
    if (result.statusCode === 200 || result.statusCode === 202) {
      console.log('✅ Teams notification sent successfully');
    } else {
      throw new Error(`Unexpected status ${result.statusCode}: ${result.body}`);
    }
  } catch (err) {
    console.error('❌ Failed to send Teams notification:', err.message);
    process.exit(1);
  }
})();
