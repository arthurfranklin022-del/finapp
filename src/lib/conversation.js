// A conversa do WhatsApp com a PrevExemplo (Etapa 4), montada a partir da persona e do
// progresso dela na trilha. Função "pura": recebe os dados e devolve a lista de mensagens.
//
// Decisões do Arthur:
// - No topo, o resumo de outubro (fixo). Para o Pedro, que é novo, uma mensagem de boas-vindas.
// - A conversa segue o dia da demo: só aparecem as mensagens até o dia atual da persona.
// - Às 8h de cada dia chega o desafio, com o link para a situação do dia.
// - Alertas de gasto às 19h, em dias definidos por persona.
// - Ao terminar a semana, chega o resumo de novembro, com a soma das melhores escolhas.
import {
  futureValue,
  futureValueOfMonthly,
  monthlyInterest,
  revolvingDebtAfterMonths,
  monthsToRevolvingCap,
  loanSummary,
} from './finance.js'
import { formatBRLRounded as R, formatPercent } from './format.js'
import { levelFor, DAYS_IN_WEEK } from './progress.js'
import { spendingByGroup, monthOverview, donutSlices } from './spending.js'
import { choicesSummary } from './choiceValue.js'
import { THEMES, S } from '../data/situations.js'
import { monthlyBalance, yearsToRetirement } from '../data/personas.js'

// Datas fictícias da semana da demo: segunda, 23/nov/2026, a domingo, 29/nov/2026
const WEEK_START = { year: 2026, month: 10, day: 23 } // mês começa em 0 (10 = novembro)
const dateOf = (offset) => new Date(Date.UTC(WEEK_START.year, WEEK_START.month, WEEK_START.day + offset, 12))
const dateLabel = (date) =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(date)

export const dayDate = (day) => dateOf(day - 1)
export const PREVIOUS_SUMMARY_DATE = new Date(Date.UTC(2026, 10, 1, 12)) // domingo, 1º de novembro
export const MONTH_SUMMARY_DATE = dateOf(DAYS_IN_WEEK) // segunda, 30 de novembro

// Endereço da situação do dia; `de=whatsapp` faz aparecer o botão de voltar para a conversa
export const situationLink = (persona) => `#/situacao?persona=${persona.id}&de=whatsapp`

const pct = (x) => formatPercent(Math.round(x * 100) / 100)
const ordinal = (n) => `${n}º`

// Posição de um gasto entre todos os gastos da persona (1 = o maior)
const rankOf = (persona, id) =>
  [...persona.expenses].sort((a, b) => b.amount - a.amount).findIndex((e) => e.id === id) + 1

// ------------------------------------------------------------------ alertas
function deliveryAlert(persona, a) {
  const e = persona.expenses.find((x) => x.id === 'delivery')
  const share = e.amount / persona.income.net
  const rank = rankOf(persona, 'delivery')
  const in10 = futureValueOfMonthly(e.amount, a.fixedIncomeReturn, 10)
  const half10 = futureValueOfMonthly(e.amount / 2, a.fixedIncomeReturn, 10)
  const income = persona.id === 'pedro' ? 'da sua bolsa' : 'da sua renda'
  return {
    id: 'alerta-delivery',
    icon: '🛵',
    title: 'Alerta de gasto: delivery',
    lines: [
      `${e.label}: ${R(e.amount)} neste mês, ${pct(share)} ${income}. É o seu ${rank === 1 ? 'maior gasto' : `${ordinal(rank)} maior gasto`}.`,
      `Se esse valor fosse guardado todo mês num investimento conservador, viraria ${S(in10)} em 10 anos. Só metade já daria ${S(half10)}.`,
    ],
    basis: 'Renda fixa conservadora a 4% ao ano acima da inflação; valores de hoje.',
    numbers: { amount: e.amount, share, rank, in10, half10 },
  }
}

