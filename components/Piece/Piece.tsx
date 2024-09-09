import React from "react";
import { Image, StyleSheet } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureHandlerRootView, GestureDetector } from "react-native-gesture-handler";

import { PIECES } from "@/constants/Pieces";
import { Vector } from "react-native-redash";
import { toPosition } from "@/utils/toPosition";
import { SIZE } from "@/constants/Size";
import { PieceName } from "@/constants/types";

interface PieceProps {
    id: PieceName;
    position: Vector;
    handleMove: (from: string, to: string, resetPosition: () => void) => void
};

export const Piece = ({ id, position, handleMove }: PieceProps) => {
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
    return (
        <GestureHandlerRootView style={[styles.root]}>
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
    },
    piece: {
        width: SIZE - 2,
        height: SIZE - 2,
    },
});