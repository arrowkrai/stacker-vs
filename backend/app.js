const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const initializeGame = require("./game.js");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

const origin = "https://stacker-vs.herokuapp.com";

const corsOptions = {
  origin: origin,
  credentials: false,
  optionSuccessStatus: 200,
};

const server = express()
  .use(cors(corsOptions))
  .use(express.static(path.join(__dirname, "..", "frontend", "build")))
  .use((req, res) => res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html")))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server, {
  cors: {
    // origin: "*",
    origin: origin,
  },
});

io.on("connection", (socket) => {
  initializeGame(io, socket);
});
