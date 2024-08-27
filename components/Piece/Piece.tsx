import React, { useCallback } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureHandlerRootView, GestureDetector } from "react-native-gesture-handler";

import { PIECES } from "@/constants/Pieces";
import { Vector } from "react-native-redash";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { toTranslation } from "@/utils/toTranslation";
import { toPosition } from "@/utils/toPosition";

interface PieceProps {
    id: Piece;
    position: Vector;
    chess: Chess;
    setGameState: any;
    handleMove: (from: string, to: string, resetPosition: () => void) => void
};

const { width } = Dimensions.get("window");
export const SIZE = width / 8;

export const Piece = ({ id, position, handleMove }: PieceProps) => {
    const originalX = useSharedValue(position.x);
    const originalY = useSharedValue(position.y);
    const translateX = useSharedValue(position.x);
    const translateY = useSharedValue(position.y);
  
    // Define the animated style
    const pieceStyle = useAnimatedStyle(() => ({
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }));
  
    // Function to reset the piece's position
    const resetPiecePosition = () => {
      translateX.value = withTiming(originalX.value);
      translateY.value = withTiming(originalY.value);
    };
  
    const onGestureEvent = Gesture.Pan()
      .onBegin(() => {
        // Save original position at the start of the gesture
        originalX.value = translateX.value;
        originalY.value = translateY.value;
      })
      .onChange(({ translationX, translationY }) => {
        // Update position as the user drags the piece
        translateX.value = translationX + originalX.value;
        translateY.value = translationY + originalY.value;
      })
      .onEnd(() => {
        // Convert the current position to board notation
        const from = toPosition({ x: originalX.value, y: originalY.value });
        const to = toPosition({ x: translateX.value, y: translateY.value });
  
        // Ensure resetPosition is passed correctly as a function to runOnJS
        runOnJS(handleMove)(from, to, resetPiecePosition);
      });
    return (
       <GestureHandlerRootView style={[styles.root, { flex: 1 }]}>
             <GestureDetector gesture={onGestureEvent}>
                <Animated.View style={pieceStyle}>
                    <Image source={PIECES[id]} style={styles.piece} />
                </Animated.View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        
    },
    piece: {
        width: SIZE,
        height: SIZE,
    },
});