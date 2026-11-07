// Regras de XP (seção 8 da spec). Streak, bônus de streak e níveis entram na Fase 5.

export const XP = {
  PILULA_CONCLUIDA: 10,
  ACERTO_PRIMEIRA: 5,
  ACERTO_REPETICAO: 2,
  PILULA_PERFEITA: 20,
} as const;

export interface DesempenhoPilula {
  acertosPrimeira: number;
  acertosRepeticao: number;
  perfeita: boolean;
}

export function xpDaPilula(d: DesempenhoPilula): number {
  return (
    XP.PILULA_CONCLUIDA +
    d.acertosPrimeira * XP.ACERTO_PRIMEIRA +
    d.acertosRepeticao * XP.ACERTO_REPETICAO +
    (d.perfeita ? XP.PILULA_PERFEITA : 0)
  );
}
