namespace Aufgabe {


    /*Events definieren */
    class Eventis {
        person: string;
        preis: string;
        datum: string;

        constructor (person: string, preis: string, datum: string) {
            this.person = person;
            this.preis = preis;
            this.datum = datum;
        }

        
    }
    /*Geholte Elemente von html */
    let interpret: HTMLInputElement = <HTMLInputElement> document.getElementById("interpret") as HTMLInputElement;
    let preis: HTMLInputElement = <HTMLInputElement> document.getElementById("preis") as HTMLInputElement;
    let datum: HTMLInputElement = <HTMLInputElement> document.getElementById("zeit") as HTMLInputElement;
    let button: HTMLElement = document.getElementById("enter");

    let arrayevents: Eventis[] = [];
    let localstoragearray: Eventis[];
    let localstoragestring: string = localStorage.getItem("myArray");
    localstoragearray = JSON.parse(localstoragestring);

    /*Array anlegen und mit Json im Local-Storage abspeichern */
    if (localStorage.length == 0 ) {
        let standartevent: Eventis = new Eventis("Mamamoo", "32.9", "21.08.2021");
        let eventstring: string = JSON.stringify(standartevent);
        localStorage.setItem("myArray", eventstring);
    }
    
    
    update();
    aktualisierenListe();
    let stringarray: string = JSON.stringify(arrayevents);
    /*localStorage.setItem("myArray", stringarray);*/

    /*local storage events abrufen */
    function update(): void {
        if (localstoragearray != null && localstoragearray.length > 0) {
            for (let index: number = 0; index < localstoragearray.length; index++) {
        
                /*Elemente anlegen für neue Tabelleneinträge */
                let liste: HTMLElement = document.createElement("tr");
                let a: HTMLElement = document.createElement("td");
                let b: HTMLElement = document.createElement("td");
                let c: HTMLElement = document.createElement("td");
                let d: HTMLElement = document.createElement("td");
                let deletebutton: HTMLElement = document.createElement("button");
                deletebutton.innerText = "delete";
                deletebutton.addEventListener("click", deleter);

                /*delete-function */
                function deleter (): void {
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
    function aktualisierenListe(): void {
        if (arrayevents.length > 0 && arrayevents != null) {
            
            /*wiederholungen verhindern */
                
            while (document.getElementById("table").lastChild != document.getElementById("wichtig")) {
                document.getElementById("table").removeChild( document.getElementById("table").lastChild);
                }

            for (let index: number = 0; index < arrayevents.length; index++) {

               
                

                /*Elemente anlegen */
                let zeile: HTMLElement = document.createElement("tr");
                let a1: HTMLElement = document.createElement("td");
                let b1: HTMLElement = document.createElement("td");
                let c1: HTMLElement = document.createElement("td");
                let d1: HTMLElement = document.createElement("td");
                let deletebutton: HTMLElement = document.createElement("button");
                deletebutton.innerText = "delete";
                deletebutton.addEventListener("click", deleter);

                /*delete-function */
                function deleter (): void {
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

            let neuEvent: Eventis = new Eventis(interpret.value, preis.value, datum.value);
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
    
}
