import { Color, PieceSymbol, Square } from "chess.js";

export type Player = "b" | "w";
export type Type = "q" | "r" | "n" | "b" | "k" | "p";
export type PieceName = `${Player}${Type}`;
export type WhitePiece = `w${Type}`;
export type BlackPiece = `b${Type}`;
export type Game = {
    player: 'w' | 'b';
    board: ({
      square: Square;
      type: PieceSymbol;
      color: Color;
  } | null)[][];
};
export type HighilghtedPiece = {
    piece: string;
    from: string;
}