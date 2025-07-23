#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
// Define the server capabilities and information
const server = new Server({
    name: 'simple-mcp-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Schema for the echo tool input
const EchoArgsSchema = z.object({
    message: z.string().describe('The message to echo back'),
});
// Schema for the calculator tool input  
const CalculatorArgsSchema = z.object({
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('The mathematical operation to perform'),
    a: z.number().describe('The first number'),
    b: z.number().describe('The second number'),
});
// Schema for the current time tool - no input needed
const CurrentTimeArgsSchema = z.object({});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'echo',
                description: 'Echo back the provided message',
                inputSchema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'The message to echo back',
                        },
                    },
                    required: ['message'],
                },
            },
            {
                name: 'calculator',
                description: 'Perform basic mathematical operations',
                inputSchema: {
                    type: 'object',
                    properties: {
                        operation: {
                            type: 'string',
                            enum: ['add', 'subtract', 'multiply', 'divide'],
                            description: 'The mathematical operation to perform',
                        },
                        a: {
                            type: 'number',
                            description: 'The first number',
                        },
                        b: {
                            type: 'number',
                            description: 'The second number',
                        },
                    },
                    required: ['operation', 'a', 'b'],
                },
            },
            {
                name: 'current_time',
                description: 'Get the current date and time',
                inputSchema: {
                    type: 'object',
                    properties: {},
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
            case 'echo': {
                const parsed = EchoArgsSchema.parse(args);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Echo, from the MCP Server:==> ${parsed.message}`,
                        },
                    ],
                };
            }
            case 'calculator': {
                const parsed = CalculatorArgsSchema.parse(args);
                let result;
                switch (parsed.operation) {
                    case 'add':
                        result = parsed.a + parsed.b;
                        break;
                    case 'subtract':
                        result = parsed.a - parsed.b;
                        break;
                    case 'multiply':
                        result = parsed.a * parsed.b;
                        break;
                    case 'divide':
                        if (parsed.b === 0) {
                            throw new Error('Division by zero is not allowed');
                        }
                        result = parsed.a / parsed.b;
                        break;
                    default:
                        throw new Error(`Unknown operation: ${parsed.operation}`);
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Result is from my Simple MCP Server:=> ${parsed.a} ${parsed.operation} ${parsed.b} = ${result}`,
                        },
                        {
                            type: 'text',
                            text: 'Ans is from Simple MCP Server.',
                        },
                    ],
                };
            }
            case 'current_time': {
                CurrentTimeArgsSchema.parse(args);
                const now = new Date();
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Current date and time is from my Simple MCP Server:=>: ${now.toLocaleString()}`,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
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
    console.error('Simple MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map