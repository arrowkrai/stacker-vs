import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { Board } from "../components/Board";
import { BACKGROUND_COLOR, BOARD_COLOR, CELL_COLOR } from "../components/Constants";
import { createBoard } from "../components/Game";
import { Stacker } from "../components/Stacker";
import Color from "color";
import { blue } from "@mui/material/colors";
import { motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: blue[100],
  borderRadius: 8,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const emptyBoard = createBoard();

const HomePage = () => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState("");


  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSinglePlayer = (e) => {
    e.preventDefault();
    setGameMode("SINGLEPLAYER");
  };
  const handleMultiplayer = () => {};

  // TODO: WHEN BUTTON IS PRESSED, ANIMATE, THEN NAVIGATE AFTER ANIMATION
  // so i'm guessing its probably just setTimeout(navigate, 4000) then start animating
  // for singleplayer, can probably just setGameMode to SINGLEPLAYER
  // for multiplayer, navigate after

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
      {gameMode === "SINGLEPLAYER" ? (
        <Stacker />
      ) : (
        <>

        {/* Overlay may need this for animation */}
      {/* <Box sx={{ backgroundColor:"#000", minHeight:"100vh", width:"100%", opacity: 0.5, zIndex:2 }} /> */}

          <Modal
            disableEnforceFocus
            disableAutoFocus
            open={open}
            // onClose={handleClose}
          >
            <>
              <Typography
                variant="h1"
                sx={{
                  color: "#fff",
                  position: "absolute",
                  top: "20%",
                  textAlign: "center",
                  left: "50%",
                  transform: "translate(-50%, -100%)",
                  textShadow:
                    "0 0 6px rgba(202,228,225,0.98),0 0 30px rgba(202,228,225,0.42),0 0 12px rgba(30,132,242,0.58),0 0 22px rgba(30,132,242,0.84),0 0 38px rgba(30,132,242,0.88),0 0 60px rgba(30,132,242,1)",
                }}
              >
                Stacker
              </Typography>
              <Box sx={style}>
                <Button
                  onClick={handleSinglePlayer}
                  fullWidth
                  variant="contained"
                  sx={{ textTransform: "none", mb: 2, borderRadius: 4 }}
                >
                  <Box sx={{ my: 1 }}>
                    <Typography sx={{ fontSize: 26, pb: 1 }}>
                      <strong>Singleplayer</strong>
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>Can you reach the top?</Typography>
                  </Box>
                </Button>
                <Button
                  onClick={handleMultiplayer}
                  color="error"
                  fullWidth
                  variant="contained"
                  sx={{ textTransform: "none", borderRadius: 4 }}
                >
                  <Box sx={{ my: 1 }}>
                    <Typography sx={{ fontSize: 26, pb: 1 }}>
                      <strong>Multiplayer</strong>
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>Stack the most in one minute to win!</Typography>
                  </Box>
                </Button>
              </Box>
            </>
          </Modal>
          <Box sx={{ pb: 8, zIndex: 1, position: "absolute" }}>
            <Board color={CELL_COLOR} boardColor={BOARD_COLOR} board={emptyBoard} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomePage;