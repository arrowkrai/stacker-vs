import { Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Game from "./Game";
import Color from "color";
import WinLoseBanner from "./WinLoseBanner";
import { MyContext } from "../pages/MultiplayerPage";

export const Stacker = ({ color, boardColor, controllable, multiplayer }) => {
  // const { state } = useContext(MyContext);
  const context = useContext(MyContext);
  var state;
  if (context) {
    state = context.state;
  }
  const [reset, setReset] = useState(false);
  const [gameOver, setGameOver] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  useEffect(() => {
    if (!controllable && multiplayer) {
      setScore(state.enemyScore);
      setHighScore(state.enemyHighScore);
    } else {
      setHighScore(Math.max(score, highScore));
    }
  }, [highScore, score, state?.enemyScore, state?.enemyHighScore]);
  

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
        highScore={highScore}
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
