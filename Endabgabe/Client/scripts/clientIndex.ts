//neue namespace für mehr Übersicht
namespace ClientIndex {

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



    productListeAnzeigen();
    /////////////////////////////////////////////////////////////Seite aufbauen//////////////////////////////////////////////////////////

    async function productListeAnzeigen(): Promise<void> {
        let fetchedArray: Product[] = await getAllProducts();
        let table: HTMLTableElement = document.getElementById("produktTabelle") as HTMLTableElement;
        //alphabetisch sortieren
        fetchedArray.sort((a: Product, b: Product) => {
            return a.name.localeCompare(b.name);
        });
        //Liste abfragen
        for (let product of fetchedArray) {
            if (countAllBadPiecesProduct(false, product) > 0) {
                //Elemente anlegen
                let tr: HTMLElement = document.createElement("tr");
                let tdName: HTMLElement = document.createElement("td");
                let tdMenge: HTMLElement = document.createElement("td");
                let tdAblauf: HTMLElement = document.createElement("td");
                let tdDetail: HTMLElement = document.createElement("td");
                let link: HTMLElement = document.createElement("a");
                let detailButton: HTMLButtonElement = document.createElement("button");

                //Inhalt füllen
                tdName.innerHTML = product.name;
                let allPieces: number;
                allPieces = countAllPiecesProduct(product);
                tdMenge.innerHTML = allPieces.toString();
                let getNextAblaufDate: Date = new Date(getNextAblauf(product));
                tdAblauf.innerHTML = `${getNextAblaufDate.getDate()}.${getNextAblaufDate.getUTCMonth() + 1}.${getNextAblaufDate.getFullYear()}`;
                detailButton.innerHTML = "Details";
                tdDetail.appendChild(link);

                //Funktion für Detailbutton
                link.appendChild(detailButton);
                link.setAttribute("href", "produkt.html");
                link.setAttribute("class", "linkProdukt");
                detailButton.addEventListener("click", saveinLocalStorage);
                //Abfrage über local Storage
                function saveinLocalStorage(): void {
                    //localStorage leeren
                    if (localStorage.getItem("productDetail")) {
                        localStorage.removeItem("productDetail");
                    }
                    localStorage.setItem("productDetail", JSON.stringify(product));
                }


                //append Inhalt
                tr.appendChild(tdName);
                tr.appendChild(tdMenge);
                tr.appendChild(tdAblauf);
                tr.appendChild(tdDetail);
                table.appendChild(tr);
            }
        }


    }
    ///////////////////////////////////////////////////hilfreiche Funktionen//////////////////////////////////////////////////////////////
    //Ablaufdaten überprüfen
    function getNextAblauf(product: Product): Date {
        let nextAblaufDate: Date = new Date(nowDate);
        product.dates.sort((a: ProductDates, b: ProductDates) => {
            let aDate: Date = new Date(a.dueDate);
            let bDate: Date = new Date(b.dueDate);
            return bDate.getTime() - aDate.getTime();
        });
        console.log(product.dates);
        for (let i: number = 0; i < product.dates.length; i++) {
            let date: Date = new Date(product.dates[i].dueDate);
            if (date.getTime() > nowDate.getTime()) {
                nextAblaufDate = product.dates[i].dueDate;
            }

        }
        console.log(nextAblaufDate);
        return nextAblaufDate;
    }
    function countAllPiecesProduct(product: Product): number {
        let count: number = 0;
        for (let i: number = 0; i < product.dates.length; i++) {
            count = product.dates[i].pieces + count;

        }
        return count;
    }
    //ganze Liste von Produkten bekommen
    async function getAllProducts(): Promise<Product[]> {
        let response: Response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText: string = await response.text();
        console.log(responseText);
        return JSON.parse(responseText) as Product[];
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


}