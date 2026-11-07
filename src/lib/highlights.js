// As 3 "contas de destaque" de cada persona, mostradas na ficha.
// Todos os números saem do motor de cálculo (finance.js) e das premissas da demo.
import {
  futureValue,
  futureValueOfMonthly,
  monthlyInterest,
  revolvingDebtAfterMonths,
  monthsToRevolvingCap,
  loanSummary,
  monthsUntilZero,
  monthsToReach,
  annualToMonthly,
  missedMatch,
} from './finance.js'
import { formatBRLRounded, formatBRLShort } from './format.js'
import { totalExpenses, monthlyBalance, reserveMonths, yearsToRetirement } from '../data/personas.js'

const fmtMonths = (n) => (n === 1 ? '1 mês' : `${n} meses`)
const fmtYears = (n) => (n === 1 ? '1 ano' : `${n} anos`)
const fmtOneDecimal = (n) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(n)

// Cada conta devolve os números crus (para os testes) e os textos (para a tela)
function revolvingCost(persona, a) {
  const debt = persona.debts.find((d) => d.rateKey === 'revolvingMonthly')
  const rate = a[debt.rateKey]
  const interest = monthlyInterest(debt.balance, rate)
  // Pela Lei 14.690/2023, os juros do rotativo não passam de 100% da dívida: ela no máximo dobra
  const capMonths = monthsToRevolvingCap(rate, a.revolvingCap)
  const atCap = revolvingDebtAfterMonths(debt.balance, rate, capMonths, a.revolvingCap)
  return {
    id: 'rotativo',
    numbers: { interest, capMonths, atCap },
    title: 'O rotativo custa caro',
    value: `${formatBRLRounded(interest)} por mês`,
    detail: `Só de juros sobre os ${formatBRLRounded(debt.balance)} do cartão. Sem pagar, em cerca de ${capMonths} meses a dívida dobra e chega a ${formatBRLRounded(atCap)}, o máximo que a lei deixa cobrar.`,
    basis: 'Rotativo a 13% ao mês; juros limitados a 100% da dívida (Lei 14.690/2023).',
  }
}

function missedMatchGain(persona, a) {
  const years = yearsToRetirement(persona, a.retirementAge)
  const missed = missedMatch(persona.income.gross, persona.plan.contributionPct, a.match)
  const projected = futureValueOfMonthly(missed, a.planReturn, years)
  const pct = Math.round(persona.plan.contributionPct * 100)
  return {
    id: 'contrapartida',
    numbers: { missed, projected, years },
    title: 'Dinheiro da empresa que fica de lado',
    value: `${formatBRLRounded(missed)} por mês`,
    detail: `Contribuindo ${pct}%, ${persona.name} recebe só parte da contrapartida. Indo para 8%, a empresa põe mais ${formatBRLRounded(missed)} por mês, que viram ${formatBRLShort(projected)} aos ${a.retirementAge} anos.`,
    basis: `Contrapartida de 100% até 8% do salário; plano rendendo 4% ao ano acima da inflação por ${fmtYears(years)}; valores de hoje.`,
  }
}

function spendingInTenYears(persona, a, expenseId) {
  const expense = persona.expenses.find((e) => e.id === expenseId)
  const projected = futureValueOfMonthly(expense.amount, a.fixedIncomeReturn, 10)
  return {
    id: `gasto-${expenseId}`,
    numbers: { monthly: expense.amount, projected },
    title: `${expense.label}: quanto vira em 10 anos`,
    value: formatBRLShort(projected),
    detail: `Se os ${formatBRLRounded(expense.amount)} por mês fossem guardados em vez de gastos. Cortar só metade já daria ${formatBRLShort(projected / 2)}.`,
    basis: 'Investimento conservador rendendo 4% ao ano acima da inflação; valores de hoje.',
  }
}

function idleSavings(persona, a) {
  const years = yearsToRetirement(persona, a.retirementAge)
  const amount = persona.reserve.amount
  const inSavings = futureValue(amount, a.savingsReturn, years)
  const inFixedIncome = futureValue(amount, a.fixedIncomeReturn, years)
  const difference = inFixedIncome - inSavings
  return {
    id: 'poupanca',
    numbers: { inSavings, inFixedIncome, difference, years },
    title: 'A poupança rende pouco',
    value: `${formatBRLShort(difference)} a menos`,
    detail: `Em ${fmtYears(years)}, os ${formatBRLShort(amount)} da poupança viram ${formatBRLShort(inSavings)}. Num investimento conservador, virariam ${formatBRLShort(inFixedIncome)}.`,
    basis: 'Poupança a 2% e renda fixa conservadora a 4% ao ano acima da inflação; valores de hoje.',
  }
}

