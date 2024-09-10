import React from 'react';
import { StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EndGame } from '@/components/Game/EndGame';
import { GameProvider } from '@/hooks/useGame';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <GameProvider>
        <EndGame />
      </GameProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    justifyContent: 'center',
  },
});
