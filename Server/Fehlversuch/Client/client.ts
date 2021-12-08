import { text } from "stream/consumers";

namespace Client {
    console.log("client läuft");
    const url: string = "http://127.0.0.1:3000";

    const myForm: HTMLFormElement = document.getElementById("myForm") as HTMLFormElement;
    const sendbutton: HTMLButtonElement = document.getElementById("sendbutton") as HTMLButtonElement;
    const date: HTMLInputElement = document.getElementById("dateinput") as HTMLInputElement;
    const div: HTMLDivElement = document.getElementById("kasten") as HTMLDivElement;

    sendbutton.addEventListener("click", function(evt: Event) {
        evt.preventDefault();
        sendForm();
    });

    async function sendForm(): Promise<void> { //Muss async haben, wegen await befehl
        let formData: FormData = new FormData(myForm);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        let urlwithQuery: string = url + "?" + query.toString();

        let text: HTMLElement = document.createElement("p");
        text.textContent = date.toString();
        div.appendChild(text);
        
        let response: Response = await fetch(urlwithQuery);
        let responseText: string = await response.text();
        console.log(responseText);
    }

    
    
}