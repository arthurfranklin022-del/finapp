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
_07/nov/2026_
- **Mascote x símbolo:** variar entre as opções, para comparar lado a lado.
- **Nome:** manter "Finapp" como marca nas telas.
- **3 direções para comparar:** (A) **Raiz**: verde-floresta e creme, mascote Broto (plantinha
  que cresce com o nível), tom acolhedor. (B) **Horizonte**: azul-marinho e âmbar, símbolo de
  sol nascendo, tom sóbrio e confiante. (C) **Coruja**: azul-petróleo e coral, mascote coruja,
  tom leve e de conversa.
- **Navegação:** barra de demo fina no topo com as 4 áreas e o seletor de persona; cada área
  ocupa o resto da tela com seu próprio visual.
- **Barra de demo:** recolhível (visível por padrão, botão para esconder e um botão pequeno
  no canto para trazer de volta).
- **WhatsApp e Situação do dia no notebook:** dentro de uma moldura de celular; no celular de
  verdade ocupam a tela toda.
- **Depois da escolha:** o app usa só a identidade escolhida; a página de comparação fica no
  projeto como registro, fora da navegação principal.
- **Identidade escolhida: (A) Raiz**, com o mascote **Broto**. Verde-floresta `#1F5D3F`, mel
  `#E9A23B`, creme `#FBF7EE`, folha clara `#DDEBDF`; fonte Nunito; tom acolhedor e paciente.
  As 4 fases do Broto (semente → broto → muda → árvore) ficam disponíveis para os níveis da
  Etapa 3. Comparação guardada em `#/identidades` e em `docs/capturas/etapa1-identidades-*.png`.
- **Nome da coruja (opção C, não escolhida):** "Sábia" ("sabiá" é outro pássaro).
- **Detalhes técnicos:** cada área tem endereço próprio com `#` (`#/whatsapp`, `#/situacao`,
  `#/painel`); cores e fonte ficam num bloco só em `src/index.css`; a persona escolhida e a
  barra escondida ficam lembradas no navegador; tecla **D** esconde/mostra a barra de demo.

### Etapa 2
_07/nov/2026_
- **Projeções em valores reais** ("em dinheiro de hoje", já descontada a inflação). Dívidas
  aparecem com a taxa nominal ao mês, como no contrato.
- **Taxas:** o Claude propõe uma tabela com referências e o Arthur revisa (ver plano da etapa).
- **Contrapartida da patrocinadora:** 100% do que a pessoa contribui, até 8% do salário bruto.
- **Ficha da persona:** nova área na barra de demo, em `#/persona`. Mostra história curta e
  objetivos, números, 3 contas de destaque, gráfico de gastos por categoria e quadro de premissas.
- **Números das personas (aprovados):**
  - Carla, 38, ativa: bruto R$ 6.800 / líquido R$ 5.200; gasta R$ 5.650 (falta R$ 450);
    rotativo R$ 3.800; reserva R$ 0; contribui 2% (empresa põe 2%); saldo no plano R$ 38.000.
  - Roberto, 45, ativo: bruto R$ 15.000 / líquido R$ 11.000; gasta R$ 8.200 (sobra R$ 2.800);
    poupança R$ 85.000; sem dívidas; contribui 4% (deixa 4% da empresa de lado); saldo R$ 210.000.
  - Dona Lúcia, 62, assistida: benefício do plano R$ 3.100 + INSS R$ 2.900 = R$ 6.000; gasta
    R$ 5.700 (saúde R$ 1.300); reserva R$ 22.000; saldo remanescente no plano R$ 480.000.
  - Pedro, 19, filho de participante: bolsa de estágio R$ 1.600; gasta R$ 1.450 (delivery/apps
    R$ 380); reserva R$ 300.
- **Pedro pode entrar no plano família** da PrevExemplo (sem contrapartida); ainda não entrou.
- **Dona Lúcia não tem consignado**, só recebe ofertas (educação preventiva).
- **Taxas aprovadas** (em `src/data/assumptions.js`, mostradas no quadro "Premissas da demo"):
  inflação 4% ao ano · plano PrevExemplo 4% ao ano acima da inflação · renda fixa conservadora
  4% acima da inflação · poupança 2% acima da inflação · rotativo 13% ao mês · cheque especial
  7,5% ao mês · consignado 1,8% ao mês. Idade de aposentadoria nas projeções: 60 anos.
- **Contas de destaque:** Carla (custo do rotativo, contrapartida que falta, delivery em 10 anos);
  Roberto (contrapartida que falta, poupança x renda fixa, sobra investida até os 60); Dona Lúcia
  (até quando o saldo dura, custo de um consignado de R$ 10 mil em 84x, meses que a reserva
  cobre); Pedro (R$ 100/mês no plano família desde os 19 x desde os 30, delivery em 10 anos,
  tempo até a reserva de 3 meses).
