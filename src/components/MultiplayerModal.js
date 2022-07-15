import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import "../styles/LoadingDots.css";
import { Board } from "./Board";
import {
  BOARD_COLOR,
  CELL_COLOR,
  COLUMN_AMOUNT,
  ENEMY_BACKGROUND_COLOR,
  ENEMY_BOARD_COLOR,
  ENEMY_CELL_COLOR,
  ROW_AMOUNT,
} from "./Constants";
import { blue, grey } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeButton from "./HomeButton";

const createBoard = () => {
  const board = [];
  for (let i = 0; i < ROW_AMOUNT; i++) {
    const row = [];
    for (let j = 0; j < COLUMN_AMOUNT; j++) {
      row.push(false);
    }
    board.push(row);
  }
  return board;
};

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
  textAlign: "center",
};

const emptyBoard = createBoard();

const MultiplayerModal = ({ domainName, gameId, goHome }) => (
  <>
    <Modal disableEnforceFocus disableAutoFocus open={true}>
      <>
        <HomeButton goHome={goHome} />
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
          <Typography>Copy and paste this URL to your friend:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            type="text"
            name="text"
            id="text"
            value={`${domainName}/${gameId}`}
            onChange={() => {}}
            sx={{ my: 2, backgroundColor: "#fff", borderRadius: 1 }}
          />
          <Typography>
            Waiting for
            <Typography color="error" component="span">
              {" "}
              Player 2{" "}
            </Typography>
            to join the game
            <span className="one">.</span>
            <span className="two">.</span>
            <span className="three">.</span>
          </Typography>
        </Box>
      </>
    </Modal>
    <Box
      sx={{
        backgroundColor: ENEMY_BACKGROUND_COLOR,
        position: "absolute",
        minHeight: "100vh",
        width: "50%",
        right: 0,
        top: 0,
        opacity: 0.5,
        zIndex: 2,
      }}
    />

    <Box sx={{ pb: 8, zIndex: 3, position: "absolute", display: "flex" }}>
      <Box sx={{ mr: 20 }}>
        <Board color={CELL_COLOR} boardColor={BOARD_COLOR} board={emptyBoard} />
      </Box>
      <Box>
        <Board color={ENEMY_CELL_COLOR} boardColor={ENEMY_BOARD_COLOR} board={emptyBoard} />
      </Box>
    </Box>
  </>
);

export default MultiplayerModal;
