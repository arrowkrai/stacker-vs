import { io } from "socket.io-client";

const URL = "https://stacker-vs.herokuapp.com";
const socket = io(URL);

var mySocketId;

socket.on("createNewGame", (statusUpdate) => {
  console.log(
    "New game created! Username: " +
      statusUpdate.userName +
      ", Game id: " +
      statusUpdate.gameId +
      " Socket id: " +
      statusUpdate.mySocketId
  );
  mySocketId = statusUpdate.mySocketId;
});

export { socket, mySocketId };