function monthlySurplus(persona, a) {
  const years = yearsToRetirement(persona, a.retirementAge)
  const surplus = monthlyBalance(persona)
  const projected = futureValueOfMonthly(surplus, a.fixedIncomeReturn, years)
  return {
    id: 'sobra',
    numbers: { surplus, projected, years },
    title: 'A sobra do mês tem potencial',
    value: formatBRLShort(projected),
    detail: `É quanto os ${formatBRLRounded(surplus)} que sobram por mês viram aos ${a.retirementAge} anos, se forem investidos em vez de parados.`,
    basis: `Investimento conservador rendendo 4% ao ano acima da inflação por ${fmtYears(years)}; valores de hoje.`,
  }
}

function balanceDuration(persona, a) {
  const months = monthsUntilZero(persona.plan.balance, annualToMonthly(a.planReturn), persona.plan.monthlyBenefit)
  const years = Math.floor(months / 12)
  return {
    id: 'duracao',
    numbers: { months, untilAge: persona.age + years },
    title: 'Até quando o saldo do plano dura',
    value: `Até os ${persona.age + years} anos`,
    detail: `Sacando ${formatBRLRounded(persona.plan.monthlyBenefit)} por mês, os ${formatBRLShort(persona.plan.balance)} do plano duram cerca de ${fmtYears(years)}, porque o saldo segue rendendo.`,
    basis: 'Plano de contribuição definida rendendo 4% ao ano acima da inflação; benefício fixo em valores de hoje.',
  }
}

function loanOfferCost(persona, a) {
  const offer = persona.loanOffer
  const s = loanSummary(offer.amount, a[offer.rateKey], offer.months)
  return {
    id: 'consignado',
    numbers: s,
    title: 'O consignado que oferecem',
    value: `${formatBRLShort(s.totalPaid)} no total`,
    detail: `Pegar ${formatBRLRounded(offer.amount)} em ${offer.months} parcelas de ${formatBRLRounded(s.payment)} significa pagar ${formatBRLShort(s.totalInterest)} só de juros.`,
    basis: 'Consignado a 1,8% ao mês, parcelas fixas (tabela Price).',
  }
}

function reserveCoverage(persona) {
  const months = reserveMonths(persona)
  return {
    id: 'reserva',
    numbers: { months },
    title: 'A reserva para imprevistos',
    value: `${fmtOneDecimal(months)} meses de gastos`,
    detail: `Os ${formatBRLShort(persona.reserve.amount)} guardados pagam cerca de ${fmtOneDecimal(months)} meses das despesas. Uma referência comum é ter de 3 a 6 meses.`,
    basis: `Gastos de ${formatBRLRounded(totalExpenses(persona))} por mês.`,
  }
}

function startEarly(persona, a) {
  const monthly = 100
  const lateAge = 30
  const now = futureValueOfMonthly(monthly, a.planReturn, a.retirementAge - persona.age)
  const late = futureValueOfMonthly(monthly, a.planReturn, a.retirementAge - lateAge)
  return {
    id: 'comecar-cedo',
    numbers: { now, late },
    title: 'Começar cedo faz diferença',
    value: formatBRLShort(now),
    detail: `R$ 100 por mês no plano família, dos ${persona.age} aos ${a.retirementAge} anos. Começando só aos ${lateAge}, seriam ${formatBRLShort(late)}.`,
    basis: 'Plano família rendendo 4% ao ano acima da inflação, sem contrapartida; valores de hoje.',
  }
}

function reserveGoal(persona, a) {
  const target = totalExpenses(persona) * 3
  const surplus = monthlyBalance(persona)
  const months = monthsToReach(target, persona.reserve.amount, surplus, a.fixedIncomeReturn)
  return {
    id: 'meta-reserva',
    numbers: { target, months },
    title: 'Reserva de 3 meses',
    value: `${fmtMonths(months)} para chegar`,
    detail: `Guardando a sobra de ${formatBRLRounded(surplus)} por mês, ${persona.name} junta ${formatBRLRounded(target)} (3 meses de gastos) em cerca de ${fmtMonths(months)}.`,
    basis: 'Investimento conservador rendendo 4% ao ano acima da inflação.',
  }
}

// Quais contas aparecem para cada persona
const BY_PERSONA = {
  carla: (p, a) => [revolvingCost(p, a), missedMatchGain(p, a), spendingInTenYears(p, a, 'delivery')],
  roberto: (p, a) => [missedMatchGain(p, a), idleSavings(p, a), monthlySurplus(p, a)],
  lucia: (p, a) => [balanceDuration(p, a), loanOfferCost(p, a), reserveCoverage(p)],
  pedro: (p, a) => [startEarly(p, a), spendingInTenYears(p, a, 'delivery'), reserveGoal(p, a)],
}

export function personaHighlights(persona, assumptions) {
  return BY_PERSONA[persona.id]?.(persona, assumptions) ?? []
}
