const url: string = "127.0.0.1"; //url

namespace ClientNeueProdukte {
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
    //Alle Produkte zum Überblick
    let allProducts: Product[] = [];
    updateArray();
    console.log(allProducts);
    options();

    /////////////////////////////////////////////Elemente aus HTML abgreifen//////////////////////////////////////////////////////////////////

    //Formelemente abgreifen
    let form1: HTMLFormElement = <HTMLFormElement>document.getElementById("form1") as HTMLFormElement;
    let form2: HTMLFormElement = <HTMLFormElement>document.getElementById("form2") as HTMLFormElement;
    //Elemente abgreifen
    let input1: HTMLInputElement = <HTMLInputElement>document.getElementById("ablaufen") as HTMLInputElement;
    let input2: HTMLInputElement = <HTMLInputElement>document.getElementById("mengenangabe") as HTMLInputElement;
    let input3: HTMLInputElement = <HTMLInputElement>document.getElementById("names") as HTMLInputElement;
    let input4: HTMLInputElement = <HTMLInputElement>document.getElementById("listprodukte") as HTMLInputElement;
    let input5: HTMLInputElement = <HTMLInputElement>document.getElementById("mengenangabe1") as HTMLInputElement; //warntext7
    let input6: HTMLInputElement = <HTMLInputElement>document.getElementById("ablaufen1") as HTMLInputElement;
    let warntext1: HTMLElement = document.getElementById("info1") as HTMLElement;
    let warntext2: HTMLElement = document.getElementById("info2") as HTMLElement;
    let warntext3: HTMLElement = document.getElementById("info3") as HTMLElement;
    let warntext4: HTMLElement = document.getElementById("info4") as HTMLElement;
    let warntext5: HTMLElement = document.getElementById("info5") as HTMLElement;
    let warntext6: HTMLElement = document.getElementById("info6") as HTMLElement;
    let warntext7: HTMLElement = document.getElementById("info7") as HTMLElement;
    let warntext8: HTMLElement = document.getElementById("info8") as HTMLElement;
    let warntext9: HTMLElement = document.getElementById("info9") as HTMLElement;

    ///////////////////////////////////////////////////////////Seite aufbauen/////////////////////////////////////////////////////////////////
    async function options(): Promise<void> {
        let datalist: HTMLDataListElement = document.getElementById("listproduktedata") as HTMLDataListElement;
        removeHTMLChildren(datalist);
        console.log("data");
        let array: Product[] = await getAllProducts();
        for (let i: number = 0; i < array.length; i++) {
            let option: HTMLOptionElement = document.createElement("option") as HTMLOptionElement;
            option.value = array[i].name;
            option.textContent = array[i].name;
            datalist.appendChild(option);
        }
    }
    ///////////////////////////////////////////////////////Produkte verändern/////////////////////////////////////////////////////////////////

    form1.addEventListener("submit", changeProduct);

    form2.addEventListener("submit", submitProduct);

