// Lógica pura do mapa da trilha (sem React/Expo): testável direto no Node.

export type EstadoPilula = 'concluida' | 'desbloqueada' | 'bloqueada';

export type ItemMapa =
  | { tipo: 'pilula'; id: string; indice: number; estado: EstadoPilula }
  | { tipo: 'bau'; id: string; aberto: boolean };

// Uma pílula libera quando a anterior foi concluída (a 1ª já começa liberada).
export function estadoPilula(ids: string[], concluidas: string[], i: number): EstadoPilula {
  if (concluidas.includes(ids[i])) return 'concluida';
  const anteriorFeita = i === 0 || concluidas.includes(ids[i - 1]);
  return anteriorFeita ? 'desbloqueada' : 'bloqueada';
}

// Monta o caminho: pílulas em ordem, com um baú (marco) a cada `intervaloBau` pílulas.
export function montarMapa(ids: string[], concluidas: string[], intervaloBau = 2): ItemMapa[] {
  const itens: ItemMapa[] = [];
  ids.forEach((id, i) => {
    itens.push({ tipo: 'pilula', id, indice: i, estado: estadoPilula(ids, concluidas, i) });
    const ehMarco = (i + 1) % intervaloBau === 0 && i < ids.length - 1;
    if (ehMarco) itens.push({ tipo: 'bau', id: `bau-${id}`, aberto: concluidas.includes(id) });
  });
  return itens;
}
