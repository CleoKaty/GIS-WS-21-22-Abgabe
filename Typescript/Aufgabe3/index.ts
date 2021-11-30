namespace Aufgabe {
    // Hilfestellung: GIS Folien JSON Beispielaufgaben

    /*Geholte Elemente von html */
    let interpret: HTMLInputElement = <HTMLInputElement> document.getElementById("interpret") as HTMLInputElement;
    let preiseingabe: HTMLInputElement = <HTMLInputElement> document.getElementById("preis") as HTMLInputElement;
    //let preis: number = Number(preiseingabe);
    let datum: HTMLInputElement = <HTMLInputElement> document.getElementById("zeit") as HTMLInputElement;
    let button: HTMLButtonElement = document.getElementById("enter") as HTMLButtonElement;
    let table: HTMLTableElement = document.getElementById("table") as HTMLTableElement;

    /*Events definieren */
    class Eventis {
        //Bestandteile
        person: string;
        preis: string;
        datum: string;
        id: number;
        //Konstruktor
        constructor (person: string, preis: string, datum: string, id: number) {
            this.person = person;
            this.preis = preis;
            this.datum = datum;
            this.id = id;
        }

        //Id Rückgabe - als String, da LocalStorage nur mit String arbeitet
        returnID (): string {
            return this.id.toString();
        }

        
    }

    /*Array anlegen und mit Json im Local-Storage abspeichern */
    let eventliste: Eventis[] = [];

    // Storage für Events definieren
    class StoreEvent {
        //String eventliste in LocalStorage
        static saveEvent(): void {
            let stringEventListe: string = JSON.stringify(eventliste);
            localStorage.setItem("EventArray", stringEventListe);
        }
        //Events abrufen
        static loadEvent(): void {
            let storageStringListe: string = localStorage.getItem("EventArray") || "[]";
            //Wiedrholungen vermeiden
            while (table.lastChild != document.getElementById("wichtig")) {
                table.removeChild(table.lastChild);
                }

            for (let evt of JSON.parse(storageStringListe)) {
                //let geladenesEvent: Eventis = new Eventis(evt.person, evt.preis, evt.datum, evt.id);
                
                //Zaehler für id
                let zaehler: number = 0;
                /*Elemente anlegen für Tabelleneinträge */
                let liste: HTMLElement = document.createElement("tr");
                let a: HTMLElement = document.createElement("td");
                let b: HTMLElement = document.createElement("td");
                let c: HTMLElement = document.createElement("td");
                let d: HTMLElement = document.createElement("td");
                let deletebutton: HTMLElement = document.createElement("button");
                deletebutton.innerText = "delete";
                let buttonid: string = zaehler.toString();
                deletebutton.id = buttonid;
                deletebutton.addEventListener("click", deleter);

                /*delete-function */
                function deleter (): void {
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

            let neuEvent: Eventis = new Eventis(interpret.value, preiseingabe.value, datum.value, eventliste.length);
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
    
}