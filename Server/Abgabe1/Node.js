"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S = void 0;
const http = require("http");
const Url = require("url");
var S;
(function (S) {
    console.log("Starting Server");
    //const hostname: string = "127.0.0.1"; //localhost
    let port = Number(process.env.PORT); //Port
    if (!port) {
        port = 3000; // wenn es keinen Port gibt soll Port 3000 sein
    }
    //Aufruf der Funktionen
    startServer(port);
    //Server erstellen
    function startServer(_port) {
        let server = http.createServer((request, response) => {
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/plain");
            response.setHeader("Access-Control-Allow-Origin", "*");
        });
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(_port);
    }
    function handleListen() {
        console.log(" I am listening");
    }
    async function handleRequest(_request, _response) {
        console.log("I hear voices!");
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url) {
            let q = Url.parse(_request.url, true);
            for (let key in q.query) {
                _response.write(key + ":" + q.query[key] + "<br/>");
            }
            let parameter = q.query;
            if (q.pathname == "/") {
                console.log("Server erreichbar");
                _response.write("Server erreichbar");
            }
            else if (q.pathname == "/convertDate") {
                console.log("hi");
                let input = {
                    datum: parameter.date
                };
                _response.write(input);
                //let date: string = url.searchParams.get("date");
                //console.log(date);
                //_response.write(date); //Wenn Server http://127.0.0.1:3000/greetings?date=21.08.2111 -> 21.08.2111 wird übergeben
            }
            else {
                _response.statusCode = 404; //STandartresponse, wenn der Pfad nicht gefunden wird
            }
        }
    }
})(S = exports.S || (exports.S = {}));
//# sourceMappingURL=Node.js.map