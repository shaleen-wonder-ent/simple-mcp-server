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
    name: 'weather-mcp-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Constants
var NWS_API_BASE = "https://api.weather.gov";
var USER_AGENT = "weather-app/1.0";
// Schema for get_alerts tool input
var GetAlertsArgsSchema = zod_1.z.object({
    state: zod_1.z.string().length(2).describe('Two-letter US state code (e.g. CA, NY)'),
});
// Schema for get_forecast tool input  
var GetForecastArgsSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90).describe('Latitude of the location'),
    longitude: zod_1.z.number().min(-180).max(180).describe('Longitude of the location'),
});
// Helper function for making NWS API requests
function makeNWSRequest(url) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = {
                        "User-Agent": USER_AGENT,
                        "Accept": "application/geo+json",
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, { headers: headers })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error making NWS request:', error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Format alert data
function formatAlert(feature) {
    var props = feature.properties;
    return [
        "Event: ".concat(props.event || "Unknown"),
        "Area: ".concat(props.areaDesc || "Unknown"),
        "Severity: ".concat(props.severity || "Unknown"),
        "Description: ".concat(props.description || "No description available"),
        "Instructions: ".concat(props.instruction || "No specific instructions provided"),
        "---",
    ].join("\n");
}
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
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
            }];
    });
}); });
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, args, _b, parsed, stateCode, alertsUrl, alertsData, features, formattedAlerts, alertsText, parsed, pointsUrl, pointsData, forecastUrl, forecastData, periods, formattedForecast, forecastText, error_2, errorMessage;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = request.params, name = _a.name, args = _a.arguments;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 9, , 10]);
                _b = name;
                switch (_b) {
                    case 'get_alerts': return [3 /*break*/, 2];
                    case 'get_forecast': return [3 /*break*/, 4];
                }
                return [3 /*break*/, 7];
            case 2:
                parsed = GetAlertsArgsSchema.parse(args);
                stateCode = parsed.state.toUpperCase();
                alertsUrl = "".concat(NWS_API_BASE, "/alerts?area=").concat(stateCode);
                return [4 /*yield*/, makeNWSRequest(alertsUrl)];
            case 3:
                alertsData = _e.sent();
                if (!alertsData) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: 'Failed to retrieve alerts data',
                                },
                            ],
                        }];
                }
                features = alertsData.features || [];
                if (features.length === 0) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "No active alerts for ".concat(stateCode),
                                },
                            ],
                        }];
                }
                formattedAlerts = features.map(formatAlert);
                alertsText = "Active alerts for ".concat(stateCode, ":\n\n").concat(formattedAlerts.join("\n"));
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: alertsText,
                            },
                        ],
                    }];
            case 4:
                parsed = GetForecastArgsSchema.parse(args);
                pointsUrl = "".concat(NWS_API_BASE, "/points/").concat(parsed.latitude.toFixed(4), ",").concat(parsed.longitude.toFixed(4));
                return [4 /*yield*/, makeNWSRequest(pointsUrl)];
            case 5:
                pointsData = _e.sent();
                if (!pointsData) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Failed to retrieve grid point data for coordinates: ".concat(parsed.latitude, ", ").concat(parsed.longitude, ". This location may not be supported by the NWS API (only US locations are supported)."),
                                },
                            ],
                        }];
                }
                forecastUrl = (_c = pointsData.properties) === null || _c === void 0 ? void 0 : _c.forecast;
                if (!forecastUrl) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: 'Failed to get forecast URL from grid point data',
                                },
                            ],
                        }];
                }
                return [4 /*yield*/, makeNWSRequest(forecastUrl)];
            case 6:
                forecastData = _e.sent();
                if (!forecastData) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: 'Failed to retrieve forecast data',
                                },
                            ],
                        }];
                }
                periods = ((_d = forecastData.properties) === null || _d === void 0 ? void 0 : _d.periods) || [];
                if (periods.length === 0) {
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: 'No forecast periods available',
                                },
                            ],
                        }];
                }
                formattedForecast = periods.slice(0, 5).map(function (period) {
                    return [
                        "".concat(period.name || "Unknown", ":"),
                        "Temperature: ".concat(period.temperature || "Unknown", "\u00B0").concat(period.temperatureUnit || "F"),
                        "Wind: ".concat(period.windSpeed || "Unknown", " ").concat(period.windDirection || ""),
                        "".concat(period.shortForecast || "No forecast available"),
                        "---",
                    ].join("\n");
                });
                forecastText = "Forecast for ".concat(parsed.latitude, ", ").concat(parsed.longitude, ":\n\n").concat(formattedForecast.join("\n"));
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: forecastText,
                            },
                        ],
                    }];
            case 7: throw new Error("Unknown tool: ".concat(name));
            case 8: return [3 /*break*/, 10];
            case 9:
                error_2 = _e.sent();
                errorMessage = error_2 instanceof Error ? error_2.message : 'Unknown error occurred';
                return [2 /*return*/, {
                        content: [
                            {
                                type: 'text',
                                text: "Error: ".concat(errorMessage),
                            },
                        ],
                        isError: true,
                    }];
            case 10: return [2 /*return*/];
        }
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
                    console.error('Weather MCP Server running on stdio');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
