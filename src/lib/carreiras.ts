import type { TrilhaId } from './recommendation';

export interface Carreira {
  id: TrilhaId;
  titulo: string;
  salario: string; // fictício
  rotina: string;
  habilidades: string[];
  diaTipico: string;
  primeirosPassos: string[];
}

export const CARREIRAS: Record<TrilhaId, Carreira> = {
  'cloud-architect': {
    id: 'cloud-architect',
    titulo: 'Cloud / Solutions Architect',
    salario: 'R$ 9.000 a R$ 16.000 (valor fictício)',
    rotina: 'Conversa com clientes e desenha soluções na nuvem.',
    habilidades: ['Comunicação', 'Visão de negócio', 'Desenho de arquitetura'],
    diaTipico:
      'Manhã entendendo a dor de um cliente, tarde desenhando a solução e estimando custos.',
    primeirosPassos: [
      'Entender cloud: regiões e zonas',
      'Conhecer serviços essenciais',
      'Aprender os 6 pilares Well-Architected',
    ],
  },
  'cloud-security': {
    id: 'cloud-security',
    titulo: 'Cloud Security Engineer',
    salario: 'R$ 10.000 a R$ 18.000 (valor fictício)',
    rotina: 'Protege acessos e dados e investiga alertas de segurança.',
    habilidades: ['Atenção a detalhes', 'Análise de riscos', 'Investigação'],
    diaTipico:
      'Manhã revisando permissões e logs, tarde investigando um alerta e ajustando regras.',
    primeirosPassos: [
      'Entender responsabilidade compartilhada',
      'Dominar identidade e acesso (IAM)',
      'Proteger dados com criptografia',
    ],
  },
};

export const ORDEM_TRILHAS: TrilhaId[] = ['cloud-architect', 'cloud-security'];

export function outraTrilha(id: TrilhaId): TrilhaId {
  return id === 'cloud-architect' ? 'cloud-security' : 'cloud-architect';
}
