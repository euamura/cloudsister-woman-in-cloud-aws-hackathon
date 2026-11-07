import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, radius, spacing } from '@/theme';

import { AppText } from './AppText';

interface FlashcardProps {
  frente: string;
  verso: string;
  virado: boolean;
  onVirar: () => void;
}

// Cartão que gira no eixo Y ao tocar. A troca de face acontece no meio do giro (90°).
export function Flashcard({ frente, verso, virado, onVirar }: FlashcardProps) {
  const reduzir = useReducedMotion();
  const giro = useSharedValue(0);

  useEffect(() => {
    const alvo = virado ? 180 : 0;
    giro.value = reduzir ? alvo : withTiming(alvo, { duration: 420 });
  }, [virado, reduzir, giro]);

  const estiloFrente = useAnimatedStyle(() => ({
    opacity: giro.value < 90 ? 1 : 0,
    transform: [{ perspective: 800 }, { rotateY: `${giro.value}deg` }],
  }));
  const estiloVerso = useAnimatedStyle(() => ({
    opacity: giro.value >= 90 ? 1 : 0,
    transform: [{ perspective: 800 }, { rotateY: `${giro.value - 180}deg` }],
  }));

  return (
    <Pressable
      onPress={onVirar}
      accessibilityRole="button"
      accessibilityLabel={virado ? `Resposta: ${verso}` : `Pergunta: ${frente}`}
      accessibilityHint={virado ? 'Toque para ver a pergunta de novo' : 'Toque para ver a resposta'}
      style={styles.area}
    >
      <Animated.View style={[styles.face, styles.frente, estiloFrente]}>
        <AppText variant="subtitulo" align="center">{frente}</AppText>
        <AppText variant="legenda" color="textMuted">Toque para virar</AppText>
      </Animated.View>
      <Animated.View style={[styles.face, styles.verso, estiloVerso]}>
        <AppText color="white" align="center">{verso}</AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  area: { height: 220 },
  face: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  frente: { backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.borderStrong },
  verso: { backgroundColor: colors.primaryDark },
});
