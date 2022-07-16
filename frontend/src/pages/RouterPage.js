import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
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
