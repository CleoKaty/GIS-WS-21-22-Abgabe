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
        response.setHeader("Access-Control-Allow-Origin", "*"); //erlaubt Zugriff
        let url = new URL(request.url || "", `http://${request.headers.host}`);
        switch (url.pathname) {
            case "/": //Default-Pfad
                response.write("Server erreichbar");
                console.log("Server erreichbar");
                break;
            case "/convertDate": //Datenpfad
                let name = url.searchParams.get("date");
                console.log(name);
                response.write("Hallo " + name + ", schoen dich zu sehen!");
                break;
            default:
                response.statusCode = 404; //Standartfehlermeldung
        }
        response.end();
    });
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`); //Wenn der Server erreichbar ist, soll folgendes ausgegeben werden.
    });
})(Server || (Server = {}));
//# sourceMappingURL=Server.js.map