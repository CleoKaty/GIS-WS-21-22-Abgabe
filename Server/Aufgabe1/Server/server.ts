import * as http from "http";

namespace Server {
    const hostname: string = "127.0.0.1"; //localhost
    const port: number = 3000; //Port

    const server: http.Server = http.createServer(
        (request: http.IncomingMessage, response: http.ServerResponse) => {

            response.statusCode = 200;
            response.setHeader("Content-Type", "text/plain");
            response.setHeader("Access-Control-Allow-Origin", "*"); //Erlaubt Zugriff

            //Routing -> Pfade definieren
            let url: URL = new URL(request.url || "", `http://${request.headers.host}`); //Url element

            switch (url.pathname) { //Pfad wird gesucht
            
            case "/":                              //Startpunkt des Servers, Mutepfad
                response.write("Server erreichbar");
                break;
            case "/convertDate":
                let name: string = url.searchParams.get("name");
                console.log(name);
                response.write("Hallo mein Freund" + name + ", du."); //Wenn Server http://127.0.0.1:3000/greetings?name=Philipp -> Philipp wird übergeben
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
}
// in Terminal: node .Server/Aufgabe1/server.js