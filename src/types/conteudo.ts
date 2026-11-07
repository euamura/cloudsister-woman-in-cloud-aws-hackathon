// Schema do conteúdo em /data/trilhas/<trilha>.json (seção 9 da spec).
import type { TrilhaId } from '../lib/recommendation';

export type NivelPilula = 'basico' | 'intermediario' | 'avancado';
// MVP: só múltipla escolha e verdadeiro/falso.
export type TipoQuestao = 'multipla_escolha' | 'verdadeiro_falso';
export type CategoriaQuestao = 'tecnica' | 'negocio';

export interface Flashcard {
  frente: string;
  verso: string;
}

export interface QuestaoPilula {
  id: string;
  tipo: TipoQuestao;
  categoria: CategoriaQuestao;
  cenario: string;
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
  referenciaConceito: string;
}

export interface Pilula {
  id: string;
  ordem: number;
  titulo: string;
  nivel: NivelPilula;
  duracaoMin: number;
  conceito: { texto: string; exemplo: string };
  flashcards: Flashcard[];
  questoes: QuestaoPilula[];
}

export interface Trilha {
  id: TrilhaId;
  titulo: string;
  // Títulos das páginas da AWS consultadas via AWS Knowledge MCP.
  fontes: string[];
  pilulas: Pilula[];
}
