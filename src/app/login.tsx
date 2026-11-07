import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Mascot, Screen, TextField } from '@/components';
import { SENHA_DEMO } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { colors, radius, spacing, TOUCH_MIN } from '@/theme';

const EXEMPLOS = ['ana', 'carla', 'julia'];

// 2. Login (validação mock local)
export default function Login() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | undefined>();
  const [enviando, setEnviando] = useState(false);

  const entrar = async () => {
    setErro(undefined);
    if (!identificador.trim() || !senha) {
      setErro('Preencha usuária e senha.');
      return;
    }
    setEnviando(true);
    const r = await login(identificador, senha);
    setEnviando(false);
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    router.replace('/pergunta-chave');
  };

  return (
    <Screen>
      <View style={styles.topo}>
        <Mascot mood="feliz" size={110} />
        <AppText variant="titulo" accessibilityRole="header">
          Que bom te ver de novo!
        </AppText>
      </View>

      <TextField
        label="Nome de usuária"
        value={identificador}
        onChangeText={setIdentificador}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextField
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      {!!erro && (
        <AppText color="errorText" accessibilityLiveRegion="polite">
          {erro}
        </AppText>
      )}

      <Button title="Entrar" onPress={entrar} loading={enviando} />

      <View style={styles.demo}>
        <AppText variant="rotulo" color="textMuted">
          Protótipo: toque para preencher com uma usuária de exemplo (senha {SENHA_DEMO}).
        </AppText>
        <View style={styles.chips}>
          {EXEMPLOS.map((u) => (
            <Pressable
              key={u}
              onPress={() => {
                setIdentificador(u);
                setSenha(SENHA_DEMO);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Preencher com usuária ${u}`}
              style={styles.chip}
            >
              <AppText variant="rotulo" color="primaryDark">
                {u}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { alignItems: 'center', gap: spacing.md },
  demo: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.pinkLight,
    borderRadius: radius.md,
  },
  chips: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: {
    minHeight: TOUCH_MIN,
    minWidth: TOUCH_MIN,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
  },
});
