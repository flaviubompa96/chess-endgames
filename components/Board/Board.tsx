import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    const offset = row % 2 === 0 ? 1 : 0;
    const bgColor = (col + offset) % 2 === 0 ? colors.WHITE : colors.BLACK;
    const textColor = (col + offset) % 2 === 0 ? colors.BLACK : colors.WHITE;
    return (
        <View style={[styles.root, styles.square, { backgroundColor: bgColor }]}>
            <Text style={{
                color: textColor,
                fontWeight: '500', 
                opacity: col === 0 ? 1 : 0
            }}>{8 -row}</Text>
            <Text style={{
                color: textColor, 
                fontWeight: '500', 
                alignSelf: 'flex-end', 
                opacity: row === 7 ? 1 : 0
            }}>{String.fromCharCode('a'.charCodeAt(0) + col)}</Text>
        </View>
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
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    square: {
        padding: 4,
        justifyContent: 'space-between',
    },
});