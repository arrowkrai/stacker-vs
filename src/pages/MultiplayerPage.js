import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Stacker } from "../components/Stacker";
const socket = require("../connection/socket").socket;

const MultiplayerPage = ({ gameId, userName }) => {
  const domainName = "http://localhost:3000";
  const [opponentSocketId, setOpponentSocketId] = React.useState("");
  const [opponentDidJoinTheGame, didJoinGame] = React.useState(false);
  const [opponentUserName, setUserName] = React.useState("");
  const [gameSessionDoesNotExist, doesntExist] = React.useState(false);

  React.useEffect(() => {
    socket.on("playerJoinedRoom", (statusUpdate) => {
      console.log(
        "A new player has joined the room! Username: " +
          statusUpdate.userName +
          ", Game id: " +
          statusUpdate.gameId +
          " Socket id: " +
          statusUpdate.mySocketId
      );
      if (socket.id !== statusUpdate.mySocketId) {
        setOpponentSocketId(statusUpdate.mySocketId);
      }
    });

    socket.on("status", (statusUpdate) => {
      console.log(statusUpdate);
      alert(statusUpdate);
      if (
        statusUpdate === "This game session does not exist." ||
        statusUpdate === "There are already 2 people playing in this room."
      ) {
        doesntExist(true);
      }
    });

    socket.on("start game", (opponentUserName) => {
      console.log("START!");
      if (opponentUserName !== userName) {
        setUserName(opponentUserName);
        didJoinGame(true);
      } else {
        socket.emit("request username", gameId);
      }
    });

    socket.on("give userName", (socketId) => {
      if (socket.id !== socketId) {
        console.log("give userName stage: " + userName);
        socket.emit("recieved userName", { userName: userName, gameId: gameId });
      }
    });

    socket.on("get Opponent UserName", (data) => {
      if (socket.id !== data.socketId) {
        setUserName(data.userName);
        console.log("data.socketId: data.socketId");
        setOpponentSocketId(data.socketId);
        didJoinGame(true);
      }
    });
  }, []);

  return (
    <>
      {opponentDidJoinTheGame ? (
        <Box>
          <Stacker />
        </Box>
      ) : gameSessionDoesNotExist ? (
        <>
          <Typography>The game session could not be found</Typography>
        </>
      ) : (
        <Box>
          <Typography>Copy and paste this URL to your friend:</Typography>
          <input type="text" name="text" id="text" value={`${domainName}/${gameId}`} onChange={() => {}} />
          <Typography>Waiting for Player 2 to join the game.</Typography>
        </Box>
      )}
    </>
  );
};

export default MultiplayerPage;
