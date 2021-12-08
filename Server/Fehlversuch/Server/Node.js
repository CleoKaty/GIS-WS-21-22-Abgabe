"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
var Server;
(function (Server) {
    const hostname = "127.0.0.1"; //localhost
    const port = 3000; //Port
    const server = http.createServer((request, response) => {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/plain");
        response.setHeader("Access-Control-Allow-Origin", "*"); //Erlaubt Zugriff
        //Routing -> Pfade definieren
        let url = new URL(request.url || "", `http://${request.headers.host}`); //Url element
        switch (url.pathname) { //Pfad wird gesucht
            case "/": //Startpunkt des Servers, Mutepfad
                response.write("Server erreichbar");
                break;
            case "/convertDate":
                let date = url.searchParams.get("date");
                console.log(date);
                response.write(date); //Wenn Server http://127.0.0.1:3000/greetings?name=Philipp -> Philipp wird übergeben
                break;
            default:
                response.statusCode = 404; //STandartresponse, wenn der Pfad nicht gefunden wird
                break;
        }
        response.end(); //Response wird abgeschickt
    });
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`);
    });
})(Server || (Server = {}));
// in Terminal: node .Server/Aufgabe1/server.js
//# sourceMappingURL=Node.js.map