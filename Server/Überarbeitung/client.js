"use strict";
var Client;
(function (Client) {
    console.log("Client läuft"); //Testausgabe
    const url = "http://127.0.0.1:3000"; //URL
    const path = "/convertDate";
    const sendButton = document.getElementById("sendbutton");
    const myForm = document.getElementById("myForm");
    const date = document.getElementById("dateinput");
    const div = document.getElementById("kasten");
    sendButton.addEventListener("click", function (evt) {
        evt.preventDefault();
        sendForm();
    });
    console.log(myForm, sendButton);
    async function sendForm() {
        //Vorbereiten der Formulardaten zum Sende-Prozess
        let formData = new FormData(myForm);
        let query = new URLSearchParams(formData);
        let urlWithQuery = url + path + "?" + query.toString(); //Url schreiben
        let response = await fetch(urlWithQuery);
        let responseText = await response.text();
        console.log(responseText);
        let responsetext = document.createElement("p");
        div.appendChild(responsetext);
        responsetext.innerHTML = responseText;
    }
})(Client || (Client = {}));
//# sourceMappingURL=client.js.map