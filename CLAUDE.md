# Finapp — MVP (demo para fundos de pensão)

Demo de uma plataforma B2B de educação financeira e previdenciária para EFPCs (fundos de
pensão). Especificação completa e decisões em @SPEC.md.

## Sobre o Arthur
- Estudante de Administração, não é programador: explique escolhas técnicas em linguagem
  simples e diga sempre como ver o resultado (qual comando rodar, qual endereço abrir).
- Prefere decidir as coisas ele mesmo: proponha opções, não decida sozinho o que é de produto,
  visual ou conteúdo.

## Como trabalhar — IMPORTANTE
1. Uma etapa do SPEC.md por sessão.
2. No início de cada etapa, ANTES de implementar, faça perguntas de personalização com a
   ferramenta AskUserQuestion (rodadas de até 4 perguntas, com uma opção recomendada).
   Não pergunte o óbvio; aponte trade-offs.
3. Registre as respostas em "Decisões por etapa" no SPEC.md.
4. Apresente um plano curto e espere aprovação.
5. Implemente e verifique contra o critério de "pronto" da etapa: rode o app, tire capturas
   de tela (celular e notebook) e rode os testes. Mostre a evidência.
6. Ao terminar, faça commit no git com mensagem descritiva em português.

## Regras do produto
- Português do Brasil, linguagem simples, mobile-first.
- Só dados fictícios; a entidade da demo se chama "PrevExemplo".
- Projeções financeiras sempre com premissas visíveis; funções de cálculo com testes.
- Conteúdo educativo: nunca recomendar produto financeiro específico.

## Comandos
Rodar sempre de dentro da pasta `finapp`.

| Para quê | Comando | Depois |
|---|---|---|
| Instalar dependências (1ª vez ou após `git pull`) | `npm install` | — |
| Abrir o app no navegador | `npm run dev` | abrir http://localhost:5173 |
| Rodar os testes | `npm test` | mostra quantos passaram |
| Testes contínuos (rodam a cada alteração) | `npm run test:watch` | Ctrl+C para sair |
| Gerar a versão de publicação | `npm run build` | sai na pasta `dist/` (é o que vai para o Netlify na Etapa 7) |

## Tecnologia e organização
- React + Vite + Tailwind CSS (v4) + Vitest. JavaScript, sem servidor.
- Nomes no código em inglês; comentários e todos os textos de tela em português.
- `src/pages` (4 áreas) · `src/components` (peças de tela) · `src/lib` (cálculos, cada um
  com `*.test.js` ao lado) · `src/data` (personas) · `docs/capturas` (evidências de cada etapa).
- Código guardado num repositório privado no GitHub (`arthurfranklin022-del/finapp`):
  as sessões rodam na nuvem e a pasta é apagada ao final, então sempre fazer commit + push.