function cardBillAlert(persona, a) {
  const debt = persona.debts.find((d) => d.rateKey === 'revolvingMonthly')
  const interest = monthlyInterest(debt.balance, a.revolvingMonthly)
  const capMonths = monthsToRevolvingCap(a.revolvingMonthly, a.revolvingCap)
  const atCap = revolvingDebtAfterMonths(debt.balance, a.revolvingMonthly, capMonths, a.revolvingCap)
  return {
    id: 'alerta-fatura',
    icon: '💳',
    title: 'Lembrete: fatura do cartão',
    lines: [
      `A fatura do seu cartão vence em 3 dias. Hoje há ${R(debt.balance)} no rotativo, que custam ${R(interest)} de juros por mês.`,
      `Sem pagar, em cerca de ${capMonths} meses a dívida dobra e chega a ${R(atCap)}, o máximo que a lei deixa cobrar. Cada real da fatura que você paga diminui esses juros.`,
    ],
    basis: 'Rotativo a 13% ao mês; juros limitados a 100% da dívida (Lei 14.690/2023).',
    numbers: { balance: debt.balance, interest, capMonths, atCap },
  }
}

function idleMoneyAlert(persona, a) {
  const amount = persona.reserve.amount
  const yrs = yearsToRetirement(persona, a.retirementAge)
  const firstYear = amount * (a.fixedIncomeReturn - a.savingsReturn)
  const inSavings = futureValue(amount, a.savingsReturn, yrs)
  const inFixed = futureValue(amount, a.fixedIncomeReturn, yrs)
  // diferença com os valores já arredondados, como na situação do dia 2
  const round100 = (v) => Math.round(v / 100) * 100
  const diff = round100(inFixed) - round100(inSavings)
  return {
    id: 'alerta-dinheiro-parado',
    icon: '💤',
    title: 'Alerta: dinheiro parado',
    lines: [
      `Você tem ${S(amount)} na poupança, que rende cerca de 2% ao ano acima da inflação. Num investimento conservador de renda fixa (cerca de 4%), seriam uns ${R(firstYear)} a mais só no 1º ano, e ${S(diff)} a mais em ${yrs} anos.`,
      `E neste mês sobraram ${R(monthlyBalance(persona))} na conta, ainda sem destino.`,
    ],
    basis: 'Poupança a 2% e renda fixa conservadora a 4% ao ano acima da inflação; valores de hoje.',
    numbers: { amount, firstYear, diff, surplus: monthlyBalance(persona) },
  }
}

function healthAndLoanAlert(persona, a) {
  const health = persona.expenses.find((x) => x.id === 'saude')
  const share = health.amount / persona.income.net
  const offer = persona.loanOffer
  // mesma conta da situação do dia 1 (parcela fixa, tabela Price)
  const { payment, totalPaid: total } = loanSummary(offer.amount, a[offer.rateKey], offer.months)
  return {
    id: 'alerta-saude-consignado',
    icon: '🩺',
    title: 'Alerta de gasto: saúde',
    lines: [
      `${health.label}: ${R(health.amount)} neste mês, ${pct(share)} da sua renda. Junto com o mercado, é o seu maior gasto.`,
      'Vale conferir quando vem o próximo reajuste do plano de saúde e perguntar na farmácia se há genérico para os remédios.',
      `📞 E um cuidado: as ligações oferecendo consignado continuam? ${R(offer.amount)} em ${offer.months} parcelas de ${R(payment)} somam ${S(total)} no total. Antes de aceitar qualquer proposta, peça por escrito e veja o custo total.`,
    ],
    basis: 'Consignado a 1,8% ao mês, parcelas fixas (tabela Price).',
    numbers: { amount: health.amount, share, payment, total },
  }
}

// Em que dia (1 a 7) cada alerta chega, por persona
const ALERTS = {
  carla: [
    { day: 2, build: cardBillAlert },
    { day: 4, build: deliveryAlert },
  ],
  roberto: [{ day: 1, build: idleMoneyAlert }],
  lucia: [{ day: 3, build: healthAndLoanAlert }],
  pedro: [{ day: 1, build: deliveryAlert }],
}

