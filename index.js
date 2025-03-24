// Directives
"use strict";
// Imports
import { WebSocket, WebSocketServer } from "ws";
// Consts
const port = 8080;
// Object
const wsServer = new WebSocketServer( {port: port} );

wsServer.on("error", (err) =>
{
    console.error(`Server encountered an error: ${err}`);
});

wsServer.on("listening", () =>
{
    console.log(`Server started successfully at port: ${port}`);
});

wsServer.on("connection", (sock) =>
{
    console.log("New client connected!");
    // Client Events
    sock.on("close", (code, reason) =>
    {
        console.log(`Client has disconnected with code: ${code} and reason: ${reason}`);
    });
    
    sock.on("message", (msgData) =>
    {
        // Local Variables
        let jsonMsg;
        let broadcastPayload;
        // Parsing
        msgData = msgData.toString();
        jsonMsg = JSON.parse(msgData);
        // Add server timestamp
        jsonMsg.timestamp = new Date().toLocaleString("en-GB");
        // Prep for broadcast
        broadcastPayload = JSON.stringify(jsonMsg);
        // Broadcoast: https://github.com/websockets/ws/tree/master#server-broadcast
        wsServer.clients.forEach((client) =>
        {
            if(client.readyState === WebSocket.OPEN)
            {
                client.send(broadcastPayload);
            }
        });
    });
});