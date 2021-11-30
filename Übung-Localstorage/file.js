"use strict";
var uebung;
(function (uebung) {
    const inputfeld = document.getElementById("inputs");
    const saveButton = document.getElementById("save");
    const loadButton = document.getElementById("load");
    const divi = document.getElementById("display");
    saveButton.addEventListener("click", saving);
    loadButton.addEventListener("click", loading);
    function saving() {
        console.log("saving...");
        console.log(inputfeld.value);
        localStorage.setItem("Input", inputfeld.value);
    }
    function loading() {
        console.log("loading...");
        let valuefromLocalStorage = localStorage.getItem("Input");
        divi.textContent = valuefromLocalStorage;
    }
})(uebung || (uebung = {}));
//# sourceMappingURL=file.js.map