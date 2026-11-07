import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, AvatarPicker, Button, OptionCard, ProgressBar, Screen, TextField } from '@/components';
import { QUESTOES_PERFIL } from '@/lib/perfil';
import { todasRespondidas, type RespostasPerfil } from '@/lib/perfilPublico';
import { validarCadastro, type ErrosCadastro } from '@/lib/validacao';
import { useAuthStore } from '@/store/useAuthStore';
import { spacing } from '@/theme';
import type { AfinidadeTech } from '@/types';

const AFINIDADES: { id: AfinidadeTech; titulo: string }[] = [
  { id: 'nenhuma', titulo: 'Nenhuma' },
  { id: 'um_pouco', titulo: 'Um pouco' },
  { id: 'trabalho_com_isso', titulo: 'Trabalho com isso' },
];

// Cadastro em 2 passos: (1) dados da conta; (2) questionário de perfil do público.
export default function Cadastro() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [passo, setPasso] = useState<1 | 2>(1);

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [avatarId, setAvatarId] = useState<string | undefined>();
  const [afinidade, setAfinidade] = useState<AfinidadeTech | undefined>();
  const [respostas, setRespostas] = useState<RespostasPerfil>({});

  const [erros, setErros] = useState<ErrosCadastro>({});
  const [erroGeral, setErroGeral] = useState<string | undefined>();
  const [enviando, setEnviando] = useState(false);

  // Passo 1 → valida os dados antes de ir para o questionário.
  const irParaPerfil = () => {
    setErroGeral(undefined);
    const e = validarCadastro({
      nome,
      idade,
      usuario,
      senha,
      temAvatar: !!avatarId,
      afinidadeEscolhida: !!afinidade,
    });
    setErros(e);
    if (Object.keys(e).length === 0) setPasso(2);
  };

  // Passo 2 → cria a conta já com o perfil identificado.
  const criarConta = async () => {
    if (!avatarId || !afinidade || !todasRespondidas(respostas, QUESTOES_PERFIL)) return;
    setEnviando(true);
    const r = await register({
      nome,
      idade: Number(idade),
      usuario,
      senha,
      avatarId,
      afinidadeTech: afinidade,
      respostasPerfil: respostas,
    });
    setEnviando(false);

    if (!r.ok) {
      // Usuária repetida: volta ao passo 1 para trocar o nome de usuária.
      setErroGeral(r.erro);
      setPasso(1);
      return;
    }
    router.replace('/perfil-identificado');
  };

  return (
    <Screen>
      <ProgressBar valor={passo / 2} rotulo={`Passo ${passo} de 2`} />
      <AppText variant="rotulo" color="textMuted">
        Passo {passo} de 2 · {passo === 1 ? 'Sua conta' : 'Seu perfil'}
      </AppText>

      {passo === 1 ? (
        <>
          <AppText color="textMuted">
            Protótipo: os dados ficam só neste aparelho. Pode usar informações fictícias.
          </AppText>

          <TextField label="Nome" value={nome} onChangeText={setNome} erro={erros.nome} autoComplete="name" />
          <TextField
            label="Idade"
            value={idade}
            onChangeText={setIdade}
            erro={erros.idade}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TextField
            label="Nome de usuária"
            value={usuario}
            onChangeText={setUsuario}
            erro={erros.usuario ?? erroGeral}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextField
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            secureTextEntry
            autoCapitalize="none"
          />

          <View style={styles.bloco}>
            <AppText variant="subtitulo">Escolha seu avatar</AppText>
            <AvatarPicker selecionado={avatarId} onSelect={setAvatarId} />
            {!!erros.temAvatar && (
              <AppText variant="legenda" color="errorText" accessibilityLiveRegion="polite">
                {erros.temAvatar}
              </AppText>
            )}
          </View>

          <View style={styles.bloco}>
            <AppText variant="subtitulo">Qual sua afinidade com tech?</AppText>
            <View style={styles.bloco} accessibilityRole="radiogroup">
              {AFINIDADES.map((a) => (
                <OptionCard
                  key={a.id}
                  titulo={a.titulo}
                  selecionado={afinidade === a.id}
                  onPress={() => setAfinidade(a.id)}
                />
              ))}
            </View>
            {!!erros.afinidadeEscolhida && (
              <AppText variant="legenda" color="errorText" accessibilityLiveRegion="polite">
                {erros.afinidadeEscolhida}
              </AppText>
            )}
          </View>

          <Button title="Continuar" onPress={irParaPerfil} />
        </>
      ) : (
        <>
          <AppText variant="titulo" accessibilityRole="header">
            Conte um pouco sobre você
          </AppText>
          <AppText color="textMuted">
            São 3 perguntas rápidas. Com elas, ajustamos os exemplos e o jeito de falar com você.
          </AppText>

          {QUESTOES_PERFIL.map((q) => (
            <View key={q.id} style={styles.bloco}>
              <AppText variant="subtitulo">{q.pergunta}</AppText>
              <View style={styles.bloco} accessibilityRole="radiogroup" accessibilityLabel={q.pergunta}>
                {q.opcoes.map((o) => (
                  <OptionCard
                    key={o.id}
                    titulo={o.texto}
                    selecionado={respostas[q.id] === o.id}
                    onPress={() => setRespostas((r) => ({ ...r, [q.id]: o.id }))}
                  />
                ))}
              </View>
            </View>
          ))}

          <Button
            title="Criar conta"
            onPress={criarConta}
            loading={enviando}
            disabled={!todasRespondidas(respostas, QUESTOES_PERFIL)}
            accessibilityHint="Responda as 3 perguntas para continuar"
          />
          <Button title="Voltar" variant="ghost" onPress={() => setPasso(1)} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: spacing.md },
});
