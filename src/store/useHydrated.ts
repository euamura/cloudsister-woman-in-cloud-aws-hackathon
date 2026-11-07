import { useEffect, useState } from 'react';

import { useAuthStore } from './useAuthStore';

// Aguarda o AsyncStorage terminar de reidratar o store antes de renderizar rotas.
export function useAuthHydrated(): boolean {
  const [hidratado, setHidratado] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const cancelar = useAuthStore.persist.onFinishHydration(() => setHidratado(true));
    setHidratado(useAuthStore.persist.hasHydrated());
    return cancelar;
  }, []);

  return hidratado;
}
