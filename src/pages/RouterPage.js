import { Box, Button, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { Board } from "../components/Board";
import { BACKGROUND_COLOR, BOARD_COLOR, CELL_COLOR } from "../components/Constants";
import { createBoard } from "../components/Game";
import { Stacker } from "../components/Stacker";
import Color from "color";
import { blue } from "@mui/material/colors";
import { motion } from "framer-motion";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import HomePage from "./HomePage";

const PageWrapper = () => {
  const { id } = useParams();
  // TODO: CHANGE TO <GamePage id={id} /> OR WHATEVER YOU END UP NAMING IT
  return <HomePage id={id} />;
};

const RouterPage = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<PageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterPage;
