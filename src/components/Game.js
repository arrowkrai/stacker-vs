import { Box, Typography } from "@mui/material";
import React, { useEffect, useReducer } from "react";
import { Board, moveAcross, moveUser } from "./Board";
import Cell from "./Cell";
import {
  BACKGROUND_COLOR,
  BOARD_COLOR,
  CELL_COLOR,
  COLUMN_AMOUNT,
  INITIAL_LENGTH,
  INITIAL_X_POSITION,
  ROW_AMOUNT,
} from "./Constants";

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
      if (game.state !== "PLAYING") return game;
      return applyMove("TICK", game);
    case "MOVE_USER":
      if (game.state !== "PLAYING") return game;
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
      // console.log(result)
      if (result === "WIN") {
        // dispatch("TOGGLE_WIN");
        // Handle game win
        return { ...game, gameOver: "WIN", state: "PAUSED" };
      } else if (result === "LOSE") {
        // Handle game lose

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
  const length = INITIAL_LENGTH;
  const direction = "RIGHT";
  return {
    length,
    direction,
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
  let tempBoard;
  tempBoard = deepCopy(board);
  const activeRow = piece.position.y;
  let startingColumn = piece.position.x;
  for (let i = startingColumn; i < startingColumn + piece.length; i++) {
    tempBoard[activeRow][i] = true;
  }
  return tempBoard;
};

export const getActiveRow = (game) => ROW_AMOUNT - game.piece.position.y;

const userListener = (input, dispatch) => {
  switch (input) {
    case "CLICK":
      dispatch("MOVE_USER");
      break;
    case "PAUSE":
      dispatch("TOGGLE_PAUSE");
      break;

    default:
      throw new Error("Unhandled User input");
  }
};

const addEventListeners = (dispatch) => {
  window.addEventListener("mousedown", (e) => userListener("CLICK", dispatch));
  window.addEventListener("keydown", (e) => e.code === "KeyP" && userListener("PAUSE", dispatch));
  window.addEventListener("keydown", (e) => e.code === "Space" && userListener("CLICK", dispatch));
  window.addEventListener("keydown", (e) => e.code === "ArrowDown" && userListener("CLICK", dispatch));
};

const removeEventListeners = (dispatch) => {
  window.removeEventListener("mousedown", () => userListener("MOUSEDOWN", dispatch));
  window.removeEventListener("keydown", (e) => e.code === "KeyP" && userListener("PAUSE", dispatch));
  window.removeEventListener("keydown", (e) => e.code === "Space" && userListener("CLICK", dispatch));
  window.removeEventListener("keydown", (e) => e.code === "ArrowDown" && userListener("CLICK", dispatch));
};

const tickRate = (activeRow) => 110 - 4.8 * activeRow - activeRow ** 1.05;
const Game = ({ color, boardColor, setGameOver, setScore, reset, setReset }) => {
  const [game, dispatch] = useReducer(update, init());

  useEffect(() => {
    dispatch("RESTART");
    setReset(false);
    setGameOver("");
  }, [reset, setReset]);

  let activeRow = getActiveRow(game);
  useEffect(() => {
    let interval;
    if (game.state === "PLAYING") {
      interval = window.setInterval(() => {
        dispatch("TICK");
      }, tickRate(activeRow));
    }
    return () => {
      window.clearInterval(interval);
    };
  }, [game.state, activeRow]);

  useEffect(() => {
    addEventListeners(dispatch);
    return () => {
      removeEventListeners(dispatch);
    };
  }, []);

  useEffect(() => {
    if (game.gameOver) {
      setGameOver(game.gameOver);
    }
  }, [game.gameOver, setGameOver]);

  useEffect(() => {
    setScore(game.points);
  }, [setScore, game.points]);

  // console.log("game", game)
  const viewBoard = renderBoard(game.board, game.piece);

  return (
    <>
      <Board color={color} boardColor={boardColor} board={viewBoard} />
    </>
  );
};

export default Game;
