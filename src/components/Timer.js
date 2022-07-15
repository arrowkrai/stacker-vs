import { Typography } from "@mui/material";
import React from "react";

const Timer = ({ children }) => {
  return (
    <Typography
      variant="h4"
      sx={{
        zIndex: 2,
        color: "grey.200",
        position: "absolute",
        transform: "translate(0%, 700%)",
        fontWeight: 700,
      }}
    >
      {children}
    </Typography>
  );
};

export default Timer;
