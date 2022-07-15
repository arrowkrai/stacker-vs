import { Box, Typography, Modal, TextField, CircularProgress, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BACKGROUND_COLOR,
  CELL_COLOR,
  BOARD_COLOR,
  ENEMY_BACKGROUND_COLOR,
  ENEMY_BOARD_COLOR,
  ENEMY_CELL_COLOR,
  ROW_AMOUNT,
  TIMER_SECONDS,
} from "../components/Constants";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Board } from "../components/Board";
import { createBoard } from "../components/Game";
import { motion } from "framer-motion";
import { Stacker } from "../components/Stacker";
import "../styles/LoadingDots.css";
import { blue, green, red, purple, orange, amber, deepOrange, indigo, lightBlue, blueGrey } from "@mui/material/colors";
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

const theme = createTheme({
  palette: {
    primary: {
      main: green[800],
    },
    secondary: {
      main: red[900],
    },
    warning: {
      main: orange[800],
    },
  },
});

const MultiplayerPage = ({ gameId, userName }) => {
  const domainName = "http://localhost:3000";
  const [opponentSocketId, setOpponentSocketId] = useState("");
  const [opponentDidJoinTheGame, didJoinGame] = useState(false);
  const [opponentUserName, setUserName] = useState("");
  const [gameSessionDoesNotExist, doesntExist] = useState(false);
  const [open, setOpen] = useState(true);
  const [myBoard, setMyBoard] = useState([]);
  const [myPiece, setMyPiece] = useState({});
  const [myScore, setMyScore] = useState(0);
  const [myHighScore, setMyHighScore] = useState(0);
  const [myPause, setMyPause] = useState(false);
  const [myWin, setMyWin] = useState(false);
  const [myLose, setMyLose] = useState(false);
  const [enemyBoard, setEnemyBoard] = useState([]);
  const [enemyPiece, setEnemyPiece] = useState({});
  const [enemyScore, setEnemyScore] = useState(0);
  const [enemyHighScore, setEnemyHighScore] = useState(0);
  const [enemyPause, setEnemyPause] = useState(false);
  const [enemyWin, setEnemyWin] = useState(false);
  const [enemyLose, setEnemyLose] = useState(false);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [timeUp, setTimeUp] = useState(false);
  const [gameOver, setGameOver] = useState("");
  const [stopGames, setStopGames] = useState(false);
  const [key, setKey] = useState(1);

  useEffect(() => {
    if (timeUp) {
      setStopGames(true);

      setTimeout(() => {
        if (myHighScore > enemyHighScore) {
          setEnemyLose(true);
          setGameOver("WIN");
        } else if (myHighScore < enemyHighScore) {
          setEnemyWin(true);
          setGameOver("LOSE");
        } else {
          setEnemyWin(true);
          setEnemyLose(true);
          setGameOver("TIE");
        }
        // console.log("enemyWin", enemyWin);
        // console.log("enemyLose", enemyLose);
        // console.log("gameOver", gameOver);
      }, 1000);
    }
  }, [timeUp]);

  const textColor = gameOver === "LOSE" ? red[900] : gameOver === "WIN" ? green[800] : orange[800];
  const buttonType = gameOver === "LOSE" ? "secondary" : gameOver === "WIN" ? "primary" : "warning";

  const resetAll = (resetKey) => {
    setStopGames(false);
    setMyBoard([]);
    setMyPiece({});
    setMyScore(0);
    setMyHighScore(0);
    setMyPause(false);
    setMyWin(false);
    setMyLose(false);
    setEnemyBoard([]);
    setEnemyPiece({});
    setEnemyScore(0);
    setEnemyHighScore(0);
    setEnemyPause(false);
    setEnemyWin(false);
    setEnemyLose(false);
    setTimer(TIMER_SECONDS);
    setTimeUp(false);
    setGameOver("");
    didJoinGame(true);
    setKey(resetKey);
    // console.log("resetAll");
  };

  const resetState = (e) => {
    e.preventDefault();
    socket.emit("new move", {
      gameId,
      key: key + 1,
    });
    // console.log("resetState");
    resetAll(key + 1);
  };

  useEffect(() => {
    let interval;
    if (opponentDidJoinTheGame) {
      interval = window.setInterval(() => {
        if (timer > 0) setTimer(timer - 1);
      }, 1000);
    }
    if (timer === 0) {
      setTimeout(() => {
        setTimeUp(true);
      }, 1000);
    }
    return () => {
      window.clearInterval(interval);
    };
  }, [opponentDidJoinTheGame, timer]);

  useEffect(() => {
    if (myBoard && myPiece) {
      socket.emit("new move", {
        gameId,
        userName,
        myBoard,
        myPiece,
        myScore,
        myHighScore,
        myPause,
        myWin,
        myLose,
      });
    }
  }, [myBoard, myPiece, myPause, myScore, myWin, myLose]);

  useEffect(() => {
    socket.on("opponent move", (move) => {
      if (move.key) {
        if (key !== move.key) {
          // setKey(move.key)
          resetAll(move.key);
          // console.log("opponent move key");
        }
      } else if (move.myBoard.length > 0 && move.userName !== userName) {
        setEnemyBoard(move.myBoard);
        setEnemyPiece(move.myPiece);
        setEnemyScore(move.myScore);
        setEnemyHighScore(move.myHighScore);
        setEnemyPause(move.myPause);
        setEnemyWin(move.myWin);
        setEnemyLose(move.myLose);
        // console.log("opponent move else");
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
      key={key}
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
        {console.log("key", key)}
        {opponentDidJoinTheGame ? (
          <>
            <React.Fragment>
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
                <>
                  {gameOver && (
                    <>
                      <Box
                        component={motion.div}
                        animate={{
                          opacity: [0, 1],
                        }}
                        style={{
                          opacity: 0,
                          position: "absolute",
                          top: "20%",
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          zIndex: 4,
                        }}
                        transition={{ duration: 0.01 }}
                      >
                        <Box
                          component={motion.div}
                          animate={{
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            opacity: [0, 100],
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.9)",
                          }}
                          style={{ y: 95, width: "100%", zIndex: 4 }}
                          transition={{ delay: 0.3, duration: 1.5 }}
                        >
                          <Typography
                            component={motion.div}
                            animate={{ opacity: [0, 1], scale: [0.8, 1], margin: [0, 30] }}
                            transition={{ delay: 0.3, duration: 3.5 }}
                            variant="h3"
                            style={{ fontSize: 64, fontWeight: 500, color: textColor, zIndex: 4 }}
                          >
                            {gameOver === "WIN" || gameOver === "LOSE" ? `YOU ${gameOver}` : "TIE"}
                          </Typography>
                        </Box>
                      </Box>
                      <ThemeProvider theme={theme}>
                        <Box
                          animate={{ y: [-9999, 0] }}
                          transition={{ delay: 2.95, duration: 0.05 }}
                          component={motion.div}
                          style={{ display: "flex", justifyContent: "center", zIndex: 4 }}
                        >
                          <Button
                            onClick={resetState}
                            component={motion.div}
                            animate={{
                              opacity: [0, 1],
                            }}
                            style={{
                              position: "absolute",
                              top: "20%",
                              y: 240,
                              opacity: 0,
                              zIndex: 4,
                            }}
                            variant="contained"
                            color={buttonType}
                            transition={{ delay: 3, duration: 0.5 }}
                          >
                            {buttonType === "secondary" ? "Try Again" : "Play Again"}
                          </Button>
                        </Box>
                      </ThemeProvider>
                    </>
                  )}

                  <Box sx={{ zIndex: 3, position: "absolute", display: "flex" }}>
                    <Box sx={{ mr: 20 }}>
                      <Stacker
                        color={CELL_COLOR}
                        boardColor={BOARD_COLOR}
                        controllable={true}
                        multiplayer={true}
                        stopGames={stopGames}
                        setMyBoard={setMyBoard}
                        setMyPiece={setMyPiece}
                        setMyScore={setMyScore}
                        setMyHighScore={setMyHighScore}
                        setMyPause={setMyPause}
                        setMyWin={setMyWin}
                        setMyLose={setMyLose}
                        enemyBoard={enemyBoard}
                        enemyPiece={enemyPiece}
                        enemyScore={enemyScore}
                        enemyHighScore={enemyHighScore}
                        enemyPause={enemyPause}
                        enemyWin={enemyWin}
                        enemyLose={enemyLose}
                      />
                    </Box>
                    <Box>
                      <Stacker
                        color={ENEMY_CELL_COLOR}
                        boardColor={ENEMY_BOARD_COLOR}
                        controllable={false}
                        multiplayer={true}
                        stopGames={stopGames}
                        setMyBoard={setMyBoard}
                        setMyPiece={setMyPiece}
                        setMyScore={setMyScore}
                        setMyHighScore={setMyHighScore}
                        setMyPause={setMyPause}
                        setMyWin={setMyWin}
                        setMyLose={setMyLose}
                        enemyBoard={enemyBoard}
                        enemyPiece={enemyPiece}
                        enemyScore={enemyScore}
                        enemyHighScore={enemyHighScore}
                        enemyPause={enemyPause}
                        enemyWin={enemyWin}
                        enemyLose={enemyLose}
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      zIndex: 2,
                      color: "grey.200",
                      position: "absolute",
                      transform: "translate(0%, 700%)",
                      fontWeight: 700,
                    }}
                  >
                    {timer}
                  </Typography>
                </>
              ) : userName === "Player 2" ? (
                <>
                  {gameOver && (
                    <>
                      <Box
                        component={motion.div}
                        animate={{
                          opacity: [0, 1],
                        }}
                        style={{
                          opacity: 0,
                          position: "absolute",
                          top: "20%",
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          zIndex: 4,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          component={motion.div}
                          animate={{
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                            opacity: [0, 100],
                            boxShadow: "0 0 5px rgba(0, 0, 0, 0.9)",
                          }}
                          style={{ y: 95, width: "100%", zIndex: 4 }}
                          transition={{ delay: 0.3, duration: 1.5 }}
                        >
                          <Typography
                            component={motion.div}
                            animate={{ opacity: [0, 1], scale: [0.8, 1], margin: [0, 30] }}
                            transition={{ delay: 0.3, duration: 3.5 }}
                            variant="h3"
                            style={{ fontSize: 64, fontWeight: 500, color: textColor, zIndex: 4 }}
                          >
                            {gameOver === "WIN" || gameOver === "LOSE" ? `YOU ${gameOver}` : "TIE"}
                          </Typography>
                        </Box>
                      </Box>
                      <ThemeProvider theme={theme}>
                        <Box
                          animate={{ y: [-9999, 0] }}
                          transition={{ delay: 2.95, duration: 0.05 }}
                          component={motion.div}
                          style={{ display: "flex", justifyContent: "center", zIndex: 4 }}
                        >
                          <Button
                            onClick={resetState}
                            component={motion.div}
                            animate={{
                              opacity: [0, 1],
                            }}
                            style={{
                              position: "absolute",
                              top: "20%",
                              y: 240,
                              opacity: 0,
                              zIndex: 4,
                            }}
                            variant="contained"
                            color={buttonType}
                            transition={{ delay: 3, duration: 0.5 }}
                          >
                            Play Again
                          </Button>
                        </Box>
                      </ThemeProvider>
                    </>
                  )}

                  <Box sx={{ zIndex: 3, position: "absolute", display: "flex" }}>
                    <Box sx={{ mr: 20 }}>
                      <Stacker
                        color={CELL_COLOR}
                        boardColor={BOARD_COLOR}
                        controllable={false}
                        multiplayer={true}
                        stopGames={stopGames}
                        setMyBoard={setMyBoard}
                        setMyPiece={setMyPiece}
                        setMyScore={setMyScore}
                        setMyHighScore={setMyHighScore}
                        setMyPause={setMyPause}
                        setMyWin={setMyWin}
                        setMyLose={setMyLose}
                        enemyBoard={enemyBoard}
                        enemyPiece={enemyPiece}
                        enemyScore={enemyScore}
                        enemyHighScore={enemyHighScore}
                        enemyPause={enemyPause}
                        enemyWin={enemyWin}
                        enemyLose={enemyLose}
                      />
                    </Box>
                    <Box>
                      <Stacker
                        color={ENEMY_CELL_COLOR}
                        boardColor={ENEMY_BOARD_COLOR}
                        controllable={true}
                        multiplayer={true}
                        stopGames={stopGames}
                        setMyBoard={setMyBoard}
                        setMyPiece={setMyPiece}
                        setMyScore={setMyScore}
                        setMyHighScore={setMyHighScore}
                        setMyPause={setMyPause}
                        setMyWin={setMyWin}
                        setMyLose={setMyLose}
                        enemyBoard={enemyBoard}
                        enemyPiece={enemyPiece}
                        enemyScore={enemyScore}
                        enemyHighScore={enemyHighScore}
                        enemyPause={enemyPause}
                        enemyWin={enemyWin}
                        enemyLose={enemyLose}
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      zIndex: 2,
                      color: "grey.200",
                      position: "absolute",
                      transform: "translate(0%, 700%)",
                      fontWeight: 700,
                    }}
                  >
                    {timer}
                  </Typography>
                </>
              ) : (
                <Typography color="error">An error occured: Invalid Username</Typography>
              )}
            </React.Fragment>
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
