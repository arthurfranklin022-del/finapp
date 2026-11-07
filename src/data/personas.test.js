import { describe, it, expect } from 'vitest'
import {
  personas,
  getPersona,
  DEFAULT_PERSONA_ID,
  totalExpenses,
  monthlyBalance,
  totalDebt,
  reserveMonths,
  yearsToRetirement,
} from './personas.js'
import { ASSUMPTIONS } from './assumptions.js'

describe('personas da demo', () => {
  it('são 4, com identificadores diferentes', () => {
    expect(personas).toHaveLength(4)
    expect(new Set(personas.map((p) => p.id)).size).toBe(4)
  })
  it('encontra uma persona pelo identificador', () => {
    expect(getPersona('lucia').name).toBe('Dona Lúcia')
  })
  it('volta para a persona padrão se o identificador não existir', () => {
    expect(getPersona('ninguem').id).toBe(DEFAULT_PERSONA_ID)
  })
})

// Os números aprovados pelo Arthur na Etapa 2 (SPEC.md, "Decisões por etapa")
describe('números aprovados', () => {
  it.each([
    ['carla', 5200, 5650, -450],
    ['roberto', 11000, 8200, 2800],
    ['lucia', 6000, 5700, 300],
    ['pedro', 1600, 1450, 150],
  ])('%s: renda líquida %d, gasta %d, sobra %d', (id, net, spent, balance) => {
    const p = getPersona(id)
    expect(p.income.net).toBe(net)
    expect(totalExpenses(p)).toBe(spent)
    expect(monthlyBalance(p)).toBe(balance)
  })
  it('Carla: R$ 3.800 no rotativo, sem reserva, 2% no plano, saldo R$ 38 mil', () => {
    const p = getPersona('carla')
    expect(totalDebt(p)).toBe(3800)
    expect(p.reserve.amount).toBe(0)
    expect(p.plan.contributionPct).toBe(0.02)
    expect(p.plan.balance).toBe(38000)
    expect(p.expenses.find((e) => e.id === 'delivery').amount).toBe(640)
  })
  it('Roberto: R$ 85 mil na poupança, 4% no plano, saldo R$ 210 mil, sem dívidas', () => {
    const p = getPersona('roberto')
    expect(p.reserve).toMatchObject({ amount: 85000, where: 'Poupança' })
    expect(p.plan.contributionPct).toBe(0.04)
    expect(p.plan.balance).toBe(210000)
    expect(totalDebt(p)).toBe(0)
  })
  it('Dona Lúcia: R$ 3.100 do plano + R$ 2.900 do INSS, saúde R$ 1.300, sem consignado', () => {
    const p = getPersona('lucia')
    const sources = p.income.sources.reduce((s, x) => s + x.amount, 0)
    expect(sources).toBe(p.income.net)
    expect(p.plan.monthlyBenefit).toBe(3100)
    expect(p.plan.balance).toBe(480000)
    expect(p.expenses.find((e) => e.id === 'saude').amount).toBe(1300)
    expect(totalDebt(p)).toBe(0)
  })
  it('Pedro: bolsa de R$ 1.600, delivery R$ 380, reserva R$ 300, ainda fora do plano família', () => {
    const p = getPersona('pedro')
    expect(p.income.net).toBe(1600)
    expect(p.expenses.find((e) => e.id === 'delivery').amount).toBe(380)
    expect(p.reserve.amount).toBe(300)
    expect(p.plan).toMatchObject({ kind: 'familia', member: false })
  })
})

describe('coerência dos dados', () => {
  it.each(personas)('$name: tem história, 2 objetivos e gastos sem repetir categoria', (p) => {
    expect(p.story.length).toBeGreaterThan(50)
    expect(p.goals).toHaveLength(2)
    expect(new Set(p.expenses.map((e) => e.id)).size).toBe(p.expenses.length)
    for (const e of p.expenses) expect(e.amount).toBeGreaterThan(0)
  })
  it.each(personas)('$name: líquido nunca maior que o bruto', (p) => {
    expect(p.income.net).toBeLessThanOrEqual(p.income.gross)
  })
  it.each(personas)('$name: toda dívida aponta para uma taxa que existe', (p) => {
    for (const d of p.debts) expect(ASSUMPTIONS[d.rateKey]).toBeTypeOf('number')
  })
})

describe('contas auxiliares', () => {
  it('reserva da Dona Lúcia cobre ≈ 3,9 meses de gastos', () => {
    expect(reserveMonths(getPersona('lucia'))).toBeCloseTo(22000 / 5700, 6)
  })
  it('anos até a aposentadoria (60): Carla 22, Roberto 15, Dona Lúcia 0', () => {
    expect(yearsToRetirement(getPersona('carla'), 60)).toBe(22)
    expect(yearsToRetirement(getPersona('roberto'), 60)).toBe(15)
    expect(yearsToRetirement(getPersona('lucia'), 60)).toBe(0)
  })
})
