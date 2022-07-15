import React, { useContext, useEffect, useReducer } from "react";
import { Board, moveAcross, moveUser } from "./Board";
import { COLUMN_AMOUNT, INITIAL_LENGTH, INITIAL_X_POSITION, ROW_AMOUNT } from "./Constants";
import { MyContext } from "../pages/MultiplayerPage";

export const update = (game, action) => {
  switch (action) {
    case "RESTART":
      return init();
    case "PAUSE":
      return game.state === "PLAYING" ? { ...game, state: "PAUSED" } : game;
    case "RESUME": {
      return game.state === "PAUSED" ? { ...game, state: "PLAYING" } : game;
    }
    case "TOGGLE_PAUSE": {
      if (game.state === "PLAYING") return { ...game, state: "PAUSED" };
      if (game.state === "PAUSED") return { ...game, state: "PLAYING" };
      return game;
    }
    case "TICK":
      return applyMove("TICK", game);
    case "MOVE_USER":
      return applyMove("MOVE_USER", game);
    default:
      throw new Error("Unhandled Action");
  }
};

const applyMove = (move, game) => {
  if (game.state !== "PLAYING") return game;
  var result;
  switch (move) {
    case "TICK":
      result = moveAcross(game.board, game.piece);
      return { ...game, piece: result };
    case "MOVE_USER":
      result = moveUser(game.board, game.piece);
      if (result === "WIN") {
        return { ...game, gameOver: "WIN", state: "PAUSED" };
      } else if (result === "LOSE") {
        return { ...game, gameOver: "LOSE", state: "PAUSED" };
      } else {
        return { ...game, points: game.points + 1, piece: result.piece, board: result.board };
      }
    default:
      throw new Error("Unhandled Move");
  }
};

export const createBoard = () => {
  const board = [];
  for (let i = 0; i < ROW_AMOUNT; i++) {
    const row = [];
    for (let j = 0; j < COLUMN_AMOUNT; j++) {
      row.push(false);
    }
    board.push(row);
  }
  return board;
};

const initPiece = () => {
  return {
    length: INITIAL_LENGTH,
    direction: "RIGHT",
    position: { x: INITIAL_X_POSITION, y: ROW_AMOUNT - 1 },
  };
};

export const init = () => {
  return {
    state: "PLAYING",
    points: 0,
    board: createBoard(),
    piece: initPiece(),
    gameOver: "",
  };
};

const deepCopy = (arr) => {
  const arrCopy = [];
  for (let i = 0; i < arr.length; i++) {
    const tempRow = [];
    for (let j = 0; j < arr[0].length; j++) {
      tempRow.push(arr[i][j]);
    }
    arrCopy.push(tempRow);
  }
  return arrCopy;
};

const renderBoard = (board, piece) => {
  let tempBoard = deepCopy(board);
  const activeRow = piece.position.y;
  let startingColumn = piece.position.x;
  for (let i = startingColumn; i < startingColumn + piece.length; i++) {
    tempBoard[activeRow][i] = true;
  }
  return tempBoard;
};

export const getActiveRow = (game) => ROW_AMOUNT - game.piece.position.y;

const userListener = (input, gameDispatch) => {
  switch (input) {
    case "CLICK":
      gameDispatch("MOVE_USER");
      break;
    case "PAUSE":
      gameDispatch("TOGGLE_PAUSE");
      break;
    default:
      throw new Error("Unhandled User input");
  }
};

const addEventListeners = (gameDispatch, multiplayer) => {
  if (!multiplayer) {
    window.addEventListener("keydown", (e) => e.code === "KeyP" && userListener("PAUSE", gameDispatch));
  }
  window.addEventListener("mousedown", (e) => userListener("CLICK", gameDispatch));
  window.addEventListener("keydown", (e) => e.code === "Space" && userListener("CLICK", gameDispatch));
  window.addEventListener("keydown", (e) => e.code === "ArrowDown" && userListener("CLICK", gameDispatch));
};

