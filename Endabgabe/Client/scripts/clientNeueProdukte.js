"use strict";
var ClientNeueProdukte;
(function (ClientNeueProdukte) {
    //heutiges Datum
    let nowDate = new Date();
    //Product anlegen
    class Product {
        name = "";
        dates = [];
        overallPieces = 0;
        notice = [];
        _id;
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
    options();
    /////////////////////////////////////////////Elemente aus HTML abgreifen//////////////////////////////////////////////////////////////////
    //Formelemente abgreifen
    let form1 = document.getElementById("form1");
    let form2 = document.getElementById("form2");
    //Elemente abgreifen
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
    ///////////////////////////////////////////////////////////Seite aufbauen/////////////////////////////////////////////////////////////////
    async function options() {
        let datalist = document.getElementById("listproduktedata");
        removeHTMLChildren(datalist);
        console.log("data");
        let array = await getAllProducts();
        for (let i = 0; i < array.length; i++) {
            let option = document.createElement("option");
            option.value = array[i].name;
            option.textContent = array[i].name;
            datalist.appendChild(option);
        }
    }
    ///////////////////////////////////////////////////////Produkte verändern/////////////////////////////////////////////////////////////////
    form1.addEventListener("submit", changeProduct);
    form2.addEventListener("submit", submitProduct);
    async function changeProduct(event) {
        event.preventDefault();
        let fetchedArray = await getAllProducts();
        let formDaten1 = new FormData(form1);
        if (fetchedArray.length > 0) {
            if (formDaten1.get("listprodukte") != "" && formDaten1.get("mengenangabe1") != "" && formDaten1.get("change") != "") {
                input4.style.borderColor = "blue";
                input5.style.borderColor = "blue";
                input6.style.borderColor = "blue";
                warntext5.textContent = "";
                warntext6.textContent = "";
                warntext7.textContent = "";
                warntext8.textContent = "";
                let product = formDaten1.get("listprodukte");
                let platzierung = await searchInArray(product);
                //Hinzufügen
                if (formDaten1.get("change") == "add") {
                    if (formDaten1.get("ablaufen1") != "") {
                        console.log("add");
                        if (platzierung !== null) {
                            warntext9.textContent = "Produkt wurde hinzugefügt";
                            warntext9.style.color = "blue";
                            //Daten für  Produkt definieren
                            let dueDateString = formDaten1.get("ablaufen1");
                            let dueDateHilfe = new Date();
                            console.log(dueDateHilfe);
                            let neuDate = {
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
                    }
                    else {
                        input6.style.borderColor = "red";
                        warntext8.textContent = "Bitte füllen Sie dieses Feld aus!";
                        warntext8.style.color = "red";
                    }
                }
                else if (formDaten1.get("change") == "subtract") { //Wegnehmen
                    console.log("subtrasct");
                    let subtractpieces = Number(formDaten1.get("mengenangabe1"));
                    console.log(subtractpieces);
                    fetchedArray[platzierung].dates.sort((a, b) => {
                        let aDate = new Date(a.dueDate);
                        let bDate = new Date(b.dueDate);
                        return aDate.getTime() - bDate.getTime(); //evtl a und b tauschen
                    });
                    console.log(fetchedArray[platzierung].dates);
                    let leerezaehler = 0;
                    if (subtractpieces <= countAllBadPiecesProduct(false, fetchedArray[platzierung])) { //Mengenangabe überprüfen; zu groß?
                        warntext9.textContent = "";
                        for (let i = 0; i < fetchedArray[platzierung].dates.length; i++) {
                            let ablaufdate = new Date(fetchedArray[platzierung].dates[i].dueDate);
                            console.log(ablaufdate);
                            if (ablaufdate.getTime() > nowDate.getTime()) {
                                if (subtractpieces != 0) {
                                    console.log(subtractpieces);
                                    if (fetchedArray[platzierung].dates[i].pieces <= subtractpieces) { //durch Dates mengen durcharbeiten
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
                            }
                            else {
                                console.log("Fehler");
                            }
                        }
                        //Alle leeren dates rauslöschen
                        for (let i = (fetchedArray[platzierung].dates.length - 1); i > -1; i--) {
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
        else {
            warntext9.textContent = `Es gibt noch keine Produkte, bitte lege zuerst ein Produkt an.`;
            warntext9.style.color = "red";
        }
    }
    ///////////////////////////////////////////////////////Produkt hinzufügen///////////////////////////////////////////////////////////////
    async function submitProduct(event) {
        event.preventDefault();
        //überprüfen
        console.log("submitform2");
        let formDaten2 = new FormData(form2);
        if (formDaten2.get("ablaufen") != "" && formDaten2.get("names") != "" && formDaten2.get("mengenangabe") != "") {
            input1.style.borderColor = "blue";
            input2.style.borderColor = "blue";
            input3.style.borderColor = "blue";
            warntext1.textContent = "";
            warntext2.textContent = "";
            warntext3.textContent = "";
            let fetchedArray = await getAllProducts();
            let namenumber = await searchInArray(formDaten2.get("names").toString());
            if (namenumber == null || fetchedArray.length == 0) {
                warntext4.textContent = "";
                //Daten für neues Produkt definieren
                let dueDateString = formDaten2.get("ablaufen");
                let dueDateHilfe = new Date();
                console.log(dueDateHilfe);
                let neuDate = {
                    pieces: Number(formDaten2.get("mengenangabe")),
                    arriveDate: nowDate,
                    dueDate: dueDateHilfe = new Date(dueDateString)
                };
                let neuesProdukt = new Product(formDaten2.get("names"), [neuDate], 0, [formDaten2.get("notiz")]);
                neuesProdukt.overallPieces = countAllPiecesProduct(neuesProdukt);
                console.log(neuesProdukt);
                postProduct(neuesProdukt);
                options();
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
    ////////////////////////////////////////////////andere Funktionen/////////////////////////////////////////////////////////////////////////
    //ganze Liste von Produkten bekommen
    async function getAllProducts() {
        let response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText = await response.text();
        return JSON.parse(responseText);
    }
    async function updateArray() {
        let fetchedProductArray = await getAllProducts(); //? funktioniert nur in async function
        allProducts = fetchedProductArray;
        console.log(allProducts);
    }
    async function postProduct(product) {
        console.log("postProduct", product);
        await sendJSONStringWithPOST("http://127.0.0.1:3000/singleProduct", JSON.stringify({
            name: product.name,
            dates: product.dates,
            overallPieces: product.overallPieces,
            notice: product.notice,
            _id: product._id
        }));
    }
    async function sendJSONStringWithPOST(url, jsonString) {
        await fetch(url, {
            method: "post",
            body: jsonString
        });
    }
    function countAllPiecesProduct(product) {
        let count = 0;
        for (let i = 0; i < product.dates.length; i++) {
            count = product.dates[i].pieces + count;
        }
        return count;
    }
    function countAllBadPiecesProduct(bad, product) {
        let countBad = 0;
        let countGood = 0;
        //Daten vergleichen
        for (let i = 0; i < product.dates.length; i++) {
            let date1 = new Date(product.dates[i].dueDate);
            console.log(date1);
            if (date1.getFullYear() < nowDate.getFullYear()) {
                countBad = product.dates[i].pieces + countBad;
                console.log("Jahr");
            }
            else if (date1.getMonth() < nowDate.getMonth()) {
                countBad = product.dates[i].pieces + countBad;
                console.log("Monat");
            }
            else if (date1.getDate() < nowDate.getDate()) {
                countBad = product.dates[i].pieces + countBad;
                console.log("Tag");
            }
            else {
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
            }
            else {
                //Überprüfen Daten
                console.log("Error");
                return 0;
            }
        }
    }
    async function searchInArray(name) {
        let productsList = await getAllProducts();
        console.log(productsList);
        let index;
        let nope = 0;
        for (let i = 0; i < productsList.length; i++) {
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
            return index;
        }
    }
    function removeHTMLChildren(element) {
        while (element.lastChild != document.getElementById("wichtig")) {
            element.removeChild(element.lastChild);
        }
    }
})(ClientNeueProdukte || (ClientNeueProdukte = {}));
//# sourceMappingURL=clientNeueProdukte.js.map