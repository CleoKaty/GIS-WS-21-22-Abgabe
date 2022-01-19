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
                } else if (this.dates[i].dueDate.getDay() <= nowDate.getDate()) {
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
    //Productliste abfangen/ anlegen
    let allProducts: Product[] = [];
    updateArray();
    async function updateArray(): Promise<void> {
        let fetchedProductArray: Product[] = await getAllProducts();
        allProducts = fetchedProductArray;
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

    async function listenAnlegen(): Promise<void> {
        for (let product of allProducts) {
            if (product.countAllPieces() == 0) {
                let liElement: HTMLElement = document.createElement("li") as HTMLElement;
                let loeschButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                liElement.innerText = product.name;
                loeschButton.innerText = "Löschen";
                liElement.appendChild(loeschButton);

                loeschButton.addEventListener("click", () => productEntfernen(product.name));

                leereListe.appendChild(liElement);
            }
            else if (product.countAllBadPieces(true) > 0) {
                let liElement: HTMLElement = document.createElement("li") as HTMLElement;
                let entsorgenButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                liElement.innerText = product.name + ": " + product.countAllBadPieces(true);
                entsorgenButton.innerText = "Entsorgen";
            }
        }
    }

    ////////////////////////////////////////////andere helfende Funktionen//////////////////////////////////////////////////////////////////
    function searchInArray(name: string): number {
        let index: number;
        let nope: number = 0;
        for (let i: number = 0; i < allProducts.length; i++) {
            if (name == allProducts[i].name) {
                index = i;
                break;
            }
            else {
                nope = nope + 1;
            }
        }
        if (nope == allProducts.length) {
            return null;
        }
        else {
            return index;
        }
    }

    async function productEntfernen(name: string): Promise<void> {
        let platzierungArray: number = searchInArray(name);
        allProducts.splice(platzierungArray, 1);

        await fetch("http://127.0.0.1:3000/allProducts", {
                    method: "post",
                    body: JSON.stringify(allProducts)
                });
    }
}