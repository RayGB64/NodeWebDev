// Directives
"use strict";
// Namespace
const chatClientNS = (() =>
{
// References
    const formMsg = document.getElementById("form-message");
    const msgField = document.getElementById("form-message").elements["message"];
    const nameField = document.getElementById("form-message").elements["name"];
    const msgBox = document.getElementById("simple-messagebox");
// Object
    const ws = new WebSocket("ws://127.0.0.1:8080");
// Events
    ws.addEventListener("close", (clsEvnt) =>
    {
        msgBox.innerHTML += `<em>Closed with code: <strong>${clsEvnt.code}</strong> and status:
        <strong>${clsEvnt.reason}</strong></em><br>`;
    });
    ws.addEventListener("error", (event) =>
    {
        msgBox.innerHTML += `<em>Error <strong>has occured</strong></em><br>`;
    });
    ws.addEventListener("message", (msgEvnt) =>
    {
// Local Const
        const message = JSON.parse(msgEvnt.data);
        msgBox.innerHTML += `<time>${message.timestamp}</time> - ${message.name}:
        ${message.message}<br>`;
    });
    ws.addEventListener("open", () =>
    {
        msgBox.innerHTML += `<em>Connected!</em><br>`;
    });
    formMsg.addEventListener("submit", (submitEvnt) =>
    {
// Local Const
        const jsonPayload =
        {
            "name" : nameField.value,
            "message" : msgField.value
        };
// Prevent Default Behaviour (submitting a form, see URL with/without)
        submitEvnt.preventDefault();
// Make use of the string data param
        ws.send(JSON.stringify(jsonPayload));
    });
// Script Start
    msgBox.innerHTML += "<em>Loading...</em><br>";
})()