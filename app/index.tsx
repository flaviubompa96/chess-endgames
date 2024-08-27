import { StyleSheet, Dimensions, View, Text} from 'react-native';

import { Board } from '@/components/Board/Board';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chess } from 'chess.js';
import { useCallback, useEffect, useState } from 'react';
import { useConst } from '@/hooks/useConst';
import { Piece, SIZE } from '@/components/Piece/Piece';
import { runOnJS } from 'react-native-reanimated';

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  //const chess = useConst(() => new Chess('1K6/7r/1k6/8/8/8/8/8 b KQkq - 0 1'))
  const chess = useConst(() => new Chess())
  const [gameState, setGameState] = useState({
      player: 'w',
      board: chess.board(),
  });

  const handleMove = useCallback((from: string, to: string, resetPosition: () => void) => {
    try {
      const moves = chess.moves({ verbose: true });
      const move = moves.find(m => m.from === from && m.to === to);
  
      if (move) {
        chess.move(move);
        setGameState({
          player: chess.turn(),
          board: chess.board(),
        });
      } else {
        runOnJS(resetPosition)();
      }
    } catch (error) {
      runOnJS(resetPosition)();
    }
  }, [gameState, chess]);
  
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.result}>
        {chess.isCheckmate() ? <Text style={{fontSize: 30}}>{chess.turn() === 'w' ? '0-1' : '1-0'}</Text>
         : null}
        {chess.isDraw() ? (
          <Text style={{fontSize: 30}}>1/2-1/2</Text>
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
                      chess={chess}
                      setGameState={setGameState}
                      handleMove={handleMove}
                  />
              }
          }))
        }
      </View>
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
  }
});
