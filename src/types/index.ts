export type AfinidadeTech = 'nenhuma' | 'um_pouco' | 'trabalho_com_isso';

// "inicio" = começando a carreira; "transicao" = mudança ou recolocação.
// Definido no cadastro pela idade + questionário de perfil (lib/perfilPublico.ts).
export type PerfilTipo = 'inicio' | 'transicao';

export interface Usuaria {
  id: string;
  nome: string;
  idade: number;
  usuario: string;
  senhaHash: string;
  salt: string;
  avatarId: string;
  afinidadeTech: AfinidadeTech;
  perfil: PerfilTipo;
  // Respostas do questionário de perfil (questaoId -> opcaoId).
  respostasPerfil?: Record<string, string>;
  competenciasTransferiveis?: string[];
  descricao?: string;
  ehSeed: boolean;
  criadaEm: string;
}

// Formato do JSON em /data/usuarias-seed.json (sem senha: ela é gerada no seed).
export interface SeedUsuaria {
  id: string;
  nome: string;
  idade: number;
  usuario: string;
  afinidadeTech: AfinidadeTech;
  avatarId: string;
  descricao: string;
  respostasPerfil: Record<string, string>;
}

export interface DadosCadastro {
  nome: string;
  idade: number;
  usuario: string;
  senha: string;
  avatarId: string;
  afinidadeTech: AfinidadeTech;
  respostasPerfil: Record<string, string>;
}

export interface AvatarOpcao {
  id: string;
  emoji: string;
  cor: string;
  rotulo: string;
}

export interface ProgressoConvidada {
  questionarioConcluido: boolean;
  pilulasConcluidas: number;
}

export type Resultado = { ok: true } | { ok: false; erro: string };
