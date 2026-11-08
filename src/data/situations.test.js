import { describe, it, expect } from 'vitest'
import { weekFor, THEMES, POINTS } from './situations.js'
import { personas, getPersona } from './personas.js'
import { ASSUMPTIONS as A } from './assumptions.js'

const week = (id) => weekFor(getPersona(id), A)
const day = (id, n) => week(id)[n - 1]
const opt = (s, quality) => s.options.find((o) => o.quality === quality)
const allSituations = personas.flatMap((p) => week(p.id).map((s) => ({ persona: p.name, ...s })))

describe('formato das situações', () => {
  it.each(personas)('$name tem 7 situações, dias 1 a 7, cobrindo os 3 temas', (p) => {
    const w = week(p.id)
    expect(w.map((s) => s.day)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(new Set(w.map((s) => s.theme))).toEqual(new Set(Object.keys(THEMES)))
  })

  it('os ids são únicos', () => {
    const ids = allSituations.map((s) => s.id)
    expect(new Set(ids).size).toBe(28)
  })

  it.each(allSituations)('$id: 3 opções, uma de cada tipo, com textos completos', (s) => {
    expect(s.options).toHaveLength(3)
    expect(s.options.map((o) => o.quality).sort()).toEqual(['best', 'ok', 'weak'])
    const texts = [s.title, s.context, s.question, s.why, s.lesson, ...s.options.flatMap((o) => [o.label, o.result, o.detail])]
    for (const t of texts) {
      expect(t.length).toBeGreaterThan(3)
      expect(t).not.toMatch(/NaN|Infinity|undefined|null|\[object/)
    }
  })

  it('a melhor escolha não fica sempre na mesma posição', () => {
    const positions = new Set(allSituations.map((s) => s.options.findIndex((o) => o.quality === 'best')))
    expect(positions.size).toBe(3)
  })

  it('pontos: melhor 30, meio 20, dá para melhorar 10', () => {
    expect(POINTS).toEqual({ best: 30, ok: 20, weak: 10 })
  })
})

// Quando as 3 opções têm o mesmo tipo de número, a "melhor" precisa ter o melhor número
// e a do meio precisa ficar entre as outras duas.
const HIGHER_IS_BETTER = ['projected', 'untilAge', 'income', 'atRetirement', 'saved']
const LOWER_IS_BETTER = ['months', 'total', 'totalPaid', 'stillMissing']
describe('a melhor escolha tem mesmo o melhor resultado', () => {
  it.each(allSituations)('$id', (s) => {
    const [b, o, w] = ['best', 'ok', 'weak'].map((q) => opt(s, q).numbers)
    for (const key of [...HIGHER_IS_BETTER, ...LOWER_IS_BETTER]) {
      if (![b, o, w].every((n) => typeof n[key] === 'number')) continue
      const sign = HIGHER_IS_BETTER.includes(key) ? 1 : -1
      expect(sign * b[key]).toBeGreaterThanOrEqual(sign * o[key])
      expect(sign * o[key]).toBeGreaterThanOrEqual(sign * w[key])
    }
  })
})

describe('os números batem com o motor de cálculo', () => {
  it('Carla dia 1: os cortes somam exatamente o que falta (R$ 450)', () => {
    const cuts = opt(day('carla', 1), 'best').numbers.cuts
    expect(cuts.reduce((a, b) => a + b, 0)).toBe(450)
  })
  it('Carla dia 2: abater R$ 1.000 do rotativo economiza R$ 130 de juros por mês', () => {
    expect(opt(day('carla', 2), 'best').numbers.saved).toBeCloseTo(130, 6)
  })
  it('Carla dia 4: no rotativo, R$ 600 viram no máximo R$ 1.200 (teto da lei)', () => {
    expect(opt(day('carla', 4), 'weak').numbers.total).toBe(1200)
  })
  it('Carla dia 7: com 8%, entram R$ 1.088 por mês e a conta do saldo confere', () => {
    const n = opt(day('carla', 7), 'best').numbers
    expect(n.monthly).toBeCloseTo(1088, 6)
    // conta feita à mão: 1 ano com R$ 272 e depois 21 anos com R$ 1.088, a 4% ao ano
    const i = 1.04 ** (1 / 12) - 1
    const fvm = (m, months) => (m * ((1 + i) ** months - 1)) / i
    const after1 = 38000 * 1.04 + fvm(272, 12)
    const expected = after1 * 1.04 ** 21 + fvm(1088, 252)
    expect(n.atRetirement).toBeCloseTo(expected, 2)
    // renda por 25 anos: zera o saldo exatamente em 300 meses
    const pv = (n.income * (1 - (1 + i) ** -300)) / i
    expect(pv).toBeCloseTo(n.atRetirement, 2)
  })
  it('Roberto dia 1: subir para 8% põe +R$ 1.200 por mês, ≈ R$ 294 mil em 15 anos', () => {
    const n = opt(day('roberto', 1), 'best').numbers
    expect(n.projected).toBeGreaterThan(290000)
    expect(n.projected).toBeLessThan(298000)
  })
  it('Roberto dia 4: 3% ao mês ≈ 42,6% ao ano, mais de 5 vezes o conservador', () => {
    const n = opt(day('roberto', 4), 'best').numbers
    expect(n.promisedYear).toBeCloseTo(1.03 ** 12 - 1, 10)
    expect(n.times).toBeGreaterThan(5)
  })
  it('Roberto dia 5: taxa de 2% leva metade do rendimento (rende 2% em vez de 4%)', () => {
    expect(opt(day('roberto', 5), 'weak').numbers.projected).toBeCloseTo(50000 * 1.02 ** 15, 4)
  })
  it('Dona Lúcia dia 1: consignado de R$ 10 mil em 84x = parcela de R$ 231,77', () => {
    expect(opt(day('lucia', 1), 'weak').numbers.payment).toBeCloseTo(231.77, 1)
  })
  it('Dona Lúcia dia 2: o saldo dura até 80 (R$ 3.100), 74 (R$ 4.000) e 83 (R$ 2.800)', () => {
    const s = day('lucia', 2)
    expect(opt(s, 'ok').numbers.untilAge).toBe(80)
    expect(opt(s, 'weak').numbers.untilAge).toBe(74)
    expect(opt(s, 'best').numbers.untilAge).toBe(83)
  })
  it('Dona Lúcia dia 7: sacando R$ 2.500, o saldo dura até os 87', () => {
    expect(opt(day('lucia', 7), 'best').numbers.untilAge).toBe(87)
  })
  it('Pedro dia 3: começar aos 30 dá ≈ 56% de começar aos 19 (não "menos da metade")', () => {
    const share = opt(day('pedro', 3), 'weak').numbers.share30
    expect(share).toBeGreaterThan(0.5)
    expect(share).toBeLessThan(0.6)
  })
  it('Pedro dia 4: juntando R$ 150 por mês a partir de R$ 300, chega a R$ 2.700 em 16 meses', () => {
    expect(opt(day('pedro', 4), 'best').numbers.months).toBe(16)
  })
})
