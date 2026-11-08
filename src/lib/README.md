# src/lib

Funções de cálculo e utilitários. Toda função daqui tem um arquivo de teste ao lado
(`nome.test.js`). Rodar: `npm test`.

- `finance.js`: motor de cálculo (juros compostos, valor guardado todo mês, custo do rotativo,
  rotativo com o teto da lei, renda mensal a partir do saldo, parcela de empréstimo, meses até quitar ou até o saldo acabar, contrapartida da patrocinadora).
- `progress.js`: regras do jogo da trilha (pontos, níveis do Broto, sequência com folga, avançar
  um dia, resumo da semana).
- `highlights.js`: as 3 "contas de destaque" de cada persona, mostradas na ficha.
- `conversation.js`: a conversa do WhatsApp (desafios, alertas de gasto, resumos do mês).
- `choiceValue.js`: quanto vale cada melhor escolha, em R$ por mês, e a soma do resumo.
- `spending.js`: gastos da persona em 6 grandes grupos, para o gráfico do resumo.
- `format.js`: dinheiro e porcentagem no formato brasileiro.
- `router.js`, `useHashRoute.js`, `storage.js`, `contrast.js`: navegação, preferências e cores.
