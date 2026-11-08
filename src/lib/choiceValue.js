// Quanto vale cada "melhor escolha" da semana, numa régua comum (decisão da Etapa 4):
// R$ POR MÊS que ficam com a pessoa.
//
// Regras (para o resumo ser fiel e não contar o mesmo dinheiro duas vezes):
// 1. Comparando com o que a pessoa faz HOJE. Quando a situação é uma decisão nova (uma oferta,
//    uma compra, um dinheiro extra), com a opção "dá para melhorar" da mesma situação.
// 2. Entra na soma por mês: gasto cortado, juros evitados, contrapartida da empresa, dinheiro
//    novo guardado (de um aumento), dinheiro que deixa de sair do saldo do plano e, quando o
//    valor guardado é o mesmo nas opções, o rendimento a mais (média por mês no prazo da situação).
// 3. Contribuição para o plano com contrapartida: conta só a parte da empresa (a parte da
//    pessoa sai do orçamento dela, que já aparece em outras contas).
// 4. Mesmo dinheiro em dias diferentes: `group` (vale o maior valor do grupo) ou `overlap`
//    (desconta a parte repetida quando as duas melhores escolhas foram feitas).
// 5. Economia que acontece uma vez só (`once`) e proteção contra perda (`protection`, ex.: não
//    cair em golpe) aparecem em linhas separadas, fora da soma por mês.
//
// Todos os números saem das próprias situações (src/data/situations.js) e do motor de cálculo.
import { employerMatch, futureValue, futureValueOfMonthly, realRate, monthsToReach } from './finance.js'
import { totalExpenses, monthlyBalance, yearsToRetirement } from '../data/personas.js'

const opt = (s, quality) => s.options.find((o) => o.quality === quality)
const best = (s) => opt(s, 'best')
const weak = (s) => opt(s, 'weak')
// Diferença final de rendimento entre a melhor e outra opção (padrão: "dá para melhorar"), média por mês
const yieldPerMonth = (s, months, base = weak(s)) => (best(s).numbers.projected - base.numbers.projected) / months
const match = (p, pct, a) => employerMatch(p.income.gross, pct, a.match)

