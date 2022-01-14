namespace Client {
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
    //Alle Produkte zum Überblick
    let allProducts: Product[] = [];
    updateArray();
    console.log(allProducts);
    async function updateArray(): Promise<void> {
        let fetchedProductArray: Product[] = await getAllProducts(); //? funktioniert nur in async function
        allProducts = fetchedProductArray;
    }
    if (document.getElementById("table")) {
        productListeAnzeigen();
    }
    


    //Formelemente abgreifen
    let form1: HTMLFormElement = <HTMLFormElement>document.getElementById("form1") as HTMLFormElement;
    let form2: HTMLFormElement = <HTMLFormElement>document.getElementById("form2") as HTMLFormElement;
    //Elemente aus HTML abgreifen
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

    
    form1.addEventListener("submit", changeProduct);

    form2.addEventListener("submit", submitProduct);

    async function changeProduct(event: Event): Promise<void> {
        event.preventDefault();
        let formDaten1: FormData = new FormData(<HTMLFormElement>event.currentTarget);
        if (formDaten1.get("ablaufen1") != "" && formDaten1.get("listprodukte") != "" && formDaten1.get("mengenangabe1") != "" && formDaten1.get("change") != "") {
            input4.style.borderColor = "blue";
            input5.style.borderColor = "blue";
            input6.style.borderColor = "blue";
            warntext5.textContent = "";
            warntext6.textContent = "";
            warntext7.textContent = "";
            warntext8.textContent = "";

            let product: string = formDaten1.get("listprodukte") as string;
            //Hinzufügen
            if (formDaten1.get("change") == "add") {
                console.log("add");
                let platzierung: number = searchInArray(product);
                if (platzierung !== null) {
                    warntext9.textContent = "";
                    //Daten für  Produkt definieren
                    let dueDateString: string = formDaten1.get("ablaufen1") as string;
                    let neuDate: ProductDates = {
                        pieces: Number(formDaten1.get("mengenangabe1")),
                        arriveDate: nowDate,
                        dueDate: nowDate = new Date(dueDateString)
                    };
                    allProducts[platzierung].dates.push(neuDate);
                    allProducts[platzierung].overallPieces = allProducts[platzierung].countAllPieces();
                }
                else {
                    warntext9.textContent = "Dieses Produkt existiert noch nicht. Legen Sie es neu an bei *Neues Produkt anlegen*!";
                    warntext9.style.color = "red";
                }
            }
            else if (formDaten1.get("change") == "subtract") { //Wegnehmen
                let platzierung: number = searchInArray(product);
                let subtractpieces: number = Number(formDaten1.get("mengenangabe1"));
                allProducts[platzierung].dates.sort((a: ProductDates, b: ProductDates) => { //Array nach datum sortieren (ältestes Produkt raus)
                    return b.dueDate.getTime() - a.dueDate.getTime();         //evtl a und b tauschen
                });
                if (subtractpieces > allProducts[platzierung].countAllBadPieces(false)) {   //Mengenangabe überprüfen; zu groß?
                    warntext9.textContent = "";
                    for (let i: number = 0; i < allProducts[platzierung].dates.length; i++) {
                        if (allProducts[platzierung].dates[i].dueDate <= nowDate) {
                            if (subtractpieces != 0) {
                                if (allProducts[platzierung].dates[i].pieces <= subtractpieces) {  //durch Dates mengen durcharbeiten
                                    subtractpieces -= allProducts[platzierung].dates[i].pieces;
                                    allProducts[platzierung].dates.splice(platzierung, 1);
                                }
                                else {
                                    allProducts[platzierung].dates[i].pieces -= subtractpieces;
                                    subtractpieces = 0;
                                }
                            }
                            else {
                                break;
                            }
                        }

                    }
                    allProducts[platzierung].overallPieces = allProducts[platzierung].countAllPieces();

                }
                else {
                    warntext9.textContent = `Es gibt dafür zu wenig bereits vorhandene Produkte. Insgesamt gibt es ${allProducts[platzierung].countAllBadPieces(false)} Stücke.`;
                    warntext9.style.color = "red";
                } //zu wenig
            }




            await fetch("http://localhost:3000/allProducts", {
                method: "post",
                body: JSON.stringify(allProducts)
            });
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
    }




    async function submitProduct(event: Event): Promise<void> {
        //überprüfen
        console.log("geht");
        console.log(nowDate);
        event.preventDefault();
        let formDaten2: FormData = new FormData(<HTMLFormElement>event.currentTarget);
        if (formDaten2.get("ablaufen") != "" && formDaten2.get("names") != "" && formDaten2.get("mengenangabe") != "") {
            input1.style.borderColor = "blue";
            input2.style.borderColor = "blue";
            input3.style.borderColor = "blue";
            warntext1.textContent = "";
            warntext2.textContent = "";
            warntext3.textContent = "";

            if (searchInArray(formDaten2.get("names").toString()) == null) {
                warntext4.textContent = "";
                //Daten für neues Produkt definieren
                let dueDateString: string = formDaten2.get("ablaufen") as string;
                let neuDate: ProductDates = {
                    pieces: Number(formDaten2.get("mengenangabe")),
                    arriveDate: nowDate,
                    dueDate: nowDate = new Date(dueDateString)
                };
                //Überprüfen Einträge
                console.log(neuDate);


                let neuesProdukt: Product = new Product(formDaten2.get("names") as string, [neuDate], 0, [formDaten2.get("notiz") as string]);
                neuesProdukt.overallPieces = neuesProdukt.countAllPieces();

                //Überprüfen Einträge
                console.log(neuesProdukt);
                allProducts.push(neuesProdukt);

                await fetch("http://localhost:3000/allProducts", {
                    method: "post",
                    body: JSON.stringify(allProducts)
                });
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

    //neue Seite Produkte Übersicht

    async function postJsonString(url: RequestInfo, jsonString: string): Promise<void> {
        let response: Response = await fetch(url, {                                        
            method: "post",
            body: jsonString
        });
        console.log(response);
    }
    //ein gewünschtes Produkt bekommen für Einzelansicht
    async function getOneProduct(name: string): Promise<Product> {
        let response: Response = await fetch(`http://localhost:3000/singleProduct?name=${name}`);
        let responseText: string = await response.text();
        return JSON.parse(responseText) as Product;                                                   
    }
    //ganze Liste von Produkten bekommen
    async function getAllProducts(): Promise<Product[]> {
        let response: Response = await fetch("http://localhost:3000/allProducts");           
        let responseText: string = await response.text();
        return JSON.parse(responseText) as Product[];
    }

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
            let detailButton: HTMLButtonElement = document.createElement("button");
            
            //Inhalt füllen
            tdName.innerHTML = product.name;
            tdMenge.innerHTML = product.overallPieces.toString();
            tdAblauf.innerHTML = getNextAblauf(product).toString();
            detailButton.innerHTML = "Details";
            tdDetail.appendChild(detailButton);

            //append Inhalt
            tr.appendChild(tdName);
            tr.appendChild(tdMenge);
            tr.appendChild(tdAblauf);
            tr.appendChild(tdDetail);
            table.appendChild(tr);


        }





    }

    //Funktion für Detailbutton

}


