"use strict";
let sendbutton = document.getElementById("sendbutton");
let myForm = document.getElementById("myForm");
let date = document.getElementById("dateinput");
let div = document.getElementById("kasten");
//let formData: FormData = new FormData(document.forms[0]);
let formData = new FormData(myForm);
sendbutton.addEventListener("click", sendForm);
async function sendForm(_event) {
    let formData = new FormData(myForm);
    let url = "http://127.0.0.1:3000/convertDate";
    let query = new URLSearchParams(formData);
    url = url + "?" + query.toString();
    let response = await fetch(url);
    let text = await response.text();
    console.log("Answer:");
    console.log(text);
    let responsetext = document.createElement("p");
    document.getElementById("response").appendChild(responsetext);
    responsetext.innerHTML = text;
}
//# sourceMappingURL=client.js.map