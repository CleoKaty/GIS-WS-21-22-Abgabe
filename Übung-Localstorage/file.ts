namespace uebung {
    const inputfeld: HTMLInputElement = <HTMLInputElement> document.getElementById("inputs") as HTMLInputElement;
    const saveButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById("save");
    const loadButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById("load");
    const divi: HTMLDivElement = <HTMLDivElement> document.getElementById("display");

    saveButton.addEventListener("click", saving);
    loadButton.addEventListener("click", loading);

    function saving(): void {
        console.log("saving...");
        console.log(inputfeld.value);
        localStorage.setItem("Input", inputfeld.value);
    }

    function loading(): void {
        console.log("loading...");
        let valuefromLocalStorage: string = localStorage.getItem("Input");
        divi.textContent = valuefromLocalStorage;
    }
}