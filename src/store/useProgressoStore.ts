import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Progresso exibido no dashboard. Streak e níveis entram na Fase 5.
interface ProgressoState {
  xp: number;
  streak: number;
  // pílulas concluídas por trilha: { 'cloud-architect': ['ca-01'] }
  concluidas: Record<string, string[]>;

  concluirPilula: (trilhaId: string, pilulaId: string, xpGanho: number) => void;
}

export const useProgressoStore = create<ProgressoState>()(
  persist(
    (set) => ({
      xp: 0,
      streak: 0,
      concluidas: {},

      concluirPilula: (trilhaId, pilulaId, xpGanho) =>
        set((s) => {
          const atuais = s.concluidas[trilhaId] ?? [];
          return {
            xp: s.xp + xpGanho,
            concluidas: {
              ...s.concluidas,
              [trilhaId]: atuais.includes(pilulaId) ? atuais : [...atuais, pilulaId],
            },
          };
        }),
    }),
    {
      name: 'cloudsister-progresso',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ xp: s.xp, streak: s.streak, concluidas: s.concluidas }),
    },
  ),
);
