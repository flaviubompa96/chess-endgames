import { SIZE } from "@/constants/Size";
import { Vector } from "react-native-redash";

export const toPosition = ({ x, y }: Vector) => {
    "worklet";
    const col = String.fromCharCode(97 + Math.floor((x + SIZE / 2) / SIZE)); // Adding half a square's size to center within column
    const row = `${8 - Math.floor((y + SIZE / 2) / SIZE)}`; // Similarly centering for row
    return `${col}${row}`;
  };