# Simple MCP Server

A simple Model Context Protocol (MCP) server example that demonstrates basic MCP functionality.
## What it does

This MCP server provides three basic tools:

1. **echo** - Echoes back a message you provide
2. **calculator** - Performs basic mathematical operations (add, subtract, multiply, divide)
3. **current_time** - Returns the current date and time

## Prerequisites

- Node.js 16 or higher
- npm

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Building

Build the TypeScript code:

```bash
npm run build
```

## Running the Server

Start the server in development mode:

```bash
npm run dev
```

Or run the built version:

```bash
npm start
```

## Testing with Claude Desktop

To test this MCP server with Claude Desktop, add the following configuration to your `claude_desktop_config.json`:

### Windows
Location: `%APPDATA%\Claude\claude_desktop_config.json`

### macOS/Linux
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

Configuration:
```json
{
  "mcpServers": {
    "simple-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/build/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/your/project/` with the actual path to your project directory.

## Project Structure

```
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript (generated)
├── .github/
│   └── copilot-instructions.md  # Copilot instructions
├── .vscode/
│   └── mcp.json          # VS Code MCP configuration
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Tools Available

### echo
- **Description**: Echo back the provided message
- **Parameters**:
  - `message` (string): The message to echo back

### calculator
- **Description**: Perform basic mathematical operations
- **Parameters**:
  - `operation` (enum): One of 'add', 'subtract', 'multiply', 'divide'
  - `a` (number): The first number
  - `b` (number): The second number

### current_time
- **Description**: Get the current date and time
- **Parameters**: None

## Example Usage

Once connected to an MCP client like Claude Desktop, you can use commands like:

- "Echo back the message 'Hello World'"
- "Calculate 15 plus 25"
- "What's the current time?"

## Development

This project is set up with:

- TypeScript for type safety
- Zod for runtime type validation
- MCP SDK for protocol compliance
- ES modules support

