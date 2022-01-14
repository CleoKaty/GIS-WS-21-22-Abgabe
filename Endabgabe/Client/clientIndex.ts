
namespace ClientIndex{

    ClientNeueProdukte
    
    async function productListeAnzeigen(): Promise<void> {
        let table: HTMLTableElement = document.getElementById("produktTabelle") as HTMLTableElement;
        //Liste erneut updaten für Sicherheit
        await updateArray();
        //Liste abfragen
        for (let product of allProducts) {
            //Elemente anlegen
            let tr: HTMLElement = document.createElement("tr");
            let tdName: HTMLElement = document.createElement("td");
            let tdMenge: HTMLElement = document.createElement("td");
            let tdAblauf: HTMLElement = document.createElement("td");
            let tdDetail: HTMLElement = document.createElement("td");
            let detailButton: HTMLButtonElement = document.createElement("button");
            
            //Inhalt füllen
            tdName.innerHTML = product.name;
            tdMenge.innerHTML = product.overallPieces.toString();
            tdAblauf.innerHTML = getNextAblauf(product).toString();
            detailButton.innerHTML = "Details";
            tdDetail.appendChild(detailButton);

            //append Inhalt
            tr.appendChild(tdName);
            tr.appendChild(tdMenge);
            tr.appendChild(tdAblauf);
            tr.appendChild(tdDetail);
            table.appendChild(tr);


        }





    }

    //Funktion für Detailbutton
}