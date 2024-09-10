import { Chess, Move } from "chess.js";
import React, { createContext, useCallback, useContext, useState } from "react";
import { runOnJS } from "react-native-reanimated";
import { useConst } from "./useConst";
import { Game, HighilghtedPiece } from "@/constants/types";

interface GameContextProps {
    chess: Chess;
    gameState: Game;
    setGameState: (value: Game) => void;
    isPromotiong: boolean;
    setIsPromoting: (value: boolean) => void;
    currentMove: Move | undefined;
    setCurrentMove: (value: Move) => void;
    highlightedPiece: HighilghtedPiece | null;
    setHighlightedPiece: (value: HighilghtedPiece | null) => void;
    possibleMoves: string[];
    setPossibleMoves: (value: string[]) => void;
    handleMove: (from: string, to: string, resetPosition: () => void) => void;
    handlePromotingPiece: (piece: string) => void;
    checkPossibleMove: (sqareName: string) => boolean;
}

const GameContext = createContext<GameContextProps>({
    chess: new Chess(),
    gameState: {
      player: 'w',
      board: [],
    },
    setGameState: () => {},
    isPromotiong: false,
    setIsPromoting: () => {},
    currentMove: undefined,
    setCurrentMove: () => {},
    highlightedPiece: null,
    setHighlightedPiece: () => {},
    possibleMoves: [],
    setPossibleMoves: () => {},
    handleMove: () => {},
    handlePromotingPiece: () => {},
    checkPossibleMove: () => false,
});

const GameProvider = ({children}: {children: any}) => {
    const chess = useConst(() => new Chess())
    const [gameState, setGameState] = useState<Game>({
        player: 'w',
        board: chess.board(),
    });
    const [isPromotiong, setIsPromoting] = useState(false);
    const [currentMove, setCurrentMove] = useState<Move>();
    const [highlightedPiece, setHighlightedPiece] = useState<HighilghtedPiece | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

    const handleMove = useCallback((from: string, to: string, resetPosition: () => void) => {
        try {
          const moves = chess.moves({ verbose: true });
          const move = moves.find(m => m.from === from && m.to === to);
          if (move) {
            if (move.piece === 'p' && ['1', '8'].includes(move.to[1])) {
              setIsPromoting(true);
              setCurrentMove(move);
            }
            else {
              chess.move(move);
              setGameState({
                player: chess.turn(),
                board: chess.board(),
              });
            }
            setHighlightedPiece(null);
            setPossibleMoves([]);
          } else {
            runOnJS(resetPosition)();
          }
        } catch (error) {
          runOnJS(resetPosition)();
        }
      }, [gameState, chess]);
    
    const handlePromotingPiece = (piece: string) => {
      if (currentMove) {
        chess.move({...currentMove, promotion: piece[1]});
        setGameState({
          player: chess.turn(),
          board: chess.board(),
        });
      }
      setIsPromoting(false);
    };

    const checkPossibleMove = (squareName: string) => {
      const possibleMove = highlightedPiece?.piece === 'p' ? squareName : `${highlightedPiece?.piece.toLocaleUpperCase()}${squareName}`;
      const possibleCapturingMove = highlightedPiece?.piece === 'p' ? `${highlightedPiece.from[0]}x${squareName}` : `${highlightedPiece?.piece.toLocaleUpperCase()}x${squareName}`;
      const movesToCheck = [
        possibleMove, 
        possibleCapturingMove, 
        `${possibleMove}+`, 
        `${possibleMove}#`, 
        `${possibleCapturingMove}+`, 
        `${possibleCapturingMove}#`,
        `${possibleMove}=Q`,
        `${possibleMove}=Q+`,
        `${possibleMove}=Q#`,
        `${possibleCapturingMove}=Q`,
        `${possibleCapturingMove}=Q+`,
        `${possibleCapturingMove}=Q#`,
      ];
      return movesToCheck.some(item => possibleMoves.includes(item));
    }

      return (
       <GameContext.Provider value={{ 
            chess,
            gameState,
            setGameState,
            isPromotiong,
            setIsPromoting,
            currentMove,
            setCurrentMove,
            highlightedPiece,
            setHighlightedPiece,
            possibleMoves,
            setPossibleMoves,
            handleMove,
            handlePromotingPiece,
            checkPossibleMove
        }}>
          {children}
        </GameContext.Provider>
      );
};

const useGame = () => {
    return useContext(GameContext);
  };
export { GameProvider, useGame };

