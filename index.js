// Directives
"use strict";
// Imports
import * as http from "http";
// Constants
const port = 8080;
// Create server at 127.0.0.1:8080
http.createServer((req, res) =>
{
/**
* This is equal to response.write followed by response.end
* end only sends text, does not set "Content-Type" unless you explicitly do so
* send can respond with html, json etc
**/
res.end("Hello World");
}).listen(port);