- **Detalhes técnicos:** motor de cálculo em `src/lib/finance.js`; contas da ficha em
  `src/lib/highlights.js`; ficha em `src/pages/PersonaSheet.jsx`. Com o 5º botão ("Ficha"), a
  barra de demo usa rótulos curtos até 1536px de largura e fica em duas linhas abaixo de 1280px.
  Capturas em `docs/capturas/etapa2-ficha-*.png`.


### Etapa 3
_07/nov/2026_
- **Opções:** em cada situação, 1 é a "melhor escolha" (⭐, 30 pontos), 1 é o caminho do meio
  (◐, 20 pontos) e 1 "dá para melhorar" (○, 10 pontos). Tom gentil, nunca "errou". Isso permite
  ao painel da Etapa 5 medir os temas com mais escolhas fracas.
- **Ponto de partida (cada persona já usa o app há um tempo):** Carla 30 pts e 1 dia seguido
  (Semente) · Roberto 110 pts e 5 dias (Broto) · Dona Lúcia 280 pts e 12 dias (Muda) ·
  Pedro do zero (Semente).
- **Níveis = fases do Broto:** Semente (0) → Broto (100) → Muda (250) → Árvore (450 pontos).
  Jogando bem a semana (7 × 30 = 210 pontos), cada persona sobe exatamente 1 nível.
- **Sequência:** 1 folga por semana. O primeiro dia pulado na semana não zera a sequência
  (fica "protegida"); o segundo zera. No modo demo, "avançar um dia" sem responder conta como
  dia pulado.
- **"Avançar um dia":** botão na barra de demo (some quando a barra é escondida).
- **Subir de nível:** cartão com o Broto mudando de fase, confete rápido e "Você virou Muda!".
- **Depois do 7º dia:** resumo da semana (pontos, nível, sequência, quantas melhores escolhas e
  as lições da semana) com botão para recomeçar.
- **Conteúdo:** o Claude escreveu as 28 situações e o Arthur revisa pela tabela
  `docs/etapa3-situacoes.md` antes da programação das telas.
- **Correção da Etapa 2 (pedida pelo Arthur):** a ficha da Carla dizia que o rotativo de
  R$ 3.800 virava R$ 16 mil em 12 meses. Pela Lei 14.690/2023 (desde jan/2024), os juros do
  rotativo e do parcelamento da fatura não passam de 100% da dívida: ela no máximo dobra
  (R$ 7.600, em cerca de 6 meses). O motor ganhou o teto (`revolvingDebtAfterMonths`,
  `monthsToRevolvingCap`) e a ficha e as situações passaram a usá-lo.
- **Premissas novas** (no quadro "Premissas da demo"): teto legal do rotativo; dinheiro parado
  rende 0% (perde para a inflação); renda do plano paga por 25 anos (60 a 85); impostos não
  entram nas contas. Nas situações: taxas de administração de 0,5%/1%/2% como exemplo; regra
  fictícia da PrevExemplo de que a pessoa aposentada pode rever o benefício uma vez por ano;
  Carla quita o cartão em cerca de 1 ano antes de mudar a contribuição.
- **Revisão do conteúdo pelo Claude:** textos em 2ª pessoa ("você"), porque quem abre o link é
  a própria pessoa; "deixar a fatura no rotativo" no lugar de "pagar o mínimo" (só sem pagar a
  dívida dobra em 6 meses); diferenças calculadas sobre os valores arredondados mostrados;
  correções de contas incoerentes (Pedro dia 3, Roberto dia 3, Carla dias 3, 5 e 7, Pedro dia 4).
  Testes em `src/data/situations.test.js` garantem que a "melhor escolha" tem o melhor número.
- **Conteúdo e premissas aprovados pelo Arthur** (08/nov/2026).
- **Detalhes da tela (Claude):** depois de responder, aparecem as 3 escolhas com a conta de cada
  uma, o "por que isso importa" e um quadro recolhível "Premissas das contas". Ícones: ⭐ melhor
  escolha, 👍 caminho do meio, 🌱 dá para melhorar. No 7º dia, o botão "Ver o resumo da semana"
  fecha a semana. Aviso gentil quando um dia é pulado (folga usada ou sequência recomeçada).
- **Detalhes técnicos:** regras em `src/lib/progress.js` (com testes); situações em
  `src/data/situations.js`; telas em `src/components/trail/`; o progresso de cada persona fica
  salvo no navegador (sobrevive a recarregar a página). Na barra de demo: "Avançar ⏭" e "↺"
  (recomeçar a semana da persona). Jogando bem, sobe de nível: Carla no dia 3, Pedro no 4,
  Roberto no 5, Dona Lúcia no 6. Capturas em `docs/capturas/etapa3-*.png`.

### Etapa 4
_08/nov/2026_
- **Base:** o trabalho das Etapas 1 a 3 estava num ramo separado no GitHub; a Etapa 4 parte dele.
- **A conversa segue o dia da demo:** mostra as mensagens até o dia atual da persona; cada
  "Avançar ⏭" faz chegar o desafio do dia seguinte.
