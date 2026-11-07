import assert from 'node:assert/strict';
import { test } from 'node:test';

import { perfilPorIdade, recomendar, type Questao } from './recommendation.ts';

const Q: Questao[] = [
  {
    id: 'q1',
    pergunta: '?',
    opcoes: [
      { id: 'a', texto: 'A', pontos: { architect: 2 } },
      { id: 'b', texto: 'B', pontos: { security: 2 } },
    ],
  },
  {
    id: 'q2',
    pergunta: '?',
    opcoes: [{ id: 'a', texto: 'A', pontos: { architect: 1 }, competencia: 'Comunicação' }],
  },
];

test('maioria architect recomenda Architect', () => {
  const r = recomendar({ q1: 'a', q2: 'a' }, 22, Q);
  assert.equal(r.trilhaRecomendada, 'cloud-architect');
  assert.deepEqual(r.afinidade, { architect: 100, security: 0 });
});

test('maioria security recomenda Security', () => {
  const r = recomendar({ q1: 'b' }, 22, Q);
  assert.equal(r.trilhaRecomendada, 'cloud-security');
  assert.deepEqual(r.afinidade, { architect: 0, security: 100 });
});

test('empate recomenda Architect', () => {
  const q: Questao[] = [Q[0]];
  assert.equal(recomendar({}, 22, q).trilhaRecomendada, 'cloud-architect');
  const r = recomendar({ q1: 'a', q2: 'x' }, 22, [
    Q[0],
    { id: 'q2', pergunta: '?', opcoes: [{ id: 'x', texto: 'X', pontos: { security: 2 } }] },
  ]);
  assert.equal(r.trilhaRecomendada, 'cloud-architect');
  assert.deepEqual(r.afinidade, { architect: 50, security: 50 });
});

test('perfil muda aos 30 anos', () => {
  assert.equal(perfilPorIdade(29), 'inicio');
  assert.equal(perfilPorIdade(30), 'transicao');
});

test('perfil definido no cadastro tem prioridade sobre a idade', () => {
  assert.equal(recomendar({}, 25, Q, 'transicao').perfil, 'transicao');
  assert.equal(recomendar({}, 40, Q, 'inicio').perfil, 'inicio');
  assert.equal(recomendar({}, 40, Q).perfil, 'transicao');
});

test('competências transferíveis só no perfil transição', () => {
  assert.deepEqual(recomendar({ q2: 'a' }, 35, Q).competenciasTransferiveis, ['Comunicação']);
  assert.deepEqual(recomendar({ q2: 'a' }, 22, Q).competenciasTransferiveis, []);
});
