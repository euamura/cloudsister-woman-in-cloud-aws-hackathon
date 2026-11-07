import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme';

export type MascotMood = 'feliz' | 'animado' | 'triste' | 'pensativo';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
}

// Mascote original: uma nuvem simpática que flutua e reage ao humor (acerto/erro).
export function Mascot({ mood = 'feliz', size = 140 }: MascotProps) {
  const S = size;
  const reduzir = useReducedMotion();
  const flutuar = useSharedValue(0);
  const escala = useSharedValue(1);

  useEffect(() => {
    if (reduzir) return;
    flutuar.value = withRepeat(
      withSequence(withTiming(-6, { duration: 1200 }), withTiming(0, { duration: 1200 })),
      -1,
      false,
    );
  }, [flutuar, reduzir]);

  useEffect(() => {
    if (reduzir) return;
    escala.value = withSequence(withSpring(1.12), withSpring(1));
  }, [mood, escala, reduzir]);

  const animado = useAnimatedStyle(() => ({
    transform: [{ translateY: flutuar.value }, { scale: escala.value }],
  }));

  const bola = (d: number, left: number, top: number): ViewStyle => ({
    position: 'absolute',
    width: d * S,
    height: d * S,
    borderRadius: (d * S) / 2,
    left: left * S,
    top: top * S,
    backgroundColor: colors.mascot,
  });

  const olho = (left: number): ViewStyle => ({
    position: 'absolute',
    width: (mood === 'animado' ? 0.085 : 0.07) * S,
    height: (mood === 'animado' ? 0.11 : 0.09) * S,
    borderRadius: 0.05 * S,
    left: left * S,
    top: 0.36 * S,
    backgroundColor: colors.mascotDark,
  });

  const bochecha = (left: number): ViewStyle => ({
    position: 'absolute',
    width: 0.09 * S,
    height: 0.055 * S,
    borderRadius: 0.03 * S,
    left: left * S,
    top: 0.47 * S,
    backgroundColor: colors.pink,
    opacity: 0.7,
  });

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Nuvem, mascote do CloudSister"
      style={[{ width: S, height: 0.78 * S }, animado]}
    >
      <View
        style={{
          position: 'absolute',
          left: 0.15 * S,
          top: 0.74 * S,
          width: 0.7 * S,
          height: 0.05 * S,
          borderRadius: 0.03 * S,
          backgroundColor: 'rgba(109,40,217,0.12)',
        }}
      />
      <View style={bola(0.42, 0.06, 0.3)} />
      <View style={bola(0.56, 0.22, 0.02)} />
      <View style={bola(0.44, 0.52, 0.26)} />
      <View
        style={{
          position: 'absolute',
          left: 0.05 * S,
          top: 0.38 * S,
          width: 0.9 * S,
          height: 0.34 * S,
          borderRadius: 0.17 * S,
          backgroundColor: colors.mascot,
        }}
      />
      <View style={olho(0.33)} />
      <View style={olho(0.6)} />
      <View style={bochecha(0.22)} />
      <View style={bochecha(0.69)} />
      <Boca mood={mood} S={S} />
    </Animated.View>
  );
}

function Boca({ mood, S }: { mood: MascotMood; S: number }) {
  const base: ViewStyle = { position: 'absolute', top: 0.5 * S, left: 0.41 * S };

  if (mood === 'animado') {
    return (
      <View
        style={[
          base,
          {
            width: 0.18 * S,
            height: 0.09 * S,
            borderBottomLeftRadius: 0.09 * S,
            borderBottomRightRadius: 0.09 * S,
            backgroundColor: colors.mascotDark,
          },
        ]}
      />
    );
  }
  if (mood === 'triste') {
    return (
      <View
        style={[
          base,
          styles.arco,
          {
            top: 0.53 * S,
            width: 0.18 * S,
            height: 0.07 * S,
            borderTopWidth: 3,
            borderTopLeftRadius: 0.09 * S,
            borderTopRightRadius: 0.09 * S,
          },
        ]}
      />
    );
  }
  if (mood === 'pensativo') {
    return (
      <View
        style={[
          base,
          {
            left: 0.46 * S,
            width: 0.08 * S,
            height: 0.08 * S,
            borderRadius: 0.04 * S,
            borderWidth: 3,
            borderColor: colors.mascotDark,
          },
        ]}
      />
    );
  }
  return (
    <View
      style={[
        base,
        styles.arco,
        {
          width: 0.18 * S,
          height: 0.08 * S,
          borderBottomWidth: 3,
          borderBottomLeftRadius: 0.09 * S,
          borderBottomRightRadius: 0.09 * S,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  arco: { borderColor: colors.mascotDark },
});
