import * as http from "http";


namespace Server {
  const hostname: string = "127.0.0.1"; //localhost
  const port: number = 3000; //Port

  const server: http.Server = http.createServer(
    (request: http.IncomingMessage, response: http.ServerResponse) => {
      
      response.statusCode = 200; 

      response.setHeader("Content-Type", "text/plain"); 

      response.setHeader("Access-Control-Allow-Origin", "*"); //erlaubt Zugriff

      let url: URL = new URL(request.url || "", `http://${request.headers.host}`);
      switch (url.pathname) {
        case "/": //Default-Pfad
          response.write("Server erreichbar");
          console.log("Server erreichbar");
          break;
        case "/convertDate": //Datenpfad
          let clientdate: string = url.searchParams.get("date");
          console.log(clientdate);
          let rueckgabeString: string = "Tag: " + clientdate.substring(9, 11) + " Monat: " + clientdate.substring(6, 8) + " Jahr: " + clientdate.substring(1, 5); 
          response.end(rueckgabeString); 
          break;
        default:
          response.statusCode = 404; //Standartfehlermeldung
      }
      response.end(); 
    }
  );

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`); //Wenn der Server erreichbar ist, soll folgendes ausgegeben werden.
  });
}
