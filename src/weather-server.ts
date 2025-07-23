#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Define the server capabilities and information
const server = new Server(
  {
    name: 'weather-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Constants
const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Schema for get_alerts tool input
const GetAlertsArgsSchema = z.object({
  state: z.string().length(2).describe('Two-letter US state code (e.g. CA, NY)'),
});

// Schema for get_forecast tool input  
const GetForecastArgsSchema = z.object({
  latitude: z.number().min(-90).max(90).describe('Latitude of the location'),
  longitude: z.number().min(-180).max(180).describe('Longitude of the location'),
});

// Helper function for making NWS API requests
async function makeNWSRequest(url: string): Promise<any | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    "Accept": "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error making NWS request:', error);
    return null;
  }
}

// Format alert data
function formatAlert(feature: any): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Description: ${props.description || "No description available"}`,
    `Instructions: ${props.instruction || "No specific instructions provided"}`,
    "---",
  ].join("\n");
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_alerts',
        description: 'Get weather alerts for a US state',
        inputSchema: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              description: 'Two-letter US state code (e.g. CA, NY)',
            },
          },
          required: ['state'],
        },
      },
      {
        name: 'get_forecast',
        description: 'Get weather forecast for a location',
        inputSchema: {
          type: 'object',
          properties: {
            latitude: {
              type: 'number',
              description: 'Latitude of the location',
            },
            longitude: {
              type: 'number',
              description: 'Longitude of the location',
            },
          },
          required: ['latitude', 'longitude'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_alerts': {
        const parsed = GetAlertsArgsSchema.parse(args);
        const stateCode = parsed.state.toUpperCase();
        const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
        const alertsData = await makeNWSRequest(alertsUrl);

        if (!alertsData) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to retrieve alerts data',
              },
            ],
          };
        }

        const features = alertsData.features || [];
        if (features.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No active alerts for ${stateCode}`,
              },
            ],
          };
        }

        const formattedAlerts = features.map(formatAlert);
        const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join("\n")}`;

        return {
          content: [
            {
              type: 'text',
              text: alertsText,
            },
          ],
        };
      }

      case 'get_forecast': {
        const parsed = GetForecastArgsSchema.parse(args);
        
        // Get grid point data
        const pointsUrl = `${NWS_API_BASE}/points/${parsed.latitude.toFixed(4)},${parsed.longitude.toFixed(4)}`;
        const pointsData = await makeNWSRequest(pointsUrl);

        if (!pointsData) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to retrieve grid point data for coordinates: ${parsed.latitude}, ${parsed.longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
              },
            ],
          };
        }

        const forecastUrl = pointsData.properties?.forecast;
        if (!forecastUrl) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to get forecast URL from grid point data',
              },
            ],
          };
        }

        // Get forecast data
        const forecastData = await makeNWSRequest(forecastUrl);
        if (!forecastData) {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to retrieve forecast data',
              },
            ],
          };
        }

        const periods = forecastData.properties?.periods || [];
        if (periods.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No forecast periods available',
              },
            ],
          };
        }

        // Format forecast periods (show first 5)
        const formattedForecast = periods.slice(0, 5).map((period: any) =>
          [
            `${period.name || "Unknown"}:`,
            `Temperature: ${period.temperature || "Unknown"}°${period.temperatureUnit || "F"}`,
            `Wind: ${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
            `${period.shortForecast || "No forecast available"}`,
            "---",
          ].join("\n"),
        );

        const forecastText = `Forecast for ${parsed.latitude}, ${parsed.longitude}:\n\n${formattedForecast.join("\n")}`;

        return {
          content: [
            {
              type: 'text',
              text: forecastText,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Error handling
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.close();
  process.exit(0);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with stdio communication
  console.error('Weather MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
