#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var zod_1 = require("zod");
// Define the server capabilities and information
var server = new index_js_1.Server({
    name: 'simple-mcp-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Schema for the echo tool input
var EchoArgsSchema = zod_1.z.object({
    message: zod_1.z.string().describe('The message to echo back'),
});
// Schema for the calculator tool input  
var CalculatorArgsSchema = zod_1.z.object({
    operation: zod_1.z.enum(['add', 'subtract', 'multiply', 'divide']).describe('The mathematical operation to perform'),
    a: zod_1.z.number().describe('The first number'),
    b: zod_1.z.number().describe('The second number'),
});
// Schema for the current time tool - no input needed
var CurrentTimeArgsSchema = zod_1.z.object({});
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
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
            }];
    });
}); });
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, parsed, parsed, result, now, errorMessage;
    return __generator(this, function (_b) {
        _a = request.params, name = _a.name, args = _a.arguments;
        try {
            switch (name) {
                case 'echo': {
                    parsed = EchoArgsSchema.parse(args);
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Echo: ".concat(parsed.message),
                                },
                            ],
                        }];
                }
                case 'calculator': {
                    parsed = CalculatorArgsSchema.parse(args);
                    result = void 0;
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
                            throw new Error("Unknown operation: ".concat(parsed.operation));
                    }
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Result: ".concat(parsed.a, " ").concat(parsed.operation, " ").concat(parsed.b, " = ").concat(result),
                                },
                            ],
                        }];
                }
                case 'current_time': {
                    CurrentTimeArgsSchema.parse(args);
                    now = new Date();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Current date and time: ".concat(now.toLocaleString()),
                                },
                            ],
                        }];
                }
                default:
                    throw new Error("Unknown tool: ".concat(name));
            }
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return [2 /*return*/, {
                    content: [
                        {
                            type: 'text',
                            text: "Error: ".concat(errorMessage),
                        },
                    ],
                    isError: true,
                }];
        }
        return [2 /*return*/];
    });
}); });
// Error handling
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
// Start the server
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    // Log to stderr so it doesn't interfere with stdio communication
                    console.error('Simple MCP Server running on stdio');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
