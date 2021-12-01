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
            console.log("this.id", this.id);
            return this.id.toString();
        }   
    }

    /*Array anlegen und mit Json im Local-Storage abspeichern */
    let eventliste: Eventis[] = [];
    //ID-Zaehler anlegen
    

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
            //Wiederholungen vermeiden
            while (table.lastChild != document.getElementById("wichtig")) {
                table.removeChild(table.lastChild);
                }

            for (let evt of JSON.parse(storageStringListe)) {
                //let geladenesEvent: Eventis = new Eventis(evt.person, evt.preis, evt.datum, evt.id);
                /*Elemente anlegen für Tabelleneinträge */
                console.log("Buttonid/Zähler", evt.id); // ist der Zähler
                let liste: HTMLElement = document.createElement("tr");
                let a: HTMLElement = document.createElement("td");
                let b: HTMLElement = document.createElement("td");
                let c: HTMLElement = document.createElement("td");
                let d: HTMLElement = document.createElement("td");
                let deletebutton: HTMLElement = document.createElement("button");
                deletebutton.innerText = "delete";
                let buttonid: string = evt.id.toString();
                deletebutton.id = buttonid;
                deletebutton.addEventListener("click", deleter);

                /*delete-function */
                function deleter (evt: Event): void {
                    console.log(evt);
                    let idbutt: number = parseInt(deletebutton.id);

                    eventliste = eventliste.filter(item => item.id !== idbutt);
                    
                    localStorage.clear();
                    StoreEvent.saveEvent();
                   
                    
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


            eventliste.length = 0;

            //eventliste neu anlegen, mithilfe des storages, um wiederholungen zu vermeiden
            if (eventliste === null || eventliste.length < 1) {
               eventliste = JSON.parse(localStorage.getItem("EventArray"));
               
               if (eventliste === null || eventliste.length < 1) {
                    let neuEvent: Eventis = new Eventis(interpret.value, preiseingabe.value, datum.value, 0);
                    eventliste = [];
                    eventliste[0] = neuEvent;
                    
               } else {
                let neuEvent: Eventis = new Eventis(interpret.value, preiseingabe.value, datum.value, (eventliste[eventliste.length - 1].id + 1));
                eventliste.push(neuEvent);
                
               }

            } else {
                let neuEvent: Eventis = new Eventis(interpret.value, preiseingabe.value, datum.value, (eventliste[eventliste.length - 1].id + 1));
                eventliste.push(neuEvent);
            }
            
        
            
            
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