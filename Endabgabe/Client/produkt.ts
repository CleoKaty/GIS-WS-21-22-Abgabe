
namespace Produktansicht {

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

    let ueberschrift: HTMLElement = document.getElementById("kopf") as HTMLElement;
    //let anzahl: HTMLDivElement = document.getElementById("anzahl") as HTMLDivElement;
    let ablaufdaten: HTMLUListElement = document.getElementById("ablaufdaten") as HTMLUListElement;
    let notizen: HTMLOListElement = document.getElementById("notizen") as HTMLOListElement;
    let p1: HTMLParagraphElement = document.getElementById("p1") as HTMLParagraphElement;
    let p2: HTMLParagraphElement = document.getElementById("p1") as HTMLParagraphElement;
    let notizDiv: HTMLDivElement = document.getElementById("nozizDiv") as HTMLDivElement;

    /////////////////////////////////////////////////////Detailansicht Code////////////////////////////////////////////////////////////////

    //ein gewünschtes Produkt bekommen für Einzelansicht mithilfe des Local Storages
    let arrayIndex: number = searchInArray(getItemFromLocalStorage());
    function getItemFromLocalStorage(): string {
        let localStorageString: string = localStorage.getItem("productDetail") || "[]";
        let array: Product[] = JSON.parse(localStorageString);
        let detailProduktName: string = array[0].name;
        localStorage.removeItem("productDetail");

        return detailProduktName;
    }
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

    seiteAufbauen(event); //geht das?

    //html Seite aufbauen
    async function seiteAufbauen(evt: Event): Promise<void> {
        evt.preventDefault();
        ueberschrift.innerHTML = allProducts[arrayIndex].name;
        allProducts[arrayIndex].overallPieces = allProducts[arrayIndex].countAllPieces();
        p1.innerText = allProducts[arrayIndex].overallPieces.toString();
        p2.innerText = `Davon abgelaufene ${allProducts[arrayIndex].countAllBadPieces(false).toString()}`;
        allProducts[arrayIndex].dates.sort((a: ProductDates, b: ProductDates) => { //Array nach datum sortieren (ältestes Produkt raus)
            return b.dueDate.getTime() - a.dueDate.getTime();
        });
        let hilfszaehler: number = 0;
        //Daten anzeigen 
        for (let date of allProducts[arrayIndex].dates) {
            let liElement: HTMLElement = document.createElement("li");
            let buttonElement: HTMLElement = document.createElement("button");
            liElement.innerText = "Ablaufdatum" + date.dueDate.getDate() + "." + date.dueDate.getMonth() + "." + date.dueDate.getFullYear() +
                + "Anlegedatum: " + date.arriveDate.getDate() + "." + date.arriveDate.getMonth() + "." + date.arriveDate.getFullYear();
            buttonElement.innerText = "Herrausnehmen";
            liElement.appendChild(buttonElement);

            buttonElement.addEventListener("click", () => {
                allProducts[arrayIndex].dates.splice(hilfszaehler, 1);
            });

            ablaufdaten.appendChild(liElement);
        }
        //Notizenanzeigen
        let inputNotiz: HTMLInputElement = document.createElement("input") as HTMLInputElement;
        let notizButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        notizButton.innerText = "neue Notiz anlegen";
        inputNotiz.setAttribute("type", "text");
        notizButton.addEventListener("click", () => {
            allProducts[arrayIndex].notice.push(inputNotiz.value.toString());
        });
        notizDiv.appendChild(inputNotiz);
        notizDiv.appendChild(notizButton);

        for (let i: number = 0; i < allProducts[arrayIndex].notice.length; i++) {
            let liElement: HTMLElement = document.createElement("li");
            let buttonElement: HTMLElement = document.createElement("button");

            liElement.innerText = allProducts[arrayIndex].notice[i];
            buttonElement.innerText = "Löschen";

            buttonElement.addEventListener("click", () => {
                allProducts[arrayIndex].notice.splice(i, 1);
            });

            notizen.appendChild(liElement);
        }
    }

}