import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { identificarPerfil, todasRespondidas, type QuestaoPerfil } from './perfilPublico.ts';

// Usa as perguntas reais do app.
const Q: QuestaoPerfil[] = JSON.parse(
  readFileSync(new URL('../data/perfil-publico.json', import.meta.url), 'utf8'),
);

test('universitária de 22 anos: perfil início', () => {
  const r = identificarPerfil(22, { momento: 'estudando', objetivo: 'estagio', experiencia: 'pouca' }, Q);
  assert.equal(r.perfil, 'inicio');
  assert.deepEqual(r.competenciasTransferiveis, []);
});

test('ex-professora de 35 anos: perfil transição com competência transferível', () => {
  const r = identificarPerfil(35, { momento: 'outra_area', objetivo: 'mudar', experiencia: 'educacao' }, Q);
  assert.equal(r.perfil, 'transicao');
  assert.deepEqual(r.competenciasTransferiveis, ['Comunicação com stakeholders']);
});

test('respostas podem mudar o perfil esperado pela idade', () => {
  // 25 anos, mas mudando de carreira depois de anos em vendas.
  const jovem = identificarPerfil(25, { momento: 'outra_area', objetivo: 'mudar', experiencia: 'atendimento' }, Q);
  assert.equal(jovem.perfil, 'transicao');
  // 34 anos, mas começando a faculdade agora.
  const madura = identificarPerfil(34, { momento: 'estudando', objetivo: 'estagio', experiencia: 'pouca' }, Q);
  assert.equal(madura.perfil, 'inicio');
});

test('empate e respostas neutras: vale a faixa de idade', () => {
  const neutras = { momento: 'ja_tech', objetivo: 'crescer' };
  assert.equal(identificarPerfil(29, neutras, Q).perfil, 'inicio');
  assert.equal(identificarPerfil(30, neutras, Q).perfil, 'transicao');
});

test('todasRespondidas exige uma opção válida em cada pergunta', () => {
  assert.equal(todasRespondidas({ momento: 'estudando', objetivo: 'estagio' }, Q), false);
  assert.equal(todasRespondidas({ momento: 'estudando', objetivo: 'estagio', experiencia: 'xyz' }, Q), false);
  assert.equal(todasRespondidas({ momento: 'estudando', objetivo: 'estagio', experiencia: 'pouca' }, Q), true);
});
