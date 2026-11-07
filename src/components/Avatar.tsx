import { StyleSheet, Text, View } from 'react-native';

import { obterAvatar } from '@/lib/avatares';

interface AvatarProps {
  avatarId?: string;
  size?: number;
}

export function Avatar({ avatarId, size = 56 }: AvatarProps) {
  const avatar = obterAvatar(avatarId);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Avatar ${avatar.rotulo}`}
      style={[
        styles.centro,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: avatar.cor },
      ]}
    >
      <Text style={{ fontSize: size * 0.5 }}>{avatar.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center' },
});
