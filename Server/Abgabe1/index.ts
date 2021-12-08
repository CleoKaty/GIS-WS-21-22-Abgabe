namespace index {
    let button: HTMLButtonElement = document.getElementById("button") as HTMLButtonElement;
    button.addEventListener("click", send);
    
    async function send(): Promise<void> {
        let url: string = "http://127.0.0.1:3000";
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();
        console.log("Answer:");
        console.log(text);
    
        
    }
    }