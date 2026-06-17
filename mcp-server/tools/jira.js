/**
 * Jira MCP Tool — Phase 4
 * Implements query_jira and get_jira_issue
 */

import https from 'https';

const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

function jiraRequest(path) {
  if (!JIRA_HOST || !JIRA_USER || !JIRA_TOKEN) {
    return Promise.resolve(getMockData(path));
  }

  const auth = Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString('base64');

  const options = {
    hostname: JIRA_HOST,
    path: `/rest/api/3${path}`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${auth}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Failed to parse Jira response: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function getMockData(path) {
  if (path.includes('/issue/')) {
    return {
      key: 'PLATFORM-42',
      fields: {
        summary: 'Add status validation to Ticket API',
        status: { name: 'In Progress' },
        priority: { name: 'High' },
        assignee: { displayName: 'Jane Smith' },
        description: 'The POST /tickets endpoint does not validate the status field.',
      },
    };
  }
  return {
    issues: [
      {
        key: 'PLATFORM-42',
        fields: {
          summary: 'Add status validation to Ticket API',
          status: { name: 'In Progress' },
          priority: { name: 'High' },
        },
      },
      {
        key: 'PLATFORM-38',
        fields: {
          summary: 'Ticket status field schema definition',
          status: { name: 'Done' },
          priority: { name: 'Medium' },
        },
      },
    ],
    total: 2,
    _note: 'Mock data — configure JIRA_HOST, JIRA_USER, JIRA_TOKEN for live data',
  };
}

export async function queryJira(query, project) {
  // Build JQL from natural language or direct JQL
  let jql = query.includes('=') || query.toLowerCase().includes(' and ')
    ? query  // treat as JQL
    : `text ~ "${query}"`;  // natural language → text search

  if (project) {
    jql = `project = ${project} AND (${jql})`;
  }

  const path = `/search?jql=${encodeURIComponent(jql)}&maxResults=10&fields=summary,status,priority,assignee,description`;
  return jiraRequest(path);
}

export async function getJiraIssue(key) {
  const path = `/issue/${key}?fields=summary,status,priority,assignee,description,comment`;
  return jiraRequest(path);
}
