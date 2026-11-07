import type { PerfilTipo } from '../types';

// Função pura e sem dependências de Expo/React: testável direto no Node.

export type Eixo = 'architect' | 'security';
export type TrilhaId = 'cloud-architect' | 'cloud-security';

export interface Opcao {
  id: string;
  texto: string;
  pontos: Partial<Record<Eixo, number>>;
  competencia?: string;
}
export interface Questao {
  id: string;
  pergunta: string;
  opcoes: Opcao[];
}
// questaoId -> opcaoId
export type Respostas = Record<string, string>;

export interface ResultadoRecomendacao {
  trilhaRecomendada: TrilhaId;
  afinidade: { architect: number; security: number };
  perfil: PerfilTipo;
  competenciasTransferiveis: string[];
}

export const IDADE_CORTE_TRANSICAO = 30;

export function perfilPorIdade(idade: number): PerfilTipo {
  return idade >= IDADE_CORTE_TRANSICAO ? 'transicao' : 'inicio';
}

// `perfilDefinido` vem do questionário de perfil do cadastro; sem ele, usa a idade.
export function recomendar(
  respostas: Respostas,
  idade: number,
  questoes: Questao[],
  perfilDefinido?: PerfilTipo,
): ResultadoRecomendacao {
  let architect = 0;
  let security = 0;
  const competencias: string[] = [];

  for (const q of questoes) {
    const opcao = q.opcoes.find((o) => o.id === respostas[q.id]);
    if (!opcao) continue;
    architect += opcao.pontos.architect ?? 0;
    security += opcao.pontos.security ?? 0;
    if (opcao.competencia && !competencias.includes(opcao.competencia)) {
      competencias.push(opcao.competencia);
    }
  }

  const total = architect + security;
  const pctArchitect = total === 0 ? 50 : Math.round((architect / total) * 100);
  const perfil = perfilDefinido ?? perfilPorIdade(idade);

  return {
    // Empate recomenda Architect (porta de entrada mais ampla).
    trilhaRecomendada: security > architect ? 'cloud-security' : 'cloud-architect',
    afinidade: { architect: pctArchitect, security: 100 - pctArchitect },
    perfil,
    competenciasTransferiveis: perfil === 'transicao' ? competencias : [],
  };
}
