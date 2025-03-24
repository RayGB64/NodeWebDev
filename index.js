// Directives
"use strict";
// Imports
import { WebSocket } from "ws";
// Objects
const sock = new WebSocket("ws://127.0.0.1:8080");
// Consts
const pingMSInterval = 1000;

// Event Listeners
sock.on("close", (code, buff) =>
{
    console.log(`Connection Closed!\nCode: ${code}\nReason: ${buff}`);
});

sock.on("open", () =>
{
    console.log("Connection Opened!");
});

sock.on("pong" , (data) =>
{
    console.log(`Received: ${data}`);
});

sock.on("error", (err) =>
{
    console.error(err);
});

// Script
setInterval(() =>
{
    sock.ping("ping", true);
}, pingMSInterval);