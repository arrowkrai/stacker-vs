import { Box } from "@mui/material";
import React from "react";
import Cell from "./Cell";
import { COLUMN_AMOUNT, ROW_AMOUNT } from "./Constants";
import Row from "./Row";

export const moveAcross = (board, piece) => {
  if (piece.direction === "RIGHT") {
    if (piece.position.x + piece.length >= COLUMN_AMOUNT) {
      return { ...piece, direction: "LEFT", position: { x: piece.position.x - 1, y: piece.position.y } };
    } else {
      return { ...piece, position: { x: piece.position.x + 1, y: piece.position.y } };
    }
  } else if (piece.direction === "LEFT") {
    if (piece.position.x <= 0) {
      return { ...piece, direction: "RIGHT", position: { x: piece.position.x + 1, y: piece.position.y } };
    } else {
      return { ...piece, position: { x: piece.position.x - 1, y: piece.position.y } };
    }
  }
};

const getRandStartXPos = (piece) => {
  function randomIntFromInterval(min, max) {
    // [min, max]
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  return randomIntFromInterval(0, COLUMN_AMOUNT - 1 - piece.length);
};

export const moveUser = (board, piece) => {
  let nextPieceLength = piece.length;
  if (piece.position.y >= ROW_AMOUNT - 1) {
    // If bottom row
    for (let i = piece.position.x; i < piece.position.x + piece.length; i++) {
      board[piece.position.y][i] = true;
    }
  } else {
    for (let i = piece.position.x; i < piece.position.x + piece.length; i++) {
      if (board[piece.position.y + 1][i]) {
        board[piece.position.y][i] = true;
      } else {
        nextPieceLength--;
        // nextPieceLength = 6; // For Debugging
      }
    }
  }

  if (nextPieceLength === 0) return "LOSE";
  if (piece.position.y === 0) return "WIN";

  return {
    piece: { ...piece, length: nextPieceLength, position: { x: getRandStartXPos(piece), y: piece.position.y - 1 } },
    board: board,
  };
};

export const Board = ({ color, boardColor, board }) => {
  const rowsBuilder = [];
  for (let i = 0; i < ROW_AMOUNT; i++) {
    const rowBuilder = [];
    for (let j = 0; j < COLUMN_AMOUNT; j++) {
      rowBuilder.push(<Cell key={"cell" + i + j} color={color} active={board[i][j] === true} />);
    }
    rowsBuilder.push(<Row key={"row" + i} row={rowBuilder} />);
  }

  return <Box sx={{ backgroundColor: boardColor, p: 0.1, borderRadius: 1 }}>{rowsBuilder}</Box>;
};
