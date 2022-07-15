import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Game from "./Game";
import Color from "color";
import WinLoseBanner from "./WinLoseBanner";

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

  const resetState = (e) => {
    e.preventDefault();
    setReset(true);
  };
  return (
    <>
      {!multiplayer && gameOver && <WinLoseBanner gameOver={gameOver} resetState={resetState} />}
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
