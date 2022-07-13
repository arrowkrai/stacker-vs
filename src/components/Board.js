import { Box } from "@mui/material";
import React from "react";
import Cell from "./Cell";
import { BOARD_COLOR, CELL_COLOR, COLUMN_AMOUNT, ROW_AMOUNT } from "./Constants";
import Row from "./Row";

export const moveAcross = (board, piece) => {
  if (piece.direction === "RIGHT") {
    if (piece.position.x + piece.length >= COLUMN_AMOUNT) {
      piece.direction = "LEFT";
      piece.position.x -= 1;
    } else {
      piece.position.x += 1;
    }
  } else if (piece.direction === "LEFT") {
    if (piece.position.x <= 0) {
      piece.direction = "RIGHT";
      piece.position.x += 1;
    } else {
      piece.position.x -= 1;
    }
  }
  return piece;
};
export const moveUser = (board, piece) => {};

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
