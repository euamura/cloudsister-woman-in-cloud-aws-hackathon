import assert from 'node:assert/strict';
import { test } from 'node:test';

import { estadoPilula, montarMapa } from './mapa.ts';

const IDS = ['p1', 'p2', 'p3'];

test('sem progresso: só a 1ª pílula está liberada', () => {
  assert.equal(estadoPilula(IDS, [], 0), 'desbloqueada');
  assert.equal(estadoPilula(IDS, [], 1), 'bloqueada');
  assert.equal(estadoPilula(IDS, [], 2), 'bloqueada');
});

test('concluir uma pílula libera a próxima', () => {
  assert.equal(estadoPilula(IDS, ['p1'], 0), 'concluida');
  assert.equal(estadoPilula(IDS, ['p1'], 1), 'desbloqueada');
  assert.equal(estadoPilula(IDS, ['p1'], 2), 'bloqueada');
});

test('baú aparece a cada 2 pílulas e abre ao concluir a anterior', () => {
  const tipos = montarMapa(IDS, []).map((i) => i.tipo);
  assert.deepEqual(tipos, ['pilula', 'pilula', 'bau', 'pilula']);

  const bau = montarMapa(IDS, ['p1', 'p2']).find((i) => i.tipo === 'bau');
  assert.deepEqual(bau, { tipo: 'bau', id: 'bau-p2', aberto: true });
});

test('não coloca baú depois da última pílula', () => {
  const tipos = montarMapa(['p1', 'p2'], []).map((i) => i.tipo);
  assert.deepEqual(tipos, ['pilula', 'pilula']);
});
