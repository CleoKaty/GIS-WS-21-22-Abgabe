let sendbutton: HTMLButtonElement = document.getElementById("sendbutton")as HTMLButtonElement;
let myForm: HTMLFormElement = document.getElementById("myForm") as HTMLFormElement;
let date: HTMLInputElement = document.getElementById("dateinput") as HTMLInputElement;
let div: HTMLDivElement = document.getElementById("kasten") as HTMLDivElement;

//let formData: FormData = new FormData(document.forms[0]);
let formData: FormData = new FormData(myForm);
sendbutton.addEventListener("click", sendForm);

async function sendForm(_event: Event): Promise<void> {
    let formData: FormData = new FormData(myForm);
    let url: string = "http://127.0.0.1:3000/convertDate";
    let query: URLSearchParams = new URLSearchParams(<URLSearchParams>formData);
    url = url + "?" + query.toString();
    let response: Response = await fetch(url);
    let text: string = await response.text();
    console.log("Answer:");
    console.log(text);

    let responsetext: HTMLElement = document.createElement("p");
    document.getElementById("response").appendChild(responsetext);
    responsetext.innerHTML = text;
}