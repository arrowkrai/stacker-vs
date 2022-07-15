import { Box, Button, Typography } from "@mui/material";
import React, { useReducer, useEffect, useState } from "react";
import { BACKGROUND_COLOR, BOARD_COLOR, CELL_COLOR } from "./Constants";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Game from "./Game";
import { motion } from "framer-motion";
import { blue, green, red, purple, orange, amber, deepOrange, indigo, lightBlue, blueGrey } from "@mui/material/colors";
import Color from "color";

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

export const Stacker = ({
  color,
  boardColor,
  controllable,
  multiplayer,
  stopGames,
  setMyBoard,
  setMyPiece,
  setMyScore,
  setMyHighScore,
  setMyPause,
  setMyWin,
  setMyLose,
  enemyBoard,
  enemyPiece,
  enemyScore,
  enemyHighScore,
  enemyPause,
  enemyWin,
  enemyLose,
}) => {
  const [reset, setReset] = useState(false);
  const [gameOver, setGameOver] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  useEffect(() => {
    if (!controllable && multiplayer) {
      setScore(enemyScore);
      setHighScore(enemyHighScore);
    } else {
      setHighScore(Math.max(score, highScore));
    }
  }, [highScore, score, enemyScore, enemyHighScore]);


  const textColor = gameOver === "LOSE" ? red[900] : gameOver === "WIN" ? green[800] : orange[800];
  const buttonType = gameOver === "LOSE" ? "secondary" : gameOver === "WIN" ? "primary" : "warning";
  const resetState = (e) => {
    e.preventDefault();
    setReset(true);
  };
  return (
    <>
      {!multiplayer && gameOver && (
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
            }}
            transition={{ duration: 0.3 }}
          >
            <Box
              component={motion.div}
              animate={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                opacity: [0, 100],
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.9)",
              }}
              style={{ y: 95, width: "100%" }}
              transition={{ delay: 0.3, duration: 1.5 }}
            >
              <Typography
                component={motion.div}
                animate={{ opacity: [0, 1], scale: [0.8, 1], margin: [0, 30] }}
                transition={{ delay: 0.3, duration: 3.5 }}
                variant="h3"
                style={{ fontSize: 64, fontWeight: 500, color: textColor }}
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
              style={{ display: "flex", justifyContent: "center" }}
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
                }}
                variant="contained"
                color={buttonType}
                transition={{ delay: 3, duration: 0.5 }}
              >
                {buttonType === "secondary" ? "Try Again" : "Play Again"}
              </Button>
            </Box>
          </ThemeProvider>
        </>
      )}
      <Game
        color={color}
        boardColor={boardColor}
        controllable={controllable}
        setGameOver={setGameOver}
        setScore={setScore}
        reset={reset}
        setReset={setReset}
        multiplayer={multiplayer}
        stopGames={stopGames}
        highScore={highScore}
        setMyBoard={setMyBoard}
        setMyPiece={setMyPiece}
        setMyScore={setMyScore}
        setMyHighScore={setMyHighScore}
        setMyPause={setMyPause}
        setMyWin={setMyWin}
        setMyLose={setMyLose}
        enemyBoard={enemyBoard}
        enemyPiece={enemyPiece}
        enemyPause={enemyPause}
        enemyWin={enemyWin}
        enemyLose={enemyLose}
      />
      <Typography sx={{ color: Color(color).lighten(0.4).toString(), mt: 2, textAlign: "center" }}>
        Current Score: {score}
      </Typography>
      <Typography sx={{ color: Color(color).lighten(0.4).toString(), textAlign: "center" }}>
        High Score: {highScore}
      </Typography>
    </>
  );
};
