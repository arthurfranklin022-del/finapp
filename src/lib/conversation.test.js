import { describe, it, expect } from 'vitest'
import { buildConversation, alertsFor, situationLink } from './conversation.js'
import { personas, getPersona, totalExpenses } from '../data/personas.js'
import { weekFor } from '../data/situations.js'
import { ASSUMPTIONS as A } from '../data/assumptions.js'
import { initialProgress, answer, advanceDay } from './progress.js'
import { pageFromHash, paramsFromHash } from './router.js'

const setup = (id) => {
  const p = getPersona(id)
  return { p, week: weekFor(p, A) }
}
const best = (s) => s.options.find((o) => o.quality === 'best').id
// Joga até o dia `upTo` (respondendo a melhor), sem pular
function playUntil(p, week, upTo) {
  let s = initialProgress(p)
  for (let d = 1; d < upTo; d++) s = advanceDay(answer(s, week[d - 1], best(week[d - 1])))
  return s
}
const challenges = (c) => c.filter((m) => m.type === 'challenge')

describe('conversa do WhatsApp', () => {
  it.each(personas)('$name: no dia 1, começa com o resumo anterior e o desafio do dia 1 com link', (p) => {
    const week = weekFor(p, A)
    const c = buildConversation(p, initialProgress(p), week, A)
    expect(c[0].type).toBe('date')
    expect(['summary', 'welcome']).toContain(c[1].type)
    const ch = challenges(c)
    expect(ch).toHaveLength(1)
    expect(ch[0].situationId).toBe(week[0].id)
    expect(ch[0].link).toBe(situationLink(p))
  })

  it.each(personas)('$name: cada dia traz o desafio certo; só o de hoje tem link', (p) => {
    const week = weekFor(p, A)
    for (let day = 1; day <= 7; day++) {
      const ch = challenges(buildConversation(p, playUntil(p, week, day), week, A))
      expect(ch).toHaveLength(day)
      ch.forEach((m, i) => expect(m.situationId).toBe(week[i].id))
      expect(ch.filter((m) => m.link)).toHaveLength(1)
      expect(ch[day - 1].link).not.toBeNull()
    }
  })

  it('o link abre a Situação do dia da persona certa', () => {
    const link = situationLink(getPersona('roberto'))
    expect(pageFromHash(link)).toBe('situacao')
    expect(paramsFromHash(link)).toMatchObject({ persona: 'roberto', de: 'whatsapp' })
  })

  it('ao fim da semana chega o resumo de novembro e nenhum link fica ativo', () => {
    const { p, week } = setup('carla')
    const done = advanceDay(answer(playUntil(p, week, 7), week[6], best(week[6])))
    const c = buildConversation(p, done, week, A)
    expect(challenges(c)).toHaveLength(7)
    expect(challenges(c).every((m) => m.link === null)).toBe(true)
    const last = c.at(-1)
    expect(last.id).toBe('resumo-novembro')
    expect(last.bestCount).toBe(7)
    expect(last.monthPoints).toBe(210)
    expect(Math.round(last.choices.achieved.monthly)).toBe(1217)
  })

  it('dia pulado: o 1º fica protegido pela folga, o 2º zera, e o desafio seguinte avisa', () => {
    const { p, week } = setup('pedro')
    let s = advanceDay(initialProgress(p)) // pula o dia 1
    s = advanceDay(s) // pula o dia 2
    const ch = challenges(buildConversation(p, s, week, A))
    expect(ch[0].skipped).toBe(true)
    expect(ch[1].previousSkip).toBe('protected')
    expect(ch[2].previousSkip).toBe('reset')
  })

  it('Pedro, que começa do zero, recebe boas-vindas no lugar do resumo de outubro', () => {
    const { p, week } = setup('pedro')
    expect(buildConversation(p, initialProgress(p), week, A)[1].type).toBe('welcome')
    const carla = getPersona('carla')
    const first = buildConversation(carla, initialProgress(carla), weekFor(carla, A), A)[1]
    expect(first).toMatchObject({ type: 'summary', month: 'outubro', points: 30, streak: 1 })
  })
})

describe('alertas de gasto', () => {
  const alert = (id, key) => alertsFor(getPersona(id), A).find((x) => x.id === key)

  it('cada persona tem os alertas decididos', () => {
    expect(alertsFor(getPersona('carla'), A).map((x) => x.id)).toEqual(['alerta-fatura', 'alerta-delivery'])
    expect(alertsFor(getPersona('roberto'), A).map((x) => x.id)).toEqual(['alerta-dinheiro-parado'])
    expect(alertsFor(getPersona('lucia'), A).map((x) => x.id)).toEqual(['alerta-saude-consignado'])
    expect(alertsFor(getPersona('pedro'), A).map((x) => x.id)).toEqual(['alerta-delivery'])
  })

  it('delivery: Carla 12% da renda (3º maior gasto); Pedro 24% da bolsa (o maior)', () => {
    const c = alert('carla', 'alerta-delivery').numbers
    expect(Math.round(c.share * 100)).toBe(12)
    expect(c.rank).toBe(3)
    const p = alert('pedro', 'alerta-delivery').numbers
    expect(Math.round(p.share * 100)).toBe(24)
    expect(p.rank).toBe(1)
  })

  it('delivery: "metade em 10 anos" bate com a situação de delivery de cada um', () => {
    const half = (id) => alert(id, 'alerta-delivery').numbers.half10
    const bestProjected = (id, day) =>
      weekFor(getPersona(id), A)[day - 1].options.find((o) => o.quality === 'best').numbers.projected
    expect(half('carla')).toBeCloseTo(bestProjected('carla', 5))
    expect(half('pedro')).toBeCloseTo(bestProjected('pedro', 2))
  })

  it('fatura da Carla: R$ 494 de juros por mês e no máximo R$ 7.600', () => {
    const n = alert('carla', 'alerta-fatura').numbers
    expect(n.interest).toBeCloseTo(494)
    expect(n.atCap).toBeCloseTo(7600)
  })

  it('Roberto: R$ 1.700 a mais no 1º ano e R$ 38.700 em 15 anos (como no dia 2)', () => {
    const n = alert('roberto', 'alerta-dinheiro-parado').numbers
    expect(n.firstYear).toBeCloseTo(1700)
    expect(n.diff).toBe(38700)
    expect(n.surplus).toBe(2800)
  })

  it('Dona Lúcia: saúde é 22% da renda e empata com o mercado como maior gasto', () => {
    const lucia = getPersona('lucia')
    const n = alert('lucia', 'alerta-saude-consignado').numbers
    expect(Math.round(n.share * 100)).toBe(22)
    const max = Math.max(...lucia.expenses.map((e) => e.amount))
    expect(n.amount).toBe(max)
    expect(lucia.expenses.find((e) => e.id === 'mercado').amount).toBe(max)
    expect(Math.round(n.payment)).toBe(232)
    expect(n.total).toBeGreaterThan(totalExpenses(lucia))
  })

  it.each(personas)('$name: textos dos alertas sem números quebrados', (p) => {
    for (const a of alertsFor(p, A)) for (const t of [a.title, a.basis, ...a.lines]) expect(t).not.toMatch(/NaN|undefined|Infinity/)
  })
})
