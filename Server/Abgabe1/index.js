"use strict";
var index;
(function (index) {
    let button = document.getElementById("button");
    button.addEventListener("click", send);
    async function send() {
        let url = "http://127.0.0.1:3000";
        let query = new URLSearchParams(formData);
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        console.log("Answer:");
        console.log(text);
    }
})(index || (index = {}));
//# sourceMappingURL=index.js.map