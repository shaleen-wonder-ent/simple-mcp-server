# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Model Context Protocol (MCP) server project written in TypeScript. 

## Key Guidelines:

- Use the MCP SDK (@modelcontextprotocol/sdk) for all MCP-related functionality
- Follow MCP best practices for tool definitions and server implementation
- Use TypeScript with proper type definitions
- Implement tools that provide meaningful functionality to LLM clients
- Handle errors gracefully and provide helpful error messages
- Use Zod for input validation and schema definitions

## Resources:

- You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt
- MCP SDK documentation: https://github.com/modelcontextprotocol/typescript-sdk
- Follow the blog tutorial: https://composio.dev/blog/mcp-server-step-by-step-guide-to-building-from-scrtch

## Project Structure:

- `src/` - Source code directory
- `src/index.ts` - Main server implementation
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
