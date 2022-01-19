"use strict";
var Produktansicht;
(function (Produktansicht) {
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
    let ueberschrift = document.getElementById("kopf");
    //let anzahl: HTMLDivElement = document.getElementById("anzahl") as HTMLDivElement;
    let ablaufdaten = document.getElementById("ablaufdaten");
    let notizen = document.getElementById("notizen");
    let p1 = document.getElementById("p1");
    let p2 = document.getElementById("p1");
    let notizDiv = document.getElementById("nozizDiv");
    /////////////////////////////////////////////////////Detailansicht Code////////////////////////////////////////////////////////////////
    //ein gewünschtes Produkt bekommen für Einzelansicht mithilfe des Local Storages
    let arrayIndex = searchInArray(getItemFromLocalStorage());
    function getItemFromLocalStorage() {
        let localStorageString = localStorage.getItem("productDetail") || "[]";
        let array = JSON.parse(localStorageString);
        let detailProduktName = array[0].name;
        localStorage.removeItem("productDetail");
        return detailProduktName;
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
    seiteAufbauen(event); //geht das?
    //html Seite aufbauen
    async function seiteAufbauen(evt) {
        evt.preventDefault();
        ueberschrift.innerHTML = allProducts[arrayIndex].name;
        allProducts[arrayIndex].overallPieces = allProducts[arrayIndex].countAllPieces();
        p1.innerText = allProducts[arrayIndex].overallPieces.toString();
        p2.innerText = `Davon abgelaufene ${allProducts[arrayIndex].countAllBadPieces(false).toString()}`;
        allProducts[arrayIndex].dates.sort((a, b) => {
            return b.dueDate.getTime() - a.dueDate.getTime();
        });
        let hilfszaehler = 0;
        //Daten anzeigen 
        for (let date of allProducts[arrayIndex].dates) {
            let liElement = document.createElement("li");
            let buttonElement = document.createElement("button");
            liElement.innerText = "Ablaufdatum" + date.dueDate.getDate() + "." + date.dueDate.getMonth() + "." + date.dueDate.getFullYear() +
                +"Anlegedatum: " + date.arriveDate.getDate() + "." + date.arriveDate.getMonth() + "." + date.arriveDate.getFullYear();
            buttonElement.innerText = "Herrausnehmen";
            liElement.appendChild(buttonElement);
            buttonElement.addEventListener("click", () => {
                allProducts[arrayIndex].dates.splice(hilfszaehler, 1);
            });
            ablaufdaten.appendChild(liElement);
        }
        //Notizenanzeigen
        let inputNotiz = document.createElement("input");
        let notizButton = document.createElement("button");
        notizButton.innerText = "neue Notiz anlegen";
        inputNotiz.setAttribute("type", "text");
        notizButton.addEventListener("click", () => {
            allProducts[arrayIndex].notice.push(inputNotiz.value.toString());
        });
        notizDiv.appendChild(inputNotiz);
        notizDiv.appendChild(notizButton);
        for (let i = 0; i < allProducts[arrayIndex].notice.length; i++) {
            let liElement = document.createElement("li");
            let buttonElement = document.createElement("button");
            liElement.innerText = allProducts[arrayIndex].notice[i];
            buttonElement.innerText = "Löschen";
            buttonElement.addEventListener("click", () => {
                allProducts[arrayIndex].notice.splice(i, 1);
            });
            notizen.appendChild(liElement);
        }
    }
})(Produktansicht || (Produktansicht = {}));
//# sourceMappingURL=produkt.js.map