import * as http from "http";
import * as mongo from "mongodb";  //arbeiten mit Mongodb als speicher

const hostName: string = "127.0.0.1"; // für local host
const port: number = 3000;            
const mongoUrl: string = "mongodb://localhost:27017"; //damit mongoDb lokal genutzt werden kann
let mongoCLient: mongo.MongoClient = new mongo.MongoClient(mongoUrl); //neuen CLient mit url

//Server
const server: http.Server = http.createServer(
    async (request: http.IncomingMessage, response: http.ServerResponse) => {
        response.statusCode = 200; //Ohne Fehler
        response.setHeader("Access-Control-Allow-Origin", "*"); //Erlaubt Zugriff 
        let url: URL = new URL(request.url || "", `http://${request.headers.host}`);
        switch (url.pathname) {  //pfade
            case "/allProducts": {    //Client.ts fetch Befehl annehmen mit "post"
                await mongoCLient.connect();
                switch (request.method) {
                    case "GET":
                        await findenMongoDB(
                            "frankeja",
                            "products",
                            {},               //ganzes Array? await dbFind("frankja", "products", {}, response)
                            response
                        );
                        break;
                    case "POST":
                        let jsonString: string = "";
                        request.on("data", data => {
                            jsonString += data;
                        });
                        request.on("end", async () => {
                            mongoCLient                          //zuvor evtl einträge löschen von products ?db.products.remove({}, callback)
                            .db("frankeja")     
                            .collection("products")
                            .insertMany(JSON.parse(jsonString)); //ganze Liste posten
                        });
                        break;
                }
                break;
            }
            case "/singleProduct": {
                await mongoCLient.connect();
                switch (request.method) {
                    case "GET":
                        await findenMongoDB(
                            "frankeja",
                            "products",
                            { name: url.searchParams.get("name")},
                            response
                        );
                        break;
                }
                break;
            }
            default:
                response.statusCode = 404; //typischer FehlerstatusCode
        }
        response.end(); 
    }
);

async function findenMongoDB(
    db: string,
    collection: string,
    requestObject: any,
    response: http.ServerResponse
  ): Promise<void> {
    let result: any = await mongoCLient
      .db(db)
      .collection(collection)
      .find(requestObject)
      .toArray();
    console.log(result, requestObject); 
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}

server.listen(port, hostName, () => {console.log(`Server running at http://${hostName}:${port}/`); });

/* cd C:\Program Files\MongoDB\Server\5.0\bin
   mongod
   *New cmd*
   cd C:\Program Files\MongoDB\Server\5.0\bin
   mongo
   show dbs *frankeja*
   use frankeja
   db.products.insertOne({name: "Paprika", dates: "", overallpieces: 0, notice: ""})
*/