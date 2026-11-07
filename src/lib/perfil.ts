import perfilJson from '@/data/perfil-publico.json';
import type { PerfilTipo } from '@/types';

import { identificarPerfil, type PerfilIdentificado, type QuestaoPerfil, type RespostasPerfil } from './perfilPublico';

export { IDADE_CORTE_TRANSICAO, perfilPorIdade } from './recommendation';

export const QUESTOES_PERFIL = perfilJson as unknown as QuestaoPerfil[];

export function perfilDaUsuaria(idade: number, respostas: RespostasPerfil): PerfilIdentificado {
  return identificarPerfil(idade, respostas, QUESTOES_PERFIL);
}

// Textos que mudam conforme o perfil (tom de descoberta x valorização da experiência).
export const TEXTOS_PERFIL: Record<PerfilTipo, { nome: string; descricao: string; oQueMuda: string }> = {
  inicio: {
    nome: 'Início de carreira',
    descricao: 'Você está começando e tem muito para descobrir. Vamos apresentar cargos em cloud que talvez você ainda não conheça.',
    oQueMuda: 'Seus exemplos vão falar do dia a dia de estágio e de vagas júnior.',
  },
  transicao: {
    nome: 'Transição de carreira',
    descricao: 'Você já tem bagagem profissional, e ela conta muito. Vamos mostrar como sua experiência se encaixa em cloud.',
    oQueMuda: 'Seus exemplos vão ser diretos e conectar o que você já sabe fazer com as tarefas do novo cargo.',
  },
};

export function saudacaoPorPerfil(perfil: PerfilTipo, nome: string): string {
  if (perfil === 'transicao') {
    return `Oi, ${nome}! Sua experiência anterior já vale muito. Vamos transformá-la em carreira em cloud.`;
  }
  return `Oi, ${nome}! Vamos descobrir cargos em cloud que você talvez ainda não conhece.`;
}
