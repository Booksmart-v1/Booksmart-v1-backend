require("dotenv").config();
const cors = require("cors");
// const expressFileUpload = require("express-fileupload");
// socket configuration
http = require("http");
const { Server } = require("socket.io"); // Add this

const WebSockets = require("./utils/WebSocket");
const httpsLocalhost = require("https-localhost")();
const certs = httpsLocalhost.getCerts();
let express = require("./configs/express");
const app = express();
const server = http.createServer(app); // Add this

// const server = require("http").Server(certs, app);
require("./app/modules/Portal/socket/socket")(server);
global.io = require("socket.io")(server);
global.io.on("connection", WebSockets.connection);

app.use(cors());

const mongoose = require("mongoose");
const config = require("./configs/configs");
// const socketio = require("socket.io");
const multer = require("multer");

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

app.get("/", function (req, res, next) {
  res.send("Welcome to Booksmart !");
});
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with socket ID: ${socket.id}, joined room: ${data}`);
  });
  socket.on("send_message", (data) => {
    data = JSON.parse(data);
    console.log(data);
    socket.to(data["chatRoomId"]).emit("get_message", data);
    console.log(data["chatRoomId"]);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
  // We can write our socket event listeners in here...
});
server.listen(config.serverPort, () => {
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  console.log(`Server running at http://localhost:${config.serverPort}`);
});
