// Directives
"use strict";
// Imports
import * as http from "http";
// Constants
const port = 8080;
// Server Objects
const server = http.createServer((req,res) =>
{
    // Local Consts
    const usrAddr = req.socket.remoteAddress;
    const usrPort = req.socket.remotePort;
    res.end(`User IP: ${usrAddr} | User Port: ${usrPort}`);
});
// Script
server.listen(port, () =>
{
    console.log(`Listening @ ${port}`);
});