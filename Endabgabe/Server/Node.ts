import * as http from "http";
import * as mongo from "mongodb";  //arbeiten mit Mongodb als speicher

///////////////////////////////////////////////////////////////SERVER/////////////////////////////////////////////////////////////////////

const hostName: string = "127.0.0.1"; // für local host
const port: number = 3000;
const mongoUrl: string = "mongodb://127.0.0.1:27017"; //damit mongoDb lokal genutzt werden kann
let mongoCLient: mongo.MongoClient = new mongo.MongoClient(mongoUrl); //neuen CLient mit url

//Server
const server: http.Server = http.createServer(
    async (request: http.IncomingMessage, response: http.ServerResponse) => {
        response.statusCode = 200; //Ohne Fehler
        response.setHeader("Content-Type", "text/plain");
        response.setHeader("Access-Control-Allow-Origin", "*"); //Erlaubt Zugriff 

        let url: URL = new URL(request.url || "", `http://${request.headers.host}`);
        switch (url.pathname) {  //pfade
            case "/allProducts": {    //Client.ts fetch Befehl annehmen mit "post"
                await mongoCLient.connect();
                switch (request.method) {
                    case "GET":
                        if (mongoCLient.db("kuelibert").collection("products")) {
                            console.log("collection da");
                        } else {
                            await mongoCLient.db("kuelibert").createCollection("products");
                        }
                        await findenMongoDB(
                            "kuelibert",
                            "products",
                            {},                         //ganzes Array await dbFind("frankja", "products", {}, response)
                            response
                        );
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
                        await findenMongoDB(
                            "kuelibert",
                            "products",
                            { _id: new mongo.ObjectId(url.searchParams.get("_id"))},
                            response
                        );
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
    }
);

//////////////////////////////////////////////////////hilfreiche Funktionen////////////////////////////////////////////////////////////////
async function findenMongoDB(
    db: string,
    collection: string,
    requestObject: any,
    response: http.ServerResponse
): Promise<void> {
    await mongoCLient.connect();
    let result: any = await mongoCLient
        .db(db)
        .collection(collection)
        .find(requestObject)
        .toArray();
    //console.log(result, requestObject);
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}

async function dbHinzufuegen(request: http.IncomingMessage): Promise<void> {
    let jsonStringGet: string = "";
    request.on("data", data => { jsonStringGet += data; });
    request.on("end", async () => {
        await mongoCLient.connect();
        // console.log(jsonString); // bei Fehlern zum Testen
        let product = JSON.parse(jsonStringGet);
        if (product._id && product._id != "") {
            product._id = new mongo.ObjectId(product._id);
            mongoCLient.db("kuelibert").collection("products").replaceOne(
                {
                    _id: product._id
                },
                product
            );
        } else {
            product._id = undefined;
            mongoCLient.db("kuelibert").collection("products").insertOne(product);
        }
    });
}
async function dbLoeschen(request: http.IncomingMessage): Promise<void> {
    console.log("loschen");
    let jsonStringGet: string = "";
    request.on("data", data => { jsonStringGet += data; });
    request.on("end", async () => {
        await mongoCLient.connect();
        let product = JSON.parse(jsonStringGet);
        if (product._id && product._id != "") {
            product._id = new mongo.ObjectId(product._id);
            mongoCLient.db("kuelibert").collection("products").deleteOne({name: product.name});
        } else {
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