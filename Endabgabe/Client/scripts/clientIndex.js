"use strict";
//neue namespace für mehr Übersicht
var ClientIndex;
(function (ClientIndex) {
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
    productListeAnzeigen();
    /////////////////////////////////////////////////////////////Seite aufbauen//////////////////////////////////////////////////////////
    async function productListeAnzeigen() {
        let fetchedArray = await getAllProducts();
        let table = document.getElementById("produktTabelle");
        //alphabetisch sortieren
        fetchedArray.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        //Liste abfragen
        for (let product of fetchedArray) {
            if (countAllBadPiecesProduct(false, product) > 0) {
                //Elemente anlegen
                let tr = document.createElement("tr");
                let tdName = document.createElement("td");
                let tdMenge = document.createElement("td");
                let tdAblauf = document.createElement("td");
                let tdDetail = document.createElement("td");
                let link = document.createElement("a");
                let detailButton = document.createElement("button");
                //Inhalt füllen
                tdName.innerHTML = product.name;
                let allPieces;
                allPieces = countAllPiecesProduct(product);
                tdMenge.innerHTML = allPieces.toString();
                let getNextAblaufDate = new Date(getNextAblauf(product));
                tdAblauf.innerHTML = `${getNextAblaufDate.getDate()}.${getNextAblaufDate.getUTCMonth() + 1}.${getNextAblaufDate.getFullYear()}`;
                detailButton.innerHTML = "Details";
                tdDetail.appendChild(link);
                //Funktion für Detailbutton
                link.appendChild(detailButton);
                link.setAttribute("href", "produkt.html");
                link.setAttribute("class", "linkProdukt");
                detailButton.addEventListener("click", saveinLocalStorage);
                //Abfrage über local Storage
                function saveinLocalStorage() {
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
    function getNextAblauf(product) {
        let nextAblaufDate = new Date(nowDate);
        product.dates.sort((a, b) => {
            let aDate = new Date(a.dueDate);
            let bDate = new Date(b.dueDate);
            return bDate.getTime() - aDate.getTime();
        });
        console.log(product.dates);
        for (let i = 0; i < product.dates.length; i++) {
            let date = new Date(product.dates[i].dueDate);
            if (date.getTime() > nowDate.getTime()) {
                nextAblaufDate = product.dates[i].dueDate;
            }
        }
        console.log(nextAblaufDate);
        return nextAblaufDate;
    }
    function countAllPiecesProduct(product) {
        let count = 0;
        for (let i = 0; i < product.dates.length; i++) {
            count = product.dates[i].pieces + count;
        }
        return count;
    }
    //ganze Liste von Produkten bekommen
    async function getAllProducts() {
        let response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText = await response.text();
        console.log(responseText);
        return JSON.parse(responseText);
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
})(ClientIndex || (ClientIndex = {}));
//# sourceMappingURL=clientIndex.js.map