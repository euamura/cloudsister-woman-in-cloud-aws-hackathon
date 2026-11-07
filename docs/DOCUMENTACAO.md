# CloudSister: resumo dos pedidos e do que foi entregue

Documento de registro da sessão. Ele resume o que foi pedido em cada etapa, o que foi entregue, como foi verificado e o que ficou pendente.

> **Nota sobre caminhos:** este registro foi escrito durante o hackathon, antes da reorganização do repositório. Os caminhos citados (`app/`, `lib/`, `data/`, `index.html`...) agora ficam em `src/app/`, `src/lib/`, `src/data/`, e o protótipo HTML está em `mvp_v1/` e `mvp_v2/`. A estrutura atual está no [README](../README.md#estrutura-do-projeto).

---

## 1. Conexão com MCPs de conteúdo AWS

**Pedido:** conectar os principais MCPs de conteúdo do repositório [awslabs/mcp](https://github.com/awslabs/mcp) para criar trilhas de aprendizado AWS.

**Servidores indicados:**

| Servidor | Tipo | Uso |
|---|---|---|
| `aws-knowledge-mcp-server` | Remoto (HTTP), sem login | Principal: docs, What's New, blogs, Well-Architected, skills |
| `aws-documentation-mcp-server` | Local (`uvx`) | Busca e leitura de docs, recomendações |
| `aws-diagram-mcp-server` | Local (`uvx`) | Diagramas de arquitetura |

**Resultado do teste:**
- O endpoint `https://knowledge-mcp.global.api.aws` respondeu ao `initialize` com HTTP 200 e listou 5 ferramentas (`aws___search_documentation`, `aws___read_documentation`, `aws___list_regions`, `aws___get_regional_availability`, `aws___retrieve_skill`).
- A configuração do usuário (`~/.kiro/settings/mcp.json`) estava com `"disabled": true` e sem `"type": "http"`. Indiquei a correção, mas não confirmei se ela foi aplicada.
- O MCP nunca foi usado de fato para gerar conteúdo.

---

## 2. Spec original do app (prompt principal)

**Produto:** app mobile **CloudSister**, que orienta mulheres para carreiras em Cloud. Referência de experiência: Duolingo, com aprendizado diário e gamificado, progressão estilo RPG e economia comportamental.

**Stack pedida:** React Native + Expo + TypeScript, expo-router, Zustand com AsyncStorage, expo-notifications, Reanimated, tema centralizado em `/theme`, sem backend.

**Pontos principais da spec:**
- **Público:** perfil "Início" (18–29 anos) e "Transição" (30+), que mudam tom, exemplos e ordem das trilhas.
- **Fluxo:** boas-vindas → convidada/cadastro/login → pergunta-chave → questionário (12 questões, até 7 min) → rotina → dashboard → pílula → resultado → loja → perfil.
- **Algoritmo:** função pura em `/lib/recommendation.ts`, com eixos `architect` e `security`. O empate recomenda Architect.
- **Trilhas:** Cloud/Solutions Architect e Cloud Security Engineer, com 5 pílulas cada e dificuldade crescente.
- **Pílula:** conceito, 5 flashcards e 6 questões (técnicas e de negócio, com cenário real). Ao errar, mostra a resposta certa, a explicação e "Rever conteúdo"; as questões erradas voltam no fim.
- **Gamificação:** XP, níveis com títulos, streak só nos dias escolhidos, congelamento semanal, baús, conquistas e uma loja simulada.
- **Lembretes:** notificações locais só nos dias escolhidos, canceladas se ela já estudou no dia.
- **Design:** paleta lilás/roxo/rosa, Nunito, mascote nuvem, botões com sombra 3D, acessibilidade AA, alvos ≥ 44px.
- **Dados:** pessoais apenas fictícios. O conteúdo técnico viria do MCP, salvo em JSON em `/data/trilhas/`.
- **Entrega:** 6 fases, uma por vez, esperando OK.

---

## 3. Mudanças de escopo pedidas

| Pedido | Decisão tomada |
|---|---|
| "Reduza para MVP, que rode em 7 minutos" | Interpretado como a jornada da usuária caber em ~7 min. Cadastro de 9 para 6 campos (saíram e-mail, telefone e foto). Removido o `expo-image-picker`. Fontes reduzidas a 4 pesos. |
| "Quanto tempo para a Fase 2?" | Estimativa de 15–25 min de execução (não medida). |
| "Fase 2 num MVP que rode em 3 minutos" | Questionário com 5 questões, sem cronômetro, testes com o runner nativo do Node (sem Jest). |
| "Finalizar o protótipo aqui" | Encerrado após a Fase 2, com tela final coerente ("Refazer diagnóstico" e "Sair"). |
| "Abra para teste" / "Só rodar localmente" | Tentativa de rodar no navegador. A instalação do `react-native-web` foi interrompida. |
| "Crie um único index.html" | Protótipo novo em HTML, CSS e JS puros, independente do projeto Expo. |

---

## 4. Entrega A: projeto Expo (`/app`, `/components`, `/lib`, `/store`, `/theme`, `/data`, `/types`)

**Fase 1 (feita):** setup, tema, navegação, boas-vindas, convidada/cadastro/login, mascote animado, 3 usuárias fictícias (Ana 22, Carla 35, Júlia 27; senha `cloud123`) e senha com SHA-256 + salt (hash simples de protótipo).

**Fase 2 (feita, reduzida):** pergunta-chave ligada, escolha direta de trilha, questionário de 5 questões, algoritmo `recomendar()` e tela de resultado com afinidade em %, dia típico e 3 primeiros passos.

**Verificado:**
- `tsc --noEmit` sem erros.
- 5 testes do algoritmo passando (`node --test lib/recommendation.test.ts`).
- Bundle Android compilando (`expo export`).

**Não verificado:** o app nunca foi aberto em celular, emulador ou navegador.

**Fora do escopo final:** Fases 3–6 (dashboard, pílulas, XP/streak, loja, lembretes, perfil) e o conteúdo via MCP.

**Observações técnicas:**
- Foi instalado o Node.js LTS v26.13 via `winget`.
- Um conflito recorrente de `react-dom` foi resolvido fixando a versão `19.3.0`.
- O template deixou `AGENTS.md`, `.claude/` e `LICENSE` na pasta.
- Nada foi commitado no git.

---

## 5. Entrega B: protótipo `index.html` (arquivo único)

**Pedido:** um único arquivo com HTML, CSS e JS puros, sem frameworks, layout mobile de até 400px, estilo Duolingo e a paleta indicada.

**Telas implementadas:**
1. Boas-vindas (💜☁️, "CloudSister", "Começar").
2. Cadastro: nome, idade, e-mail e 4 avatares. Nada é salvo.
3. Pergunta-chave. "Sim" leva a 2 cards de trilha. "Não" leva a 3 perguntas de perfil, com contagem de pontos e recomendação.
4. Home: nome, 🔥 3 dias, XP, barra de progresso e caminho com 5 pílulas (1ª liberada, demais 🔒).
5. Pílula 1, "Conceitos de Cloud": card de conceito, flashcard que vira e 3 questões com cenário. Ao acertar, o botão fica verde e soma +10 XP. Ao errar, mostra a resposta certa e uma explicação.
6. Resultado: "Pílula concluída! +N XP 🎉" e "Voltar para a trilha".

**Ponto de atenção:** o título do resultado mostra o XP realmente ganho (30 só se acertar as 3), e não um "+30" fixo como no exemplo do pedido.

**Não verificado:** a checagem de sintaxe e a abertura no navegador foram canceladas antes de rodar.

---

## 6. Pendências

- [ ] Abrir o `index.html` no navegador e conferir o fluxo completo.
- [ ] Confirmar se o `mcp.json` foi corrigido (`"type": "http"`, `"disabled": false`).
- [ ] Decidir qual protótipo segue adiante: o Expo (base mais completa) ou o HTML (mais simples de demonstrar).
- [ ] Se for o Expo: instalar `react-native-web` com `react-dom@19.3.0` para rodar no navegador, ou testar no Expo Go.

---

## 7. Fase 3 (retomada após o encerramento)

**Pedido:** seguir com a Fase 3 (dashboard, mapa da trilha e JSON das 2 trilhas, com conteúdo via MCP).

**Conteúdo via MCP:** o AWS Knowledge MCP foi consultado direto pelo endpoint (`aws___search_documentation`) sobre Regiões e Zonas, Well-Architected, EC2 Auto Scaling, responsabilidade compartilhada, IAM, KMS, CloudTrail e GuardDuty. Os textos foram parafraseados em português, e as páginas consultadas estão listadas no campo `fontes` de cada JSON.

**Entregue:**
- `data/trilhas/cloud-architect.json` e `cloud-security.json`: 3 pílulas por trilha (básico, intermediário, desafio), cada uma com conceito, exemplo, 3 flashcards e 4 questões (múltipla escolha e verdadeiro/falso, misturando técnica e negócio, sempre com cenário).
- `lib/mapa.ts`: lógica pura do mapa (pílula concluída, liberada ou bloqueada; baú a cada 2 pílulas).
- `app/home.tsx`: dashboard com avatar, streak, XP, trilha ativa com progresso, meta do dia e mapa vertical em zigue-zague.
- `app/pilula/[id].tsx`: prévia da pílula com o card de conceito. O player completo é a Fase 4.
- "Começar esta trilha" agora leva ao dashboard, e quem reabre o app com trilha confirmada cai direto nele.

**Verificado:** `npm test` (11 testes: algoritmo, mapa e validação dos JSON), `tsc --noEmit` e bundle Android. O app continua sem ter sido aberto num dispositivo.

**Ainda não funciona:** concluir pílulas (Fase 4), regras de XP e streak (Fase 5). Por isso o dashboard mostra 0 XP e 0 dias.

---

## 8. Fase 4: player da pílula

**Entregue:**
- `app/pilula/[id].tsx`: player em 3 etapas. Primeiro o card de conceito com exemplo, depois os flashcards (giram ao tocar, com "Sabia" / "Não sabia") e por fim as questões com cenário.
- **Feedback de erro:** mostra a resposta certa e a explicação, avisa que a questão volta no fim e oferece "Rever conteúdo", que abre o trecho do conceito. A opção certa e a errada ganham cor e símbolo (✓ / ✗). O mascote reage ao acerto e ao erro.
- `lib/sessao.ts`: questão errada volta para o fim da fila até ser acertada.
- `lib/gamification.ts`: XP da pílula (+10 concluída, +5 acerto de primeira, +2 acerto na revisão, +20 se perfeita).
- `app/resultado-pilula.tsx`: XP ganho, acertos de primeira e tempo, com animação de comemoração. Concluir libera a próxima pílula no mapa e soma o XP no dashboard.
- **Convidada:** depois da 1ª pílula, aparece "Crie sua conta para salvar seu progresso", e as pílulas seguintes pedem cadastro.

**Verificado:** `npm test` (15 testes), `tsc --noEmit` e bundle Android. O app continua sem ter sido aberto num dispositivo.

**Ainda não funciona:** streak, níveis, bônus de streak, conquistas e loja (Fase 5); lembretes e perfil (Fase 6). O "Sabia / Não sabia" dos flashcards ainda não altera nada.
