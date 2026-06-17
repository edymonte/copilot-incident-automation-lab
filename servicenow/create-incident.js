/**
 * create-incident.js — Phase 2: ServiceNow Integration
 *
 * Creates a ServiceNow incident when a GitHub Issue is created.
 * Intended to run as a GitHub Action step.
 *
 * Required environment variables:
 *   SNOW_INSTANCE  — e.g. dev12345.service-now.com
 *   SNOW_USER      — ServiceNow username
 *   SNOW_PASSWORD  — ServiceNow password
 *   ISSUE_TITLE    — GitHub Issue title
 *   ISSUE_URL      — GitHub Issue URL
 *   ISSUE_NUMBER   — GitHub Issue number
 */

const https = require('https');

const {
  SNOW_INSTANCE,
  SNOW_USER,
  SNOW_PASSWORD,
  ISSUE_TITLE,
  ISSUE_URL,
  ISSUE_NUMBER,
} = process.env;

const REQUIRED = ['SNOW_INSTANCE', 'SNOW_USER', 'SNOW_PASSWORD', 'ISSUE_TITLE', 'ISSUE_URL'];
const missing = REQUIRED.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const incident = {
  short_description: `[GitHub #${ISSUE_NUMBER}] ${ISSUE_TITLE}`,
  description: `Incident created automatically from GitHub Issue.\n\nIssue URL: ${ISSUE_URL}`,
  priority: '2',
  urgency: '2',
  impact: '2',
  assignment_group: 'Cloud Platform',
  category: 'Software',
};

function createSnowIncident() {
  const body = JSON.stringify(incident);
  const auth = Buffer.from(`${SNOW_USER}:${SNOW_PASSWORD}`).toString('base64');

  const options = {
    hostname: SNOW_INSTANCE,
    path: '/api/now/table/incident',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (res.statusCode === 201) {
          resolve(parsed.result);
        } else {
          reject(new Error(`ServiceNow API error ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log(`Creating ServiceNow incident for GitHub Issue #${ISSUE_NUMBER}...`);
  try {
    const result = await createSnowIncident();
    console.log(`✅ ServiceNow incident created: ${result.number}`);
    console.log(`   Sys ID: ${result.sys_id}`);
    console.log(`   URL: https://${SNOW_INSTANCE}/nav_to.do?uri=incident.do?sys_id=${result.sys_id}`);
  } catch (err) {
    console.error('❌ Failed to create ServiceNow incident:', err.message);
    process.exit(1);
  }
})();
