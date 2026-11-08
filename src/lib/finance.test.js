import { describe, it, expect } from 'vitest'
import {
  annualToMonthly,
  monthlyToAnnual,
  realRate,
  futureValue,
  futureValueOfMonthly,
  monthlyInterest,
  debtAfterMonths,
  revolvingDebtAfterMonths,
  monthsToRevolvingCap,
  monthlyIncomeFromBalance,
  loanPayment,
  loanSummary,
  monthsUntilZero,
  monthsToReach,
  employerMatch,
  missedMatch,
} from './finance.js'

const RULE = { matchRate: 1, matchCap: 0.08 }

describe('conversão de taxas', () => {
  it('4% ao ano ≈ 0,3274% ao mês', () => {
    expect(annualToMonthly(0.04)).toBeCloseTo(0.0032737, 6)
  })
  it('ida e volta dá o mesmo valor', () => {
    expect(monthlyToAnnual(annualToMonthly(0.04))).toBeCloseTo(0.04, 10)
  })
  it('13% ao mês ≈ 333% ao ano (o rotativo assusta)', () => {
    expect(monthlyToAnnual(0.13)).toBeCloseTo(3.3345, 3)
  })
  it('poupança de 6,17% com inflação de 4% rende ≈ 2,09% de verdade', () => {
    expect(realRate(0.0617, 0.04)).toBeCloseTo(0.020865, 5)
  })
})

describe('juros compostos', () => {
  it('R$ 1.000 a 10% por 2 anos = R$ 1.210', () => {
    expect(futureValue(1000, 0.1, 2)).toBeCloseTo(1210, 6)
  })
  it('com taxa zero, nada muda', () => {
    expect(futureValue(500, 0, 30)).toBe(500)
  })
})

describe('valor guardado todo mês', () => {
  it('sem rendimento é só a soma dos depósitos', () => {
    expect(futureValueOfMonthly(100, 0, 10)).toBe(12000)
  })
  it('R$ 100 por 1 ano a 12,68% ao ano (1% ao mês) ≈ R$ 1.268,25', () => {
    // fórmula de referência: 100 × (1,01^12 − 1) / 0,01
    expect(futureValueOfMonthly(100, 1.01 ** 12 - 1, 1)).toBeCloseTo(1268.25, 2)
  })
  it('R$ 640 por mês em 10 anos a 4% ≈ R$ 93,9 mil (delivery da Carla)', () => {
    expect(futureValueOfMonthly(640, 0.04, 10)).toBeCloseTo(93890, -2)
  })
  it('rende mais do que a soma dos depósitos', () => {
    expect(futureValueOfMonthly(640, 0.04, 10)).toBeGreaterThan(640 * 120)
  })
})

describe('dívidas', () => {
  it('juros de um mês do rotativo: R$ 3.800 a 13% = R$ 494', () => {
    expect(monthlyInterest(3800, 0.13)).toBeCloseTo(494, 6)
  })
  it('conta pura, sem o teto da lei: R$ 3.800 a 13% por 12 meses daria ≈ R$ 16,5 mil', () => {
    expect(debtAfterMonths(3800, 0.13, 12)).toBeCloseTo(16471.19, 1)
  })
})

describe('empréstimo com parcelas fixas (tabela Price)', () => {
  it('R$ 1.000 em 2 parcelas a 10% ao mês ≈ R$ 576,19', () => {
    expect(loanPayment(1000, 0.1, 2)).toBeCloseTo(576.19, 2)
  })
  it('sem juros, a parcela é o valor dividido', () => {
    expect(loanPayment(1200, 0, 12)).toBe(100)
  })
  it('consignado de R$ 10 mil em 84 parcelas a 1,8%: parcela ≈ R$ 231,77', () => {
    const s = loanSummary(10000, 0.018, 84)
    expect(s.payment).toBeCloseTo(231.77, 1)
    expect(s.totalPaid).toBeCloseTo(s.payment * 84, 6)
    expect(s.totalInterest).toBeCloseTo(s.totalPaid - 10000, 6)
  })
})

