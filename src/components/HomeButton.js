import { Button } from "@mui/material";
import React from "react";
import { grey } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const HomeButton = ({ goHome }) => {
  return (
    <Button
      onClick={goHome}
      style={{
        position: "absolute",
        top: "2%",
        left: "1%",
        opacity: 1,
        zIndex: 4,
        color: grey[500],
      }}
      variant="text"
    >
      <ArrowBackIcon style={{ width: 30 }} />
    </Button>
  );
};

export default HomeButton;
