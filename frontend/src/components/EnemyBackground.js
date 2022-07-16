import { Box } from "@mui/material";
import React from "react";
import { ENEMY_BACKGROUND_COLOR } from "./Constants";

const EnemyBackground = () => {
  return (
    <Box
      sx={{
        backgroundColor: ENEMY_BACKGROUND_COLOR,
        position: "absolute",
        minHeight: "100vh",
        width: "50%",
        right: 0,
        top: 0,
        opacity: 0.5,
        zIndex: 2,
      }}
    />
  );
};

export default EnemyBackground;
