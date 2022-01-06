

namespace Client {
    const url: string = "http://127.0.0.1:3000"; //URL
    const path: string = "/concertEvents";

    interface Concert {
        _id?: string;
        interpret: string;
        preis: number;
        datum: string;
    }

    async function requestTextWithGET(url: RequestInfo): Promise<string> {
        let response: Response = await fetch(url);
        let text: string = await response.text();
        return text;
    }


    let interpret: HTMLInputElement = <HTMLInputElement>document.getElementById("interpret") as HTMLInputElement;
    let preis: HTMLInputElement = <HTMLInputElement>document.getElementById("preis") as HTMLInputElement;
    let datum: HTMLInputElement = <HTMLInputElement>document.getElementById("zeit") as HTMLInputElement;
    let button: HTMLElement = document.getElementById("enter");


    console.log(interpret);

    async function sendJSONStringWithPOST(
        url: RequestInfo,
        jsonString: string
    ): Promise<void> {
        await fetch(url, {
            method: "post",
            body: jsonString
        });
    }


    button.addEventListener("click", () => {
        if (interpret.value != "" && preis.value != "" && datum.value != "") {
            interpret.style.borderColor = "black";
            preis.style.borderColor = "black";
            datum.style.borderColor = "black";

            sendJSONStringWithPOST(
                "http://localhost:3000/concertEvents",
                JSON.stringify({
                    Interpret: interpret.value,
                    Preis: preis.value,
                    Datum: datum.value

                })
            );

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

    async function requestConcert(): Promise<Concert[]> {
        let response: Response = await fetch(
            `http://localhost:3000/concertEvents?concerts`
        );
        let text: string = await response.text();
        return JSON.parse(text) as Concert[];
    }

    async function displayConcerts(): Promise<void> {
        let concerts: Concert[] = await requestConcert();
        let tbody: HTMLTableElement = <HTMLTableElement> document.getElementById("table");
        removeChildren(tbody);
        for (let concert of concerts) {
            let tr: HTMLTableRowElement = document.createElement("tr");
            tr.dataset.id = concert._id;
            for (let info of [
                concert.interpret,
                concert.preis,
                concert.datum
            ]) {
                let td: HTMLElement = document.createElement("td");
                td.textContent = `${info}`;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    function removeChildren(element: HTMLElement): void {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }








}
