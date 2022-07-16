import { Box, Button, Typography } from "@mui/material";
import React, { createContext, useEffect, useReducer, useState } from "react";
import { CELL_COLOR, BOARD_COLOR, ENEMY_BOARD_COLOR, ENEMY_CELL_COLOR, TIMER_SECONDS } from "../components/Constants";
import { Stacker } from "../components/Stacker";
import WinLoseBanner from "../components/WinLoseBanner";
import MultiplayerModal from "../components/MultiplayerModal";
import Timer from "../components/Timer";
import MainBackground from "../components/MainBackground";
import EnemyBackground from "../components/EnemyBackground";
import { useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeButton from "../components/HomeButton";

const socket = require("../connection/socket").socket;
export const MyContext = createContext(null);
export const reducer = (state, action) => {
  switch (action.type) {
    case "GAME_STOP":
      return { ...state, stopGames: true };
    case "GAME_WIN":
      return { ...state, enemyLose: true, gameOver: "WIN" };
    case "GAME_LOSE":
      return { ...state, enemyWin: true, gameOver: "LOSE" };
    case "GAME_TIE":
      return { ...state, enemyWin: true, enemyLose: true, gameOver: "TIE" };
    case "TIMER_TICK":
      return { ...state, timer: state.timer - 1 };
    case "TIME_UP":
      return { ...state, timeUp: true };
    case "RESET":
      return init(state.key + 1);
    case "RESET_WITH_KEY":
      return init(action.payload);
    case "SET_ENEMY":
      const { myBoard, myPiece, myScore, myHighScore, myPause, myWin, myLose, timeUp } = action.payload;
      return {
        ...state,
        enemyBoard: myBoard,
        enemyPiece: myPiece,
        enemyScore: myScore,
        enemyHighScore: myHighScore,
        enemyPause: myPause,
        enemyWin: myWin,
        enemyLose: myLose,
        timeUp: timeUp,
      };
    case "MY_WIN_TRUE":
      return { ...state, myWin: true };
    case "MY_WIN_FAIL":
      return { ...state, myPause: true, myPiece: action.payload };
    case "MY_WIN_FAIL_UNPAUSE":
      return { ...state, myPause: false };
    case "MY_MOVE":
      const { board, piece, points, highScore } = action.payload;
      return { ...state, myBoard: board, myPiece: piece, myScore: points, myHighScore: highScore };
    default:
      return state;
    // throw new Error(`Unhandled Action ${action.type}`);
  }
};

const init = (resetKey = 1) => {
  return {
    myBoard: [],
    myPiece: {},
    myScore: 0,
    myHighScore: 0,
    myPause: false,
    myWin: false,
    myLose: false,
    enemyBoard: [],
    enemyPiece: {},
    enemyScore: 0,
    enemyHighScore: 0,
    enemyPause: false,
    enemyWin: false,
    enemyLose: false,
    timer: TIMER_SECONDS,
    timeUp: false,
    gameOver: "",
    stopGames: false,
    key: resetKey,
  };
};

const MultiplayerPage = ({ gameId, userName }) => {
  const domainName = "https://stacker-vs.herokuapp.com";
  const [opponentSocketId, setOpponentSocketId] = useState("");
  const [opponentDidJoinTheGame, setOpponentDidJoinTheGame] = useState(false);
  const [opponentUserName, setOpponentUserName] = useState("");
  const [gameSessionDoesNotExist, setGameSessionDoesNotExist] = useState(false);
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, init());

  const goHome = (e) => {
    e.preventDefault();
    navigate("/");
  };

  useEffect(() => {
    if (state.timeUp) {
      dispatch({ type: "GAME_STOP" });

      setTimeout(() => {
        if (state.myHighScore > state.enemyHighScore) {
          dispatch({ type: "GAME_WIN" });
        } else if (state.myHighScore < state.enemyHighScore) {
          dispatch({ type: "GAME_LOSE" });
        } else {
          dispatch({ type: "GAME_TIE" });
        }
      }, 1000);
    }
  }, [state.timeUp]);

  const resetState = (e) => {
    e.preventDefault();
    socket.emit("new move", {
      gameId,
      key: state.key + 1,
    });
    dispatch({ type: "RESET" });
  };

  useEffect(() => {
    let interval;
    if (opponentDidJoinTheGame) {
      interval = window.setInterval(() => {
        if (state.timer > 0 && !state.timeUp) dispatch({ type: "TIMER_TICK" });
      }, 1000);
    }
    if (state.timer === 0) {
      setTimeout(() => {
        dispatch({ type: "TIME_UP" });
      }, 1000);
    }
    return () => {
      window.clearInterval(interval);
    };
  }, [opponentDidJoinTheGame, state.timer]);

  useEffect(() => {
    if (state.myBoard && state.myPiece) {
      socket.emit("new move", {
        gameId,
        userName,
        myBoard: state.myBoard,
        myPiece: state.myPiece,
        myScore: state.myScore,
        myHighScore: state.myHighScore,
        myPause: state.myPause,
        myWin: state.myWin,
        myLose: state.myLose,
        timeUp: state.timeUp,
      });
    }
  }, [state.myBoard, state.myPiece, state.myPause, state.myScore, state.myWin, state.myLose]);

  useEffect(() => {
    socket.on("opponent move", (move) => {
      if (move.key) {
        if (state.key !== move.key) {
          dispatch({ type: "RESET_WITH_KEY", payload: move.key });
        }
      } else if (move.myBoard.length > 0 && move.userName !== userName) {
        dispatch({ type: "SET_ENEMY", payload: move });
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
        setGameSessionDoesNotExist(true);
      }
    });

    socket.on("start game", (opponentUserName) => {
      // console.log("START!");
      if (opponentUserName !== userName) {
        setOpponentUserName(opponentUserName);
        setOpponentDidJoinTheGame(true);
      } else {
        socket.emit("request username", gameId);
      }
    });

    socket.on("give userName", (socketId) => {
      if (socket.id !== socketId) {
        // console.log("give userName stage: " + userName);
        socket.emit("recieved userName", { userName: userName, gameId: gameId });
      }
    });

    socket.on("get Opponent UserName", (data) => {
      if (socket.id !== data.socketId) {
        setOpponentUserName(data.userName);
        // console.log("data.socketId: data.socketId");
        setOpponentSocketId(data.socketId);
        setOpponentDidJoinTheGame(true);
      }
    });
  }, []);

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      <MainBackground key={state.key}>
        <>
          {opponentDidJoinTheGame ? (
            <>
              <HomeButton goHome={goHome} />
              <EnemyBackground />
              {userName === "Player 1" ? (
                <>
                  {state.gameOver && (
                    <WinLoseBanner
                      gameOver={state.gameOver}
                      resetState={resetState}
                      multiplayer={true}
                      goHome={goHome}
                    />
                  )}

                  <Box sx={{ zIndex: 3, position: "absolute", display: "flex" }}>
                    <Box sx={{ mr: 20 }}>
                      <Stacker color={CELL_COLOR} boardColor={BOARD_COLOR} controllable={true} multiplayer={true} />
                    </Box>
                    <Box>
                      <Stacker
                        color={ENEMY_CELL_COLOR}
                        boardColor={ENEMY_BOARD_COLOR}
                        controllable={false}
                        multiplayer={true}
                      />
                    </Box>
                  </Box>
                  <Timer>{state.timer}</Timer>
                </>
              ) : userName === "Player 2" ? (
                <>
                  {state.gameOver && (
                    <WinLoseBanner
                      gameOver={state.gameOver}
                      resetState={resetState}
                      multiplayer={true}
                      goHome={goHome}
                    />
                  )}

                  <Box sx={{ zIndex: 3, position: "absolute", display: "flex" }}>
                    <Box sx={{ mr: 20 }}>
                      <Stacker color={CELL_COLOR} boardColor={BOARD_COLOR} controllable={false} multiplayer={true} />
                    </Box>
                    <Box>
                      <Stacker
                        color={ENEMY_CELL_COLOR}
                        boardColor={ENEMY_BOARD_COLOR}
                        controllable={true}
                        multiplayer={true}
                      />
                    </Box>
                  </Box>
                  <Timer>{state.timer}</Timer>
                </>
              ) : (
                <Typography color="error">An error occured: Invalid Username</Typography>
              )}
            </>
          ) : gameSessionDoesNotExist ? (
            <Typography sx={{ color: "#fff" }}>The game session could not be found</Typography>
          ) : (
            <MultiplayerModal domainName={domainName} gameId={gameId} goHome={goHome} />
          )}
        </>
      </MainBackground>
    </MyContext.Provider>
  );
};

export default MultiplayerPage;
