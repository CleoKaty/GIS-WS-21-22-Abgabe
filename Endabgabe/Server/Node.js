"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const mongo = require("mongodb"); //arbeiten mit Mongodb als speicher
///////////////////////////////////////////////////////////////SERVER/////////////////////////////////////////////////////////////////////
const hostName = "127.0.0.1"; // für local host
const port = 3000;
const mongoUrl = "mongodb://127.0.0.1:27017"; //damit mongoDb lokal genutzt werden kann
let mongoCLient = new mongo.MongoClient(mongoUrl); //neuen CLient mit url
//Server
const server = http.createServer(async (request, response) => {
    response.statusCode = 200; //Ohne Fehler
    response.setHeader("Content-Type", "text/plain");
    response.setHeader("Access-Control-Allow-Origin", "*"); //Erlaubt Zugriff 
    let url = new URL(request.url || "", `http://${request.headers.host}`);
    switch (url.pathname) { //pfade
        case "/allProducts": { //Client.ts fetch Befehl annehmen mit "post"
            await mongoCLient.connect();
            switch (request.method) {
                case "GET":
                    if (mongoCLient.db("kuelibert").collection("products")) {
                        console.log("collection da");
                    }
                    else {
                        await mongoCLient.db("kuelibert").createCollection("products");
                    }
                    await findenMongoDB("kuelibert", "products", {}, //ganzes Array await dbFind("frankja", "products", {}, response)
                    response);
                    console.log("gefunden");
                    break;
                case "POST":
                    await dbLoeschen(request);
                    break;
            }
            break;
        }
        case "/singleProduct": {
            await mongoCLient.connect();
            switch (request.method) {
                case "GET":
                    await findenMongoDB("kuelibert", "products", { _id: new mongo.ObjectId(url.searchParams.get("_id")) }, response);
                    break;
                case "POST":
                    console.log("post");
                    await dbHinzufuegen(request);
                    break;
            }
            break;
        }
        default:
            response.statusCode = 404; //typischer FehlerstatusCode
    }
    response.end();
});
//////////////////////////////////////////////////////hilfreiche Funktionen////////////////////////////////////////////////////////////////
async function findenMongoDB(db, collection, requestObject, response) {
    await mongoCLient.connect();
    let result = await mongoCLient
        .db(db)
        .collection(collection)
        .find(requestObject)
        .toArray();
    //console.log(result, requestObject);
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}
async function dbHinzufuegen(request) {
    let jsonStringGet = "";
    request.on("data", data => { jsonStringGet += data; });
    request.on("end", async () => {
        await mongoCLient.connect();
        // console.log(jsonString); // bei Fehlern zum Testen
        let product = JSON.parse(jsonStringGet);
        if (product._id && product._id != "") {
            product._id = new mongo.ObjectId(product._id);
            mongoCLient.db("kuelibert").collection("products").replaceOne({
                _id: product._id
            }, product);
        }
        else {
            product._id = undefined;
            mongoCLient.db("kuelibert").collection("products").insertOne(product);
        }
    });
}
async function dbLoeschen(request) {
    console.log("loschen");
    let jsonStringGet = "";
    request.on("data", data => { jsonStringGet += data; });
    request.on("end", async () => {
        await mongoCLient.connect();
        let product = JSON.parse(jsonStringGet);
        if (product._id && product._id != "") {
            product._id = new mongo.ObjectId(product._id);
            mongoCLient.db("kuelibert").collection("products").deleteOne({ name: product.name });
        }
        else {
            product._id = undefined;
            mongoCLient.db("kuelibert").collection("products").insertOne(product);
        }
    });
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