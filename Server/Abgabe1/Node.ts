import * as http from "http";
import * as Url from "url";
import { ParsedUrlQuery } from "querystring";

export namespace S {
    interface Date {
        datum: string;
    }
    console.log("Starting Server");
    //const hostname: string = "127.0.0.1"; //localhost
    let port: number = Number(process.env.PORT); //Port
    if (!port) {
        port = 3000; // wenn es keinen Port gibt soll Port 3000 sein
    }
 //Aufruf der Funktionen
    startServer(port);
        
    //Server erstellen
    function startServer(_port: number | string): void {
        let server: http.Server = http.createServer(
            (request: http.IncomingMessage, response: http.ServerResponse) => {
    
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/plain");
                response.setHeader("Access-Control-Allow-Origin", "*");  
            });
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen); 
        server.listen(_port); 
    }
    function handleListen(): void {
        console.log(" I am listening"); 
    }
    async function handleRequest(_request: http.IncomingMessage, _response: http.ServerResponse): Promise<void> {
        console.log("I hear voices!"); 
        _response.setHeader("content-type", "text/html; charset=utf-8"); 
        _response.setHeader("Access-Control-Allow-Origin", "*"); 

        if (_request.url) {
            let q: Url.UrlWithParsedQuery = Url.parse(_request.url, true);    
            for (let key in q.query) {
                _response.write (key + ":" + q.query[key] + "<br/>");   
            }
            let parameter: ParsedUrlQuery = q.query;

            if (q.pathname == "/") {
                console.log("Server erreichbar");
                _response.write("Server erreichbar"); 
            }
            else if (q.pathname == "/convertDate") {
                console.log("hi");
                let input: Date = {
                    datum: parameter.date as string
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
}