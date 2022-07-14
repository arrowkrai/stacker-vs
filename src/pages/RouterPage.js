import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { Board } from "../components/Board";
import { BACKGROUND_COLOR, BOARD_COLOR, CELL_COLOR } from "../components/Constants";
import { createBoard } from "../components/Game";
import { Stacker } from "../components/Stacker";
import Color from "color";
import { blue } from "@mui/material/colors";
import { motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useParams, Link } from "react-router-dom";
import HomePage from "./HomePage";
import MultiplayerPage from "./MultiplayerPage";
const socket = require("../connection/socket").socket;

const CreateNewGame = (gameId) => {
  socket.emit("createNewGame", gameId);
};

const JoinGame = (gameId, userName) => {
  socket.emit("playerJoinGame", { gameId, userName });
};

const PageWrapper = ({ userName }) => {
  const { gameid } = useParams();
  if (userName === "Player 1") CreateNewGame(gameid);
  JoinGame(gameid, userName);

  return <MultiplayerPage gameId={gameid} userName={userName} />;
};

const RouterPage = () => {
  const [username, setUsername] = useState("Player 2");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage setUsername={setUsername} />} />
        <Route path="/:gameid" element={<PageWrapper userName={username} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterPage;
