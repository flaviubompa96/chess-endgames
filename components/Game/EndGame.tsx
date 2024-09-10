import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { runOnJS } from "react-native-reanimated";

import { Chess, Move, PieceSymbol, Square } from "chess.js";
import { Game, HighilghtedPiece } from "@/constants/types";
import { SIZE, width } from "@/constants/Size";
import { getDifferentColor } from "@/utils/getDifferentColor";
import { useConst } from "@/hooks/useConst";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";
import { Piece } from "../Piece/Piece";
import { Board } from "../Board/Board";


export const EndGame = () => {
    //const chess = useConst(() => new Chess('1K6/7r/1k6/8/8/8/8/8 b KQkq - 0 1'))
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
      }
    
      useEffect(() => {
        if(highlightedPiece) {
          const moves = chess.moves({piece: highlightedPiece.piece as PieceSymbol, square: highlightedPiece.from as Square});
          setPossibleMoves(moves);
        }
      }, [highlightedPiece]);
    return (
        <>
            <View style={styles.result}>
        {chess.isCheckmate() ? <Text style={styles.text}>{chess.turn() === 'w' ? '0-1' : '1-0'}</Text>
         : null}
        {chess.isDraw() ? (
          <Text style={styles.text}>1/2-1/2</Text>
        ) : null}
      </View>
      <View style={styles.board}>
        <Board 
          highlightedPiece={highlightedPiece}
          setHighlightedPiece={setHighlightedPiece}
          possibleMoves={possibleMoves} 
          setPossibleMoves={setPossibleMoves}
          handleMove={handleMove}
        />
        {
          gameState.board.map((row, i) => row.map((square, j) => {
              if (square === null) {
                  return null;
              }
              else {
                  return <Piece 
                      id={`${square.color}${square.type}`} 
                      position={{x: j * SIZE, y: i * SIZE}}
                      key={`${square.color}${square.type}${j}${i}`}
                      handleMove={handleMove}
                      setHighlightedPiece={setHighlightedPiece}
                      highlightedPiece={highlightedPiece}
                      possibleMoves={possibleMoves}
                  />
              }
          }))
        }
      </View>
      {isPromotiong ? <PromotionDialog color={getDifferentColor(gameState.player)} setPromotionPiece={handlePromotingPiece} /> : null}
    
        </>
    );
};

const styles = StyleSheet.create({
    root: {
      height: '100%',
      justifyContent: 'center',
    },
    board: {
      alignContent: 'center',
      alignSelf: 'center',
      width: width,
      height: width,
    },
    result: {
      alignContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 30,
    },
  });