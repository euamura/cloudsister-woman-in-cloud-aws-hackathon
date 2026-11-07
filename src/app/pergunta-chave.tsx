import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Mascot, Screen } from '@/components';
import { saudacaoPorPerfil } from '@/lib/perfil';
import { useAuthStore, useUsuariaAtual } from '@/store/useAuthStore';
import { spacing } from '@/theme';

// 3. Pergunta-chave. Nesta fase a tela existe e mostra a saudação personalizada
// por perfil; os caminhos "Sim"/"Não" são ligados na Fase 2.
export default function PerguntaChave() {
  const router = useRouter();
  const usuaria = useUsuariaAtual();
  const logout = useAuthStore((s) => s.logout);

  const sair = () => {
    logout();
    router.replace('/');
  };

  return (
    <Screen semHeader>
      <View style={styles.topo}>
        {usuaria && <Avatar avatarId={usuaria.avatarId} size={64} />}
        <Mascot mood="pensativo" size={120} />
        <AppText variant="subtitulo" color="textMuted" align="center">
          {usuaria
            ? saudacaoPorPerfil(usuaria.perfil, usuaria.nome)
            : 'Oi! Você está explorando como convidada.'}
        </AppText>
      </View>

      <AppText variant="titulo" align="center" accessibilityRole="header">
        Você já sabe o que quer seguir na área de tech?
      </AppText>

      <View style={styles.acoes}>
        <Button title="Sim, já sei" onPress={() => router.push('/escolha-trilha')} />
        <Button title="Ainda não" variant="secondary" onPress={() => router.push('/questionario')} />
      </View>

      <Button title={usuaria ? 'Sair da conta' : 'Voltar ao início'} variant="ghost" onPress={sair} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { alignItems: 'center', gap: spacing.md },
  acoes: { gap: spacing.md },
});
