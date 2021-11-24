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
    //TODO: Eingabefelder clearen
    let interpret: HTMLInputElement = <HTMLInputElement> document.getElementById("interpret") as HTMLInputElement;
    let preis: HTMLInputElement = <HTMLInputElement> document.getElementById("preis") as HTMLInputElement;
    let datum: HTMLInputElement = <HTMLInputElement> document.getElementById("zeit") as HTMLInputElement;
    let button: HTMLElement = document.getElementById("enter");

    let localstoragearray: Eventis[] = [];
    let localstoragestring: string;
    console.log(localstoragearray);

    /*Array anlegen und mit Json im Local-Storage abspeichern */
    if (localStorage.length == 0 ) {
        //TODO: Event erschein nur nach clearen des Lokal Stores, nach reload nicht mehr in Tabelle
        let standartevent: Eventis = new Eventis("Mamamoo", "32.9", "21.08.2021");
        //let neuEvent: Eventis = new Eventis(interpret.value, preis.value, datum.value);
        let eventstring: string = JSON.stringify(standartevent);
        localStorage.setItem("myArray", eventstring);
        console.log("Eventstring", eventstring);
        localstoragearray[0] = new Eventis("Mamamoo", "32.9", "21.08.2021");
        //localstoragearray.push(new Eventis("Mamamoo", "32.9", "21.08.2021"));
    }
    else {
        for(let i: number = 1; i <= localStorage.length; i++){
            localstoragestring = localStorage.getItem("myArray");
            if (i ==1){
                localstoragearray = JSON.parse(localstoragestring);
            }
            //TODO: string hat immer nur länge 1 
            else{
                localstoragearray.push(JSON.parse(localstoragestring));
                console.log("else",localstoragearray);
            }
        }
    }

    console.log("Before:",localstoragearray);
    update(localstoragearray);
    console.log("After:",localstoragearray);
    aktualisierenListe(localstoragearray);
    /*localStorage.setItem("myArray", stringarray);*/

    /*local storage events abrufen */
    function update(storagearray: Eventis[]): void {
        console.log("Array",storagearray);
        console.log("Lenght",storagearray.length); 
        //TODO: Lenght is undefine
        //console.log("Array",storagearray); lenght funktioniert nicht ist undefined
        if (storagearray != null && storagearray.length > 0) {
            for (let index: number = 0; index < storagearray.length; index++) {
        
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
                //TODO: deletfunktion fixen 
                function deleter (): void {
                    document.getElementById("table").removeChild(liste);

                }

                document.getElementById("table").appendChild(liste);
                a.innerText = storagearray[index].person;
                b.innerText = storagearray[index].preis;
                c.innerText = storagearray[index].datum;
                d.appendChild(deletebutton);
                liste.appendChild(a);
                liste.appendChild(b);
                liste.appendChild(c);
                liste.appendChild(d);
            }
        }
    }
    function aktualisierenListe(eventarry: Eventis[]): void {
        console.log(1);
        if (eventarry.length > 0 && eventarry != null) {
            console.log(2);
            
            /*wiederholungen verhindern */
                
            while (document.getElementById("table").lastChild != document.getElementById("wichtig")) {
                document.getElementById("table").removeChild( document.getElementById("table").lastChild);
                }

            for (let index: number = 0; index < eventarry.length; index++) {

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
                    //TODO: deletfunktion fixen 
                    document.getElementById("table").removeChild(zeile);
                }

                document.getElementById("table").appendChild(zeile);
                a1.innerText = eventarry[index].person;
                b1.innerText = eventarry[index].preis;
                c1.innerText = eventarry[index].datum;
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
            console.log(neuEvent);

            for(let i: number = 1; i <= localStorage.length; i++){
                console.log("Lengthbutton",localStorage.length);
                localstoragestring = localStorage.getItem("myArray")
                console.log(localstoragestring);
                if (i ==1){
                    localstoragearray = JSON.parse(localstoragestring);
                    console.log("i=1",localstoragearray);
                }
                //TODO: string hat immer nur länge 1 
                else{
                    localstoragearray.push(JSON.parse(localstoragestring));
                    console.log("else",localstoragearray);
                }
            }
            
            localstoragearray.push(neuEvent);
            
            //localstoragearray[localStorage.length] = neuEvent;
            console.log("Array after button",localstoragearray);
            localstoragestring = JSON.stringify(localstoragearray);
            console.log("String after Button", localstoragestring);
            localStorage.setItem("myArray",localstoragestring);
            aktualisierenListe(localstoragearray);

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