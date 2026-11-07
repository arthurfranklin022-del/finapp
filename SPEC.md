# SPEC — MVP Finapp (educação financeira e previdenciária para EFPCs)

> Documento vivo. Cada etapa começa com perguntas de personalização ao Arthur.
> As respostas são registradas em **"Decisões"** no fim deste arquivo antes de implementar.

## 1. Visão

O Finapp é uma plataforma B2B de educação financeira e previdenciária vendida a **entidades
fechadas de previdência complementar (EFPCs / fundos de pensão)**, que a oferecem aos seus
participantes ativos, assistidos e familiares. A PREVIC exige que as EFPCs ofereçam esse tipo
de educação; o Finapp entrega isso de forma personalizada e leve.

**Conceito do produto real:** a pessoa não instala app nem faz cadastro. Ela recebe mensagens
no WhatsApp (dicas, alertas de gastos, resumo do mês) com um link para uma **situação do dia**
no navegador, construída com os números reais da vida dela (via Open Finance e dados que a
entidade já tem).

**Objetivo deste MVP:** ser uma **demo para reuniões com EFPCs**. Precisa impressionar, ser
fácil de apresentar ao vivo e permitir validar as dores das entidades. Não é para uso com
participantes reais.

## 2. Decisões já tomadas (entrevista inicial, 07/nov/2026)

| Tema | Decisão |
|---|---|
| Objetivo | Demo para EFPCs, com dados fictícios |
| Público da trilha | Participante ativo, assistido (aposentado) e família / jovens |
| Telas | Situação do dia (trilha), simulação do WhatsApp, painel da EFPC, página de apresentação |
| Tom | Meio-termo: confiável como instituição financeira, leve e gamificado na trilha |
| Desafio diário | **Uma situação ligada à vida da pessoa**, para ela entender o valor do dinheiro e de investi-lo (não é jogo de palavras) |
| Gamificação | Pontos e níveis + sequência de dias seguidos |
| Personalização | Pela **situação financeira** da pessoa (não pela idade) |
| Temas iniciais | Previdência, orçamento e dívidas, investimentos |
| Origem dos dados na demo | Personas fictícias, trocadas ao vivo por um seletor |
| Números nas situações | Sempre os números da persona (renda, gastos, saldo do plano) |
| Mensagens do WhatsApp | Desafio do dia, alerta de gasto, resumo do mês |
| Painel da EFPC | Adesão e engajamento, evolução por perfil, temas com mais dúvida |
| Identidade visual | Nova, pensada para previdência (3 opções propostas na Etapa 1) |
| Tecnologia | Simples, sem servidor: roda no navegador, dados no código, publica no Netlify |
| Equipe | Só o Arthur por enquanto (repositório privado no GitHub — revisto na Etapa 0) |

## 3. Fora do escopo do MVP

- Integração real com WhatsApp Cloud API e com Open Finance (tudo simulado)
- Login, cadastro, servidor, banco de dados
- Relatório para a PREVIC (fica para a próxima versão)
- Ranking entre participantes e compartilhamento de resultado
- White-label (decisão adiada)
- App nas lojas

## 4. Personas fictícias (sugestão inicial — confirmar na Etapa 2)

Todas pertencem a uma entidade fictícia, a **"PrevExemplo"** (nunca usar nome de entidade real).

1. **Carla, 38 — endividada / no limite.** Participante ativa. Renda líquida ~R$ 5.200; gasta
   mais do que ganha; dívida no rotativo do cartão; contribui o mínimo para o plano.
2. **Roberto, 45 — guarda mas não investe.** Participante ativo. Renda ~R$ 11.000; sobra
   todo mês; dinheiro parado na poupança; não aproveita toda a contrapartida da patrocinadora.
3. **Dona Lúcia, 62 — aposentada recente.** Assistida. Vive do benefício do plano + INSS;
   precisa organizar a renda da aposentadoria e cuidar de propostas de consignado.
4. **Pedro, 19 — jovem da família.** Filho de participante; primeiro emprego/estágio;
   começando a lidar com o próprio dinheiro.

Cada persona tem: nome, idade, vínculo com a entidade, renda, gastos por categoria
(moradia, mercado, delivery, transporte, lazer, cartão…), dívidas, reserva, saldo e
contribuição no plano, contrapartida da patrocinadora, nível atual e histórico de dias.

## 5. Regras que valem para todo o projeto

- **Mobile-first**: a trilha é aberta pelo link do WhatsApp, no celular. O painel da EFPC e a
  página de apresentação também precisam funcionar bem no notebook (uso em reunião).
- **Português do Brasil, linguagem simples**, sem jargão sem explicação. Fonte confortável
  (pensar na Dona Lúcia).
- **Cálculos corretos e transparentes**: toda projeção (juros compostos, custo da dívida,
  efeito da contrapartida) mostra as premissas (taxa, prazo, se é valor real ou nominal).
  As funções de cálculo têm testes automatizados.
- **Educação, não recomendação**: nunca indicar produto financeiro específico; incluir aviso
  curto de que o conteúdo é educativo.
