import type { ProgressoConvidada } from '@/types';

export const PROGRESSO_CONVIDADA_INICIAL: ProgressoConvidada = {
  questionarioConcluido: false,
  pilulasConcluidas: 0,
};

// Convidada pode fazer o questionário e a 1ª pílula. Depois da 1ª pílula
// (venha ela do questionário ou da escolha direta), pedimos a conta.
export function convidadaPrecisaCriarConta(p: ProgressoConvidada): boolean {
  return p.pilulasConcluidas >= 1;
}
