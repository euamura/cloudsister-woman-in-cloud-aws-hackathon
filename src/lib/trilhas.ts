import architectJson from '@/data/trilhas/cloud-architect.json';
import securityJson from '@/data/trilhas/cloud-security.json';
import type { Pilula, Trilha } from '@/types/conteudo';

import type { TrilhaId } from './recommendation';

// O app lê só estes JSON (gerados com apoio do AWS Knowledge MCP); nada de MCP em runtime.
export const TRILHAS: Record<TrilhaId, Trilha> = {
  'cloud-architect': architectJson as unknown as Trilha,
  'cloud-security': securityJson as unknown as Trilha,
};

export function obterPilula(id: string): { trilha: Trilha; pilula: Pilula } | undefined {
  for (const trilha of Object.values(TRILHAS)) {
    const pilula = trilha.pilulas.find((p) => p.id === id);
    if (pilula) return { trilha, pilula };
  }
  return undefined;
}

export const ROTULO_NIVEL: Record<Pilula['nivel'], string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};
