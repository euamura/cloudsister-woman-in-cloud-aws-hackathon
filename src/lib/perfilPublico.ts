import type { PerfilTipo } from '../types';

// Identifica o perfil do público no cadastro (função pura, testável no Node).
// Regra: idade soma 2 pontos no perfil esperado para a faixa (até 29 = início,
// 30+ = transição); as respostas somam pontos e podem mudar o resultado.
// Empate: vale a faixa de idade.

export interface OpcaoPerfil {
  id: string;
  texto: string;
  pontos: Partial<Record<PerfilTipo, number>>;
  competencia?: string;
}

export interface QuestaoPerfil {
  id: string;
  pergunta: string;
  opcoes: OpcaoPerfil[];
}

// questaoId -> opcaoId
export type RespostasPerfil = Record<string, string>;

export interface PerfilIdentificado {
  perfil: PerfilTipo;
  pontos: Record<PerfilTipo, number>;
  competenciasTransferiveis: string[];
}

export const IDADE_CORTE = 30;
export const PESO_IDADE = 2;

export function identificarPerfil(
  idade: number,
  respostas: RespostasPerfil,
  questoes: QuestaoPerfil[],
): PerfilIdentificado {
  const porIdade: PerfilTipo = idade >= IDADE_CORTE ? 'transicao' : 'inicio';
  const pontos: Record<PerfilTipo, number> = { inicio: 0, transicao: 0 };
  pontos[porIdade] += PESO_IDADE;

  const competencias: string[] = [];
  for (const q of questoes) {
    const opcao = q.opcoes.find((o) => o.id === respostas[q.id]);
    if (!opcao) continue;
    pontos.inicio += opcao.pontos.inicio ?? 0;
    pontos.transicao += opcao.pontos.transicao ?? 0;
    if (opcao.competencia && !competencias.includes(opcao.competencia)) {
      competencias.push(opcao.competencia);
    }
  }

  const perfil: PerfilTipo =
    pontos.transicao > pontos.inicio ? 'transicao' : pontos.inicio > pontos.transicao ? 'inicio' : porIdade;

  return { perfil, pontos, competenciasTransferiveis: competencias };
}

export function todasRespondidas(respostas: RespostasPerfil, questoes: QuestaoPerfil[]): boolean {
  return questoes.every((q) => q.opcoes.some((o) => o.id === respostas[q.id]));
}
