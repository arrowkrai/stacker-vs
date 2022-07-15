import React, { useState, useEffect } from "react";
import { BOARD_COLOR, CELL_COLOR } from "../components/Constants";
import { Stacker } from "../components/Stacker";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import MainBackground from "../components/MainBackground";
import HomeModal from "../components/HomeModal";

const HomePage = ({ setUsername }) => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState("");

  useEffect(() => {
    setUsername("Player 1");
  }, [setUsername]);

  const multiplayerRedirect = (gameid) => {
    navigate(`/${gameid}`);
  };

  const handleSinglePlayer = (e) => {
    e.preventDefault();
    setGameMode("SINGLEPLAYER");
  };
  const handleMultiplayer = (e) => {
    e.preventDefault();
    multiplayerRedirect(uuidv4());
  };

  return (
    <MainBackground>
      {gameMode === "SINGLEPLAYER" ? (
        <Stacker color={CELL_COLOR} boardColor={BOARD_COLOR} controllable={true} multiplayer={false} />
      ) : gameMode === "MULTIPLAYER" ? null : (
        <HomeModal handleSinglePlayer={handleSinglePlayer} handleMultiplayer={handleMultiplayer} />
      )}
    </MainBackground>
  );
};

export default HomePage;
