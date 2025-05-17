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

    /* Interval list */
    let IntervalList = [];
    let clear = 'false';

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
                        IntervalList.push(`${message.payload.topic}`);
                        break;

                    case "unsub":
                        statusBox.innerHTML += `Unsubscribed from ${message.payload.topic} <br>`;

                        const index = IntervalList.findIndex(item => item.name === `${message.payload.topic}`);

                        // If found, remove it using splice
                        if (index !== -1) {
                          items.splice(index, 1);
                        }
                        break;
                }

                break;
            case "dat":
                console.log("Arrived");
                console.log(clear);
                if (clear == 'false') {
                    const Inter = setInterval(() => {
                        console.log("Interval Received");
                        statusBox.innerHTML += `Train ID: ${message.payload.topic} Time:${message.payload.msg} <br>`;
                        const isLast = IntervalList.at(-1);
                        console.log(`${isLast}`);
                        console.log(`${message.payload.topic}`);
                        if (isLast == `${message.payload.topic}`) {
                            clear = 'true';
                        }
                        clearInterval(Inter);
                    }, 180000); //Pauses for 3 minutes before uploading next
                    break;
                } else if (clear == 'true') {
                    console.log("Else if");
                        if (statusBox.innerHTML.trim() !== "") {
                            statusBox.innerHTML = "";
                            statusBox.innerHTML += `The site is updating with train times... <br>`; 
                            clear = 'false';
                        };
                    break;
                };
            default:
                break;
        }
    });

    sock.addEventListener("open", () =>
    {
        statusBox.innerHTML += `Connection opened<br>`;
    });
})();