import { Box } from "@mui/material";
import React from "react";
import Cell from "./Cell";
import { BOARD_COLOR, CELL_COLOR, COLUMN_AMOUNT, ROW_AMOUNT } from "./Constants";
import Row from "./Row";

const Board = ({ color, boardColor, rows }) => {
  const rowsBuilder = [];
  for (let i = 0; i < ROW_AMOUNT; i++) {
    const rowBuilder = [];
    for (let j = 0; j < COLUMN_AMOUNT; j++) {
      rowBuilder.push(<Cell key={"cell" + i + j} color={color} active={rows[i][j] === true} />);
    }
    rowsBuilder.push(<Row key={"row" + i} row={rowBuilder} />);
  }

  return <Box sx={{ backgroundColor: boardColor, p: 0.1, borderRadius: 1 }}>{rowsBuilder}</Box>;
};

export default Board;
