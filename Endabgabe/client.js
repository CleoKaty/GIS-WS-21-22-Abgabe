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
    //Formelemente abgreifen
    let form1 = document.getElementById("form1");
    let form2 = document.getElementById("form2");
    //Elemente aus HTML abgreifen
    let input1 = document.getElementById("ablaufen");
    let input2 = document.getElementById("mengenangabe");
    let input3 = document.getElementById("names");
    let warntext1 = document.getElementById("info1");
    let warntext2 = document.getElementById("info2");
    let warntext3 = document.getElementById("info3");
    form2.addEventListener("submit", submitProduct);
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
            await fetch("http://localhost:3000/neuesProdukt", {
                method: "post",
                body: JSON.stringify(neuesProdukt)
            });
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
})(Client || (Client = {}));
//# sourceMappingURL=client.js.map