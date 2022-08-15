require("dotenv").config();
let exp = require("express");
let express = require("./configs/express");
const mongoose = require("mongoose");
const config = require("./configs/configs");

mongoose
  .connect(
    "mongodb://user1:myyKK1HlvKedXxjN@booksmart-shard-00-00.zjufe.mongodb.net:27017,booksmart-shard-00-01.zjufe.mongodb.net:27017,booksmart-shard-00-02.zjufe.mongodb.net:27017/booksmart?replicaSet=atlas-g9eyff-shard-0&ssl=true&authSource=admin",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log(`Mongodb connected on port ${config.mongodb.port}`);
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

const httpsLocalhost = require("https-localhost")();
const certs = httpsLocalhost.getCerts();
const app = express();
const server = require("http").Server(certs, app);
require("./app/modules/Portal/socket/socket")(server);

app.get("/", function (req, res, next) {
  res.send("Welcome to Booksmart !");
});

server.listen(config.serverPort, () => {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  console.log(`Server running at http://localhost:${config.serverPort}`);
});
