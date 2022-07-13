import { Box } from "@mui/material";
import React from "react";
import { Board, moveAcross, moveUser } from "./Board";
import Cell from "./Cell";
import { BACKGROUND_COLOR, BOARD_COLOR, CELL_COLOR, COLUMN_AMOUNT, INITIAL_LENGTH, ROW_AMOUNT } from "./Constants";

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
      return applyMove(moveAcross, game);
    case "MOVE_USER":
      if (game.state !== "PLAYING") return game;
      return applyMove(moveUser, game);
    default:
      throw new Error("Unhandled Action");
  }
};

const applyMove = (move, game) => {
  if (game.state !== "PLAYING") return game;
  const result = move(game.board, game.piece);
  return result ? { ...game, piece: result } : game;
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
    position: { x: (COLUMN_AMOUNT - length) / 2, y: ROW_AMOUNT - 1 },
  };
};

export const init = () => {
  return {
    state: "PLAYING",
    points: 0,
    board: createBoard(),
    piece: initPiece(),
  };
};

const renderBoard = (board, piece) => {
  const activeRow = piece.position.y;
  let startingColumn = piece.position.x;
  for (let i = startingColumn; i < startingColumn + piece.length; i++) {
    board[activeRow][i] = true;
  }
};

export const getActiveRow = (game) => ROW_AMOUNT - game.piece.position.y;

const Game = () => {
  let game = init();
  game = applyMove(moveAcross, game);
  game = applyMove(moveAcross, game);
  game = applyMove(moveAcross, game);
  game = applyMove(moveAcross, game);
  game = applyMove(moveAcross, game);
  game = applyMove(moveAcross, game);
  game = applyMove(moveAcross, game);

  renderBoard(game.board, game.piece);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: BACKGROUND_COLOR,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Board color={CELL_COLOR} boardColor={BOARD_COLOR} board={game.board} />
    </Box>
  );
};

export default Game;
