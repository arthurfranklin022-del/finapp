// Motor de cálculo da demo.
// Convenções:
// - Taxas em número decimal: 4% = 0.04.
// - Rendimentos são REAIS (acima da inflação): o resultado é "em dinheiro de hoje".
// - Juros de dívida são NOMINAIS ao mês, como aparecem no contrato.
// - Depósitos mensais acontecem no fim de cada mês, 12 por ano.

// Taxa ao ano -> taxa equivalente ao mês. Ex.: 4% ao ano ≈ 0,327% ao mês.
export function annualToMonthly(annualRate) {
  return (1 + annualRate) ** (1 / 12) - 1
}

// Taxa ao mês -> taxa equivalente ao ano. Ex.: 13% ao mês ≈ 333% ao ano.
export function monthlyToAnnual(monthlyRate) {
  return (1 + monthlyRate) ** 12 - 1
}

// Tira a inflação de uma taxa: rendimento de 6,17% com inflação de 4% ≈ 2,09% "de verdade".
export function realRate(nominalRate, inflation) {
  return (1 + nominalRate) / (1 + inflation) - 1
}

// Juros compostos: quanto um valor guardado hoje vira depois de X anos.
export function futureValue(amount, annualRate, years) {
  return amount * (1 + annualRate) ** years
}

// Quanto vira um valor guardado TODO MÊS durante X anos (o dinheiro rende enquanto isso).
// Serve também para "quanto um gasto mensal viraria se fosse guardado".
export function futureValueOfMonthly(monthly, annualRate, years) {
  const months = Math.round(years * 12)
  const i = annualToMonthly(annualRate)
  if (i === 0) return monthly * months
  return monthly * (((1 + i) ** months - 1) / i)
}

// Juros de um mês sobre uma dívida (ex.: rotativo do cartão).
export function monthlyInterest(balance, monthlyRate) {
  return balance * monthlyRate
}

// Quanto uma dívida vira se nada for pago durante X meses.
export function debtAfterMonths(balance, monthlyRate, months) {
  return balance * (1 + monthlyRate) ** months
}

// Parcela fixa de um empréstimo (tabela Price, a usada no consignado).
export function loanPayment(principal, monthlyRate, months) {
  if (monthlyRate === 0) return principal / months
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
}

// Resumo de um empréstimo: parcela, total pago e quanto disso é juro.
export function loanSummary(principal, monthlyRate, months) {
  const payment = loanPayment(principal, monthlyRate, months)
  const totalPaid = payment * months
  return { payment, totalPaid, totalInterest: totalPaid - principal }
}

// Quantos meses até um saldo zerar, tirando um valor fixo por mês enquanto ele rende
// (ou cobra) juros. Serve para:
// - quitar uma dívida pagando X por mês;
// - quanto tempo dura o saldo do plano sacando o benefício todo mês.
// Se o valor mensal não cobre nem os juros, o saldo nunca zera: devolve Infinity.
export function monthsUntilZero(balance, monthlyRate, monthlyPayment) {
  if (balance <= 0) return 0
  if (monthlyPayment <= 0) return Infinity
  if (monthlyRate === 0) return Math.ceil(balance / monthlyPayment)
  const ratio = (balance * monthlyRate) / monthlyPayment
  if (ratio >= 1) return Infinity
  return Math.ceil(-Math.log(1 - ratio) / Math.log(1 + monthlyRate))
}

// Quantos meses guardando X por mês até juntar uma meta (partindo do que já existe).
export function monthsToReach(target, current, monthly, annualRate) {
  if (current >= target) return 0
  if (monthly <= 0) return Infinity
  const i = annualToMonthly(annualRate)
  let balance = current
  let months = 0
  while (balance < target && months < 1200) {
    balance = balance * (1 + i) + monthly
    months++
  }
  return balance >= target ? months : Infinity
}

// Contrapartida da patrocinadora: quanto a empresa deposita por mês no plano.
// Regra da PrevExemplo: a empresa põe `matchRate` (100%) do que a pessoa contribui,
// até `matchCap` (8%) do salário bruto.
export function employerMatch(grossSalary, contributionPct, { matchRate, matchCap }) {
  return grossSalary * Math.min(contributionPct, matchCap) * matchRate
}

// Quanto da contrapartida a pessoa está deixando de receber por mês
// (diferença entre contribuir o máximo que a empresa acompanha e o que contribui hoje).
export function missedMatch(grossSalary, contributionPct, rule) {
  return employerMatch(grossSalary, rule.matchCap, rule) - employerMatch(grossSalary, contributionPct, rule)
}

// Rotativo do cartão com o teto da lei (Lei 14.690/2023, em vigor desde jan/2024):
// juros e encargos do rotativo e do parcelamento da fatura não podem passar de 100% da
// dívida original. Ou seja, a dívida pode no máximo dobrar.
export function revolvingDebtAfterMonths(balance, monthlyRate, months, cap = 1) {
  return Math.min(debtAfterMonths(balance, monthlyRate, months), balance * (1 + cap))
}

// Renda mensal fixa que um saldo paga por X anos, enquanto o que fica segue rendendo
// (mesma conta da parcela fixa, só que ao contrário: o plano "paga" a pessoa).
export function monthlyIncomeFromBalance(balance, annualRate, years) {
  return loanPayment(balance, annualToMonthly(annualRate), Math.round(years * 12))
}

// Em quantos meses o rotativo chega ao teto da lei (com 13% ao mês e teto de 100%: ≈ 6 meses).
export function monthsToRevolvingCap(monthlyRate, cap = 1) {
  return Math.ceil(Math.log(1 + cap) / Math.log(1 + monthlyRate))
}