- **Link do desafio:** leva à área "Situação do dia", na persona e no dia certos, com um botão
  para voltar ao WhatsApp.
- **Resumo do mês:** no topo da conversa, o resumo do mês passado (outubro, fixo e fictício).
  Ao fim da semana da demo, chega um 2º resumo com o que a pessoa jogou.
- **"Quanto poderia ter guardado":** soma das melhores escolhas da semana, numa régua comum de
  **R$ por mês que fica no bolso**. Escolhas sem efeito mensal (ex.: não cair em golpe) entram
  como "proteção", fora da soma. O Claude propõe o valor de cada situação e o Arthur revisa.
- **Gráfico de gastos no resumo:** quanto da renda foi para cada grande grupo, em 6 grupos
  (Moradia e contas · Alimentação · Transporte · Saúde · Lazer e assinaturas · Família e
  outros). **Clicável:** tocar num grupo mostra os gastos dentro dele (ex.: Alimentação abre
  mercado e delivery).
- **Alertas de gasto:** delivery acima do comum (Carla e Pedro), dinheiro parado na poupança
  (Roberto), saúde e ofertas de consignado (Dona Lúcia) e fatura do cartão (Carla).
- **Plano e tabela de valores aprovados pelo Arthur**, com o pedido: "revise e retire
  inconsistências, não esqueça nenhum gasto; o resumo tem que ser completo e fiel".
- **Revisão de consistência (Claude), aplicada:**
  - Régua: comparar com o que a pessoa faz **hoje**; numa decisão nova (oferta, compra, dinheiro
    extra), com a opção "dá para melhorar". Com isso, a Carla no dia 3 passou de R$ 544 para R$ 408
    (ela já contribui com 2%), a Dona Lúcia no dia 2 vale R$ 300 (hoje tira R$ 3.100, passa a
    R$ 2.800) e, no dia 3, R$ 41 (a reserva já está na poupança, não em casa).
  - Contribuição com contrapartida: conta só a parte da empresa.
  - O mesmo dinheiro não conta duas vezes: Carla dias 3 e 7 e Roberto dias 1 e 7 são a mesma
    decisão (vale uma vez); Pedro dias 1 e 3 usam a mesma sobra de R$ 150; o corte do dia 1 da
    Carla já tem R$ 125 de delivery (o dia 5 vale R$ 195 se os dois forem escolhidos); a taxa de
    0,5% do dia 5 do Roberto desconta R$ 35 do rendimento do dia 2.
  - Consignados recusados (Dona Lúcia dias 1 e 5) contam os juros evitados, como o rotativo da
    Carla. Compras à vista (tênis do Davi, celular do Pedro) contam o que se evita em relação ao
    rotativo (R$ 660 e R$ 3.300), numa linha "de uma vez", fora da soma por mês. Golpe e consignado
    para o sobrinho ficam como "proteção", fora da soma.
  - Somando a melhor escolha em todos os dias: Carla R$ 1.217/mês (+ R$ 660 de uma vez), Roberto
    R$ 2.957/mês, Dona Lúcia R$ 1.153/mês, Pedro R$ 554/mês (+ R$ 3.300 de uma vez).
  - O resumo mostra a conta de cada dia ("Ver a conta de cada dia") e o texto "como contamos".
- **Gráfico:** os 6 grupos cobrem todos os gastos das 4 personas (testado: nenhum fica de fora e a
  soma dos grupos é igual ao total gasto). Mostra cada grupo em % da renda e, no fim, quanto entrou,
  saiu e sobrou (ou faltou). Grupo sem gasto não aparece (Pedro não tem Saúde).
- **Detalhes da conversa (Claude):** resumo de outubro em 1º de novembro; para o Pedro, que começa
  do zero, boas-vindas com o mês de outubro no lugar do resumo. Semana da demo de 23 a 29 de
  novembro; desafio às 8h, alertas às 19h (Pedro e Roberto no dia 1, Carla fatura no dia 2 e
  delivery no dia 4, Dona Lúcia no dia 3); resumo de novembro em 30/nov às 9h. O botão do desafio
  só funciona no dia de hoje; dias passados mostram "Respondida: ⭐ Melhor escolha · +30" ou "Não
  respondida", e o desafio seguinte avisa se a folga protegeu a sequência. Rodapé com aviso de
  conteúdo educativo e "responda SAIR".
- **Detalhes técnicos:** conversa em `src/lib/conversation.js`, valor das escolhas em
  `src/lib/choiceValue.js`, grupos de gastos em `src/lib/spending.js` (todos com testes); telas
  em `src/components/whatsapp/`. O link é `#/situacao?persona=<id>&de=whatsapp`: abre a persona
  certa e mostra "← Voltar ao WhatsApp". Capturas em `docs/capturas/etapa4-*.png`.

### Etapa 5
-

### Etapa 6
-

### Etapa 7
-
