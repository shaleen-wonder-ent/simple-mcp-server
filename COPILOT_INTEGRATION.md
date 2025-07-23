# Adding Your MCP Server to GitHub Copilot

Your MCP server is now ready to be used with GitHub Copilot! Here are the steps to configure it:

## Method 1: Workspace-Specific Configuration (Recommended)

I've already created a `.vscode/settings.json` file in your workspace with the MCP server configuration. This will make your MCP server available when working in this specific workspace.

## Method 2: Global Configuration

To make your MCP server available in all VS Code workspaces, you need to add the configuration to your global VS Code settings:

### Steps:

1. **Open VS Code Command Palette** (`Ctrl+Shift+P`)

2. **Run**: `Preferences: Open User Settings (JSON)`

3. **Add the following configuration** to your global settings.json:

```json
{
  "github.copilot.chat.mcp.servers": {
    "simple-mcp-server": {
      "command": "node",
      "args": ["c:\\Users\\shaleent\\Downloads\\MyCode\\MCP\\build\\index.js"],
      "env": {}
    }
  }
}
```

**Note**: If you already have other settings in your settings.json, just add the `"github.copilot.chat.mcp.servers"` section to the existing JSON object.

## Method 3: Alternative Global Path Configuration

If you want to use a relative path that works from any directory, you can also configure it like this:

```json
{
  "github.copilot.chat.mcp.servers": {
    "simple-mcp-server": {
      "command": "node",
      "args": ["c:\\Users\\shaleent\\Downloads\\MyCode\\MCP\\build\\index.js"],
      "cwd": "c:\\Users\\shaleent\\Downloads\\MyCode\\MCP"
    }
  }
}
```

## How to Use Your MCP Server in Copilot Chat

Once configured, you can use your MCP tools in GitHub Copilot Chat:

### Available Tools:

1. **@simple-mcp-server echo** - Repeats back any message
   ```
   @simple-mcp-server echo "Hello, world!"
   ```

2. **@simple-mcp-server calculator** - Performs math operations
   ```
   @simple-mcp-server calculator add 5 3
   @simple-mcp-server calculator multiply 10 7
   ```

3. **@simple-mcp-server current_time** - Gets current timestamp
   ```
   @simple-mcp-server current_time
   ```

## Restart Required

After adding the configuration:
1. **Restart VS Code** to load the new MCP server configuration
2. **Open Copilot Chat** (Ctrl+Alt+I or from the sidebar)
3. **Start using your MCP tools** with the `@simple-mcp-server` prefix

## Troubleshooting

If your MCP server doesn't appear in Copilot Chat:

1. Check that the path to your `build/index.js` file is correct
2. Ensure your server builds successfully (`npm run build`)
3. Restart VS Code completely
4. Check the VS Code output panel for any MCP-related errors

## Making Your Server Portable

To make your MCP server easily shareable and installable by others, consider:

1. **Publishing to npm** as a global package
2. **Creating a standalone executable** using tools like `pkg`
3. **Adding installation scripts** to your package.json

Your MCP server is now ready to enhance your GitHub Copilot experience!
