import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { runOnJS } from 'react-native-reanimated';

import { Chess, Color, Move, PieceSymbol, Square } from 'chess.js';
import { Board } from '@/components/Board/Board';
import { useConst } from '@/hooks/useConst';
import { Piece } from '@/components/Piece/Piece';
import { SIZE, width } from '@/constants/Size';
import { PromotionDialog } from '@/components/PromotionDialog/PromotionDialog';
import { Game } from '@/constants/types';
import { getDifferentColor } from '@/utils/getDifferentColor';

export default function HomeScreen() {
  //const chess = useConst(() => new Chess('1K6/7r/1k6/8/8/8/8/8 b KQkq - 0 1'))
  const chess = useConst(() => new Chess())
  const [gameState, setGameState] = useState<Game>({
      player: 'w',
      board: chess.board(),
  });
  const [isPromotiong, setIsPromoting] = useState(false);
  const [currentMove, setCurrentMove] = useState<Move>();

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
  
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.result}>
        {chess.isCheckmate() ? <Text style={styles.text}>{chess.turn() === 'w' ? '0-1' : '1-0'}</Text>
         : null}
        {chess.isDraw() ? (
          <Text style={styles.text}>1/2-1/2</Text>
        ) : null}
      </View>
      <View style={styles.board}>
        <Board/>
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
                  />
              }
          }))
        }
      </View>
      {isPromotiong ? <PromotionDialog color={getDifferentColor(gameState.player)} setPromotionPiece={handlePromotingPiece} /> : null}
    </SafeAreaView>
  );
}

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
