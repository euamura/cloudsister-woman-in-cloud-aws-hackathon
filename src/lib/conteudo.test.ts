import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// Valida os JSON das trilhas contra as regras do schema (seção 9) e do MVP.
const ARQUIVOS = ['cloud-architect', 'cloud-security'];
const NIVEIS = ['basico', 'intermediario', 'avancado'];

for (const nome of ARQUIVOS) {
  const trilha = JSON.parse(readFileSync(new URL(`../data/trilhas/${nome}.json`, import.meta.url), 'utf8'));

  test(`${nome}: estrutura e regras do MVP`, () => {
    assert.equal(trilha.id, nome);
    assert.equal(trilha.pilulas.length, 3);
    assert.ok(trilha.fontes.length > 0, 'precisa citar as fontes consultadas');

    const ids = new Set<string>();
    trilha.pilulas.forEach((p: any, i: number) => {
      assert.equal(p.ordem, i + 1);
      // A dificuldade sobe: básico → intermediário → avançado.
      assert.equal(p.nivel, NIVEIS[i]);
      assert.ok(p.duracaoMin <= 10, `${p.id} passa de 10 min`);
      assert.ok(p.conceito.texto && p.conceito.exemplo);
      assert.equal(p.flashcards.length, 3);
      assert.equal(p.questoes.length, 4);

      const categorias = new Set(p.questoes.map((q: any) => q.categoria));
      assert.ok(categorias.has('tecnica') && categorias.has('negocio'), `${p.id} precisa misturar técnica e negócio`);

      for (const q of p.questoes) {
        assert.ok(!ids.has(q.id), `id repetido: ${q.id}`);
        ids.add(q.id);
        assert.ok(q.id.startsWith(p.id), `${q.id} fora da pílula ${p.id}`);
        assert.ok(q.cenario && q.pergunta && q.explicacao && q.referenciaConceito);
        assert.ok(q.correta >= 0 && q.correta < q.opcoes.length, `${q.id}: correta fora das opções`);
        if (q.tipo === 'verdadeiro_falso') assert.deepEqual(q.opcoes, ['Verdadeiro', 'Falso']);
        else assert.equal(q.tipo, 'multipla_escolha');
      }
    });
  });
}