const removeEventListeners = (gameDispatch, multiplayer) => {
  if (!multiplayer) {
    window.removeEventListener("keydown", (e) => e.code === "KeyP" && userListener("PAUSE", gameDispatch));
  }
  window.removeEventListener("mousedown", () => userListener("MOUSEDOWN", gameDispatch));
  window.removeEventListener("keydown", (e) => e.code === "Space" && userListener("CLICK", gameDispatch));
  window.removeEventListener("keydown", (e) => e.code === "ArrowDown" && userListener("CLICK", gameDispatch));
};

const tickRate = (activeRow) => 110 - 4.8 * activeRow - activeRow ** 1.05;
const Game = ({ color, boardColor, setGameOver, setScore, reset, setReset, controllable, multiplayer, highScore }) => {
  const [game, gameDispatch] = useReducer(update, init());
  const context = useContext(MyContext);
  var state;
  var dispatch;
  if (context) {
    state = context.state;
    dispatch = context.dispatch;
  }

  useEffect(() => {
    if (multiplayer) {
      if (game.gameOver === "WIN") {
        dispatch({ type: "MY_WIN_TRUE" });
      }

      if (state.enemyWin || state.enemyLose) {
        gameDispatch("PAUSE");
      }
    }
  }, [state?.enemyWin, state?.enemyLose]);

  useEffect(() => {
    if (multiplayer) {
      if (game.gameOver === "LOSE") {
        dispatch({ type: "MY_WIN_FAIL", payload: game.piece });
        removeEventListeners(gameDispatch, multiplayer);
        setTimeout(() => {
          if (!state.stopGames) dispatch({ type: "MY_WIN_FAIL_UNPAUSE" });
        }, 100);
        setTimeout(() => {
          if (!(state.enemyWin || state.enemyLose) && !state.stopGames) {
            gameDispatch("RESTART");
            setReset(false);
            setGameOver("");
            addEventListeners(gameDispatch, multiplayer);
          }
        }, 1000);
      }
    }
  }, [game, gameDispatch, multiplayer, setReset, setGameOver]);

  let activeRow = getActiveRow(game);
  useEffect(() => {
    let interval;
    if (game.state === "PLAYING") {
      interval = window.setInterval(() => {
        gameDispatch("TICK");
      }, tickRate(activeRow));
    }
    return () => {
      window.clearInterval(interval);
    };
  }, [game.state, activeRow]);

  useEffect(() => {
    if (controllable) {
      addEventListeners(gameDispatch, multiplayer);
    }
    return () => {
      removeEventListeners(gameDispatch, multiplayer);
    };
  }, []);

  useEffect(() => {
    if (!multiplayer && game.gameOver) {
      setGameOver(game.gameOver);
    }
  }, [game.gameOver, setGameOver, multiplayer]);

  useEffect(() => {
    setScore(game.points);
  }, [setScore, game.points]);

  useEffect(() => {
    gameDispatch("RESTART");
    setReset(false);
    setGameOver("");
  }, [reset, setReset, setGameOver]);

  useEffect(() => {
    if (multiplayer && controllable) {
      dispatch({ type: "MY_MOVE", payload: { ...game, highScore: Math.max(highScore, game.points) } });
    }
  }, [game.points]);

  useEffect(() => {
    if (multiplayer && !controllable) {
      if (state?.enemyBoard?.length && state?.enemyPiece) {
        game.board = state.enemyBoard;
        game.piece = state.enemyPiece;
      }
    }
  }, [state?.enemyBoard]);

  useEffect(() => {
    if (multiplayer && !controllable) {
      if (state.enemyPause) {
        gameDispatch("PAUSE");
        setTimeout(() => {
          gameDispatch("RESUME");
        }, 1000);
      }
    }
  }, [state?.enemyPause, game.state]);
  useEffect(() => {
    if (state?.stopGames) {
      gameDispatch("PAUSE");
      removeEventListeners();
    }
  }, [state?.stopGames]);

  const viewBoard = renderBoard(game.board, game.piece);

  return (
    <>
      <Board color={color} boardColor={boardColor} board={viewBoard} />
    </>
  );
};

export default Game;
