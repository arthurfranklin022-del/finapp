// Gera docs/etapa3-situacoes.md a partir de src/data/situations.js, para revisar o
// conteúdo das situações sem abrir o app. Rodar com: node scripts/revisao-situacoes.mjs
import { writeFileSync } from 'node:fs'
import { personas } from '../src/data/personas.js'
import { ASSUMPTIONS } from '../src/data/assumptions.js'
import { weekFor, THEMES } from '../src/data/situations.js'

const Q = { best: '⭐ melhor', ok: '◐ meio', weak: '○ dá para melhorar' }
let out =
  '# Etapa 3 — as 28 situações da semana\n\nGerado automaticamente de `src/data/situations.js` ' +
  '(`node scripts/revisao-situacoes.mjs`). Os números vêm do motor de cálculo.\n' +
  'Pontos: ⭐ melhor = 30 · ◐ meio = 20 · ○ dá para melhorar = 10.\n'
for (const p of personas) {
  out += `\n## ${p.name}, ${p.age} — ${p.profile}\n`
  for (const s of weekFor(p, ASSUMPTIONS)) {
    out += `\n### Dia ${s.day} · ${THEMES[s.theme].label} · ${s.title}\n\n${s.context}\n\n**${s.question}**\n\n`
    out += '| Opção | Tipo | Resultado | Explicação |\n|---|---|---|---|\n'
    for (const o of s.options) out += `| ${o.label} | ${Q[o.quality]} | ${o.result} | ${o.detail} |\n`
    out += `\n**Por que isso importa:** ${s.why}\n\n_Lição:_ ${s.lesson}\n`
  }
}
writeFileSync(new URL('../docs/etapa3-situacoes.md', import.meta.url), out)
console.log('docs/etapa3-situacoes.md atualizado')
