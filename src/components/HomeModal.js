import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import { Board } from "./Board";
import { BOARD_COLOR, CELL_COLOR } from "./Constants";
import { createBoard } from "./Game";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, red, orange, blue, blueGrey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[800],
    },
    secondary: {
      main: red[800],
    },
    info: {
      main: blueGrey[900],
    },
  },
});

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

const HomeModal = ({ handleSinglePlayer, handleMultiplayer, goHome }) => {
  return (
    <>
      <Modal disableEnforceFocus disableAutoFocus open={true}>
        <>
          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              position: "absolute",
              top: "20%",
              textAlign: "center",
              left: "50%",
              transform: "translate(-50%, -110%)",
              textShadow:
                "0 0 6px rgba(202,228,225,0.98),0 0 30px rgba(202,228,225,0.42),0 0 12px rgba(30,132,242,0.58),0 0 22px rgba(30,132,242,0.84),0 0 38px rgba(30,132,242,0.88),0 0 60px rgba(30,132,242,1)",
            }}
          >
            Stacker
          </Typography>
          <Box sx={style}>
            <ThemeProvider theme={theme}>
              <Button
                onClick={handleSinglePlayer}
                fullWidth
                variant="contained"
                sx={{ textTransform: "none", borderRadius: 4, mb: 2 }}
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
            </ThemeProvider>
          </Box>
        </>
      </Modal>
      <Box sx={{ pb: 8, zIndex: 1, position: "absolute" }}>
        <Board color={CELL_COLOR} boardColor={BOARD_COLOR} board={emptyBoard} />
      </Box>
    </>
  );
};

export default HomeModal;
