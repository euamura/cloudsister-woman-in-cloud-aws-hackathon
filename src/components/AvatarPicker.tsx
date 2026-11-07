import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AVATARES } from '@/lib/avatares';
import { colors, radius, spacing, TOUCH_MIN } from '@/theme';

interface AvatarPickerProps {
  selecionado?: string;
  onSelect: (id: string) => void;
}

// Grade 4x2 com os 8 avatares ilustrados.
export function AvatarPicker({ selecionado, onSelect }: AvatarPickerProps) {
  return (
    <View style={styles.grade} accessibilityRole="radiogroup">
      {AVATARES.map((a) => {
        const ativo = a.id === selecionado;
        return (
          <Pressable
            key={a.id}
            onPress={() => onSelect(a.id)}
            accessibilityRole="radio"
            accessibilityLabel={`Avatar ${a.rotulo}`}
            accessibilityState={{ selected: ativo }}
            style={[styles.item, { backgroundColor: a.cor }, ativo && styles.ativo]}
          >
            <Text style={styles.emoji}>{a.emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  item: {
    width: 64,
    height: 64,
    minWidth: TOUCH_MIN,
    minHeight: TOUCH_MIN,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  ativo: { borderColor: colors.primaryDark },
  emoji: { fontSize: 30 },
});
