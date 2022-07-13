import { Box } from "@mui/material";
import React from "react";
import Cell from "./Cell";
import { BACKGROUND_COLOR, CELL_COLOR } from "./Constants";

const Row = ({row}) => {
  return (
    <Box sx={{ display:"flex"}}>
      {row}
    </Box>
  );
};

export default Row;
