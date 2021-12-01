"use strict";
var Aufgabe;
(function (Aufgabe) {
    // Hilfestellung: GIS Folien JSON Beispielaufgaben
    /*Geholte Elemente von html */
    let interpret = document.getElementById("interpret");
    let preiseingabe = document.getElementById("preis");
    //let preis: number = Number(preiseingabe);
    let datum = document.getElementById("zeit");
    let button = document.getElementById("enter");
    let table = document.getElementById("table");
    /*Events definieren */
    class Eventis {
        //Bestandteile
        person;
        preis;
        datum;
        id;
        //Konstruktor
        constructor(person, preis, datum, id) {
            this.person = person;
            this.preis = preis;
            this.datum = datum;
            this.id = id;
        }
        //Id Rückgabe - als String, da LocalStorage nur mit String arbeitet
        returnID() {
            return this.id.toString();
        }
    }
    /*Array anlegen und mit Json im Local-Storage abspeichern */
    let eventliste = [];
    // Storage für Events definieren
    class StoreEvent {
        //String eventliste in LocalStorage
        static saveEvent() {
            let stringEventListe = JSON.stringify(eventliste);
            localStorage.setItem("EventArray", stringEventListe);
        }
        //Events abrufen
        static loadEvent() {
            let storageStringListe = localStorage.getItem("EventArray") || "[]";
            //Wiedrholungen vermeiden
            while (table.lastChild != document.getElementById("wichtig")) {
                table.removeChild(table.lastChild);
            }
            for (let evt of JSON.parse(storageStringListe)) {
                //let geladenesEvent: Eventis = new Eventis(evt.person, evt.preis, evt.datum, evt.id);
                //Zaehler für id
                let zaehler = 0;
                /*Elemente anlegen für Tabelleneinträge */
                let liste = document.createElement("tr");
                let a = document.createElement("td");
                let b = document.createElement("td");
                let c = document.createElement("td");
                let d = document.createElement("td");
                let deletebutton = document.createElement("button");
                deletebutton.innerText = "delete";
                let buttonid = zaehler.toString();
                deletebutton.id = buttonid;
                deletebutton.addEventListener("click", deleter);
                /*delete-function */
                function deleter() {
                    //In Events-Array finden und löschen
                    eventliste.forEach((event, index) => {
                        if (event.returnID() == deletebutton.id) {
                            eventliste.splice(index, 1);
                        }
                    });
                    //LocalStorage mithilfe von EventArray updaten
                    StoreEvent.saveEvent();
                    //aus Tabelle löschen
                    table.removeChild(liste);
                }
                //Anlegen in Liste
                document.getElementById("table").appendChild(liste);
                a.innerText = evt.person;
                b.innerText = evt.preis;
                c.innerText = evt.datum;
                d.appendChild(deletebutton);
                liste.appendChild(a);
                liste.appendChild(b);
                liste.appendChild(c);
                liste.appendChild(d);
                zaehler++;
            }
        }
    }
    StoreEvent.loadEvent();
    /*Event-button definieren */
    button.addEventListener("click", () => {
        if (interpret.value != "" && preiseingabe.value != "" && datum.value != "") {
            interpret.style.borderColor = "black";
            preiseingabe.style.borderColor = "black";
            datum.style.borderColor = "black";
            let neuEvent = new Eventis(interpret.value, preiseingabe.value, datum.value, eventliste.length);
            eventliste.push(neuEvent);
            //event speichern und anlegen
            StoreEvent.saveEvent();
            StoreEvent.loadEvent();
        }
        else {
            if (interpret.value == "") {
                interpret.style.borderColor = "red";
            }
            if (preiseingabe.value == "") {
                preiseingabe.style.borderColor = "red";
            }
            if (datum.value == "") {
                datum.style.borderColor = "red";
            }
        }
    });
})(Aufgabe || (Aufgabe = {}));
//# sourceMappingURL=index.js.map