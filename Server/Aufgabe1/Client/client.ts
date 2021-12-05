namespace Client {
    console.log("client läuft");
    const url: string = "http://127.0.0.1:3000";

    const myForm: HTMLFormElement = document.getElementById("myForm") as HTMLFormElement;
    const Sendbutton: HTMLButtonElement = document.getElementById("sendbutton") as HTMLButtonElement;

    Sendbutton.addEventListener("click", function(evt: Event) {
        evt.preventDefault();
        sendForm();
    });

    async function sendForm(): Promise<void> { //Muss async haben, wegen await befehl
        let formData: FormData = new FormData(myForm);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        let urlwithQuery: string = url + "?" + query.toString();

        let response: Response = await fetch(urlwithQuery);
        let responseText: string = await response.text();
        console.log(responseText);
    }
    
}