    async function changeProduct(event: Event): Promise<void> {
        event.preventDefault();
        let fetchedArray: Product[] = await getAllProducts();
        let formDaten1: FormData = new FormData(<HTMLFormElement>form1);
        if (fetchedArray.length > 0) {
            if (formDaten1.get("listprodukte") != "" && formDaten1.get("mengenangabe1") != "" && formDaten1.get("change") != "") {
                input4.style.borderColor = "blue";
                input5.style.borderColor = "blue";
                input6.style.borderColor = "blue";
                warntext5.textContent = "";
                warntext6.textContent = "";
                warntext7.textContent = "";
                warntext8.textContent = "";

                let product: string = formDaten1.get("listprodukte") as string;
                let platzierung: number = await searchInArray(product);
                //Hinzufügen

                if (formDaten1.get("change") == "add") {
                    if (formDaten1.get("ablaufen1") != "") {
                        console.log("add");
                        if (platzierung !== null) {
                            warntext9.textContent = "Produkt wurde hinzugefügt";
                            warntext9.style.color = "blue";

                            //Daten für  Produkt definieren
                            let dueDateString: string = formDaten1.get("ablaufen1") as string;
                            let dueDateHilfe: Date = new Date();
                            console.log(dueDateHilfe);
                            let neuDate: ProductDates = {
                                pieces: Number(formDaten1.get("mengenangabe1")),
                                arriveDate: nowDate,
                                dueDate: dueDateHilfe = new Date(dueDateString)
                            };
                            fetchedArray[platzierung].dates.push(neuDate);

                            postProduct(fetchedArray[platzierung]);
                        }
                        else {
                            warntext9.textContent = "Dieses Produkt existiert noch nicht. Legen Sie es neu an bei *Neues Produkt anlegen*!";
                            warntext9.style.color = "red";
                        }
                    } else {
                        input6.style.borderColor = "red";
                        warntext8.textContent = "Bitte füllen Sie dieses Feld aus!";
                        warntext8.style.color = "red";
                    }
                }
                else if (formDaten1.get("change") == "subtract") { //Wegnehmen
                    console.log("subtrasct");
                    let subtractpieces: number = Number(formDaten1.get("mengenangabe1"));
                    console.log(subtractpieces);
                    fetchedArray[platzierung].dates.sort((a: ProductDates, b: ProductDates) => { //Array nach datum sortieren (ältestes Produkt raus)
                        let aDate: Date = new Date(a.dueDate);
                        let bDate: Date = new Date(b.dueDate);
                        return aDate.getTime() - bDate.getTime();         //evtl a und b tauschen
                    });
                    console.log(fetchedArray[platzierung].dates);
                    let leerezaehler: number = 0;
                    if (subtractpieces <= countAllBadPiecesProduct(false, fetchedArray[platzierung])) {   //Mengenangabe überprüfen; zu groß?
                        warntext9.textContent = "";
                        for (let i: number = 0; i < fetchedArray[platzierung].dates.length; i++) {
                            let ablaufdate: Date = new Date(fetchedArray[platzierung].dates[i].dueDate);
                            console.log(ablaufdate);
                            if (ablaufdate.getTime() > nowDate.getTime()) {
                                if (subtractpieces != 0) {
                                    console.log(subtractpieces);
                                    if (fetchedArray[platzierung].dates[i].pieces <= subtractpieces) {  //durch Dates mengen durcharbeiten
                                        subtractpieces = subtractpieces - fetchedArray[platzierung].dates[i].pieces;
                                        fetchedArray[platzierung].dates[i].pieces = 0;
                                        leerezaehler = leerezaehler + 1;
                                    }
                                    else {
                                        fetchedArray[platzierung].dates[i].pieces -= subtractpieces;
                                        subtractpieces = 0;
                                    }
                                }
                                else {
                                    break;
                                }
                            } else {
                                console.log("Fehler");
                            }

                        }
                        //Alle leeren dates rauslöschen
                        for (let i: number = (fetchedArray[platzierung].dates.length - 1); i > -1; i--) {
                            if (fetchedArray[platzierung].dates[i].pieces == 0) {
                                fetchedArray[platzierung].dates.splice(i, leerezaehler);
                            }
                        }
                        postProduct(fetchedArray[platzierung]);
                    }
                    else {
                        warntext9.textContent = `Es gibt dafür zu wenig bereits vorhandene Produkte. Insgesamt gibt es ${countAllBadPiecesProduct(false, fetchedArray[platzierung])} Stücke.`;
                        warntext9.style.color = "red";
                    } //zu wenig
                }
            } else {
                //Hinweis bei Ausgefüllten Feldern

                if (input4.value == "") {
                    input4.style.borderColor = "red";
                    warntext5.textContent = "Bitte füllen Sie dieses Feld aus!";
                    warntext5.style.color = "red";
                }
                else {
                    input4.style.borderColor = "blue";
                    warntext5.textContent = "";
                }
                if (input5.value == "") {
                    input5.style.borderColor = "red";
                    warntext7.textContent = "Bitte füllen Sie dieses Feld aus!";
                    warntext7.style.color = "red";
                }
                else {
                    input5.style.borderColor = "blue";
                    warntext7.textContent = "";

                }
                if (input6.value == "") {
                    input6.style.borderColor = "red";
                    warntext8.textContent = "Bitte füllen Sie dieses Feld aus!";
                    warntext8.style.color = "red";
                }
                else {
                    input6.style.borderColor = "blue";
                    warntext8.textContent = "";
                }
                if (formDaten1.get("change") == "") {
                    warntext6.textContent = "Bitte füllen Sie dieses Feld aus!";
                    warntext6.style.color = "red";
                }
                else {
                    warntext6.textContent = "";
                }
            }
        } else {
            warntext9.textContent = `Es gibt noch keine Produkte, bitte lege zuerst ein Produkt an.`;
            warntext9.style.color = "red";
        }
    }


