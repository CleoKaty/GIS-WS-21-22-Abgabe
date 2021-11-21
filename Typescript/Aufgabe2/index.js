"use strict";
var Aufgabe;
(function (Aufgabe) {
    /*Kill me pls */
    let interpret = document.getElementById("interpret");
    let preis = document.getElementById("preis");
    let datum = document.getElementById("zeit");
    let button = document.getElementById("enter");
    console.log(interpret);
    button.addEventListener("click", () => {
        if (interpret.value != "" && preis.value != "" && datum.value != "") {
            interpret.style.borderColor = "black";
            preis.style.borderColor = "black";
            datum.style.borderColor = "black";
            let liste = document.createElement("tr");
            let a = document.createElement("td");
            let b = document.createElement("td");
            let c = document.createElement("td");
            let d = document.createElement("td");
            let deletebutton = document.createElement("button");
            deletebutton.innerText = "delete";
            document.getElementById("table").appendChild(liste);
            a.innerText = interpret.value;
            b.innerText = preis.value;
            c.innerText = datum.value;
            d.appendChild(deletebutton);
            liste.appendChild(a);
            liste.appendChild(b);
            liste.appendChild(c);
            liste.appendChild(d);
            deletebutton.addEventListener("click", deleter);
            function deleter() {
                document.getElementById("table").removeChild(liste);
            }
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
})(Aufgabe || (Aufgabe = {}));
//# sourceMappingURL=index.js.map