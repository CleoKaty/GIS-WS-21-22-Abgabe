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
                else if (this.dates[i].dueDate.getDay() <= nowDate.getDay()) {
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
    console.log(allProducts);
    async function updateArray() {
        let response = await fetch("http://127.0.0.1:3000/allProducts");
        let responseText = await response.text();
        let fetchedArray = [];
        fetchedArray = JSON.parse(responseText);
        return fetchedArray;
    }
    /////////////////////////////////////////////Elemente aus html abgreifen///////////////////////////////////////////////////////////////
    let ueberschrift = document.getElementById("kopf");
    //let anzahl: HTMLDivElement = document.getElementById("anzahl") as HTMLDivElement;
    let ablaufdaten = document.getElementById("ablaufdaten");
    let notizen = document.getElementById("notizen");
    let p1 = document.getElementById("p1");
    let p2 = document.getElementById("p2");
    let notizDiv = document.getElementById("notizDiv");
    let nameChange = document.getElementById("nameChange");
    let neuName = document.getElementById("neuName");
    /////////////////////////////////////////////////////Detailansicht Code////////////////////////////////////////////////////////////////
    //ein gewünschtes Produkt bekommen für Einzelansicht mithilfe des Local Storages
    function getItemFromLocalStorage() {
        let localStorageString = localStorage.getItem("productDetail") || "[]";
        let arrayProduct = [];
        arrayProduct[0] = JSON.parse(localStorageString);
        console.log(arrayProduct);
        let detailProduktName = arrayProduct[0].name;
        console.log(detailProduktName);
        return detailProduktName;
    }
    async function searchInArray(name) {
        let productsList = await updateArray();
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
    async function nameChanger() {
        let array = await updateArray();
        let arrayIndex = await searchInArray(getItemFromLocalStorage());
        let zaehler = 0;
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
    async function splicerDate(index) {
        let array = await updateArray();
        let arrayIndex = await searchInArray(getItemFromLocalStorage());
        array[arrayIndex].dates.splice(index, 1);
        await postProduct(array[arrayIndex]);
        array = await updateArray();
        seiteAufbauen();
    }
    async function splicerNotiz(index) {
        let array = await updateArray();
        let arrayIndex = await searchInArray(getItemFromLocalStorage());
        array[arrayIndex].notice.splice(index, 1);
        await postProduct(array[arrayIndex]);
        array = await updateArray();
        seiteAufbauen();
    }
    async function postProduct(product) {
        await sendJSONStringWithPOST("http://127.0.0.1:3000/singleProduct", JSON.stringify({
            name: product.name,
            dates: product.dates,
            overallPieces: countAllPiecesProduct(product),
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
            else if (date1.getDay() < nowDate.getDay()) {
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
    seiteAufbauen();
    //////////////////////////////////////////////////////////Seite aufbauen////////////////////////////////////////////////////////////////
    async function seiteAufbauen() {
        let fetchedArray = await updateArray();
        console.log(fetchedArray);
        //Listen leeren, um Verdoppelungen zu vermeiden
        removeHTMLChildren(ablaufdaten);
        removeHTMLChildren(notizen);
        removeHTMLChildren(notizDiv);
        let arrayIndex = await searchInArray(getItemFromLocalStorage());
        let fetchedProduct = fetchedArray[arrayIndex];
        ueberschrift.innerHTML = fetchedProduct.name;
        fetchedArray[arrayIndex].overallPieces = countAllPiecesProduct(fetchedArray[arrayIndex]);
        p1.innerText = fetchedArray[arrayIndex].overallPieces.toString();
        p2.innerText = `Davon abgelaufene:  ${countAllBadPiecesProduct(true, fetchedArray[arrayIndex]).toString()}`;
        fetchedArray[arrayIndex].dates.sort((a, b) => {
            let aDate = new Date(a.dueDate);
            let bDate = new Date(b.dueDate);
            return bDate.getTime() - aDate.getTime();
        });
        let hilfszaehler = 0;
        //Daten anzeigen 
        for (let date of fetchedArray[arrayIndex].dates) {
            let liElement = document.createElement("li");
            let buttonElement = document.createElement("button");
            let ablaufDatum = new Date(date.dueDate);
            let anlegeDatum = new Date(date.arriveDate);
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
        let inputNotiz = document.createElement("input");
        let notizButton = document.createElement("button");
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
        for (let i = 0; i < fetchedArray[arrayIndex].notice.length; i++) {
            let liElement = document.createElement("li");
            let buttonElement = document.createElement("button");
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
})(Produktansicht || (Produktansicht = {}));
//# sourceMappingURL=produkt.js.map