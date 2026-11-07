import assert from 'node:assert/strict';
import { test } from 'node:test';

import { xpDaPilula } from './gamification.ts';
import { avancar, ehRepeticao, iniciarSessao, questaoAtual, responder, resumir, terminou } from './sessao.ts';

// Responde a questão atual e avança, como faz a tela.
const passo = (s: ReturnType<typeof iniciarSessao>, acertou: boolean) => avancar(responder(s, acertou));

test('acertando tudo de primeira: termina sem repetição e é perfeita', () => {
  let s = iniciarSessao(['q1', 'q2']);
  s = passo(s, true);
  s = passo(s, true);
  assert.ok(terminou(s));
  assert.deepEqual(resumir(s), { total: 2, acertosPrimeira: 2, acertosRepeticao: 0, perfeita: true });
});

test('questão errada volta no fim da fila', () => {
  let s = iniciarSessao(['q1', 'q2']);
  s = passo(s, false); // erra q1
  s = passo(s, true); // acerta q2
  assert.equal(questaoAtual(s), 'q1');
  assert.ok(ehRepeticao(s));
  s = passo(s, true); // acerta q1 na revisão
  assert.ok(terminou(s));
  assert.deepEqual(resumir(s), { total: 2, acertosPrimeira: 1, acertosRepeticao: 1, perfeita: false });
});

test('errar de novo na revisão repete outra vez', () => {
  let s = iniciarSessao(['q1']);
  s = passo(s, false);
  s = passo(s, false);
  assert.equal(questaoAtual(s), 'q1');
  s = passo(s, true);
  assert.ok(terminou(s));
  assert.equal(resumir(s).acertosRepeticao, 1);
});

test('XP: +10 pílula, +5 por acerto de primeira, +2 na repetição, +20 se perfeita', () => {
  assert.equal(xpDaPilula({ acertosPrimeira: 4, acertosRepeticao: 0, perfeita: true }), 10 + 20 + 20);
  assert.equal(xpDaPilula({ acertosPrimeira: 3, acertosRepeticao: 1, perfeita: false }), 10 + 15 + 2);
  assert.equal(xpDaPilula({ acertosPrimeira: 0, acertosRepeticao: 4, perfeita: false }), 10 + 8);
});