export function alertsFor(persona, assumptions) {
  return (ALERTS[persona.id] ?? []).map(({ day, build }) => ({ day, ...build(persona, assumptions) }))
}

// ------------------------------------------------------------------ resumos
function monthBlock(persona) {
  return { overview: monthOverview(persona), groups: spendingByGroup(persona), donut: donutSlices(persona) }
}

function previousSummary(persona) {
  const start = persona.start ?? { points: 0, streak: 0 }
  if (start.points === 0) {
    // o Pedro está começando agora: boas-vindas no lugar do resumo de outubro
    return {
      type: 'welcome',
      id: 'boas-vindas',
      date: PREVIOUS_SUMMARY_DATE,
      time: '09:00',
      ...monthBlock(persona),
    }
  }
  return {
    type: 'summary',
    id: 'resumo-outubro',
    month: 'outubro',
    date: PREVIOUS_SUMMARY_DATE,
    time: '09:00',
    points: start.points,
    level: levelFor(start.points),
    streak: start.streak,
    ...monthBlock(persona),
  }
}

function monthSummary(persona, progress, week, assumptions) {
  const choices = choicesSummary(week, persona, assumptions, progress.answers)
  return {
    type: 'summary',
    id: 'resumo-novembro',
    month: 'novembro',
    date: MONTH_SUMMARY_DATE,
    time: '09:00',
    points: progress.points,
    monthPoints: progress.points - progress.startPoints,
    level: levelFor(progress.points),
    startLevel: levelFor(progress.startPoints),
    streak: progress.streak,
    answeredCount: Object.keys(progress.answers).length,
    bestCount: choices.bestDays.length,
    choices,
    ...monthBlock(persona),
  }
}

// ------------------------------------------------------------------ conversa
// O que aconteceu com um dia pulado: o 1º da semana é protegido pela folga, os outros zeram
function skipOutcome(progress, day) {
  const sorted = [...progress.skipped].sort((a, b) => a - b)
  const i = sorted.indexOf(day)
  if (i === -1) return null
  return i === 0 ? 'protected' : 'reset'
}

export function buildConversation(persona, progress, week, assumptions) {
  const msgs = []
  const prev = previousSummary(persona)
  msgs.push({ type: 'date', id: 'data-outubro', label: dateLabel(prev.date) })
  msgs.push(prev)

  const alerts = alertsFor(persona, assumptions)
  const lastDay = progress.finished ? DAYS_IN_WEEK : progress.day

  for (let day = 1; day <= lastDay; day++) {
    const situation = week[day - 1]
    const isToday = !progress.finished && day === progress.day
    const ans = progress.answers[day]
    msgs.push({ type: 'date', id: `data-${day}`, label: dateLabel(dayDate(day)) })
    msgs.push({
      type: 'challenge',
      id: `desafio-${day}`,
      time: '08:00',
      day,
      situationId: situation.id,
      title: situation.title,
      theme: THEMES[situation.theme],
      // o link só funciona no dia de hoje: a trilha mostra sempre a situação do dia atual
      link: isToday ? situationLink(persona) : null,
      isToday,
      answer: ans ? { quality: ans.quality, points: ans.points } : null,
      skipped: progress.skipped.includes(day),
      previousSkip: day > 1 ? skipOutcome(progress, day - 1) : null,
    })
    for (const alert of alerts.filter((x) => x.day === day)) {
      msgs.push({ type: 'alert', time: '19:00', ...alert, id: `${alert.id}-${day}` })
    }
  }

  if (progress.finished) {
    msgs.push({ type: 'date', id: 'data-resumo', label: dateLabel(MONTH_SUMMARY_DATE) })
    msgs.push(monthSummary(persona, progress, week, assumptions))
  }
  return msgs
}