    ///////////////////////////////////////////////////////Produkt hinzufügen///////////////////////////////////////////////////////////////

    async function submitProduct(event: Event): Promise<void> {
        event.preventDefault();
        //überprüfen
        console.log("submitform2");
        let formDaten2: FormData = new FormData(<HTMLFormElement>form2);
        if (formDaten2.get("ablaufen") != "" && formDaten2.get("names") != "" && formDaten2.get("mengenangabe") != "") {
            input1.style.borderColor = "blue";
            input2.style.borderColor = "blue";
            input3.style.borderColor = "blue";
            warntext1.textContent = "";
            warntext2.textContent = "";
            warntext3.textContent = "";

            let fetchedArray: Product[] = await getAllProducts();
            let namenumber: number = await searchInArray(formDaten2.get("names").toString());
            if (namenumber == null || fetchedArray.length == 0) {
                warntext4.textContent = "";
                //Daten für neues Produkt definieren
                let dueDateString: string = formDaten2.get("ablaufen") as string;
                let dueDateHilfe: Date = new Date();
                console.log(dueDateHilfe);
                let neuDate: ProductDates = {
                    pieces: Number(formDaten2.get("mengenangabe")),
                    arriveDate: nowDate,
                    dueDate: dueDateHilfe = new Date(dueDateString)
                };

                let neuesProdukt: Product = new Product(formDaten2.get("names") as string, [neuDate], 0, [formDaten2.get("notiz") as string]);
                neuesProdukt.overallPieces = countAllPiecesProduct(neuesProdukt);

                console.log(neuesProdukt);

                postProduct(neuesProdukt);

                options();
            }
            else {
                warntext4.textContent = "Dieses Produkt existiert bereits. Bitte fügen Sie es bei *Bereits existierende Produktmengen verändern* hinzu.";
                warntext4.style.color = "red";
            }
        } else {
            //Hinweis bei Ausgefüllten Feldern

            if (input1.value == "") {
                input1.style.borderColor = "red";
                warntext3.textContent = "Bitte füllen Sie dieses Feld aus!";
                warntext3.style.color = "red";
            }
            else {
                input1.style.borderColor = "blue";
                warntext3.textContent = "";
            }
            if (input2.value == "") {
                input2.style.borderColor = "red";
                warntext2.textContent = "Bitte füllen Sie dieses Feld aus!";
                warntext2.style.color = "red";
            }
            else {
                input2.style.borderColor = "blue";
                warntext2.textContent = "";

            }
            if (input3.value == "") {
                input3.style.borderColor = "red";
                warntext1.textContent = "Bitte füllen Sie dieses Feld aus!";
                warntext1.style.color = "red";
            }
            else {
                input3.style.borderColor = "blue";
                warntext1.textContent = "";
            }
        }
    }

    ////////////////////////////////////////////////andere Funktionen/////////////////////////////////////////////////////////////////////////

    //ganze Liste von Produkten bekommen
    async function getAllProducts(): Promise<Product[]> {
        let response: Response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText: string = await response.text();
        return JSON.parse(responseText) as Product[];
    }
    async function updateArray(): Promise<void> {
        let fetchedProductArray: Product[] = await getAllProducts(); //? funktioniert nur in async function
        allProducts = fetchedProductArray;
        console.log(allProducts);
    }

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
    function removeHTMLChildren(element: HTMLElement): void {
        while (element.lastChild != document.getElementById("wichtig")) {
          element.removeChild(element.lastChild);
        }
      }
}



