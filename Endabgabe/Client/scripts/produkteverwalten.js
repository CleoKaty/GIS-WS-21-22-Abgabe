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
    listenAnlegen();
    async function listenAnlegen() {
        let fetchedarray = await getAllProducts();
        fetchedarray.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        //Wiederholungen vermeiden
        removeHTMLChildren(leereListe);
        removeHTMLChildren(abgelaufenListe);
        console.log(fetchedarray);
        //event.preventDefault();
        for (let product of fetchedarray) {
            if (countAllPiecesProduct(product) == 0 || product.dates.length == 0) {
                let liElement = document.createElement("li");
                let loeschButton = document.createElement("button");
                liElement.innerText = product.name;
                loeschButton.innerText = "Löschen";
                liElement.appendChild(loeschButton);
                loeschButton.addEventListener("click", () => productEntfernen(product.name));
                leereListe.appendChild(liElement);
            }
            else if (countAllBadPiecesProduct(true, product) > 0) {
                let liElement = document.createElement("li");
                let entsorgenButton = document.createElement("button");
                liElement.innerText = product.name + ": " + countAllBadPiecesProduct(true, product);
                entsorgenButton.innerText = "Entsorgen";
                liElement.appendChild(entsorgenButton);
                entsorgenButton.addEventListener("click", () => productEntsorgen(product.name));
                abgelaufenListe.appendChild(liElement);
            }
        }
    }
    alleEntsorgenButton.addEventListener("click", () => {
        alleEntsorgen();
    });
    alleLoeschenButton.addEventListener("click", () => {
        alleLoeschen();
    });
    ////////////////////////////////////////////andere helfende Funktionen//////////////////////////////////////////////////////////////////
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
    async function productEntfernen(name) {
        let platzierungArray = await searchInArray(name);
        let array = await getAllProducts();
        console.log(array);
        let loeschProdukt = array[platzierungArray];
        console.log(loeschProdukt);
        await postProductLoesch(loeschProdukt);
        await listenAnlegen();
    }
    async function productEntsorgen(name) {
        let platzierungArray = await searchInArray(name);
        let array = await getAllProducts();
        for (let i = 0; i < array[platzierungArray].dates.length; i++) {
            let datestring = array[platzierungArray].dates[i].dueDate.toString();
            let date1 = new Date(datestring);
            if (date1.getFullYear() <= nowDate.getFullYear()) {
                array[platzierungArray].dates.splice(i, 1);
            }
            else if (date1.getMonth() <= nowDate.getMonth()) {
                array[platzierungArray].dates.splice(i, 1);
            }
            else if (date1.getDay() <= nowDate.getDate()) {
                array[platzierungArray].dates.splice(i, 1);
            }
        }
        let loeschProdukt = array[platzierungArray];
        await postProduct(loeschProdukt);
        await listenAnlegen();
    }
    async function alleEntsorgen() {
        let array = await getAllProducts();
        for (let product of array) {
            productEntsorgen(product.name);
        }
        await listenAnlegen();
    }
    async function alleLoeschen() {
        let array = await getAllProducts();
        for (let product of array) {
            productEntfernen(product.name);
        }
        await listenAnlegen();
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
    function removeHTMLChildren(element) {
        while (element.lastChild != document.getElementById("wichtig")) {
            element.removeChild(element.lastChild);
        }
    }
    //für Post an den Server
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
    async function postProductLoesch(product) {
        console.log("postProduct", product);
        await sendJSONStringWithPOST("http://127.0.0.1:3000/allProducts", JSON.stringify({
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
})(Verwaltung || (Verwaltung = {}));
//# sourceMappingURL=produkteverwalten.js.map