
namespace Verwaltung {
    ////////////////////////////////////////////////////Klassen, Interfaces und Arrays////////////////////////////////////////////////////////////

    //heutiges Datum
    let nowDate: Date = new Date();
    //Product anlegen
    class Product {
        name: string = "";
        dates: ProductDates[] = [];
        overallPieces: number = 0;
        notice: string[] = [];
        _id?: string;

        constructor(name: string, dates: ProductDates[], overallPieces: number, notice: string[]) {
            this.name = name;
            this.dates = dates;
            this.overallPieces = overallPieces;
            this.notice = notice;
        }
        //Mengenanzahl feststellen
        countAllPieces(): number {
            let count: number = 0;
            for (let i: number = 0; i < this.dates.length; i++) {
                count = this.dates[i].pieces + count;

            }
            return count;
        }
        //(nicht) Abgelaufene Produktmenge feststellen 
        countAllBadPieces(bad: boolean): number {
            let countBad: number = 0;
            let countGood: number = 0;

            //Daten vergleichen
            for (let i: number = 0; i < this.dates.length; i++) {
                if (this.dates[i].dueDate.getFullYear() <= nowDate.getFullYear()) {
                    countBad = this.dates[i].pieces + countBad;
                } else if (this.dates[i].dueDate.getMonth() <= nowDate.getMonth()) {
                    countBad = this.dates[i].pieces + countBad;
                } else if (this.dates[i].dueDate.getDay() <= nowDate.getDay()) {
                    countBad = this.dates[i].pieces + countBad;
                } else {
                    countGood = this.dates[i].pieces + countGood;
                }
            }
            if (bad == true) {
                return countBad;
            }
            else {
                if (this.countAllPieces() - countBad === countGood) {
                    return countGood;
                } else {
                    //Überprüfen Daten
                    console.log("Error");
                    return 0;
                }
            }
        }

    }
    //Daten für Produkt anlegen
    interface ProductDates {
        arriveDate: Date;
        pieces: number;
        dueDate: Date;
    }

    //ganze Liste von Produkten bekommen
    async function getAllProducts(): Promise<Product[]> {
        let response: Response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText: string = await response.text();
        return JSON.parse(responseText) as Product[];
    }
    /////////////////////////////////////////////Elemente aus html abgreifen///////////////////////////////////////////////////////////////

    let alleEntsorgenButton: HTMLButtonElement = document.getElementById("entsorgen") as HTMLButtonElement;
    let abgelaufenListe: HTMLElement = document.getElementById("abgelaufenListe") as HTMLElement;
    let alleLoeschenButton: HTMLButtonElement = document.getElementById("löschen") as HTMLButtonElement;
    let leereListe: HTMLElement = document.getElementById("leereListe") as HTMLElement;

    //////////////////////////////////////////////////////Seite aufbauen///////////////////////////////////////////////////////////////////
    listenAnlegen();
    async function listenAnlegen(): Promise<void> {
        let fetchedarray: Product[] = await getAllProducts();
        fetchedarray.sort((a: Product, b: Product) => {
            return a.name.localeCompare(b.name);
        });

        //Wiederholungen vermeiden
        removeHTMLChildren(leereListe);
        removeHTMLChildren(abgelaufenListe);
        console.log(fetchedarray);
        //event.preventDefault();
        for (let product of fetchedarray) {
            if (countAllPiecesProduct(product) == 0 || product.dates.length == 0) {
                let liElement: HTMLElement = document.createElement("li") as HTMLElement;
                let loeschButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                liElement.innerText = product.name;
                loeschButton.innerText = "Löschen";
                liElement.appendChild(loeschButton);

                loeschButton.addEventListener("click", () => productEntfernen(product.name));

                leereListe.appendChild(liElement);
            }
            else if (countAllBadPiecesProduct(true, product) > 0) {
                let liElement: HTMLElement = document.createElement("li") as HTMLElement;
                let entsorgenButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                liElement.innerText = product.name + ": " + countAllBadPiecesProduct(true, product);
                entsorgenButton.innerText = "Entsorgen";
                liElement.appendChild(entsorgenButton);

                entsorgenButton.addEventListener("click", () => productEntsorgen(product.name));

                abgelaufenListe.appendChild(liElement);
            }
        }
    }

    alleEntsorgenButton.addEventListener("click", () => {
        alleEntsorgen();
    });

    alleLoeschenButton.addEventListener("click", () => {
        alleLoeschen();
    });

