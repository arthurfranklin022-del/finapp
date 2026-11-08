import { describe, it, expect } from 'vitest'
import { bestChoiceValues, sumValues, choicesSummary } from './choiceValue.js'
import { personas, getPersona } from '../data/personas.js'
import { weekFor } from '../data/situations.js'
import { ASSUMPTIONS as A } from '../data/assumptions.js'

const valuesOf = (id) => bestChoiceValues(weekFor(getPersona(id), A), getPersona(id), A)
const all = [1, 2, 3, 4, 5, 6, 7]

describe('valor das melhores escolhas (R$ por mês)', () => {
  it.each(personas)('$name: os 7 dias têm valor positivo e um tipo conhecido', (p) => {
    const v = valuesOf(p.id)
    expect(v.map((x) => x.day)).toEqual(all)
    for (const x of v) {
      expect(['monthly', 'once', 'protection']).toContain(x.kind)
      expect(x.amount).toBeGreaterThan(0)
      expect(x.what.length).toBeGreaterThan(5)
    }
  })

  it('Carla: valores conferidos à mão', () => {
    const v = valuesOf('carla')
    expect(v.map((x) => Math.round(x.amount))).toEqual([450, 130, 408, 660, 320, 34, 408])
    // dias 3 e 7 são a mesma decisão (contrapartida): contam uma vez só
    expect(sumValues(v, [3, 7]).monthly).toBe(408)
    // o corte do dia 1 já tem R$ 125 de delivery: com os dois dias, o dia 5 vale R$ 195
    expect(sumValues(v, [1, 5]).monthly).toBe(450 + 195)
    expect(sumValues(v, [5]).monthly).toBe(320)
    expect(Math.round(sumValues(v, all).monthly)).toBe(1217)
    expect(sumValues(v, all).once).toBe(660)
  })

  it('Roberto: contrapartida contada uma vez; taxa do dia 5 desconta do rendimento do dia 2', () => {
    const v = valuesOf('roberto')
    expect(sumValues(v, [1, 7]).monthly).toBe(600)
    const both = sumValues(v, [2, 5]).monthly
    expect(both).toBeLessThan(v[1].amount + v[4].amount)
    expect(sumValues(v, all).protection.map((x) => x.amount)).toEqual([30000])
    expect(Math.round(sumValues(v, all).monthly)).toBe(2957)
  })

  it('Dona Lúcia: o dia 2 compara com o que ela tira hoje (R$ 3.100 → R$ 2.800)', () => {
    const v = valuesOf('lucia')
    expect(v[1].amount).toBe(300)
    expect(v[6].amount).toBe(600)
    expect(Math.round(sumValues(v, all).monthly)).toBe(1153)
  })

  it('Pedro: dias 1 e 3 usam a mesma sobra de R$ 150 e contam uma vez', () => {
    const v = valuesOf('pedro')
    expect(sumValues(v, [1, 3]).monthly).toBe(150)
    expect(sumValues(v, all).once).toBe(3300)
  })

  it('o resumo soma só os dias com melhor escolha; o potencial é com todas', () => {
    const p = getPersona('carla')
    const week = weekFor(p, A)
    const answers = { 1: { quality: 'best' }, 2: { quality: 'ok' }, 5: { quality: 'best' } }
    const s = choicesSummary(week, p, A, answers)
    expect(s.bestDays).toEqual([1, 5])
    expect(s.achieved.monthly).toBe(645)
    expect(s.achieved.monthly).toBeLessThanOrEqual(s.potential.monthly)
  })
})
