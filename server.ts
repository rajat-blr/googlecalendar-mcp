import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { createEvent, listEvents } from './calendar';

const server = new McpServer({
  name: 'Google Calendar MCP Server',
  version: '1.0.0',
});

server.tool(
  'createEvent',
  {
    summary: z.string(),
    location: z.string().optional(),
    description: z.string().optional(),
    startDateTime: z.string(),
    endDateTime: z.string(),
    timeZone: z.string().default('Asia/Kolkata'),
    attendees: z.array(z.string()).optional(),
  },
  async (params) => {
    try {
      const link = await createEvent(params);
      return { content: [{ type: 'text', text: `Event created: ${link}` }] };
    } catch (e) {
      return { content: [{ type: 'text', text: `Error: ${e}` }] };
    }
  }
);

server.tool(
  'listUpcomingEvents',
  {
    maxResults: z.number().default(10),
  },
  async (params) => {
    try {
      const output = await listEvents(params.maxResults);
      return { content: [{ type: 'text', text: output }] };
    } catch (e) {
      return { content: [{ type: 'text', text: `Error: ${e}` }] };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
