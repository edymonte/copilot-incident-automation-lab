/**
 * ServiceNow MCP Tool — Phase 4
 * Implements get_incident, update_incident, list_incidents
 */

import https from 'https';

const SNOW_INSTANCE = process.env.SNOW_INSTANCE;
const SNOW_USER = process.env.SNOW_USER;
const SNOW_PASSWORD = process.env.SNOW_PASSWORD;

function snowRequest(path, method = 'GET', body = null) {
  if (!SNOW_INSTANCE || !SNOW_USER || !SNOW_PASSWORD) {
    // Return mock data when credentials are not configured (demo mode)
    return Promise.resolve(getMockData(path));
  }

  const auth = Buffer.from(`${SNOW_USER}:${SNOW_PASSWORD}`).toString('base64');
  const bodyStr = body ? JSON.stringify(body) : null;

  const options = {
    hostname: SNOW_INSTANCE,
    path: `/api/now${path}`,
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
      ...(bodyStr && { 'Content-Length': Buffer.byteLength(bodyStr) }),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).result);
        } catch {
          reject(new Error(`Failed to parse ServiceNow response: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function getMockData(path) {
  if (path.includes('INC00012345')) {
    return {
      number: 'INC00012345',
      short_description: 'Ticket API accepting invalid status values',
      state: 'In Progress',
      priority: 'High',
      assignment_group: 'Cloud Platform',
      assigned_to: 'John Doe',
      opened_at: '2026-06-16T03:00:01Z',
      work_notes: 'GitHub Copilot Agent is analyzing the issue',
    };
  }
  return { message: 'Mock data — configure SNOW_INSTANCE, SNOW_USER, SNOW_PASSWORD for live data' };
}

export async function getIncident(number) {
  const results = await snowRequest(
    `/table/incident?sysparm_query=number=${number}&sysparm_limit=1&sysparm_fields=number,short_description,description,state,priority,assignment_group,assigned_to,opened_at,work_notes`
  );
  return Array.isArray(results) ? results[0] : results;
}

export async function updateIncident(number, { state, work_notes }) {
  const existing = await getIncident(number);
  if (!existing?.sys_id && !SNOW_INSTANCE) {
    return { ...existing, state: state || existing.state, work_notes: work_notes || existing.work_notes, _updated: true };
  }

  const stateMap = {
    'New': '1',
    'In Progress': '2',
    'On Hold': '3',
    'Resolved': '6',
    'Closed': '7',
  };

  const updates = {};
  if (state) updates.state = stateMap[state] || '2';
  if (work_notes) updates.work_notes = work_notes;

  return snowRequest(`/table/incident/${existing.sys_id}`, 'PATCH', updates);
}

export async function listIncidents({ priority, limit = 10 }) {
  let query = 'active=true^state!=7';
  if (priority) query += `^priority=${priority}`;

  return snowRequest(
    `/table/incident?sysparm_query=${encodeURIComponent(query)}&sysparm_limit=${limit}&sysparm_fields=number,short_description,state,priority,assigned_to,opened_at`
  );
}
