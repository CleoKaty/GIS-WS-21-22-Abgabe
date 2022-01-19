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
    //Productliste abfangen/ anlegen
    let allProducts = [];
    async function updateArray() {
        let fetchedProductArray = await getAllProducts();
        allProducts = fetchedProductArray;
    }
    productListeAnzeigen();
    //ganze Liste von Produkten bekommen
    async function getAllProducts() {
        let response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText = await response.text();
        return JSON.parse(responseText);
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
            let link = document.createElement("a");
            let detailButton = document.createElement("button");
            //Inhalt füllen
            tdName.innerHTML = product.name;
            let allPieces = product.countAllPieces();
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
            function saveinLocalStorage() {
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
})(ClientIndex || (ClientIndex = {}));
//# sourceMappingURL=clientIndex.js.map