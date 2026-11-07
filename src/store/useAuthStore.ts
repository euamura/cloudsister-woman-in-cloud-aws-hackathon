import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import seedJson from '@/data/usuarias-seed.json';
import { gerarId, gerarSalt, hashSenha, SENHA_DEMO } from '@/lib/auth';
import { PROGRESSO_CONVIDADA_INICIAL } from '@/lib/convidada';
import { perfilDaUsuaria } from '@/lib/perfil';
import { normalizar } from '@/lib/validacao';
import type { DadosCadastro, ProgressoConvidada, Resultado, SeedUsuaria, Usuaria } from '@/types';

const SEED_VERSAO = 2;

interface AuthState {
  users: Usuaria[];
  currentUserId: string | null;
  isGuest: boolean;
  seedVersao: number;
  progressoConvidada: ProgressoConvidada;

  seedUsers: () => Promise<void>;
  register: (dados: DadosCadastro) => Promise<Resultado>;
  login: (identificador: string, senha: string) => Promise<Resultado>;
  continueAsGuest: () => void;
  marcarQuestionarioConvidada: () => void;
  marcarPilulaConvidada: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      isGuest: false,
      seedVersao: 0,
      progressoConvidada: PROGRESSO_CONVIDADA_INICIAL,

      // Usuárias fictícias de exemplo (nenhum dado real). Ao mudar o seed, suba
      // SEED_VERSAO: as seeds são recriadas com os mesmos ids (sessão continua válida).
      seedUsers: async () => {
        if (get().seedVersao === SEED_VERSAO) return;
        const seeds = seedJson as unknown as SeedUsuaria[];
        const criadas = await Promise.all(
          seeds.map(async (s): Promise<Usuaria> => {
            const salt = gerarSalt();
            const identificado = perfilDaUsuaria(s.idade, s.respostasPerfil);
            return {
              ...s,
              salt,
              senhaHash: await hashSenha(SENHA_DEMO, salt),
              perfil: identificado.perfil,
              competenciasTransferiveis: identificado.competenciasTransferiveis,
              ehSeed: true,
              criadaEm: new Date().toISOString(),
            };
          }),
        );
        set((state) => ({
          users: [...state.users.filter((u) => !u.ehSeed), ...criadas],
          seedVersao: SEED_VERSAO,
        }));
      },

      register: async (dados) => {
        const usuario = normalizar(dados.usuario);

        if (get().users.some((u) => normalizar(u.usuario) === usuario)) {
          return { ok: false, erro: 'Esse nome de usuária já está em uso.' };
        }

        const salt = gerarSalt();
        const identificado = perfilDaUsuaria(dados.idade, dados.respostasPerfil);
        const nova: Usuaria = {
          id: gerarId(),
          nome: dados.nome.trim(),
          idade: dados.idade,
          usuario,
          salt,
          senhaHash: await hashSenha(dados.senha, salt),
          avatarId: dados.avatarId,
          afinidadeTech: dados.afinidadeTech,
          perfil: identificado.perfil,
          respostasPerfil: dados.respostasPerfil,
          competenciasTransferiveis: identificado.competenciasTransferiveis,
          ehSeed: false,
          criadaEm: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, nova],
          currentUserId: nova.id,
          isGuest: false,
        }));
        return { ok: true };
      },

      login: async (identificador, senha) => {
        const chave = normalizar(identificador);
        const encontrada = get().users.find((u) => normalizar(u.usuario) === chave);
        const hash = encontrada ? await hashSenha(senha, encontrada.salt) : null;

        if (!encontrada || hash !== encontrada.senhaHash) {
          return { ok: false, erro: 'Usuária ou senha incorretos.' };
        }
        set({ currentUserId: encontrada.id, isGuest: false });
        return { ok: true };
      },

      continueAsGuest: () =>
        set({
          currentUserId: null,
          isGuest: true,
          progressoConvidada: PROGRESSO_CONVIDADA_INICIAL,
        }),

      marcarPilulaConvidada: () =>
        set((s) =>
          s.isGuest
            ? {
                progressoConvidada: {
                  ...s.progressoConvidada,
                  pilulasConcluidas: s.progressoConvidada.pilulasConcluidas + 1,
                },
              }
            : {},
        ),

      marcarQuestionarioConvidada: () =>
        set((s) =>
          s.isGuest
            ? { progressoConvidada: { ...s.progressoConvidada, questionarioConcluido: true } }
            : {},
        ),

      logout: () => set({ currentUserId: null, isGuest: false }),
    }),
    {
      name: 'cloudsister-auth',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        users: s.users,
        currentUserId: s.currentUserId,
        isGuest: s.isGuest,
        seedVersao: s.seedVersao,
        progressoConvidada: s.progressoConvidada,
      }),
    },
  ),
);

export function useUsuariaAtual(): Usuaria | null {
  return useAuthStore((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);
}
