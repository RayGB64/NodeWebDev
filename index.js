// Directives
"use strict";

// Imports
import { WebSocket, WebSocketServer } from "ws";

// Server Object
const wsServer = new WebSocketServer({port: 8080});

// Event Listeners
wsServer.on("listening", () =>
{
    console.log("WebSocket Server listening...");
});
wsServer.on("connection", (sock) =>
{
    console.log("Client connected...");
    
    sock.on("ping", (data) =>
    {
        console.log(`Received: ${data}`);
    });
    sock.on("close", () =>
    {
        console.log("Client disconnected...");
    })
});