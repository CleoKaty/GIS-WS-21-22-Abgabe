
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


    console.log(allProducts);
    async function updateArray(): Promise<Product[]> {
        let response: Response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText: string = await response.text();
        let fetchedArray: Product[] = [];
        fetchedArray = JSON.parse(responseText) as Product[];
        return fetchedArray;

    }

    /////////////////////////////////////////////Elemente aus html abgreifen///////////////////////////////////////////////////////////////

    let ueberschrift: HTMLElement = document.getElementById("kopf") as HTMLElement;
    //let anzahl: HTMLDivElement = document.getElementById("anzahl") as HTMLDivElement;
    let ablaufdaten: HTMLUListElement = document.getElementById("ablaufdaten") as HTMLUListElement;
    let notizen: HTMLOListElement = document.getElementById("notizen") as HTMLOListElement;
    let p1: HTMLParagraphElement = document.getElementById("p1") as HTMLParagraphElement;
    let p2: HTMLParagraphElement = document.getElementById("p2") as HTMLParagraphElement;
    let notizDiv: HTMLDivElement = document.getElementById("notizDiv") as HTMLDivElement;
    let nameChange: HTMLButtonElement = document.getElementById("nameChange") as HTMLButtonElement;
    let neuName: HTMLInputElement = document.getElementById("neuName") as HTMLInputElement;

    /////////////////////////////////////////////////////Detailansicht Code////////////////////////////////////////////////////////////////


    //ein gewünschtes Produkt bekommen für Einzelansicht mithilfe des Local Storages
    function getItemFromLocalStorage(): string {
        let localStorageString: string = localStorage.getItem("productDetail") || "[]";
        let arrayProduct: Product[] = [];
        arrayProduct[0] = JSON.parse(localStorageString);
        console.log(arrayProduct);
        let detailProduktName: string = arrayProduct[0].name;

        console.log(detailProduktName);
        return detailProduktName;
    }
    async function searchInArray(name: string): Promise<number> {
        let productsList: Product[] = await updateArray();
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

    async function nameChanger(): Promise<void> {
        let array: Product[] = await updateArray();
        let arrayIndex: number = await searchInArray(getItemFromLocalStorage());
        let zaehler: number = 0;
        for (let product of array) {
            if (product.name != neuName.value && getItemFromLocalStorage() != neuName.value && neuName.value != "") {
                zaehler = zaehler + 1;
            }
        }
        if (zaehler == array.length) {
            array[arrayIndex].name = neuName.value;
            localStorage.removeItem("productDetail");
            localStorage.setItem("productDetail", JSON.stringify(array[arrayIndex]));
            await postProduct(array[arrayIndex]);
        }

        

        array = await updateArray();

        seiteAufbauen();
    }

    async function splicerDate(index: number): Promise<void> {
        let array: Product[] = await updateArray();
        let arrayIndex: number = await searchInArray(getItemFromLocalStorage());
        array[arrayIndex].dates.splice(index, 1);

        await postProduct(array[arrayIndex]);

        array = await updateArray();

        seiteAufbauen();
    }

    async function splicerNotiz(index: number): Promise<void> {
        let array: Product[] = await updateArray();
        let arrayIndex: number = await searchInArray(getItemFromLocalStorage());
        array[arrayIndex].notice.splice(index, 1);

        await postProduct(array[arrayIndex]);

        array = await updateArray();

        seiteAufbauen();
    }

    async function postProduct(product: Product): Promise<void> {
        await sendJSONStringWithPOST(
            "http://127.0.0.1:3000/singleProduct",
            JSON.stringify({
                name: product.name,
                dates: product.dates,
                overallPieces: countAllPiecesProduct(product),
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
            } else if (date1.getDate() < nowDate.getDate()) {
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


    seiteAufbauen();

    //////////////////////////////////////////////////////////Seite aufbauen////////////////////////////////////////////////////////////////
    async function seiteAufbauen(): Promise<void> {
        let fetchedArray: Product[] = await updateArray();
        console.log(fetchedArray);
        //Listen leeren, um Verdoppelungen zu vermeiden
        removeHTMLChildren(ablaufdaten);
        removeHTMLChildren(notizen);
        removeHTMLChildren(notizDiv);

        let arrayIndex: number = await searchInArray(getItemFromLocalStorage());
        let fetchedProduct: Product = fetchedArray[arrayIndex];
        ueberschrift.innerHTML = fetchedProduct.name;
        fetchedArray[arrayIndex].overallPieces = countAllPiecesProduct(fetchedArray[arrayIndex]);
        p1.innerText = fetchedArray[arrayIndex].overallPieces.toString();
        p2.innerText = `Davon abgelaufene:  ${countAllBadPiecesProduct(true, fetchedArray[arrayIndex]).toString()}`;
        fetchedArray[arrayIndex].dates.sort((a: ProductDates, b: ProductDates) => { //Array nach datum sortieren (ältestes Produkt raus)
            let aDate: Date = new Date(a.dueDate);
            let bDate: Date = new Date(b.dueDate);
            return bDate.getTime() - aDate.getTime();
        });
        let hilfszaehler: number = 0;
        //Daten anzeigen 
        for (let date of fetchedArray[arrayIndex].dates) {
            let liElement: HTMLElement = document.createElement("li");
            let buttonElement: HTMLElement = document.createElement("button");
            let ablaufDatum: Date = new Date(date.dueDate);
            let anlegeDatum: Date = new Date(date.arriveDate);
            liElement.innerText = `Ablaufdatum:  ${ablaufDatum.getDate()}.${(ablaufDatum.getUTCMonth() + 1)}.${ablaufDatum.getFullYear()}
            Anlegedatum:  ${anlegeDatum.getDate()}.${(anlegeDatum.getMonth() + 1)}.${anlegeDatum.getFullYear()}
            Stuecke: ${date.pieces}`;
            buttonElement.innerText = "Herrausnehmen";
            liElement.appendChild(buttonElement);

            buttonElement.addEventListener("click", () => splicerDate(hilfszaehler));
            fetchedArray = await updateArray();

            ablaufdaten.appendChild(liElement);
        }
        //Notizenanzeigen
        let inputNotiz: HTMLInputElement = document.createElement("input") as HTMLInputElement;
        let notizButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        notizButton.innerText = "neue Notiz anlegen";
        inputNotiz.setAttribute("type", "text");
        notizButton.addEventListener("click", () => {
            fetchedArray[arrayIndex].notice.push(inputNotiz.value.toString());
            postProduct(fetchedArray[arrayIndex]);
            console.log(inputNotiz.value, fetchedArray[arrayIndex]);
            seiteAufbauen();
        });
        notizDiv.appendChild(inputNotiz);
        notizDiv.appendChild(notizButton);


        for (let i: number = 0; i < fetchedArray[arrayIndex].notice.length; i++) {
            let liElement: HTMLElement = document.createElement("li");
            let buttonElement: HTMLElement = document.createElement("button");

            liElement.innerText = fetchedArray[arrayIndex].notice[i];
            buttonElement.innerText = "Löschen";
            liElement.appendChild(buttonElement);

            buttonElement.addEventListener("click", () => splicerNotiz(i));
            fetchedArray = await updateArray();

            notizen.appendChild(liElement);
        }
        fetchedArray = await updateArray();
        nameChange.addEventListener("click", () => nameChanger());
    }

}