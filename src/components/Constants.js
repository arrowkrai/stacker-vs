import Color from "color";
import { blue, blueGrey, grey, red } from "@mui/material/colors";

const ROW_AMOUNT = 16;
const COLUMN_AMOUNT = 10;
const CELL_SIZE = 35;
const INITIAL_LENGTH = 5;
const INITIAL_X_POSITION = Math.floor((COLUMN_AMOUNT - INITIAL_LENGTH) / 2);
const TIMER_SECONDS = 3;
const CELL_COLOR = Color(blue[400]).toString();
const BOARD_COLOR = Color(CELL_COLOR).desaturate(0.1).darken(0.7).toString();
const BACKGROUND_COLOR = Color(blueGrey[900]).saturate(0.6).darken(0.4).toString();
const ENEMY_CELL_COLOR = Color(red[400]).toString();
const ENEMY_BOARD_COLOR = Color(ENEMY_CELL_COLOR).desaturate(0.1).darken(0.7).toString();
const ENEMY_BACKGROUND_COLOR = Color(red[900]).desaturate(0.2).darken(0.4).toString();

export {
  CELL_SIZE,
  BACKGROUND_COLOR,
  BOARD_COLOR,
  CELL_COLOR,
  ROW_AMOUNT,
  COLUMN_AMOUNT,
  INITIAL_LENGTH,
  INITIAL_X_POSITION,
  ENEMY_CELL_COLOR,
  ENEMY_BOARD_COLOR,
  ENEMY_BACKGROUND_COLOR,
  TIMER_SECONDS
};
