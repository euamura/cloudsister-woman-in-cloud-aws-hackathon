// Sessão de questões da pílula (lógica pura, testável no Node).
// Regra: questão errada volta para o fim da fila até ser acertada.

export interface Sessao {
  fila: string[];
  pos: number;
  // Resultado da 1ª tentativa de cada questão (true = acertou de primeira).
  primeiraTentativa: Record<string, boolean>;
  acertosRepeticao: number;
}

export function iniciarSessao(ids: string[]): Sessao {
  return { fila: [...ids], pos: 0, primeiraTentativa: {}, acertosRepeticao: 0 };
}

export function questaoAtual(s: Sessao): string | undefined {
  return s.fila[s.pos];
}

// true quando a questão atual já foi respondida antes (está voltando para revisão).
export function ehRepeticao(s: Sessao): boolean {
  const id = questaoAtual(s);
  return id !== undefined && id in s.primeiraTentativa;
}

export function responder(s: Sessao, acertou: boolean): Sessao {
  const id = questaoAtual(s);
  if (id === undefined) return s;
  const fila = acertou ? s.fila : [...s.fila, id];

  if (!ehRepeticao(s)) {
    return { ...s, fila, primeiraTentativa: { ...s.primeiraTentativa, [id]: acertou } };
  }
  return { ...s, fila, acertosRepeticao: s.acertosRepeticao + (acertou ? 1 : 0) };
}

export function avancar(s: Sessao): Sessao {
  return { ...s, pos: s.pos + 1 };
}

export function terminou(s: Sessao): boolean {
  return s.pos >= s.fila.length;
}

export interface ResumoSessao {
  total: number;
  acertosPrimeira: number;
  acertosRepeticao: number;
  perfeita: boolean;
}

export function resumir(s: Sessao): ResumoSessao {
  const resultados = Object.values(s.primeiraTentativa);
  const acertosPrimeira = resultados.filter(Boolean).length;
  return {
    total: resultados.length,
    acertosPrimeira,
    acertosRepeticao: s.acertosRepeticao,
    perfeita: resultados.length > 0 && acertosPrimeira === resultados.length,
  };
}
