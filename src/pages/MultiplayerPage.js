import { Box, Typography, Modal, TextField, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BACKGROUND_COLOR,
  CELL_COLOR,
  BOARD_COLOR,
  ENEMY_BACKGROUND_COLOR,
  ENEMY_BOARD_COLOR,
  ENEMY_CELL_COLOR,
} from "../components/Constants";
import { blue } from "@mui/material/colors";
import { Board } from "../components/Board";
import { createBoard } from "../components/Game";

import { Stacker } from "../components/Stacker";
import "../styles/LoadingDots.css";
const socket = require("../connection/socket").socket;
const emptyBoard = createBoard();

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: blue[100],
  borderRadius: 8,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const MultiplayerPage = ({ gameId, userName }) => {
  const domainName = "http://localhost:3000";
  const [opponentSocketId, setOpponentSocketId] = React.useState("");
  const [opponentDidJoinTheGame, didJoinGame] = React.useState(false);
  const [opponentUserName, setUserName] = React.useState("");
  const [gameSessionDoesNotExist, doesntExist] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [myBoard, setMyBoard] = React.useState([]);
  const [myPiece, setMyPiece] = React.useState({});
  const [enemyBoard, setEnemyBoard] = React.useState([]);
  const [enemyPiece, setEnemyPiece] = React.useState({});

  React.useEffect(() => {
    if (myBoard && myPiece) {
      socket.emit("new move", {
        gameId,
        userName,
        myBoard,
        myPiece,
      });
    }
  }, [myBoard, myPiece]);

  React.useEffect(() => {
    socket.on("opponent move", (move) => {
      if (move.userName !== userName) {
        setEnemyBoard(move.myBoard);
        setEnemyPiece(move.myPiece);
      }
    });

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
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: BACKGROUND_COLOR,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}
    >
      <>
        {opponentDidJoinTheGame ? (
          <>
            <Box
              sx={{
                backgroundColor: ENEMY_BACKGROUND_COLOR,
                position: "absolute",
                minHeight: "100vh",
                width: "50%",
                right: 0,
                top: 0,
                opacity: 0.5,
                zIndex: 2,
              }}
            />
            {userName === "Player 1" ? (
              <Box sx={{ zIndex: 3, position: "absolute", display: "flex" }}>
                <Box sx={{ mr: 20 }}>
                  <Stacker
                    color={CELL_COLOR}
                    boardColor={BOARD_COLOR}
                    controllable={true}
                    multiplayer={true}
                    setMyBoard={setMyBoard}
                    setMyPiece={setMyPiece}
                    enemyBoard={enemyBoard}
                    enemyPiece={enemyPiece}
                  />
                </Box>
                <Box>
                  <Stacker
                    color={ENEMY_CELL_COLOR}
                    boardColor={ENEMY_BOARD_COLOR}
                    controllable={false}
                    multiplayer={true}
                    setMyBoard={setMyBoard}
                    setMyPiece={setMyPiece}
                    enemyBoard={enemyBoard}
                    enemyPiece={enemyPiece}
                  />
                </Box>
              </Box>
            ) : userName === "Player 2" ? (
              <Box sx={{ zIndex: 3, position: "absolute", display: "flex" }}>
                <Box sx={{ mr: 20 }}>
                  <Stacker
                    color={CELL_COLOR}
                    boardColor={BOARD_COLOR}
                    controllable={false}
                    multiplayer={true}
                    setMyBoard={setMyBoard}
                    setMyPiece={setMyPiece}
                    enemyBoard={enemyBoard}
                    enemyPiece={enemyPiece}
                  />
                </Box>
                <Box>
                  <Stacker
                    color={ENEMY_CELL_COLOR}
                    boardColor={ENEMY_BOARD_COLOR}
                    controllable={true}
                    multiplayer={true}
                    setMyBoard={setMyBoard}
                    setMyPiece={setMyPiece}
                    enemyBoard={enemyBoard}
                    enemyPiece={enemyPiece}
                  />
                </Box>
              </Box>
            ) : (
              <Typography color="error">An error occured: Invalid Username</Typography>
            )}
          </>
        ) : gameSessionDoesNotExist ? (
          <>
            <Typography sx={{ color: "#fff" }}>The game session could not be found</Typography>
          </>
        ) : (
          <>
            <Modal
              disableEnforceFocus
              disableAutoFocus
              open={open}
              // onClose={handleClose}
            >
              <>
                <Typography
                  variant="h1"
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    top: "20%",
                    textAlign: "center",
                    left: "50%",
                    transform: "translate(-50%, -110%)",
                    textShadow:
                      "0 0 6px rgba(202,228,225,0.98),0 0 30px rgba(202,228,225,0.42),0 0 12px rgba(30,132,242,0.58),0 0 22px rgba(30,132,242,0.84),0 0 38px rgba(30,132,242,0.88),0 0 60px rgba(30,132,242,1)",
                  }}
                >
                  Stacker
                </Typography>
                <Box sx={style}>
                  <Typography>Copy and paste this URL to your friend:</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    name="text"
                    id="text"
                    value={`${domainName}/${gameId}`}
                    onChange={() => {}}
                    sx={{ my: 2, backgroundColor: "#fff", borderRadius: 1 }}
                  />
                  <Typography>
                    Waiting for
                    <Typography color="error" component="span">
                      {" "}
                      Player 2{" "}
                    </Typography>
                    to join the game
                    <span className="one">.</span>
                    <span className="two">.</span>
                    <span className="three">.</span>
                  </Typography>
                </Box>
              </>
            </Modal>
            <Box
              sx={{
                backgroundColor: ENEMY_BACKGROUND_COLOR,
                position: "absolute",
                minHeight: "100vh",
                width: "50%",
                right: 0,
                top: 0,
                opacity: 0.5,
                zIndex: 2,
              }}
            />

            <Box sx={{ pb: 8, zIndex: 3, position: "absolute", display: "flex" }}>
              <Box sx={{ mr: 20 }}>
                <Board color={CELL_COLOR} boardColor={BOARD_COLOR} board={emptyBoard} />
              </Box>
              <Box>
                <Board color={ENEMY_CELL_COLOR} boardColor={ENEMY_BOARD_COLOR} board={emptyBoard} />
              </Box>
            </Box>
          </>
        )}
      </>
    </Box>
  );
};

export default MultiplayerPage;
