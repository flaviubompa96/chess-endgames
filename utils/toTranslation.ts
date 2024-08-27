import { SIZE } from "../constants/Size";

export const toTranslation = (to: string) => {
    "worklet";
    // worklet don't support destructuring yet
    const tokens = to.split("");
    const col = tokens[0];
    const row = tokens[1];
    if (!col || !row) {
      throw new Error("Invalid notation: " + to);
    }
    const indexes = {
      x: col.charCodeAt(0) - "a".charCodeAt(0),
      y: parseInt(row, 10) - 1,
    };
    return {
      x: indexes.x * SIZE,
      y: 7 * SIZE - indexes.y * SIZE,
    };
  };