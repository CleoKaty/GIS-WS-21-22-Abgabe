namespace Client {
    console.log("Client läuft"); //Testausgabe

    const url: string = "http://127.0.0.1:3000"; //URL
    const path: string = "/convertDate";

    const sendButton: HTMLButtonElement = document.getElementById("sendbutton")as HTMLButtonElement;
    const myForm: HTMLFormElement = document.getElementById("myForm") as HTMLFormElement;
    const date: HTMLInputElement = document.getElementById("dateinput") as HTMLInputElement;
    const div: HTMLDivElement = document.getElementById("kasten") as HTMLDivElement;

    
    sendButton.addEventListener("click", function (evt: Event) {
        evt.preventDefault();
        sendForm();
    });

    console.log(myForm, sendButton);

    async function sendForm(): Promise<void> {

        //Vorbereiten der Formulardaten zum Sende-Prozess
        let formData: FormData = new FormData(myForm);
        let query: URLSearchParams = new URLSearchParams(<any>formData); 
        let urlWithQuery: string = url + path + "?" + query.toString(); //Url schreiben
        

        let response: Response = await fetch(urlWithQuery); 
        let responseText: string = await response.text(); 
        console.log(responseText);

        let responsetext: HTMLElement = document.createElement("p");
        div.appendChild(responsetext);
        responsetext.innerHTML = responseText;
    }
}