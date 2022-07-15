import React from "react";
import Color from "color";
import { CELL_SIZE } from "./Constants";
import { Box } from "@mui/material";
const Cell = ({ color, active }) => {
  const cellColor = active ? Color(color).lighten(0.3) : Color(color).alpha(0.5).desaturate(0.5);
  return (
    <Box
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: 6,
        margin: 1,
        backgroundColor: cellColor,
        boxShadow: active ? `0 0 ${CELL_SIZE / 2}px ${color}` : undefined,
      }}
    />
  );
};

export default Cell;
