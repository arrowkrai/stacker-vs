import { Box } from "@mui/material";
import React from "react";
import Board from "./Board";
import Cell from "./Cell";
import { BACKGROUND_COLOR, BOARD_COLOR, CELL_COLOR } from "./Constants";

const testBoard = [
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, false, false],
  [false, false, false, false, true, true, true, true, false, false],
];

const Game = () => {
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
      <Board color={CELL_COLOR} boardColor={BOARD_COLOR} rows={testBoard} />

    </Box>
  );
};

export default Game;
