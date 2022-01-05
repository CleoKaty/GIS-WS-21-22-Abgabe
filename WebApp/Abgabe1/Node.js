"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const mongo = require("mongodb");
const hostname = "127.0.0.1"; // localhost
const port = 3000;
const mongoUrl = "mongodb://localhost:27017"; // für lokale MongoDB
let mongoClient = new mongo.MongoClient(mongoUrl);
async function dbFind(db, collection, requestObject, response) {
    let result = await mongoClient
        .db(db)
        .collection(collection)
        .find(requestObject)
        .toArray();
    // console.log(result, requestObject); // bei Fehlern zum Testen
    response.setHeader("Content-Type", "application/json");
    response.write(JSON.stringify(result));
}
//Funktion zum Hinzufügen
async function dbAddOrEdit(db, collection, request) {
    let jsonString = "";
    request.on("data", data => {
        jsonString += data;
    });
    request.on("end", async () => {
        await mongoClient.connect();
        // console.log(jsonString); // bei Fehlern zum Testen
        let neuConcert = JSON.parse(jsonString);
        if (neuConcert._id && neuConcert._id !== "") {
            neuConcert._id = new mongo.ObjectId(neuConcert._id);
            mongoClient.db(db).collection(collection).replaceOne({
                _id: neuConcert._id
            }, neuConcert);
        }
        else {
            neuConcert._id = undefined;
            mongoClient.db(db).collection(collection).insertOne(neuConcert);
        }
    });
}
const server = http.createServer(async (request, response) => {
    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*"); // bei CORS Fehler, erlaubt Zugrif
    let url = new URL(request.url || "", `http://${request.headers.host}`);
    switch (url.pathname) {
        case "/concerts": {
            switch (request.method) {
                case "GET":
                    await dbFind("event", "concert", {}, response);
                    break;
            }
        }
        case "/concertEvents": {
            await mongoClient.connect();
            switch (request.method) {
                case "GET":
                    await dbFind("event", "concert", {
                        concert: url.searchParams.get("concert")
                    }, response);
                    break;
                case "POST":
                    await dbAddOrEdit("event", "concert", request);
                    break;
            }
            break;
        }
        default:
            response.statusCode = 404;
    }
    response.end();
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
//# sourceMappingURL=Node.js.map