const RULES = {
  // ---------------- Carla
  'carla-1': (s, p) => ({ kind: 'monthly', amount: -monthlyBalance(p), what: 'deixam de faltar no mês' }),
  'carla-2': (s) => ({ kind: 'monthly', amount: best(s).numbers.saved, what: 'a menos de juros do rotativo' }),
  // hoje ela já contribui com 2%: o ganho é a contrapartida a mais ao chegar a 8%
  'carla-3': (s, p, a) => ({
    kind: 'monthly',
    amount: match(p, a.match.matchCap, a) - match(p, p.plan.contributionPct, a),
    what: 'a mais da empresa no plano (indo a 8% depois de quitar o cartão)',
    group: 'carla-contrapartida',
  }),
  'carla-4': (s) => ({
    kind: 'once',
    amount: weak(s).numbers.total - best(s).numbers.total,
    what: 'a menos no tênis do Davi (em vez do rotativo)',
  }),
  'carla-5': (s, p, a, week) => ({
    kind: 'monthly',
    amount: best(s).numbers.monthly,
    what: 'a menos de delivery',
    // o corte do dia 1 já inclui um pouco de delivery
    overlap: { with: 'carla-1', amount: best(week[0]).numbers.cuts[2] },
  }),
  'carla-6': (s) => ({ kind: 'monthly', amount: yieldPerMonth(s, 36), what: 'de rendimento a mais na reserva (média em 3 anos)' }),
  'carla-7': (s, p, a) => ({
    kind: 'monthly',
    amount: match(p, a.match.matchCap, a) - match(p, p.plan.contributionPct, a),
    what: 'a mais da empresa no plano (a mesma decisão do dia 3)',
    group: 'carla-contrapartida',
  }),

  // ---------------- Roberto
  'roberto-1': (s, p, a) => ({
    kind: 'monthly',
    amount: match(p, a.match.matchCap, a) - match(p, p.plan.contributionPct, a),
    what: 'a mais da empresa no plano',
    group: 'roberto-contrapartida',
  }),
  'roberto-2': (s, p, a) => ({
    kind: 'monthly',
    amount: yieldPerMonth(s, yearsToRetirement(p, a.retirementAge) * 12),
    what: 'de rendimento a mais nos R$ 85 mil (média em 15 anos)',
  }),
  'roberto-3': (s, p, a) => ({
    kind: 'monthly',
    amount: yieldPerMonth(s, yearsToRetirement(p, a.retirementAge) * 12),
    what: 'de rendimento a mais na sobra investida (média em 15 anos)',
  }),
  'roberto-4': (s) => ({ kind: 'protection', amount: weak(s).numbers.atRisk, what: 'longe de um possível golpe' }),
  'roberto-5': (s, p, a) => ({
    kind: 'monthly',
    amount: yieldPerMonth(s, yearsToRetirement(p, a.retirementAge) * 12),
    what: 'a menos de taxa de administração (média em 15 anos)',
    // se os R$ 85 mil do dia 2 já foram para a renda fixa, a taxa de 0,5% sai daquele rendimento
    overlap: {
      with: 'roberto-2',
      amount:
        (futureValue(50000, a.fixedIncomeReturn, yearsToRetirement(p, a.retirementAge)) -
          futureValue(50000, a.fixedIncomeReturn - 0.005, yearsToRetirement(p, a.retirementAge))) /
        (yearsToRetirement(p, a.retirementAge) * 12),
    },
  }),
  'roberto-6': (s) => ({ kind: 'monthly', amount: best(s).numbers.monthly, what: 'do aumento investidos' }),
  'roberto-7': (s, p, a) => ({
    kind: 'monthly',
    amount: match(p, a.match.matchCap, a) - match(p, p.plan.contributionPct, a),
    what: 'a mais da empresa no plano (a mesma decisão do dia 1)',
    group: 'roberto-contrapartida',
  }),

  // ---------------- Dona Lúcia
  'lucia-1': (s) => ({
    kind: 'monthly',
    amount: weak(s).numbers.totalInterest / 84,
    what: 'de juros de consignado evitados (média em 84 meses)',
  }),
  // hoje ela tira R$ 3.100: o ganho é o que deixa de tirar em relação a hoje
  'lucia-2': (s, p) => ({
    kind: 'monthly',
    amount: p.plan.monthlyBenefit - best(s).numbers.benefit,
    what: 'deixam de sair do saldo do plano',
  }),
  // hoje a reserva está na poupança (a opção do meio)
  'lucia-3': (s) => ({
    kind: 'monthly',
    amount: yieldPerMonth(s, 60, opt(s, 'ok')),
    what: 'de rendimento a mais na reserva (média em 5 anos)',
  }),
  'lucia-4': (s) => ({ kind: 'protection', amount: weak(s).numbers.payment, what: 'por mês do benefício fora de risco, por 7 anos' }),
  'lucia-5': (s) => ({
    kind: 'monthly',
    amount: weak(s).numbers.totalInterest / 24,
    what: 'de juros de consignado evitados (média em 24 meses)',
  }),
  'lucia-6': (s) => ({ kind: 'monthly', amount: yieldPerMonth(s, 60), what: 'de rendimento a mais (média em 5 anos)' }),
  'lucia-7': (s) => ({ kind: 'monthly', amount: best(s).numbers.monthly, what: 'deixam de sair do saldo do plano' }),

  // ---------------- Pedro (dias 1 e 3 usam a mesma sobra de R$ 150)
  'pedro-1': (s) => ({ kind: 'monthly', amount: best(s).numbers.monthly, what: 'guardados no dia da bolsa', group: 'pedro-sobra' }),
  'pedro-2': (s) => ({ kind: 'monthly', amount: best(s).numbers.monthly, what: 'a menos de delivery e aplicativos' }),
  'pedro-3': (s) => ({
    kind: 'monthly',
    amount: best(s).numbers.monthly,
    what: 'no plano família (sai da mesma sobra do dia 1)',
    group: 'pedro-sobra',
  }),
  'pedro-4': (s) => ({
    kind: 'once',
    amount: weak(s).numbers.total - best(s).numbers.total,
    what: 'a menos no celular (em vez do rotativo)',
  }),
  'pedro-5': (s) => ({ kind: 'protection', amount: weak(s).numbers.atRisk, what: 'da reserva longe de um possível golpe' }),
  'pedro-6': (s, p, a) => {
    // rendimento a mais na reserva até chegar à meta, comparando com deixar na conta
    const target = totalExpenses(p) * 3
    const surplus = monthlyBalance(p)
    const months = monthsToReach(target, p.reserve.amount, surplus, a.fixedIncomeReturn)
    const at = (rate) => futureValue(p.reserve.amount, rate, months / 12) + futureValueOfMonthly(surplus, rate, months / 12)
    const idle = realRate(a.idleCash, a.inflation)
    return { kind: 'monthly', amount: (at(a.fixedIncomeReturn) - at(idle)) / months, what: 'de rendimento a mais na reserva' }
  },
  'pedro-7': (s) => ({ kind: 'monthly', amount: best(s).numbers.monthly, what: 'do aumento guardados (plano e reserva)' }),
}

// Valor da melhor escolha de cada dia da semana da persona (mesma ordem de `week`)
export function bestChoiceValues(week, persona, assumptions) {
  return week.map((s) => {
    const rule = RULES[s.id]
    if (!rule) throw new Error(`Situação sem valor definido: ${s.id}`)
    return { day: s.day, situationId: s.id, title: s.title, ...rule(s, persona, assumptions, week) }
  })
}

// Soma dos valores de um conjunto de dias (os dias em que a pessoa fez a melhor escolha).
// Respeita grupos (vale o maior) e sobreposições (desconta a parte repetida).
export function sumValues(values, days) {
  const chosen = values.filter((v) => days.includes(v.day))
  const ids = new Set(chosen.map((v) => v.situationId))
  const groups = {}
  let monthly = 0
  for (const v of chosen.filter((x) => x.kind === 'monthly')) {
    const amount = v.overlap && ids.has(v.overlap.with) ? v.amount - v.overlap.amount : v.amount
    if (v.group) groups[v.group] = Math.max(groups[v.group] ?? 0, amount)
    else monthly += amount
  }
  monthly += Object.values(groups).reduce((s, x) => s + x, 0)
  const total = (kind) => chosen.filter((v) => v.kind === kind).reduce((s, v) => s + v.amount, 0)
  return { monthly, once: total('once'), protection: chosen.filter((v) => v.kind === 'protection') }
}

// Resumo das escolhas: o que a pessoa conquistou e o que daria escolhendo a melhor em todas
export function choicesSummary(week, persona, assumptions, answers) {
  const values = bestChoiceValues(week, persona, assumptions)
  const bestDays = Object.entries(answers)
    .filter(([, ans]) => ans.quality === 'best')
    .map(([day]) => Number(day))
  return {
    values,
    bestDays,
    achieved: sumValues(values, bestDays),
    potential: sumValues(
      values,
      values.map((v) => v.day),
    ),
  }
}
