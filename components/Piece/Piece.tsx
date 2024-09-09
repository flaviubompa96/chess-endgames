import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureHandlerRootView, GestureDetector } from "react-native-gesture-handler";

import { PIECES } from "@/constants/Pieces";
import { Vector } from "react-native-redash";
import { toPosition } from "@/utils/toPosition";
import { SIZE } from "@/constants/Size";
import { HighilghtedPiece, PieceName } from "@/constants/types";

interface PieceProps {
    id: PieceName;
    position: Vector;
    handleMove: (from: string, to: string, resetPosition: () => void) => void;
    highlightedPiece: HighilghtedPiece | null;
    setHighlightedPiece: (value: HighilghtedPiece | null) => void;
    possibleMoves: string[];
};

export const Piece = ({ id, position, handleMove, highlightedPiece, setHighlightedPiece, possibleMoves }: PieceProps) => {
    const originalX = useSharedValue(position.x);
    const originalY = useSharedValue(position.y);
    const translateX = useSharedValue(position.x);
    const translateY = useSharedValue(position.y);

    const pieceStyle = useAnimatedStyle(() => ({
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }));
  
    const resetPiecePosition = () => {
      translateX.value = withTiming(originalX.value);
      translateY.value = withTiming(originalY.value);
    };
  
    const onGestureEvent = Gesture.Pan()
      .onBegin(() => {
        originalX.value = translateX.value;
        originalY.value = translateY.value;
      })
      .onChange(({ translationX, translationY }) => {
        translateX.value = translationX + originalX.value;
        translateY.value = translationY + originalY.value;
      })
      .onEnd(() => {
        const from = toPosition({ x: originalX.value, y: originalY.value });
        const to = toPosition({ x: translateX.value, y: translateY.value });
        runOnJS(handleMove)(from, to, resetPiecePosition);
      });

    const handlePress = () => {
        if(!highlightedPiece) {
            setHighlightedPiece({
                piece: id[1],
                from: toPosition({ x: originalX.value, y: originalY.value })
            })
        }
        else {
            const to = toPosition({ x: originalX.value, y: originalY.value });
            const possibleMove = highlightedPiece?.piece === 'p' ? to : `${highlightedPiece?.piece.toLocaleUpperCase()}${to}`;
            const possibleCapturingMove = highlightedPiece?.piece === 'p' ? `${highlightedPiece.from[0]}x${to}` : `${highlightedPiece?.piece.toLocaleUpperCase()}x${to}`;
            const movesToCheck = [possibleMove, possibleCapturingMove, `${possibleMove}+`, `${possibleMove}#`, `${possibleCapturingMove}+`, `${possibleCapturingMove}#`]
            if (movesToCheck.some(item => possibleMoves.includes(item))) {
                runOnJS(handleMove)(highlightedPiece.from, to, resetPiecePosition);
            }
            else setHighlightedPiece(null);
        }
    }
    return (
        <TouchableOpacity 
            style={styles.root} 
            onPress={handlePress}
            activeOpacity={1}
        >
            <GestureHandlerRootView >
                <GestureDetector gesture={onGestureEvent}>
                        <Animated.View style={pieceStyle}>
                            <Image source={PIECES[id]} style={styles.piece} />
                        </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
    },
    piece: {
        width: SIZE - 2,
        height: SIZE - 2,
    },
});