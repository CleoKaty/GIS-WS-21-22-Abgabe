"use strict";
var Verwaltung;
(function (Verwaltung) {
    ////////////////////////////////////////////////////Klassen, Interfaces und Arrays////////////////////////////////////////////////////////////
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
    updateArray();
    async function updateArray() {
        let fetchedProductArray = await getAllProducts();
        allProducts = fetchedProductArray;
    }
    //ganze Liste von Produkten bekommen
    async function getAllProducts() {
        let response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText = await response.text();
        return JSON.parse(responseText);
    }
    /////////////////////////////////////////////Elemente aus html abgreifen///////////////////////////////////////////////////////////////
    let alleEntsorgenButton = document.getElementById("entsorgen");
    let abgelaufenListe = document.getElementById("abgelaufenListe");
    let alleLoeschenButton = document.getElementById("löschen");
    let leereListe = document.getElementById("leereListe");
    //////////////////////////////////////////////////////Seite aufbauen///////////////////////////////////////////////////////////////////
    async function listenAnlegen() {
        for (let product of allProducts) {
            if (product.countAllPieces() == 0) {
                let liElement = document.createElement("li");
                let loeschButton = document.createElement("button");
                liElement.innerText = product.name;
                loeschButton.innerText = "Löschen";
                liElement.appendChild(loeschButton);
                loeschButton.addEventListener("click", () => productEntfernen(product.name));
                leereListe.appendChild(liElement);
            }
            else if (product.countAllBadPieces(true) > 0) {
                let liElement = document.createElement("li");
                let entsorgenButton = document.createElement("button");
                liElement.innerText = product.name + ": " + product.countAllBadPieces(true);
                entsorgenButton.innerText = "Entsorgen";
            }
        }
    }
    ////////////////////////////////////////////andere helfende Funktionen//////////////////////////////////////////////////////////////////
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
    async function productEntfernen(name) {
        let platzierungArray = searchInArray(name);
        allProducts.splice(platzierungArray, 1);
        await fetch("http://127.0.0.1:3000/allProducts", {
            method: "post",
            body: JSON.stringify(allProducts)
        });
    }
})(Verwaltung || (Verwaltung = {}));
//# sourceMappingURL=produkteverwalten.js.map