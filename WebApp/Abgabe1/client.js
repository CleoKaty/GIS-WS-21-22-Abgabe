"use strict";
//namespace Client {
const url = "http://127.0.0.1:3000"; //URL
const path = "/concertEvents";
let interpret = document.getElementById("interpret");
let preis = document.getElementById("preis");
let datum = document.getElementById("zeit");
let button = document.getElementById("enter");
console.log(interpret);
async function sendJSONStringWithPOST(url, jsonString) {
    await fetch(url, {
        method: "post",
        body: jsonString
    });
}
button.addEventListener("click", () => {
    if (interpret.value != "" && preis.value != "" && datum.value != "") {
        interpret.style.borderColor = "black";
        preis.style.borderColor = "black";
        datum.style.borderColor = "black";
        sendJSONStringWithPOST("http://localhost:3000/concertEvents", JSON.stringify({
            Interpret: interpret.value,
            Preis: preis.value,
            Datum: datum.value
        }));
    }
    else {
        if (interpret.value == "") {
            interpret.style.borderColor = "red";
        }
        if (preis.value == "") {
            preis.style.borderColor = "red";
        }
        if (datum.value == "") {
            datum.style.borderColor = "red";
        }
    }
});
async function requestConcert() {
    let response = await fetch(`http://localhost:3000/concertEvents?concerts`);
    let text = await response.text();
    return JSON.parse(text);
}
async function displayConcerts() {
    let concerts = await requestConcert();
    let tbody = document.getElementById("table");
    removeChildren(tbody);
    for (let concert of concerts) {
        let tr = document.createElement("tr");
        tr.dataset.id = concert._id;
        for (let info of [
            concert.interpret,
            concert.preis,
            concert.datum
        ]) {
            let td = document.createElement("td");
            td.textContent = `${info}`;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}
function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
//}
//# sourceMappingURL=client.js.map