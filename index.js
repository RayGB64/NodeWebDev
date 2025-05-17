/* Directive */
"use strict";

/* Namespace */
const ns_client = (() =>
{
    /* References */
    const statusBox = document.getElementById("status-box");
    const subForm = document.getElementById("sub-form");
    const subTrain = document.getElementById("sub-form").elements["Train-sub"];
    const unsubForm = document.getElementById("unsub-form");
    const unsubTrain = document.getElementById("unsub-form").elements["Train-unsub"];

    /* Client Init */
    const sock = new WebSocket("ws://127.0.0.1")

    /* Script Start */
    statusBox.innerHTML += `Loading...<br>`;

/************************************************************************************** FORM EVENTS */
    subForm.addEventListener("submit", (submitEvnt) =>
    {
        // Send sub/unsub to middleware
        const data =
        {
            msgType: "cmd",
            payload:
            {
                msg: "sub",
                topic: subTrain.value,
            }
        }

        // Prevent Default Behaviour (submitting a form, see URL with/without)
        submitEvnt.preventDefault();

        console.log(data.payload.msg);
        sock.send(JSON.stringify(data));
    });
    
    unsubForm.addEventListener("submit", (submitEvnt) =>
    {
        // Send sub/unsub to middleware
        const data =
        {
            msgType: "cmd",
            payload:
            {
                msg: "unsub",
                topic: unsubTrain.value,
            }
        }

        // Prevent Default Behaviour (submitting a form, see URL with/without)
        submitEvnt.preventDefault();

        console.log(data.payload.msg);
        sock.send(JSON.stringify(data));
    });

/********************************************************************************* WEBSOCKET EVENTS */
    sock.addEventListener("close", (clsEvnt) =>
    {
        statusBox.innerHTML += `Closed with code: ${clsEvnt.code}<br>`;
    });

    sock.addEventListener("message", (msgEvent) =>
    {
        // Parse it
        const message = JSON.parse(msgEvent.data);
        // handle sub/unsub
        switch(message.msgType)
        {
            case "cmd":
                switch(message.payload.msg)
                {
                    case "sub":
                        statusBox.innerHTML += `Subscribed to ${message.payload.topic} <br>`;
                        break;
                    case "unsub":
                        statusBox.innerHTML += `Unsubscribed from ${message.payload.topic} <br>`;
                        break;
                }

                break;
            case "dat":
                console.log("Interval Received")
                setInterval(() => {
                    if (statusBox.innerHTML.trim() !== "") {
                        statusBox.innerHTML = "";
                    }
                    statusBox.innerHTML += `Train arriving Interval: <br>`;
                    statusBox.innerHTML += `Train ID: ${message.payload.topic} Time:${message.payload.msg} <br>`;
                    console.log("Interval Completed")
                }, 180000);
                break;
            default:
                break;
        }
    });

    sock.addEventListener("open", () =>
    {
        statusBox.innerHTML += `Connection opened<br>`;
    });
})();