describe('meses até zerar um saldo', () => {
  it('sem juros: R$ 1.000 pagando R$ 300 leva 4 meses', () => {
    expect(monthsUntilZero(1000, 0, 300)).toBe(4)
  })
  it('se a parcela não cobre os juros, nunca zera', () => {
    expect(monthsUntilZero(3800, 0.13, 494)).toBe(Infinity)
    expect(monthsUntilZero(3800, 0.13, 400)).toBe(Infinity)
  })
  it('saldo de R$ 480 mil sacando R$ 3.100 a 4% ao ano dura ≈ 18 anos', () => {
    const months = monthsUntilZero(480000, annualToMonthly(0.04), 3100)
    expect(months).toBeGreaterThanOrEqual(215)
    expect(months).toBeLessThanOrEqual(218)
  })
  it('saldo zerado ou negativo: zero meses', () => {
    expect(monthsUntilZero(0, 0.01, 100)).toBe(0)
  })
})

describe('meses até juntar uma meta', () => {
  it('sem rendimento: de R$ 300 a R$ 1.500 guardando R$ 150 = 8 meses', () => {
    expect(monthsToReach(1500, 300, 150, 0)).toBe(8)
  })
  it('se já tem a meta, zero meses', () => {
    expect(monthsToReach(1000, 2000, 0, 0.04)).toBe(0)
  })
  it('sem guardar nada, nunca chega', () => {
    expect(monthsToReach(1000, 0, 0, 0.04)).toBe(Infinity)
  })
})

describe('contrapartida da patrocinadora (100% até 8%)', () => {
  it('Carla contribui 2% de R$ 6.800: empresa põe R$ 136', () => {
    expect(employerMatch(6800, 0.02, RULE)).toBeCloseTo(136, 6)
  })
  it('acima de 8%, a empresa para de acompanhar', () => {
    expect(employerMatch(10000, 0.12, RULE)).toBeCloseTo(800, 6)
  })
  it('Roberto contribui 4% de R$ 15.000: deixa de receber R$ 600 por mês', () => {
    expect(missedMatch(15000, 0.04, RULE)).toBeCloseTo(600, 6)
  })
  it('quem já contribui 8% ou mais não perde nada', () => {
    expect(missedMatch(15000, 0.08, RULE)).toBe(0)
    expect(missedMatch(15000, 0.1, RULE)).toBe(0)
  })
  it('regra de 50%: metade do que a pessoa põe', () => {
    expect(employerMatch(10000, 0.05, { matchRate: 0.5, matchCap: 0.1 })).toBeCloseTo(250, 6)
  })
})

describe('rotativo com o teto da lei (Lei 14.690/2023)', () => {
  it('antes do teto, cresce com juros compostos normalmente', () => {
    expect(revolvingDebtAfterMonths(3800, 0.13, 3)).toBeCloseTo(3800 * 1.13 ** 3, 6)
  })
  it('a dívida no máximo dobra: R$ 3.800 para no máximo R$ 7.600', () => {
    expect(revolvingDebtAfterMonths(3800, 0.13, 12)).toBe(7600)
    expect(revolvingDebtAfterMonths(3800, 0.13, 120)).toBe(7600)
  })
  it('a 13% ao mês, chega ao teto em 6 meses', () => {
    expect(monthsToRevolvingCap(0.13)).toBe(6)
    expect(debtAfterMonths(1, 0.13, 5)).toBeLessThan(2)
    expect(debtAfterMonths(1, 0.13, 6)).toBeGreaterThan(2)
  })
})

describe('renda mensal a partir do saldo', () => {
  it('sem rendimento, é só dividir: R$ 300 mil por 25 anos = R$ 1.000 por mês', () => {
    expect(monthlyIncomeFromBalance(300000, 0, 25)).toBeCloseTo(1000, 6)
  })
  it('com rendimento, paga mais que a divisão simples e zera o saldo no fim do prazo', () => {
    const income = monthlyIncomeFromBalance(500000, 0.04, 25)
    expect(income).toBeGreaterThan(500000 / 300)
    expect(monthsUntilZero(500000, annualToMonthly(0.04), income)).toBe(300)
  })
})
