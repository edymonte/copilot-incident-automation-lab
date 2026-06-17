/**
 * MCP Server — Incident Management
 * Phase 4: Connects GitHub Copilot Agent to ServiceNow, Jira, and Azure DevOps
 *
 * Usage:
 *   node mcp-server/index.js
 *
 * Environment variables:
 *   SNOW_INSTANCE    — ServiceNow instance hostname
 *   SNOW_USER        — ServiceNow username
 *   SNOW_PASSWORD    — ServiceNow password
 *   JIRA_HOST        — Jira host (e.g. yourorg.atlassian.net)
 *   JIRA_USER        — Jira email
 *   JIRA_TOKEN       — Jira API token
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getIncident, updateIncident, listIncidents } from './tools/servicenow.js';
import { queryJira, getJiraIssue } from './tools/jira.js';

const server = new Server(
  {
    name: 'incident-management-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_incident',
      description: 'Retrieve a ServiceNow incident by its number (e.g. INC00012345)',
      inputSchema: {
        type: 'object',
        properties: {
          number: {
            type: 'string',
            description: 'ServiceNow incident number (e.g. INC00012345)',
          },
        },
        required: ['number'],
      },
    },
    {
      name: 'update_incident',
      description: 'Update the status or work notes of a ServiceNow incident',
      inputSchema: {
        type: 'object',
        properties: {
          number: {
            type: 'string',
            description: 'ServiceNow incident number',
          },
          state: {
            type: 'string',
            enum: ['New', 'In Progress', 'On Hold', 'Resolved', 'Closed'],
            description: 'New incident state',
          },
          work_notes: {
            type: 'string',
            description: 'Work notes to add to the incident',
          },
        },
        required: ['number'],
      },
    },
    {
      name: 'list_incidents',
      description: 'List open ServiceNow incidents, optionally filtered by priority',
      inputSchema: {
        type: 'object',
        properties: {
          priority: {
            type: 'string',
            enum: ['1', '2', '3', '4', '5'],
            description: '1=Critical, 2=High, 3=Moderate, 4=Low, 5=Planning',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results (default: 10)',
          },
        },
      },
    },
    {
      name: 'query_jira',
      description: 'Query Jira issues related to an incident using JQL',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'JQL query string or natural language description (e.g. "issues related to ticket API status validation")',
          },
          project: {
            type: 'string',
            description: 'Jira project key to scope the search (optional)',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_jira_issue',
      description: 'Retrieve a specific Jira issue by its key (e.g. PROJ-123)',
      inputSchema: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: 'Jira issue key (e.g. PROJ-123)',
          },
        },
        required: ['key'],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_incident': {
        const incident = await getIncident(args.number);
        return {
          content: [{ type: 'text', text: JSON.stringify(incident, null, 2) }],
        };
      }

      case 'update_incident': {
        const result = await updateIncident(args.number, {
          state: args.state,
          work_notes: args.work_notes,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'list_incidents': {
        const incidents = await listIncidents({
          priority: args.priority,
          limit: args.limit || 10,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(incidents, null, 2) }],
        };
      }

      case 'query_jira': {
        const issues = await queryJira(args.query, args.project);
        return {
          content: [{ type: 'text', text: JSON.stringify(issues, null, 2) }],
        };
      }

      case 'get_jira_issue': {
        const issue = await getJiraIssue(args.key);
        return {
          content: [{ type: 'text', text: JSON.stringify(issue, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Incident Management MCP Server running on stdio');
