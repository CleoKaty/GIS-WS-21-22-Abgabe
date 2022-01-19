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
    async function updateArray(): Promise<void> {
        let fetchedProductArray: Product[] = await getAllProducts();
        allProducts = fetchedProductArray;
    }
    productListeAnzeigen();
    //ganze Liste von Produkten bekommen
    async function getAllProducts(): Promise<Product[]> {
        let response: Response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText: string = await response.text();
        return JSON.parse(responseText) as Product[];
    }

    async function productListeAnzeigen(): Promise<void> {
        let table: HTMLTableElement = document.getElementById("produktTabelle") as HTMLTableElement;
        //Liste erneut updaten für Sicherheit
        await updateArray();
        //Liste abfragen
        for (let product of allProducts) {
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
            let allPieces: number = product.countAllPieces();
            tdMenge.innerHTML = allPieces.toString();
            tdAblauf.innerHTML = getNextAblauf(product).toString();
            detailButton.innerHTML = "Details";
            tdDetail.appendChild(link);

            //Funktion für Detailbutton
            link.appendChild(detailButton);
            link.setAttribute("href", "produkt.html");
            link.setAttribute("class", "linkProdukt");
            detailButton.addEventListener("click", saveinLocalStorage);
            //Abfrage über local Storage
            function saveinLocalStorage(): void {
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
    //Ablaufdaten überprüfen
    function getNextAblauf(product: Product): Date {
        let nextAblaufDate: Date = nowDate;
        for (let i: number = 0; i < product.dates.length; i++) {
            if (product.dates[i].dueDate > nowDate) {
                nextAblaufDate = product.dates[i].dueDate;
                break;
            }

        }
        return nextAblaufDate;
    }


}