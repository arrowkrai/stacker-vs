import { Box } from "@mui/material";
import React from "react";
import { BACKGROUND_COLOR } from "./Constants";

const MainBackground = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: BACKGROUND_COLOR,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}
    >
      {children}
    </Box>
  );
};

export default MainBackground;
