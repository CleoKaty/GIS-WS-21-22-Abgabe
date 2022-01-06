import * as http from "http";
import * as mongo from "mongodb";

const hostname: string = "127.0.0.1"; // localhost
const port: number = 3000;
const mongoUrl: string = "mongodb://localhost:27017"; // für lokale MongoDB
let mongoClient: mongo.MongoClient = new mongo.MongoClient(mongoUrl);

async function dbFind(
  db: string,
  collection: string,
  requestObject: any,
  response: http.ServerResponse
): Promise<void> {
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
async function dbAddOrEdit(
  db: string,
  collection: string,
  request: http.IncomingMessage
): Promise<void>  {
  let jsonString: string = "";
  request.on("data", data => {
    jsonString += data;
  });
  request.on("end", async () => {
    await mongoClient.connect();
    // console.log(jsonString); // bei Fehlern zum Testen
    let neuConcert = JSON.parse(jsonString);
    if (neuConcert._id && neuConcert._id !== "") {
      neuConcert._id = new mongo.ObjectId(neuConcert._id);
      mongoClient.db(db).collection(collection).replaceOne(
        {
          _id: neuConcert._id
        },
        neuConcert
      );
    } else {
      neuConcert._id = undefined;
      mongoClient.db(db).collection(collection).insertOne(neuConcert);
    }
  });
}

const server: http.Server = http.createServer(
  async (request: http.IncomingMessage, response: http.ServerResponse) => {
    response.statusCode = 200;
    response.setHeader("Access-Control-Allow-Origin", "*"); // bei CORS Fehler, erlaubt Zugrif
    let url: URL = new URL(request.url || "", `http://${request.headers.host}`);
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
            await dbFind(
              "event",
              "concert",
              {
                concert: url.searchParams.get("concert")
              },
              response
            );
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
  }
);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});