    ////////////////////////////////////////////andere helfende Funktionen//////////////////////////////////////////////////////////////////
    async function searchInArray(name: string): Promise<number> {
        let productsList: Product[] = await getAllProducts();
        console.log(productsList);
        let index: number;
        let nope: number = 0;
        for (let i: number = 0; i < productsList.length; i++) {
            if (name == productsList[i].name) {
                index = i;
                break;
            }
            else {
                nope = nope + 1;
            }
        }
        if (nope == productsList.length) {
            return null;
        }
        else {
            return index as number;
        }
    }

    async function productEntfernen(name: string): Promise<void> {
        let platzierungArray: number = await searchInArray(name);
        let array: Product[] = await getAllProducts();
        console.log(array);
        let loeschProdukt: Product = array[platzierungArray];
        console.log(loeschProdukt);
        await  postProductLoesch(loeschProdukt);

        await listenAnlegen();
    }

    async function productEntsorgen(name: string): Promise<void> {
        let platzierungArray: number = await searchInArray(name);
        let array: Product[] = await getAllProducts();

        for (let i: number = 0; i < array[platzierungArray].dates.length; i++) {
            let datestring: string = array[platzierungArray].dates[i].dueDate.toString();
            let date1: Date = new Date(datestring);
            if (date1.getFullYear() <= nowDate.getFullYear()) {
                array[platzierungArray].dates.splice(i, 1);
            } else if (date1.getMonth() <= nowDate.getMonth()) {
                array[platzierungArray].dates.splice(i, 1);
            } else if (date1.getDay() <= nowDate.getDay()) {
                array[platzierungArray].dates.splice(i, 1);
            }
        }
        let loeschProdukt: Product = array[platzierungArray];

        await  postProduct(loeschProdukt);


        await listenAnlegen();
    }
    async function alleEntsorgen(): Promise<void> {
        let array: Product[] = await getAllProducts();
        for (let product of array) {
            productEntsorgen(product.name);
        }
        await listenAnlegen();
    }
    async function alleLoeschen(): Promise<void> {
        let array: Product[] = await getAllProducts();
        for (let product of array) {
            productEntfernen(product.name);
        }
        await listenAnlegen();
    }

    function countAllPiecesProduct(product: Product): number {
        let count: number = 0;
        for (let i: number = 0; i < product.dates.length; i++) {
            count = product.dates[i].pieces + count;

        }
        return count;
    }
    function countAllBadPiecesProduct(bad: boolean, product: Product): number {
        let countBad: number = 0;
        let countGood: number = 0;

        //Daten vergleichen
        for (let i: number = 0; i < product.dates.length; i++) {
            let date1: Date = new Date(product.dates[i].dueDate);
            console.log(date1);
            if (date1.getFullYear() < nowDate.getFullYear()) {
                countBad = product.dates[i].pieces + countBad;
                console.log("Jahr");
            } else if (date1.getMonth() < nowDate.getMonth()) {
                countBad = product.dates[i].pieces + countBad;
                console.log("Monat");
            } else if (date1.getDay() < nowDate.getDay()) {
                countBad = product.dates[i].pieces + countBad;
                console.log("Tag");
            } else {
                countGood = product.dates[i].pieces + countGood;
            }
        }
        if (bad == true) {
            console.log(countBad);
            return countBad;

        }
        else {
            if (countAllPiecesProduct(product) - countBad === countGood) {
                console.log(countGood);
                return countGood;
            } else {
                //Überprüfen Daten
                console.log("Error");
                return 0;
            }
        }
    }
    function removeHTMLChildren(element: HTMLElement): void {
        while (element.lastChild != document.getElementById("wichtig")) {
            element.removeChild(element.lastChild);
        }
    }
    //für Post an den Server
    async function postProduct(product: Product): Promise<void> {
        console.log("postProduct", product);
        await sendJSONStringWithPOST(
            "http://127.0.0.1:3000/singleProduct",
            JSON.stringify({
                name: product.name,
                dates: product.dates,
                overallPieces: product.overallPieces,
                notice: product.notice,
                _id: product._id
            }));
    }
    async function postProductLoesch(product: Product): Promise<void> {
        console.log("postProduct", product);
        await sendJSONStringWithPOST(
            "http://127.0.0.1:3000/allProducts",
            JSON.stringify({
                name: product.name,
                dates: product.dates,
                overallPieces: product.overallPieces,
                notice: product.notice,
                _id: product._id
            }));
    }
    async function sendJSONStringWithPOST(url: RequestInfo, jsonString: string): Promise<void> {
        await fetch(url, {
            method: "post",
            body: jsonString
        });
    }
    
}