import { describe, it, expect } from 'vitest'
import { personaHighlights } from './highlights.js'
import { personas, getPersona } from '../data/personas.js'
import { ASSUMPTIONS } from '../data/assumptions.js'

const get = (personaId, highlightId) =>
  personaHighlights(getPersona(personaId), ASSUMPTIONS).find((h) => h.id === highlightId)

describe('contas de destaque', () => {
  it.each(personas)('$name tem 3 contas, todas com título, valor, explicação e premissa', (p) => {
    const list = personaHighlights(p, ASSUMPTIONS)
    expect(list).toHaveLength(3)
    for (const h of list) {
      for (const field of ['title', 'value', 'detail', 'basis']) expect(h[field].length).toBeGreaterThan(3)
      expect(h.value).not.toMatch(/NaN|Infinity|undefined/)
      expect(h.detail).not.toMatch(/NaN|Infinity|undefined/)
    }
  })

  it('Carla: rotativo custa R$ 494 por mês e vira ≈ R$ 16,5 mil em 12 meses', () => {
    const h = get('carla', 'rotativo')
    expect(h.numbers.interest).toBeCloseTo(494, 6)
    expect(h.numbers.after12).toBeCloseTo(16471, 0)
  })
  it('Carla: deixa R$ 408 da empresa por mês; em 22 anos ≈ R$ 171 mil', () => {
    const h = get('carla', 'contrapartida')
    expect(h.numbers.missed).toBeCloseTo(408, 6)
    expect(h.numbers.years).toBe(22)
    expect(h.numbers.projected).toBeGreaterThan(165000)
    expect(h.numbers.projected).toBeLessThan(176000)
  })
  it('Carla: delivery de R$ 640 vira ≈ R$ 94 mil em 10 anos', () => {
    expect(get('carla', 'gasto-delivery').numbers.projected).toBeCloseTo(93890, -2)
  })

  it('Roberto: deixa R$ 600 da empresa por mês; em 15 anos ≈ R$ 147 mil', () => {
    const h = get('roberto', 'contrapartida')
    expect(h.numbers.missed).toBeCloseTo(600, 6)
    expect(h.numbers.projected).toBeGreaterThan(143000)
    expect(h.numbers.projected).toBeLessThan(151000)
  })
  it('Roberto: poupança rende ≈ R$ 39 mil a menos em 15 anos', () => {
    const h = get('roberto', 'poupanca')
    expect(h.numbers.inSavings).toBeCloseTo(85000 * 1.02 ** 15, 2)
    expect(h.numbers.inFixedIncome).toBeCloseTo(85000 * 1.04 ** 15, 2)
    expect(h.numbers.difference).toBeGreaterThan(38000)
    expect(h.numbers.difference).toBeLessThan(40000)
  })

  it('Dona Lúcia: saldo dura até ≈ 80 anos', () => {
    expect(get('lucia', 'duracao').numbers.untilAge).toBe(80)
  })
  it('Dona Lúcia: consignado de R$ 10 mil em 84x custa ≈ R$ 9,5 mil de juros', () => {
    const h = get('lucia', 'consignado')
    expect(h.numbers.payment).toBeCloseTo(231.77, 1)
    expect(h.numbers.totalInterest).toBeGreaterThan(9400)
    expect(h.numbers.totalInterest).toBeLessThan(9600)
  })

  it('Pedro: começar aos 19 junta ≈ R$ 122 mil, quase o dobro de começar aos 30 (≈ R$ 69 mil)', () => {
    const h = get('pedro', 'comecar-cedo')
    expect(h.numbers.now).toBeCloseTo(121960, -3)
    expect(h.numbers.late).toBeCloseTo(68560, -3)
    expect(h.numbers.now / h.numbers.late).toBeGreaterThan(1.7)
  })
  it('Pedro: reserva de 3 meses (R$ 4.350) em pouco mais de 2 anos', () => {
    const h = get('pedro', 'meta-reserva')
    expect(h.numbers.target).toBe(4350)
    expect(h.numbers.months).toBeGreaterThanOrEqual(25)
    expect(h.numbers.months).toBeLessThanOrEqual(28)
  })
})
