import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeGame } from "./game.js";
const app = express();
const corsOptions = {
  // origin: "*",
  origin: "http://localhost:3000",
  credentials: false,
  optionSuccessStatus: 200,
};
app.use(express());
app.use(cors(corsOptions));
// app.use(cors());
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    // origin: "*",
    origin: "http://localhost:3000",
  },
});

io.on("connection", (client) => {
  initializeGame(io, client);
});

httpServer.listen(process.env.PORT || 8000);
