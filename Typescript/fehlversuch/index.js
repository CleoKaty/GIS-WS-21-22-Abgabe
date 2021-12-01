"use strict";
var Aufgabe;
(function (Aufgabe) {
    /*Events definieren */
    class Eventis {
        person;
        preis;
        datum;
        constructor(person, preis, datum) {
            this.person = person;
            this.preis = preis;
            this.datum = datum;
        }
    }
    /*Geholte Elemente von html */
    let interpret = document.getElementById("interpret");
    let preis = document.getElementById("preis");
    let datum = document.getElementById("zeit");
    let button = document.getElementById("enter");
    let arrayevents = [];
    let localstoragearray;
    let localstoragestring = localStorage.getItem("myArray");
    localstoragearray = JSON.parse(localstoragestring);
    /*Array anlegen und mit Json im Local-Storage abspeichern */
    if (localStorage.length == 0) {
        let standartevent = new Eventis("Mamamoo", "32.9", "21.08.2021");
        let eventstring = JSON.stringify(standartevent);
        localStorage.setItem("myArray", eventstring);
    }
    update();
    aktualisierenListe();
    let stringarray = JSON.stringify(arrayevents);
    /*localStorage.setItem("myArray", stringarray);*/
    /*local storage events abrufen */
    function update() {
        if (localstoragearray != null && localstoragearray.length > 0) {
            for (let index = 0; index < localstoragearray.length; index++) {
                /*Elemente anlegen für neue Tabelleneinträge */
                let liste = document.createElement("tr");
                let a = document.createElement("td");
                let b = document.createElement("td");
                let c = document.createElement("td");
                let d = document.createElement("td");
                let deletebutton = document.createElement("button");
                deletebutton.innerText = "delete";
                deletebutton.addEventListener("click", deleter);
                /*delete-function */
                function deleter() {
                    document.getElementById("table").removeChild(liste);
                }
                document.getElementById("table").appendChild(liste);
                a.innerText = localstoragearray[index].person;
                b.innerText = localstoragearray[index].preis;
                c.innerText = localstoragearray[index].datum;
                d.appendChild(deletebutton);
                liste.appendChild(a);
                liste.appendChild(b);
                liste.appendChild(c);
                liste.appendChild(d);
            }
        }
    }
    function aktualisierenListe() {
        if (arrayevents.length > 0 && arrayevents != null) {
            /*wiederholungen verhindern */
            while (document.getElementById("table").lastChild != document.getElementById("wichtig")) {
                document.getElementById("table").removeChild(document.getElementById("table").lastChild);
            }
            for (let index = 0; index < arrayevents.length; index++) {
                /*Elemente anlegen */
                let zeile = document.createElement("tr");
                let a1 = document.createElement("td");
                let b1 = document.createElement("td");
                let c1 = document.createElement("td");
                let d1 = document.createElement("td");
                let deletebutton = document.createElement("button");
                deletebutton.innerText = "delete";
                deletebutton.addEventListener("click", deleter);
                /*delete-function */
                function deleter() {
                    document.getElementById("table").removeChild(zeile);
                }
                document.getElementById("table").appendChild(zeile);
                a1.innerText = arrayevents[index].person;
                b1.innerText = arrayevents[index].preis;
                c1.innerText = arrayevents[index].datum;
                d1.appendChild(deletebutton);
                zeile.appendChild(a1);
                zeile.appendChild(b1);
                zeile.appendChild(c1);
                zeile.appendChild(d1);
            }
        }
    }
    /*Event-button definieren */
    button.addEventListener("click", () => {
        if (interpret.value != "" && preis.value != "" && datum.value != "") {
            interpret.style.borderColor = "black";
            preis.style.borderColor = "black";
            datum.style.borderColor = "black";
            let neuEvent = new Eventis(interpret.value, preis.value, datum.value);
            arrayevents.push(neuEvent);
            aktualisierenListe();
            stringarray = JSON.stringify(arrayevents);
            localStorage.setItem("myArray", stringarray);
            console.log(arrayevents);
            /* let liste1: HTMLElement = document.createElement("tr");
             let a1: HTMLElement = document.createElement("td");
             let b1: HTMLElement = document.createElement("td");
             let c1: HTMLElement = document.createElement("td");
             let d1: HTMLElement = document.createElement("td");
             let deletebutton: HTMLElement = document.createElement("button");
             
             document.getElementById("table").appendChild(liste1);
             a1.innerText = interpret.value;
             b1.innerText = preis.value;
             c1.innerText = datum.value;
             d1.appendChild(deletebutton);
             liste1.appendChild(a);
             liste1.appendChild(b);
             liste1.appendChild(c);
             liste1.appendChild(d);*/
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