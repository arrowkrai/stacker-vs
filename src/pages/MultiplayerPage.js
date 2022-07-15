import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CELL_COLOR, BOARD_COLOR, ENEMY_BOARD_COLOR, ENEMY_CELL_COLOR, TIMER_SECONDS } from "../components/Constants";
import { Stacker } from "../components/Stacker";
import WinLoseBanner from "../components/WinLoseBanner";
import MultiplayerModal from "../components/MultiplayerModal";
import Timer from "../components/Timer";
import MainBackground from "../components/MainBackground";
import EnemyBackground from "../components/EnemyBackground";
const socket = require("../connection/socket").socket;

const MultiplayerPage = ({ gameId, userName }) => {
  const domainName = "http://localhost:3000";
  const [opponentSocketId, setOpponentSocketId] = useState("");
  const [opponentDidJoinTheGame, didJoinGame] = useState(false);
  const [opponentUserName, setUserName] = useState("");
  const [gameSessionDoesNotExist, doesntExist] = useState(false);
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
      }, 1000);
    }
  }, [timeUp]);

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
  };

  const resetState = (e) => {
    e.preventDefault();
    socket.emit("new move", {
      gameId,
      key: key + 1,
    });
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
          resetAll(move.key);
        }
      } else if (move.myBoard.length > 0 && move.userName !== userName) {
        setEnemyBoard(move.myBoard);
        setEnemyPiece(move.myPiece);
        setEnemyScore(move.myScore);
        setEnemyHighScore(move.myHighScore);
        setEnemyPause(move.myPause);
        setEnemyWin(move.myWin);
        setEnemyLose(move.myLose);
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
    <MainBackground key={key}>
      <>
        {console.log("key", key)}
        {opponentDidJoinTheGame ? (
          <>
            <EnemyBackground />
            {userName === "Player 1" ? (
              <>
                {gameOver && <WinLoseBanner gameOver={gameOver} resetState={resetState} />}

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
                <Timer>{timer}</Timer>
              </>
            ) : userName === "Player 2" ? (
              <>
                {gameOver && <WinLoseBanner gameOver={gameOver} resetState={resetState} multiplayer={true} />}

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
                <Timer>{timer}</Timer>
              </>
            ) : (
              <Typography color="error">An error occured: Invalid Username</Typography>
            )}
          </>
        ) : gameSessionDoesNotExist ? (
          <Typography sx={{ color: "#fff" }}>The game session could not be found</Typography>
        ) : (
          <MultiplayerModal domainName={domainName} gameId={gameId} />
        )}
      </>
    </MainBackground>
  );
};

export default MultiplayerPage;
