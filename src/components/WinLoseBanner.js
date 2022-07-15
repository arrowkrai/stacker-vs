import React from "react";
import { motion } from "framer-motion";
import { Box, Button, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, red, orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: green[800],
    },
    secondary: {
      main: red[900],
    },
    warning: {
      main: orange[800],
    },
  },
});

const WinLoseBanner = ({ gameOver, resetState, multiplayer }) => {
  const textColor = gameOver === "LOSE" ? red[900] : gameOver === "WIN" ? green[800] : orange[800];
  const buttonType = gameOver === "LOSE" ? "secondary" : gameOver === "WIN" ? "primary" : "warning";
  return (
    <>
      <Box
        component={motion.div}
        animate={{
          opacity: [0, 1],
        }}
        style={{
          opacity: 0,
          position: "absolute",
          top: "20%",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          zIndex: 4,
        }}
        transition={{ duration: 0.01 }}
      >
        <Box
          component={motion.div}
          animate={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            opacity: [0, 100],
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.9)",
          }}
          style={{ y: 95, width: "100%", zIndex: 4 }}
          transition={{ delay: 0.3, duration: 1.5 }}
        >
          <Typography
            component={motion.div}
            animate={{ opacity: [0, 1], scale: [0.8, 1], margin: [0, 30] }}
            transition={{ delay: 0.3, duration: 3.5 }}
            variant="h3"
            style={{ fontSize: 64, fontWeight: 500, color: textColor, zIndex: 4 }}
          >
            {gameOver === "WIN" || gameOver === "LOSE" ? `YOU ${gameOver}` : "TIE"}
          </Typography>
        </Box>
      </Box>
      <ThemeProvider theme={theme}>
        <Box
          animate={{ y: [-9999, 0] }}
          transition={{ delay: 2.95, duration: 0.05 }}
          component={motion.div}
          style={{ display: "flex", justifyContent: "center", zIndex: 4 }}
        >
          <Button
            onClick={resetState}
            component={motion.div}
            animate={{
              opacity: [0, 1],
            }}
            style={{
              position: "absolute",
              top: "20%",
              y: 240,
              opacity: 0,
              zIndex: 4,
            }}
            variant="contained"
            color={buttonType}
            transition={{ delay: 3, duration: 0.5 }}
          >
            {multiplayer ? "Play Again" : <>{buttonType === "secondary" ? "Try Again" : "Play Again"}</>}
          </Button>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default WinLoseBanner;
