// Directives
"use strict";
// Imports
import WebSocket from "ws";
// Server Objects
const client = new WebSocket("wss://websocket-echo.com");
// Server Scope Variables
let pingInterval;
let pongCount = 0;
// Event Listeners
client.onclose = (close) =>
{
console.log(`Connection closed: ${close.reason} - Was clean: ${close.wasClean}`);
};
client.onmessage = (msg) =>
{
console.log(`Recv: ${msg.data}`);
};
client.onopen = () =>
{
console.log(`Connection opened!`);
};
client.on("pong", () =>
{
console.log(`Ponged ${++pongCount}`);
});
// Script
pingInterval = setInterval(() =>
{
client.ping();
}, 2000);
setTimeout(() =>
{
clearInterval(pingInterval);
client.close(1000, "Work complete.");
}, 10000);