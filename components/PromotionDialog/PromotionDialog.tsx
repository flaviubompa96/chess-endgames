import { PIECES } from "@/constants/Pieces";
import { BlackPiece, WhitePiece } from "@/constants/types";
import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";

interface Props {
    color: 'w' | 'b',
    setPromotionPiece: (value: string) => void
}
export const PromotionDialog = ({color, setPromotionPiece}: Props) => {
    const pieces: WhitePiece[] | BlackPiece[] = color === 'w' ? ['bq', 'br', 'bn', 'bb'] : ['wq', 'wr', 'wn', 'wb'];
    return (
        <View style={styles.root}>
            <Text style={styles.text}>Choose the promoting piece</Text>
            <View style={styles.piecesContainer}>
                {pieces.map(piece => 
                    <TouchableOpacity 
                        onPress={() => setPromotionPiece(piece)} 
                        activeOpacity={0.8}
                        key={`promoting-${piece}`}
                    >
                        <Image source={PIECES[piece]} style={styles.piece} />
                    </TouchableOpacity>
                )}
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 40,
    },
    piece: {
        width: 30,
        height: 30,
        margin: 5,
        alignContent: 'center',
        backgroundColor: 'gray'
    },
    piecesContainer: {
        flexDirection: 'row',
        padding: 5,
    },
    text: {
        justifyContent: 'center',
        fontSize: 15,
        alignSelf: 'center',
        marginHorizontal: 5,
    }
});