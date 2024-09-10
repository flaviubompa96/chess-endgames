import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { runOnJS } from "react-native-reanimated";
import { useGame } from "@/hooks/useGame";

const colors = {
    WHITE: 'rgb(100, 133, 68)',
    BLACK: 'rgb(230, 233, 198)',
};

interface RowProps {
    row: number;
}

interface SquareProps {
    row: number;
    col: number;
}

const Square = ({ row, col }: SquareProps) => {
    const { highlightedPiece, handleMove, setHighlightedPiece, setPossibleMoves, checkPossibleMove } = useGame();
    const offset = row % 2 === 0 ? 1 : 0;
    const bgColor = (col + offset) % 2 === 0 ? colors.WHITE : colors.BLACK;
    const textColor = (col + offset) % 2 === 0 ? colors.BLACK : colors.WHITE;
    const colChar = String.fromCharCode('a'.charCodeAt(0) + col);
    const squareName = `${colChar}${8 - row}`;
    const isPossibleMove = checkPossibleMove(squareName);
    const handlePress = () => {
        if(highlightedPiece) {
            if (isPossibleMove) {
                runOnJS(handleMove)(highlightedPiece.from, squareName, () => {});
            }
            else {
                setHighlightedPiece(null);
                setPossibleMoves([]);
            }
        }
    }
    return (
        <TouchableOpacity 
            style={[styles.root, styles.square, { backgroundColor: squareName === highlightedPiece?.from ? 'yellow' : bgColor }]}
            activeOpacity={1}
            onPress={handlePress}
        >
            <Text style={{
                color: textColor,
                fontWeight: '500', 
                opacity: col === 0 ? 1 : 0
            }}>{8 -row}</Text>
            {isPossibleMove
                ?   <View style={styles.circleRoot}>
                        <View style={styles.circle} />
                    </View>
                : null}
            <Text style={{
                color: textColor, 
                fontWeight: '500', 
                alignSelf: 'flex-end', 
                opacity: row === 7 ? 1 : 0
            }}>{colChar}</Text>
            
        </TouchableOpacity>
    );
};

const Row = ({ row }: RowProps) => {
    return (
        <View style={styles.row}>
            {
                new Array(8).fill(0).map((_, col) => (
                    <Square row={row} col={col} key={col} />
                ))
            }
        </View>
    );
};

export const Board = () => {
    return (
        <View style={styles.root}>
            {
                new Array(8).fill(0).map((_, row) => (
                    <Row key={row} row={row} />
                ))
            }
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    square: {
        padding: 1,
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    circle: {
        backgroundColor: 'rgba(0,0,0,.4)',
        borderRadius: 5,
        width: 10, 
        height: 10,
        alignSelf: 'center',
    },
    circleRoot: {
        justifyContent: 'center',
        flex: 1,
        zIndex: 100
    },
});