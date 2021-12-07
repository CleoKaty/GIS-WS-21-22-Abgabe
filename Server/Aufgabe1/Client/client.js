"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client;
(function (Client) {
    console.log("client läuft");
    const url = "http://127.0.0.1:3000";
    const myForm = document.getElementById("myForm");
    const sendbutton = document.getElementById("sendbutton");
    const date = document.getElementById("dateinput");
    const div = document.getElementById("kasten");
    sendbutton.addEventListener("click", function (evt) {
        evt.preventDefault();
        sendForm();
    });
    async function sendForm() {
        let formData = new FormData(myForm);
        let query = new URLSearchParams(formData);
        let urlwithQuery = url + "?" + query.toString();
        let text = document.createElement("p");
        text.textContent = date.toString();
        div.appendChild(text);
        let response = await fetch(urlwithQuery);
        let responseText = await response.text();
        console.log(responseText);
    }
})(Client || (Client = {}));
//# sourceMappingURL=client.js.map