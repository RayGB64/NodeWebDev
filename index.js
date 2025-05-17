/* Directives */
"use strict";

/* Imports (npm modules, custom) */
import JSONArrayError from "./json-array-error.js";
import mqtt from "mqtt";
import {WebSocket, WebSocketServer} from "ws";

/* Middleware Connection Constants */
const webSockPort = 80;
const mqttOptions =
{
    clean: true,
    username: "a016132n",
    password: "cNB2SWtGEre8seW",
    protocol: "mqtts",
    host: "111d456bad854cf0894967ba4b8ef587.s1.eu.hivemq.cloud",
    port: 8883
};

/* Middleware Objects */
const mqttMSubscriber = mqtt.connect(mqttOptions);
const webSocketServer = new WebSocket.WebSocketServer({port: webSockPort});

function action_wsclient_command(message) /**/
{
    try
    {
        message = JSON.parse(message);
    }
    catch (err)
    {
        console.log(`Error: ${err} couldn't parse JSON...`);
        return;
    }
    if(message.msgType === "cmd")
    {
        switch(message.payload.msg)
        {
            case "unsub":
                mqtt_unsub(message.payload.topic);
                break;
            case "sub":
                mqtt_sub(message.payload.topic);
                break;
            default:
                break;
        }
    }
}

function broadcast_to_websocket_clients(payload)
{
    webSocketServer.clients.forEach((client) =>
    {
    if(client.readyState === WebSocket.OPEN)
        {
            client.send(payload);
        }
    });
}

function mqtt_sub(topic)
{
    // Limited to only accepting one from the client...but remember we can do this as an array!
    mqttMSubscriber.subscribe(topic, (err, granted) =>
    {
        // Local Variable
        let data;

        if(err)
        {
            console.log(`Problem encountered attempting to sub ${err}`);
        }
        else
        {
            data =
            {
                msgType: "cmd",
                payload:
                {
                    msg: "sub",
                    topic: granted[0].topic.toString()
                }
            }
            
        broadcast_to_websocket_clients(JSON.stringify(data));
        console.log(`Subscribed to ${granted[0].topic}`);
        }
    });
}

function mqtt_unsub(topic)
{
    mqttMSubscriber.unsubscribe(topic, (err) =>
    {
        // Local Variable
        let data;
        if(err)
        {
            console.log(`Problem encountered attempting to unsub ${err}`);
        }
        else
        {
            data =
            {
                msgType: "cmd",
                payload:
                {
                    msg: "unsub",
                    topic: topic.toString()
                }
            }
            broadcast_to_websocket_clients(JSON.stringify(data));
            console.log(`Unsubscribed from ${topic}`);
        }
    });
}

/************************************************************************************** MQTT EVENTS */
mqttMSubscriber.on("close", () => //MQTT disconnecting
{
    console.log(`Connection to broker ${mqttOptions.host} closed...`);
});
mqttMSubscriber.on("error", (err) => //MQTT catching errors
{
    console.log(`There was an error ${err}`);
});
mqttMSubscriber.on("connect", () => //MQTT connecting
{
    console.log(`Successfully connected to broker ${mqttOptions.host}`);
});
mqttMSubscriber.on("message", (topic, message) => //MQTT sending message to user
{
    // Compile message to broadcast
    // This code shares the arrival time of the next train into the established protocol
    const data =
    {
        msgType : "dat",
        payload:
        {
            msg: JSON.parse(message)[0].expectedArrival,
            topic: topic.toString()
        },
    };

    broadcast_to_websocket_clients(JSON.stringify(data));
    console.log(`Message sent to ${webSocketServer.clients.size} clients...`);
});

/********************************************************************************* WEBSOCKET EVENTS */
webSocketServer.on("connection", (sock) => //This is how the server responds to an incoming connection
{
    console.log(`New client connection...`);

    /******************************************************************************** CLIENT EVENTS */
    sock.on("close", (code, reason) => //When the client disconnects
    {
        console.log(`Client disconnected with code: ${code}`);
    });

    sock.on("message", (msgData) => //When the client messages
    {
        action_wsclient_command(msgData);
    });
});
webSocketServer.on("error", (err) => //Error catching
{
    console.log(`Server encountered an error ${err}`);
});
webSocketServer.on("listening", () =>
{
    console.log(`Successfully started server at port: ${webSockPort}`);
});