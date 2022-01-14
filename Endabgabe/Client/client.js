"use strict";
var Client;
(function (Client) {
    //heutiges Datum
    let nowDate = new Date();
    //Product anlegen
    class Product {
        name = "";
        dates = [];
        overallPieces = 0;
        notice = [];
        constructor(name, dates, overallPieces, notice) {
            this.name = name;
            this.dates = dates;
            this.overallPieces = overallPieces;
            this.notice = notice;
        }
        //Mengenanzahl feststellen
        countAllPieces() {
            let count = 0;
            for (let i = 0; i < this.dates.length; i++) {
                count = this.dates[i].pieces + count;
            }
            return count;
        }
        //(nicht) Abgelaufene Produktmenge feststellen 
        countAllBadPieces(bad) {
            let countBad = 0;
            let countGood = 0;
            //Daten vergleichen
            for (let i = 0; i < this.dates.length; i++) {
                if (this.dates[i].dueDate.getFullYear() <= nowDate.getFullYear()) {
                    countBad = this.dates[i].pieces + countBad;
                }
                else if (this.dates[i].dueDate.getMonth() <= nowDate.getMonth()) {
                    countBad = this.dates[i].pieces + countBad;
                }
                else if (this.dates[i].dueDate.getDay() <= nowDate.getDate()) {
                    countBad = this.dates[i].pieces + countBad;
                }
                else {
                    countGood = this.dates[i].pieces + countGood;
                }
            }
            if (bad == true) {
                return countBad;
            }
            else {
                if (this.countAllPieces() - countBad === countGood) {
                    return countGood;
                }
                else {
                    //Überprüfen Daten
                    console.log("Error");
                    return 0;
                }
            }
        }
    }
    //Alle Produkte zum Überblick
    let allProducts = [];
    updateArray();
    console.log(allProducts);
    async function updateArray() {
        let fetchedProductArray = await getAllProducts(); //? funktioniert nur in async function
        allProducts = fetchedProductArray;
    }
    if (document.getElementById("table")) {
        productListeAnzeigen();
    }
    //Formelemente abgreifen
    let form1 = document.getElementById("form1");
    let form2 = document.getElementById("form2");
    //Elemente aus HTML abgreifen
    let input1 = document.getElementById("ablaufen");
    let input2 = document.getElementById("mengenangabe");
    let input3 = document.getElementById("names");
    let input4 = document.getElementById("listprodukte");
    let input5 = document.getElementById("mengenangabe1"); //warntext7
    let input6 = document.getElementById("ablaufen1");
    let warntext1 = document.getElementById("info1");
    let warntext2 = document.getElementById("info2");
    let warntext3 = document.getElementById("info3");
    let warntext4 = document.getElementById("info4");
    let warntext5 = document.getElementById("info5");
    let warntext6 = document.getElementById("info6");
    let warntext7 = document.getElementById("info7");
    let warntext8 = document.getElementById("info8");
    let warntext9 = document.getElementById("info9");
    form1.addEventListener("submit", changeProduct);
    form2.addEventListener("submit", submitProduct);
    async function changeProduct(event) {
        event.preventDefault();
        let formDaten1 = new FormData(event.currentTarget);
        if (formDaten1.get("ablaufen1") != "" && formDaten1.get("listprodukte") != "" && formDaten1.get("mengenangabe1") != "" && formDaten1.get("change") != "") {
            input4.style.borderColor = "blue";
            input5.style.borderColor = "blue";
            input6.style.borderColor = "blue";
            warntext5.textContent = "";
            warntext6.textContent = "";
            warntext7.textContent = "";
            warntext8.textContent = "";
            let product = formDaten1.get("listprodukte");
            //Hinzufügen
            if (formDaten1.get("change") == "add") {
                console.log("add");
                let platzierung = searchInArray(product);
                if (platzierung !== null) {
                    warntext9.textContent = "";
                    //Daten für  Produkt definieren
                    let dueDateString = formDaten1.get("ablaufen1");
                    let neuDate = {
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
                let platzierung = searchInArray(product);
                let subtractpieces = Number(formDaten1.get("mengenangabe1"));
                allProducts[platzierung].dates.sort((a, b) => {
                    return b.dueDate.getTime() - a.dueDate.getTime(); //evtl a und b tauschen
                });
                if (subtractpieces > allProducts[platzierung].countAllBadPieces(false)) { //Mengenangabe überprüfen; zu groß?
                    warntext9.textContent = "";
                    for (let i = 0; i < allProducts[platzierung].dates.length; i++) {
                        if (allProducts[platzierung].dates[i].dueDate <= nowDate) {
                            if (subtractpieces != 0) {
                                if (allProducts[platzierung].dates[i].pieces <= subtractpieces) { //durch Dates mengen durcharbeiten
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
        }
        else {
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
    async function submitProduct(event) {
        //überprüfen
        console.log("geht");
        console.log(nowDate);
        event.preventDefault();
        let formDaten2 = new FormData(event.currentTarget);
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
                let dueDateString = formDaten2.get("ablaufen");
                let neuDate = {
                    pieces: Number(formDaten2.get("mengenangabe")),
                    arriveDate: nowDate,
                    dueDate: nowDate = new Date(dueDateString)
                };
                //Überprüfen Einträge
                console.log(neuDate);
                let neuesProdukt = new Product(formDaten2.get("names"), [neuDate], 0, [formDaten2.get("notiz")]);
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
        }
        else {
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
    function searchInArray(name) {
        let index;
        let nope = 0;
        for (let i = 0; i < allProducts.length; i++) {
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
    async function postJsonString(url, jsonString) {
        let response = await fetch(url, {
            method: "post",
            body: jsonString
        });
        console.log(response);
    }
    //ein gewünschtes Produkt bekommen für Einzelansicht
    async function getOneProduct(name) {
        let response = await fetch(`http://localhost:3000/singleProduct?name=${name}`);
        let responseText = await response.text();
        return JSON.parse(responseText);
    }
    //ganze Liste von Produkten bekommen
    async function getAllProducts() {
        let response = await fetch("http://localhost:3000/allProducts");
        let responseText = await response.text();
        return JSON.parse(responseText);
    }
    function getNextAblauf(product) {
        let nextAblaufDate = nowDate;
        for (let i = 0; i < product.dates.length; i++) {
            if (product.dates[i].dueDate > nowDate) {
                nextAblaufDate = product.dates[i].dueDate;
                break;
            }
        }
        return nextAblaufDate;
    }
    async function productListeAnzeigen() {
        let table = document.getElementById("produktTabelle");
        //Liste erneut updaten für Sicherheit
        await updateArray();
        //Liste abfragen
        for (let product of allProducts) {
            //Elemente anlegen
            let tr = document.createElement("tr");
            let tdName = document.createElement("td");
            let tdMenge = document.createElement("td");
            let tdAblauf = document.createElement("td");
            let tdDetail = document.createElement("td");
            let detailButton = document.createElement("button");
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
})(Client || (Client = {}));
//# sourceMappingURL=client.js.map