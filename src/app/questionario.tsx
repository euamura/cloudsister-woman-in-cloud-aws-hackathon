import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Mascot, OptionCard, ProgressBar, Screen } from '@/components';
import questionarioJson from '@/data/questionario.json';
import { recomendar, type Questao, type Respostas } from '@/lib/recommendation';
import { useAuthStore, useUsuariaAtual } from '@/store/useAuthStore';
import { useJornadaStore } from '@/store/useJornadaStore';
import { spacing } from '@/theme';

const QUESTOES = questionarioJson as unknown as Questao[];
const IDADE_PADRAO_CONVIDADA = 25;
// Pergunta de experiência anterior: já respondida no questionário de perfil do cadastro.
const ID_PERGUNTA_EXPERIENCIA = 'q4';

// 4. Questionário de diagnóstico (avança ao tocar).
export default function Questionario() {
  const router = useRouter();
  const usuaria = useUsuariaAtual();
  const definirResultado = useJornadaStore((s) => s.definirResultado);
  const concluirConvidada = useAuthStore((s) => s.marcarQuestionarioConvidada);

  // Quem fez o perfil no cadastro não responde a experiência de novo.
  const [questoes] = useState(() =>
    usuaria?.respostasPerfil ? QUESTOES.filter((q) => q.id !== ID_PERGUNTA_EXPERIENCIA) : QUESTOES,
  );
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({});
  const questao = questoes[indice];

  const responder = (opcaoId: string) => {
    const novas = { ...respostas, [questao.id]: opcaoId };
    setRespostas(novas);

    if (indice < questoes.length - 1) {
      setIndice(indice + 1);
      return;
    }
    const r = recomendar(novas, usuaria?.idade ?? IDADE_PADRAO_CONVIDADA, questoes, usuaria?.perfil);
    // Soma as competências declaradas no cadastro às do diagnóstico (sem repetir).
    if (r.perfil === 'transicao') {
      const doCadastro = usuaria?.competenciasTransferiveis ?? [];
      r.competenciasTransferiveis = [...new Set([...doCadastro, ...r.competenciasTransferiveis])];
    }
    definirResultado(r);
    concluirConvidada();
    router.replace('/resultado');
  };

  return (
    <Screen>
      <ProgressBar
        valor={indice / questoes.length}
        rotulo={`Questão ${indice + 1} de ${questoes.length}`}
      />
      <View style={styles.topo}>
        <Mascot mood="pensativo" size={90} />
        <AppText variant="rotulo" color="textMuted">
          Questão {indice + 1} de {questoes.length}
        </AppText>
        <AppText variant="titulo" align="center" accessibilityRole="header">
          {questao.pergunta}
        </AppText>
      </View>

      <View style={styles.opcoes} accessibilityRole="radiogroup">
        {questao.opcoes.map((o) => (
          <OptionCard
            key={`${questao.id}-${o.id}`}
            titulo={o.texto}
            selecionado={false}
            onPress={() => responder(o.id)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { alignItems: 'center', gap: spacing.sm },
  opcoes: { gap: spacing.md },
});