- **Nada de dados reais** de pessoas ou entidades.
- **Modo demo**: botões para trocar de persona e para "avançar um dia", para mostrar a
  evolução (sequência, pontos, nível) durante a reunião.

## 6. Etapas

Cada etapa: (1) perguntas de personalização → (2) plano → (3) implementação → (4) verificação
com o critério de "pronto" → (5) registro em "Decisões" e commit no git.

### Etapa 0 — Preparar o projeto
- Criar o projeto (sugestão: React + Vite + Tailwind; o Claude Code explica a escolha).
- Estrutura de pastas, git local, comando para rodar no navegador.
- **Pronto quando:** o app abre no navegador com uma tela "Olá, Finapp" e o primeiro commit existe.

### Etapa 1 — Identidade visual e estrutura
- Propor **3 opções de identidade** (paleta, tipografia, mascote ou símbolo, tom de voz),
  com uma página de comparação; Arthur escolhe.
- Estrutura de navegação entre as 4 áreas: Apresentação, WhatsApp, Situação do dia, Painel da EFPC.
- Barra de modo demo com seletor de persona.
- **Pronto quando:** as 4 áreas abrem (mesmo vazias) com a identidade escolhida, no celular e no
  notebook, conferido por captura de tela das duas larguras.

### Etapa 2 — Personas e motor de cálculo
- Confirmar e detalhar as 4 personas (números, história, objetivos).
- Funções de cálculo: juros compostos, custo do rotativo/dívida, efeito de aumentar a
  contribuição com contrapartida, quanto um gasto mensal vira em X anos, etc.
- Premissas de taxa definidas com o Arthur e exibidas na tela.
- **Pronto quando:** os testes das funções passam e uma tela de "ficha da persona" mostra os
  números de cada uma.

### Etapa 3 — Situação do dia (a trilha)
- Formato de cada situação: contexto com os números da persona → pergunta "o que você
  faria?" → 3 opções → feedback com o cálculo de cada escolha → "por que isso importa".
- Pelo menos **7 situações por persona** (uma semana), cobrindo previdência, orçamento e
  dívidas e investimentos.
- Pontos por situação, níveis (ex.: iniciante → avançado) e sequência de dias seguidos.
- "Avançar um dia" no modo demo.
- **Pronto quando:** dá para jogar a semana inteira com cada persona, os números batem com
  o motor de cálculo e pontos/nível/sequência evoluem corretamente.

### Etapa 4 — Simulação do WhatsApp
- Tela que imita uma conversa do WhatsApp com a "PrevExemplo".
- Mensagens: desafio do dia (com link que abre a situação da persona), alerta de gasto
  (gerado a partir dos gastos da persona) e resumo do mês (pontos, nível, quanto poderia ter
  guardado).
- **Pronto quando:** cada persona tem sua conversa, e o link leva à situação certa.

### Etapa 5 — Painel da EFPC
- População fictícia da entidade (ex.: alguns milhares de participantes gerados com semente
  fixa, para os números serem sempre os mesmos na demo).
- Indicadores: adesão e engajamento (quantos usam, sequências, resposta às mensagens),
  evolução do nível por perfil financeiro ao longo do tempo, temas com mais erro.
- **Pronto quando:** o painel abre com gráficos legíveis num notebook e os números são
  coerentes entre si.

### Etapa 6 — Página de apresentação
- Página para o gestor da EFPC: problema (exigência da PREVIC, tema árido), solução, como
  funciona (WhatsApp → situação do dia → painel), benefícios para a entidade, chamada para
  conversa.
- **Pronto quando:** a página conta a história em menos de 2 minutos de leitura e leva às demais áreas.

### Etapa 7 — Revisão, roteiro de demo e publicação
- Revisão completa por um subagente (textos, cálculos, celular e notebook).
- Roteiro de demo de 5 minutos para reunião (`ROTEIRO-DEMO.md`).
- Publicar no Netlify.
- **Pronto quando:** o link público funciona no celular e o roteiro foi ensaiado do começo ao fim.

## 7. Decisões por etapa

> Preencher no início de cada etapa, com as respostas do Arthur.

### Etapa 0
_07/nov/2026_
- **Tecnologia:** React + Vite + Tailwind (como sugerido), com Vitest para os testes.
- **Onde fica o código:** repositório **privado no GitHub**. Muda a decisão anterior ("pasta
  local, sem GitHub") porque as sessões do Claude Code rodam na nuvem e a pasta é apagada
  ao final; sem repositório, o trabalho se perderia.
- **Idioma do código:** nomes em inglês, comentários em português. Textos de tela sempre em português.
- **Publicação no Netlify:** só na Etapa 7, como previsto.
- Tela provisória "Olá, Finapp" com cores neutras; a identidade visual fica para a Etapa 1.

### Etapa 1
-

### Etapa 2
-

### Etapa 3
-

### Etapa 4
-

### Etapa 5
-

### Etapa 6
-

### Etapa 7
-
