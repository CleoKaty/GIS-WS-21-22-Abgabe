namespace Client {
    //heutiges Datum
    let nowDate: Date = new Date();
    //Product anlegen
    class Product {
        name: string;
        dates: Dates[];
        overallPieces: number;
        //Mengenanzahl feststellen
        countAllPieces(): number {
            let count: number = 0;
            for (let i = 0; i < this.dates.length; i++) {
                count = this.dates[i].pieces + count;

            } return count;
        }
        //(nicht) Abgelaufene Produktmenge feststellen 
        countAllBadPieces(bad: boolean): number {
            let countBad: number = 0;
            let countGood: number = 0;

            //Daten vergleichen
            for (let i = 0; i < this.dates.length; i++) {
                if (this.dates[i].dueDate.getFullYear() <= nowDate.getFullYear()) {
                    countBad = this.dates[i].pieces + countBad;
                } else if (this.dates[i].dueDate.getMonth() <= nowDate.getMonth()) {
                    countBad = this.dates[i].pieces + countBad;
                } else if (this.dates[i].dueDate.getDay() <= nowDate.getDate()) {
                    countBad = this.dates[i].pieces + countBad;
                } else {
                    countGood = this.dates[i].pieces + countGood;
                }
            } if (bad == true) {
                return countBad;
            }else {
                if(this.countAllPieces() - countBad === countGood){
                    return countGood;
                }else{
                    //Überprüfen Daten
                    console.log("Error");
                }
            }
        }

    }
    interface Dates {
        arriveDate: Date;
        pieces: number;
        dueDate: Date;
    }

    let allProducts: Product = Product[];


    let form1: HTMLFormElement = <HTMLFormElement>document.getElementById("form1") as HTMLFormElement;
    let form2: HTMLInputElement = <HTMLInputElement>document.getElementById("form2") as HTMLInputElement;

    form1.addEventListener("submit", submitProduct);

    async function submitProduct(event: Event) {
        event.preventDefault();

    }


    button.addEventListener("click", () => {
        if (interpret.value != "" && preis.value != "" && datum.value != "") {
            interpret.style.borderColor = "black";
            preis.style.borderColor = "black";
            datum.style.borderColor = "black";
            let liste: HTMLElement = document.createElement("tr");
            let a: HTMLElement = document.createElement("td");
            let b: HTMLElement = document.createElement("td");
            let c: HTMLElement = document.createElement("td");
            let d: HTMLElement = document.createElement("td");
            let deletebutton: HTMLElement = document.createElement("button");
            deletebutton.innerText = "delete";
            document.getElementById("table").appendChild(liste);
            a.innerText = interpret.value;
            b.innerText = preis.value;
            c.innerText = datum.value;
            d.appendChild(deletebutton);
            liste.appendChild(a);
            liste.appendChild(b);
            liste.appendChild(c);
            liste.appendChild(d);
            deletebutton.addEventListener("click", deleter);

            function deleter(): void {
                document.getElementById("table").removeChild(liste);
            }
        }
        else {
            if (interpret.value == "") {
                interpret.style.borderColor = "red";
            }
            if (preis.value == "") {
                preis.style.borderColor = "red";
            }
            if (datum.value == "") {
                datum.style.borderColor = "red";
            }
        }

    });
}