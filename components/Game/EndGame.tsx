import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { PieceSymbol, Square } from "chess.js";
import { PieceName } from "@/constants/types";
import { SIZE, width } from "@/constants/Size";
import { getDifferentColor } from "@/utils/getDifferentColor";
import { useGame } from "@/hooks/useGame";
import { PromotionDialog } from "../PromotionDialog/PromotionDialog";
import { Piece } from "../Piece/Piece";
import { Board } from "../Board/Board";


export const EndGame = () => {
    //const chess = useConst(() => new Chess('1K6/7r/1k6/8/8/8/8/8 b KQkq - 0 1'))
    const { chess, highlightedPiece, setPossibleMoves, gameState, isPromotiong } = useGame();
    
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
        <Board />
        {
          gameState.board.map((row: any[], i: number) => row.map((square, j) => {
              if (square === null) {
                  return null;
              }
              else {
                  return <Piece 
                      id={`${square.color}${square.type}` as PieceName} 
                      position={{x: j * SIZE, y: i * SIZE}}
                      key={`${square.color}${square.type}${j}${i}`}
                  />
              }
          }))
        }
      </View>
      {isPromotiong ? <PromotionDialog color={getDifferentColor(gameState.player)} /> : null}
    
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