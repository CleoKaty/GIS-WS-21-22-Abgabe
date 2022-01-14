"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const mongo = require("mongodb"); //arbeiten mit Mongodb als speicher
const hostName = "127.0.0.1"; // für local host
const port = 3000;
const mongoUrl = "mongodb://127.0.0.1:27017"; //damit mongoDb lokal genutzt werden kann
let mongoCLient = new mongo.MongoClient(mongoUrl); //neuen CLient mit url
//Server
const server = http.createServer(async (request, response) => {
    response.statusCode = 200; //Ohne Fehler
    response.setHeader("Access-Control-Allow-Origin", "*"); //Erlaubt Zugriff 
    let url = new URL(request.url || "", `http://${request.headers.host}`);
    switch (url.pathname) { //pfade
        case "/allProducts": { //Client.ts fetch Befehl annehmen mit "post"
            await mongoCLient.connect();
            switch (request.method) {
                case "GET":
                    await findenMongoDB("frankeja", "products", {}, //ganzes Array await dbFind("frankja", "products", {}, response)
                    response);
                    break;
                case "POST":
                    let jsonString = "";
                    request.on("data", data => {
                        jsonString += data;
                    });
                    await mongoCLient.db("frankeja").collection("products").drop(); //vorherige Liste löschen
                    request.on("end", async () => {
                        mongoCLient
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
                    await findenMongoDB("frankeja", "products", { name: url.searchParams.get("name") }, response);
                    break;
            }
            break;
        }
        default:
            response.statusCode = 404; //typischer FehlerstatusCode
    }
    response.end();
});
async function findenMongoDB(db, collection, requestObject, response) {
    let result = await mongoCLient
        .db(db)
        .collection(collection)
        .find(requestObject)
        .toArray();
    console.log(result, requestObject);
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}
server.listen(port, hostName, () => { console.log(`Server running at http://${hostName}:${port}/`); });
/* cd C:\Program Files\MongoDB\Server\5.0\bin
   mongod
   *New cmd*
   cd C:\Program Files\MongoDB\Server\5.0\bin
   mongo
   show dbs *frankeja*
   use frankeja
   db.products.insertOne({name: "Paprika", dates: "", overallpieces: 0, notice: ""})
*/
/*
await mongoClient.db("frankeja").collection("products").drop();
*/ 
//# sourceMappingURL=Node.js.map