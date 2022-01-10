namespace Client {
    //heutiges Datum
    let nowDate: Date = new Date();
    //Product anlegen
    class Product {
        name: string = "";
        dates: Dates[] = [];
        overallPieces: number = 0;
        notice: string[] = [];

        constructor(name: string, dates: Dates[], overallPieces: number, notice: string[]) {
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
    interface Dates {
        arriveDate: Date;
        pieces: number;
        dueDate: Date;
    }
    //Alle Produkte zum Überblick
    let allProducts: Product[] = [];

    //Formelemente abgreifen
    let form1: HTMLFormElement = <HTMLFormElement>document.getElementById("form1") as HTMLFormElement;
    let form2: HTMLFormElement = <HTMLFormElement>document.getElementById("form2") as HTMLFormElement;
    //Elemente aus HTML abgreifen
    let input1: HTMLInputElement = <HTMLInputElement>document.getElementById("ablaufen") as HTMLInputElement;
    let input2: HTMLInputElement = <HTMLInputElement>document.getElementById("mengenangabe") as HTMLInputElement;
    let input3: HTMLInputElement = <HTMLInputElement>document.getElementById("names") as HTMLInputElement;
    let warntext1: HTMLElement = document.getElementById("info1") as HTMLElement;
    let warntext2: HTMLElement = document.getElementById("info2") as HTMLElement;
    let warntext3: HTMLElement = document.getElementById("info3") as HTMLElement;

    form2.addEventListener("submit", submitProduct);

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
            //Daten für neues Produkt definieren
            let dueDateString: string = formDaten2.get("ablaufen") as string;
            let neuDate: Dates = {
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

            await fetch("http://localhost:3000/neuesProdukt", {
                method: "post",
                body: JSON.stringify(neuesProdukt)
            });
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
}