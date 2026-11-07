import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  // true = conteúdo rolável (formulários); false = layout fixo.
  scroll?: boolean;
  fundo?: string;
  // true quando a rota não tem header nativo: respeita a área da barra de status.
  semHeader?: boolean;
}

export function Screen({
  children,
  scroll = true,
  fundo = colors.bgSoft,
  semHeader = false,
}: ScreenProps) {
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: fundo }]}
      edges={semHeader ? ['top', 'bottom', 'left', 'right'] : ['bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, styles.conteudo]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  conteudo: { flexGrow: 1, padding: spacing.xl, gap: spacing.lg },
});
