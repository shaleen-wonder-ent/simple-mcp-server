import { spawn } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = spawn('node', ['build/weather-server.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

const request = {
  jsonrpc: '2.0',
  id: '1',
  method: 'CallTool',
  params: {
    name: 'get_forecast',
    arguments: {
      latitude: 25.7617,
      longitude: -80.1918
    }
  }
};

server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('Server log:', data.toString());
});

server.stdin.write(JSON.stringify(request) + '\n');
