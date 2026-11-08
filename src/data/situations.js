// As situações do dia: 7 por persona (uma semana), escritas para a Etapa 3.
// Cada situação: contexto com os números da persona → "o que você faria?" → 3 opções →
// feedback com a conta de cada escolha → "por que isso importa".
//
// Os textos falam com a própria pessoa ("você"): é ela quem abre o link no WhatsApp.
// Todos os números saem do motor de cálculo (src/lib/finance.js), das premissas
// (src/data/assumptions.js) e dos dados da persona (src/data/personas.js).
// Cada situação parte dos números originais da persona (as escolhas de um dia não mudam o seguinte).
// Cada opção guarda os números crus em `numbers` (para os testes) e os textos para a tela.
//
// quality: 'best' = melhor escolha · 'ok' = caminho do meio · 'weak' = dá para melhorar
import {
  annualToMonthly,
  monthlyToAnnual,
  realRate,
  futureValue,
  futureValueOfMonthly,
  monthlyInterest,
  revolvingDebtAfterMonths,
  monthsToRevolvingCap,
  loanSummary,
  monthsUntilZero,
  monthsToReach,
  employerMatch,
  monthlyIncomeFromBalance,
} from '../lib/finance.js'
import { formatBRL, formatBRLRounded as R, formatBRLShort, formatPercent } from '../lib/format.js'
import { totalExpenses, monthlyBalance, yearsToRetirement } from './personas.js'

export const THEMES = {
  previdencia: { label: 'Previdência', emoji: '🌳' },
  orcamento: { label: 'Orçamento e dívidas', emoji: '🧾' },
  investimentos: { label: 'Investimentos', emoji: '🌱' },
}

// Pontos por tipo de escolha (decisão da Etapa 3)
export const POINTS = { best: 30, ok: 20, weak: 10 }

// Dinheiro nas situações: até R$ 10 mil, valor inteiro; até R$ 100 mil, arredondado na centena
// (R$ 46.900); acima disso, curto (R$ 294 mil). Evita números "precisos demais" e evita
// que duas opções diferentes apareçam com o mesmo valor arredondado.
const roundForDisplay = (v) => {
  const abs = Math.abs(v)
  const step = abs < 10000 ? 1 : abs < 100000 ? 100 : 1000
  return Math.round(v / step) * step
}
export const S = (v) => (Math.abs(v) < 100000 ? R(roundForDisplay(v)) : formatBRLShort(roundForDisplay(v)))
// Diferença entre dois valores, calculada com os valores já arredondados que aparecem na tela
// (assim "R$ 26.800 − R$ 24.300" aparece como R$ 2.500, e não R$ 2.477).
const D = (x, y) => S(roundForDisplay(x) - roundForDisplay(y))
const months = (n) => (n === 1 ? '1 mês' : `${n} meses`)
const years = (n) => (n === 1 ? '1 ano' : `${n} anos`)
const oneDecimal = (n) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(n)
const expense = (p, id) => p.expenses.find((e) => e.id === id).amount
// Rendimento real do dinheiro parado (0% ao ano tirando a inflação: ≈ -3,8% ao ano)
const idleRate = (a) => realRate(a.idleCash, a.inflation)
// Quanto a dívida no rotativo chega, no máximo, pelo teto da lei
const revolvingAtCap = (amount, a) =>
  revolvingDebtAfterMonths(amount, a.revolvingMonthly, monthsToRevolvingCap(a.revolvingMonthly, a.revolvingCap), a.revolvingCap)

// Saldo do plano na aposentadoria: o que já existe rendendo + contribuições mensais.
// `phases` = [{ monthly, years }] em sequência (ex.: 5 anos com um valor e depois outro).
function planAtRetirement(balance, phases, a) {
  let total = balance
  for (const ph of phases) total = futureValue(total, a.planReturn, ph.years) + futureValueOfMonthly(ph.monthly, a.planReturn, ph.years)
  return total
}

// Até que idade o saldo do plano paga um benefício mensal fixo
const balanceLastsUntil = (p, benefit, a) =>
  p.age + Math.floor(monthsUntilZero(p.plan.balance, annualToMonthly(a.planReturn), benefit) / 12)

// ---------------------------------------------------------------- Carla
// Nas contas de previdência da Carla, supomos que ela quita o cartão em 1 ano
// e só então muda a contribuição (premissa escrita no próprio texto da situação).
const CARLA_PAYOFF_YEARS = 1

const carla = [
  // Dia 1 — fechar o mês
  (p) => {
    const gap = -monthlyBalance(p)
    const subs = expense(p, 'assinaturas')
    const halfLeisure = expense(p, 'lazer') / 2
    return {
      id: 'carla-1',
      theme: 'orcamento',
      title: 'O mês não fecha',
      context: `Este mês entraram ${R(p.income.net)} e saíram ${R(totalExpenses(p))}. Faltaram ${R(gap)}, que foram parar no cartão de crédito, onde a dívida cobra 13% ao mês.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: `Cancelar as assinaturas (${R(subs)})`,
          result: `Ainda faltam ${R(gap - subs)} por mês`,
          detail: `Ajuda, mas em 1 ano ainda seriam ${R((gap - subs) * 12)} a mais no cartão, pagando 13% ao mês.`,
          numbers: { stillMissing: gap - subs },
        },
        {
          id: 'b',
          quality: 'best',
          label: `Achar ${R(gap)} nos gastos que dá para mexer`,
          result: 'O mês fecha e a dívida para de crescer',
          detail: `Por exemplo: assinaturas (${R(subs)}), metade do lazer (${R(halfLeisure)}) e um pouco do delivery (${R(gap - subs - halfLeisure)}). Somam ${R(gap)}.`,
          numbers: { stillMissing: 0, cuts: [subs, halfLeisure, gap - subs - halfLeisure] },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Deixar como está e ver no mês que vem',
          result: `${R(gap * 12)} a mais no cartão em 1 ano`,
          detail: `São 12 meses de ${R(gap)} indo para o cartão, fora os juros de 13% ao mês sobre tudo isso.`,
          numbers: { stillMissing: gap },
        },
      ],
      why: 'Enquanto o mês não fecha, qualquer dívida só cresce. O primeiro passo é parar de faltar dinheiro; depois dá para atacar a dívida.',
      lesson: 'Fechar o mês vem antes de tudo.',
    }
  },

  // Dia 2 — dinheiro extra: abater dívida ou guardar?
  (p, a) => {
    const debt = p.debts[0].balance
    const extra = 1000
    const interestNow = monthlyInterest(debt, a.revolvingMonthly)
    const interestAfter = monthlyInterest(debt - extra, a.revolvingMonthly)
    const savingsGain = extra * annualToMonthly(a.savingsReturn)
    return {
      id: 'carla-2',
      theme: 'orcamento',
      title: 'Um dinheiro a mais',
      context: `Você fez hora extra e recebeu ${R(extra)}. A sua dívida no rotativo é de ${R(debt)} e cobra ${R(interestNow)} de juros por mês.`,
      question: `O que você faria com os ${R(extra)}?`,
      options: [
        {
          id: 'a',
          quality: 'best',
          label: 'Usar tudo para abater o rotativo',
          result: `${R(interestNow - interestAfter)} a menos de juros todo mês`,
          detail: `A dívida cai para ${R(debt - extra)} e os juros, de ${R(interestNow)} para ${R(interestAfter)} por mês.`,
          numbers: { saved: interestNow - interestAfter },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Guardar na poupança, para uma emergência',
          result: `Rende cerca de ${formatBRL(savingsGain)} por mês acima da inflação`,
          detail: `Enquanto isso, os mesmos ${R(extra)} no rotativo custam ${R(interestNow - interestAfter)} por mês. Ter reserva é bom, mas, com dívida cara, a conta não fecha.`,
          numbers: { gain: savingsGain },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Fazer um passeio especial com o Davi',
          result: `Os juros seguem em ${R(interestNow)} por mês`,
          detail: 'Momentos com a família importam. Mas, com a dívida no rotativo, um passeio mais simples deixaria parte do dinheiro para abater a dívida.',
          numbers: { saved: 0 },
        },
      ],
      why: 'Nenhum investimento seguro rende 13% ao mês. Quitar uma dívida cara é o “investimento” que mais rende.',
      lesson: 'Dívida cara se paga primeiro.',
    }
  },

  // Dia 3 — zerar a contribuição do plano?
  (p, a) => {
    const yrs = yearsToRetirement(p, a.retirementAge)
    const own = p.income.gross * p.plan.contributionPct
    const match = employerMatch(p.income.gross, p.plan.contributionPct, a.match)
    const matchAt8 = employerMatch(p.income.gross, a.match.matchCap, a.match)
    const lostIfZero = futureValueOfMonthly(own + match, a.planReturn, yrs)
    const gainAt8 = futureValueOfMonthly(matchAt8 - match, a.planReturn, yrs - CARLA_PAYOFF_YEARS)
    return {
      id: 'carla-3',
      theme: 'previdencia',
      title: 'Parar de contribuir para o plano?',
      context: `Para sobrar dinheiro, você pensa em zerar a sua contribuição de 2% do salário (${R(own)} por mês) para o plano da PrevExemplo. Hoje, a empresa coloca o mesmo valor: mais ${R(match)}.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: 'Zerar a contribuição por um tempo',
          result: `O plano deixa de receber ${R(own + match)} por mês`,
          detail: `Sobram ${R(own)} no mês, mas a empresa também para de depositar. Se ficasse assim até os ${a.retirementAge}, seriam ${S(lostIfZero)} a menos no plano.`,
          numbers: { lost: lostIfZero },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Manter os 2% como está',
          result: `Segue ganhando ${R(match)} da empresa por mês`,
          detail: `Bom não parar. Mas, contribuindo 2%, você deixa ${R(matchAt8 - match)} por mês da empresa de lado.`,
          numbers: { missed: matchAt8 - match },
        },
        {
          id: 'c',
          quality: 'best',
          label: 'Manter os 2% e subir para 8% quando quitar o cartão',
          result: `A empresa passa a pôr ${R(matchAt8)} por mês`,
          detail: `São ${R(matchAt8 - match)} a mais por mês só da empresa. Se você quitar o cartão em ${years(CARLA_PAYOFF_YEARS)} e subir depois disso, esse dinheiro a mais vira ${S(gainAt8)} aos ${a.retirementAge}.`,
          numbers: { gain: gainAt8 },
        },
      ],
      why: 'A contrapartida é um dinheiro que a empresa só coloca se você também colocar: até 8% do salário, cada R$ 1 seu vira R$ 2 no mesmo dia.',
      lesson: 'Nunca abrir mão da contrapartida.',
    }
  },

  // Dia 4 — compra parcelada
  (p, a) => {
    const price = 600
    const cash = price * 0.9
    const capMonths = monthsToRevolvingCap(a.revolvingMonthly, a.revolvingCap)
    const revolving = revolvingAtCap(price, a)
    return {
      id: 'carla-4',
      theme: 'orcamento',
      title: 'O tênis do Davi',
      context: `O Davi precisa de um tênis para a escola. Na loja: ${R(price)} em 6 vezes sem juros, ou ${R(cash)} à vista (10% de desconto). Você não tem esse dinheiro sobrando agora.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: `Parcelar em 6 vezes de ${R(price / 6)} sem juros`,
          result: `Paga ${R(price - cash)} a mais que à vista`,
          detail: `Sem juros, mas são ${R(price / 6)} a menos por mês pelos próximos 6 meses, num orçamento que já não fecha.`,
          numbers: { total: price },
        },
        {
          id: 'b',
          quality: 'weak',
          label: 'Comprar no cartão e deixar a fatura no rotativo',
          result: `Os ${R(price)} podem virar ${R(revolving)}`,
          detail: `A 13% ao mês, a dívida dobra em cerca de ${capMonths} meses. ${R(revolving)} é o máximo que a lei deixa cobrar (o dobro), e mesmo assim é muito.`,
          numbers: { total: revolving },
        },
        {
          id: 'c',
          quality: 'best',
          label: 'Segurar outros gastos no mês que vem e pagar à vista',
          result: `Paga ${R(cash)} e economiza ${R(price - cash)}`,
          detail: `Por exemplo, pedindo menos delivery por um mês. Você garante o desconto e não compromete os próximos meses.`,
          numbers: { total: cash },
        },
      ],
      why: '“Sem juros” não quer dizer “de graça”: a parcela ocupa a renda dos próximos meses. E, se a fatura não for paga inteira, o rotativo transforma uma compra pequena numa dívida grande.',
      lesson: 'Parcela também é dívida.',
    }
  },

  // Dia 5 — delivery: quanto vira em 10 anos
  (p, a) => {
    const delivery = expense(p, 'delivery')
    const fv = (m) => futureValueOfMonthly(m, a.fixedIncomeReturn, 10)
    return {
      id: 'carla-5',
      theme: 'orcamento',
      title: 'O delivery da semana',
      context: `Você gasta ${R(delivery)} por mês com delivery, quase sempre à noite, depois do trabalho.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'best',
          label: 'Trocar metade dos pedidos por comida feita no fim de semana',
          result: `${S(fv(delivery / 2))} em 10 anos`,
          detail: `Se os ${R(delivery / 2)} por mês que deixam de ir para o delivery forem guardados num investimento conservador.`,
          numbers: { projected: fv(delivery / 2), monthly: delivery / 2 },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Fazer um pedido a menos por semana',
          result: `${S(fv(delivery / 4))} em 10 anos`,
          detail: `Corta cerca de ${R(delivery / 4)} por mês. Já é um começo.`,
          numbers: { projected: fv(delivery / 4) },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Manter como está: é o seu descanso',
          result: 'Nada muda',
          detail: `Só para comparar: os ${R(delivery)} por mês, guardados por 10 anos, virariam ${S(fv(delivery))}.`,
          numbers: { projected: 0 },
        },
      ],
      why: 'Gastos pequenos e frequentes somam muito. Não é preciso cortar tudo: metade já faz diferença.',
      lesson: 'Gasto pequeno de todo dia vira dinheiro grande.',
    }
  },

  // Dia 6 — onde guardar a reserva
  (p, a) => {
    const monthly = 300
    const fv = (r) => futureValueOfMonthly(monthly, r, 3)
    return {
      id: 'carla-6',
      theme: 'investimentos',
      title: 'A primeira reserva',
      context: `Quando quitar o cartão, você quer guardar ${R(monthly)} por mês para imprevistos. Em 3 anos, serão ${R(monthly * 36)} guardados.`,
      question: 'Onde você deixaria esse dinheiro?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: 'Parado na conta corrente, para ficar à mão',
          result: `Vale ${S(fv(idleRate(a)))} em dinheiro de hoje`,
          detail: 'Parado, o dinheiro não rende, e a inflação come um pouco dele todo ano.',
          numbers: { projected: fv(idleRate(a)) },
        },
        {
          id: 'b',
          quality: 'best',
          label: 'Num investimento conservador de renda fixa que dá para resgatar a qualquer dia',
          result: `Vira ${S(fv(a.fixedIncomeReturn))} em dinheiro de hoje`,
          detail: 'Fica fácil de pegar numa emergência e rende acima da inflação.',
          numbers: { projected: fv(a.fixedIncomeReturn) },
        },
        {
          id: 'c',
          quality: 'ok',
          label: 'Na poupança',
          result: `Vira ${S(fv(a.savingsReturn))} em dinheiro de hoje`,
          detail: 'É segura e fácil de pegar, mas rende menos que outras opções conservadoras.',
          numbers: { projected: fv(a.savingsReturn) },
        },
      ],
      why: 'A reserva precisa ser segura e fácil de pegar. Mas, parada, perde para a inflação, e dá para ter as duas coisas.',
      lesson: 'Reserva: segura, à mão e rendendo.',
    }
  },

  // Dia 7 — quanto contribuir depois de quitar
  (p, a) => {
    const yrs = yearsToRetirement(p, a.retirementAge)
    const total = (pct) => p.income.gross * pct + employerMatch(p.income.gross, pct, a.match)
    const current = total(p.plan.contributionPct)
    // 1 ano como está (enquanto quita o cartão) e depois a nova contribuição até os 60
    const scenario = (pct) => {
      const atRetirement = planAtRetirement(
        p.plan.balance,
        [
          { monthly: current, years: CARLA_PAYOFF_YEARS },
          { monthly: total(pct), years: yrs - CARLA_PAYOFF_YEARS },
        ],
        a,
      )
      return { atRetirement, income: monthlyIncomeFromBalance(atRetirement, a.planReturn, a.payoutYears), monthly: total(pct) }
    }
    const s2 = scenario(0.02)
    const s5 = scenario(0.05)
    const s8 = scenario(0.08)
    return {
      id: 'carla-7',
      theme: 'previdencia',
      title: 'O plano aos 60',
      context: `Você tem ${S(p.plan.balance)} no plano. Hoje contribui com 2% do salário e, com a empresa, entram ${R(current)} por mês. A ideia é rever isso quando quitar o cartão, daqui a cerca de ${years(CARLA_PAYOFF_YEARS)}.`,
      question: 'Para quanto você mudaria a contribuição?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: 'Subir para 5%',
          result: `Renda do plano de cerca de ${R(s5.income)} por mês aos ${a.retirementAge}`,
          detail: `Com a empresa, passam a entrar ${R(s5.monthly)} por mês. Aos ${a.retirementAge}, o saldo chega a ${S(s5.atRetirement)}.`,
          numbers: s5,
        },
        {
          id: 'b',
          quality: 'best',
          label: 'Subir para 8%, o máximo que a empresa acompanha',
          result: `Renda do plano de cerca de ${R(s8.income)} por mês aos ${a.retirementAge}`,
          detail: `Com a empresa, passam a entrar ${R(s8.monthly)} por mês. Aos ${a.retirementAge}, o saldo chega a ${S(s8.atRetirement)}.`,
          numbers: s8,
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Ficar nos 2%',
          result: `Renda do plano de cerca de ${R(s2.income)} por mês aos ${a.retirementAge}`,
          detail: `Seguem entrando ${R(s2.monthly)} por mês. Aos ${a.retirementAge}, o saldo chega a ${S(s2.atRetirement)}.`,
          numbers: s2,
        },
      ],
      why: 'Cada ponto de contribuição hoje vira renda todo mês na aposentadoria, além do INSS. E, até 8% do salário, a empresa dobra o que você coloca.',
      lesson: 'Contribuir até 8% dobra o esforço.',
    }
  },
]

// ---------------------------------------------------------------- Roberto
const roberto = [
  // Dia 1 — a contrapartida que fica de lado
  (p, a) => {
    const yrs = yearsToRetirement(p, a.retirementAge)
    const extra = (pct) => p.income.gross * (pct - p.plan.contributionPct) * 2 // seu + da empresa
    const fvPlan = (m) => futureValueOfMonthly(m, a.planReturn, yrs)
    const own = p.income.gross * p.plan.contributionPct
    const inSavings = futureValueOfMonthly(own, a.savingsReturn, yrs)
    return {
      id: 'roberto-1',
      theme: 'previdencia',
      title: 'Dinheiro da empresa na mesa',
      context: `Você contribui com 4% do salário (${R(own)} por mês) e a empresa põe o mesmo. Mas a PrevExemplo acompanha até 8%: você está deixando ${R(own)} por mês da empresa de lado.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'best',
          label: 'Subir para 8%',
          result: `+${R(extra(0.08))} por mês no plano`,
          detail: `Metade disso vem da empresa. Em ${years(yrs)}, esse dinheiro a mais vira ${S(fvPlan(extra(0.08)))}.`,
          numbers: { projected: fvPlan(extra(0.08)) },
        },
        {
          id: 'b',
          quality: 'weak',
          label: `Manter 4% e guardar os ${R(own)} na poupança`,
          result: `${S(inSavings)} em ${years(yrs)}`,
          detail: `Sem a parte da empresa e rendendo menos. Os mesmos ${R(own)} no plano, com a empresa acompanhando, virariam ${S(fvPlan(extra(0.08)))}.`,
          numbers: { projected: inSavings },
        },
        {
          id: 'c',
          quality: 'ok',
          label: 'Subir para 6%',
          result: `+${R(extra(0.06))} por mês no plano`,
          detail: `Metade vem da empresa. Em ${years(yrs)}, vira ${S(fvPlan(extra(0.06)))}. Ainda fica contrapartida na mesa.`,
          numbers: { projected: fvPlan(extra(0.06)) },
        },
      ],
      why: 'A contrapartida é um “rendimento” de 100% no mesmo dia, que nenhum investimento oferece. Deixar de usá-la é deixar parte do salário com a empresa.',
      lesson: 'A contrapartida rende 100% no dia.',
    }
  },

  // Dia 2 — poupança x renda fixa
  (p, a) => {
    const yrs = yearsToRetirement(p, a.retirementAge)
    const amount = p.reserve.amount
    const fv = (x, r) => futureValue(x, r, yrs)
    const all = fv(amount, a.fixedIncomeReturn)
    const none = fv(amount, a.savingsReturn)
    const half = fv(amount / 2, a.savingsReturn) + fv(amount / 2, a.fixedIncomeReturn)
    return {
      id: 'roberto-2',
      theme: 'investimentos',
      title: `${S(amount)} na poupança`,
      context: `Você guarda ${S(amount)} na poupança “por segurança”. A poupança rende 2% ao ano acima da inflação; um investimento conservador de renda fixa, cerca de 4%.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: 'Deixar tudo na poupança',
          result: `${S(none)} em ${years(yrs)}`,
          detail: 'Seguro, mas é o caminho que menos rende entre os três.',
          numbers: { projected: none },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Mover metade para renda fixa conservadora',
          result: `${S(half)} em ${years(yrs)}`,
          detail: 'Um passo seguro para começar e ganhar confiança.',
          numbers: { projected: half },
        },
        {
          id: 'c',
          quality: 'best',
          label: 'Mover tudo para renda fixa conservadora que dá para resgatar a qualquer dia',
          result: `${S(all)} em ${years(yrs)}`,
          detail: `A reserva de emergência continua à mão, e o total rende ${D(all, none)} a mais que na poupança.`,
          numbers: { projected: all },
        },
      ],
      why: '2 pontos por ano parecem pouco, mas os juros compostos fazem essa diferença crescer com o tempo. Segurança e rendimento podem andar juntos.',
      lesson: 'Seguro não precisa render pouco.',
    }
  },

  // Dia 3 — pague-se primeiro
  (p, a) => {
    const yrs = yearsToRetirement(p, a.retirementAge)
    const surplus = monthlyBalance(p)
    const fv = (r) => futureValueOfMonthly(surplus, r, yrs)
    return {
      id: 'roberto-3',
      theme: 'orcamento',
      title: 'A sobra sem destino',
      context: `Todo mês sobram ${R(surplus)} para você. Esse dinheiro não tem um plano: o que não é gasto fica na conta.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: 'Mandar para a poupança o que sobrar no fim do mês',
          result: `${S(fv(a.savingsReturn))} aos ${a.retirementAge}`,
          detail: 'Bom hábito, mas a poupança rende menos. E, no fim do mês, costuma sobrar menos do que o previsto.',
          numbers: { projected: fv(a.savingsReturn) },
        },
        {
          id: 'b',
          quality: 'best',
          label: 'Programar o investimento para o dia do salário',
          result: `${S(fv(a.fixedIncomeReturn))} aos ${a.retirementAge}`,
          detail: `Os ${R(surplus)} saem para um investimento conservador antes de você ter a chance de gastar.`,
          numbers: { projected: fv(a.fixedIncomeReturn) },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Deixar na conta corrente',
          result: `Vale ${S(fv(idleRate(a)))} em dinheiro de hoje`,
          detail: `Você teria juntado ${S(surplus * 12 * yrs)}, mas, parado, o dinheiro perde para a inflação todo ano.`,
          numbers: { projected: fv(idleRate(a)) },
        },
      ],
      why: '“Pague-se primeiro”: separar o investimento no dia em que o salário cai é o jeito mais simples de não deixar a sobra sumir.',
      lesson: 'Pague-se primeiro.',
    }
  },

  // Dia 4 — promessa de 3% ao mês
  (p, a) => {
    const promisedYear = monthlyToAnnual(0.03)
    const conservativeNominal = (1 + a.fixedIncomeReturn) * (1 + a.inflation) - 1
    const surplus = monthlyBalance(p)
    return {
      id: 'roberto-4',
      theme: 'investimentos',
      title: 'Um investimento “garantido”',
      context: 'Um conhecido oferece a você um investimento que “rende 3% ao mês, garantido”. Ele diz que já colocou R$ 50 mil e está ganhando todo mês.',
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: 'Colocar R$ 30 mil da poupança',
          result: 'Se for golpe, você perde R$ 30 mil',
          detail: `São cerca de ${months(Math.round(30000 / surplus))} da sua sobra. Golpes desse tipo costumam pagar no começo, para atrair mais dinheiro.`,
          numbers: { atRisk: 30000, monthsOfSurplus: 30000 / surplus },
        },
        {
          id: 'b',
          quality: 'best',
          label: 'Desconfiar e checar se a empresa é autorizada pela CVM ou pelo Banco Central',
          result: `3% ao mês seriam ${formatPercent(promisedYear)} ao ano`,
          detail: `É mais de ${Math.floor(promisedYear / conservativeNominal)} vezes o que rende um investimento conservador (cerca de ${formatPercent(conservativeNominal)} ao ano, já com a inflação). Promessa assim é sinal forte de golpe.`,
          numbers: { promisedYear, times: promisedYear / conservativeNominal },
        },
        {
          id: 'c',
          quality: 'ok',
          label: 'Colocar só R$ 5 mil para testar',
          result: 'Se for golpe, você perde R$ 5 mil',
          detail: `São cerca de ${months(Math.round(5000 / surplus))} da sua sobra. E testar não protege: o golpe costuma pagar direitinho no começo.`,
          numbers: { atRisk: 5000, monthsOfSurplus: 5000 / surplus },
        },
      ],
      why: 'Retorno alto e “garantido” ao mesmo tempo não existe. Nas pirâmides, quem entra primeiro é pago com o dinheiro de quem entra depois, até tudo desabar.',
      lesson: 'Garantido e alto demais é golpe.',
    }
  },

  // Dia 5 — taxa de administração
  (p, a) => {
    const amount = 50000
    const yrs = yearsToRetirement(p, a.retirementAge)
    // Aproximação: a taxa anual é descontada do rendimento (4% - 1% = 3% ao ano)
    const fv = (fee) => futureValue(amount, a.fixedIncomeReturn - fee, yrs)
    return {
      id: 'roberto-5',
      theme: 'investimentos',
      title: 'A taxa que ninguém vê',
      context: `Você vai investir ${S(amount)} por ${years(yrs)} num fundo de renda fixa que rende 4% ao ano acima da inflação, antes da taxa de administração. Você encontrou três fundos parecidos.`,
      question: 'Qual você escolheria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: 'Taxa de 1% ao ano',
          result: `${S(fv(0.01))} em ${years(yrs)}`,
          detail: 'Rende 3% ao ano acima da inflação, depois da taxa.',
          numbers: { projected: fv(0.01) },
        },
        {
          id: 'b',
          quality: 'weak',
          label: 'Taxa de 2% ao ano, do banco onde você já tem conta',
          result: `${S(fv(0.02))} em ${years(yrs)}`,
          detail: `A taxa leva metade do rendimento. São ${D(fv(0.005), fv(0.02))} a menos que no fundo mais barato.`,
          numbers: { projected: fv(0.02) },
        },
        {
          id: 'c',
          quality: 'best',
          label: 'Taxa de 0,5% ao ano',
          result: `${S(fv(0.005))} em ${years(yrs)}`,
          detail: 'No mesmo tipo de investimento, a taxa menor deixa mais rendimento com você.',
          numbers: { projected: fv(0.005) },
        },
      ],
      why: 'A taxa é cobrada todo ano sobre o total, com ou sem lucro. Uma diferença pequena por ano vira muito dinheiro no longo prazo.',
      lesson: 'Taxa pequena por ano vira muito.',
    }
  },

  // Dia 6 — o aumento de salário
  (p, a) => {
    const raise = 800
    const yrs = yearsToRetirement(p, a.retirementAge)
    const fv = (m) => futureValueOfMonthly(m, a.fixedIncomeReturn, yrs)
    return {
      id: 'roberto-6',
      theme: 'orcamento',
      title: 'O aumento chegou',
      context: `Você teve um aumento: são ${R(raise)} a mais por mês, já descontados os impostos.`,
      question: 'O que você faria com o aumento?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: 'Aproveitar tudo: trocar de carro e sair mais',
          result: 'A sobra continua a mesma',
          detail: `O padrão de vida sobe junto com o salário. Só para comparar: investir os ${R(raise)} viraria ${S(fv(raise))} aos ${a.retirementAge}.`,
          numbers: { projected: 0 },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Investir R$ 200 e aproveitar o resto',
          result: `${S(fv(200))} aos ${a.retirementAge}`,
          detail: 'Um bom começo, e ainda sobra bastante para curtir.',
          numbers: { projected: fv(200) },
        },
        {
          id: 'c',
          quality: 'best',
          label: 'Investir metade e aproveitar a outra metade',
          result: `${S(fv(raise / 2))} aos ${a.retirementAge}`,
          detail: `Os ${R(raise / 2)} por mês vão para um investimento conservador; os outros ${R(raise / 2)} melhoram o dia a dia.`,
          numbers: { projected: fv(raise / 2), monthly: raise / 2 },
        },
      ],
      why: 'Quando a renda sobe, os gastos tendem a subir junto sem a gente perceber. Decidir antes para onde vai o aumento evita isso.',
      lesson: 'Aumento: decidir antes de gastar.',
    }
  },

  // Dia 7 — a renda aos 60
  (p, a) => {
    const yrs = yearsToRetirement(p, a.retirementAge)
    const total = (pct) => p.income.gross * pct + employerMatch(p.income.gross, pct, a.match)
    const scenario = (phases) => {
      const atRetirement = planAtRetirement(p.plan.balance, phases, a)
      return { atRetirement, income: monthlyIncomeFromBalance(atRetirement, a.planReturn, a.payoutYears) }
    }
    const stay = scenario([{ monthly: total(0.04), years: yrs }])
    const later = scenario([
      { monthly: total(0.04), years: 5 },
      { monthly: total(0.08), years: yrs - 5 },
    ])
    const now = scenario([{ monthly: total(0.08), years: yrs }])
    return {
      id: 'roberto-7',
      theme: 'previdencia',
      title: 'A renda aos 60',
      context: `Você tem ${S(p.plan.balance)} no plano e quer se aposentar aos ${a.retirementAge}. Hoje contribui com 4% e a empresa também: ${R(total(0.04))} por mês no total.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'best',
          label: 'Subir para 8% agora',
          result: `Renda do plano de cerca de ${R(now.income)} por mês`,
          detail: `Entram ${R(total(0.08))} por mês no total. Aos ${a.retirementAge}, o saldo chega a ${S(now.atRetirement)}.`,
          numbers: now,
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Subir para 8% daqui a 5 anos',
          result: `Renda do plano de cerca de ${R(later.income)} por mês`,
          detail: `Os 5 anos de espera custam ${R(now.income - later.income)} por mês de renda na aposentadoria.`,
          numbers: later,
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Continuar com 4%',
          result: `Renda do plano de cerca de ${R(stay.income)} por mês`,
          detail: `Aos ${a.retirementAge}, o saldo chega a ${S(stay.atRetirement)}.`,
          numbers: stay,
        },
      ],
      why: 'O que entra no plano hoje tem mais tempo para render. Adiar a decisão sai caro, mesmo que seja por poucos anos. (A renda do plano vem além da aposentadoria do INSS.)',
      lesson: 'Quanto antes, maior a renda.',
    }
  },
]

// ---------------------------------------------------------------- Dona Lúcia
const lucia = [
  // Dia 1 — a ligação do consignado
  (p, a) => {
    const offer = p.loanOffer
    const s = loanSummary(offer.amount, a[offer.rateKey], offer.months)
    const surplus = monthlyBalance(p)
    return {
      id: 'lucia-1',
      theme: 'orcamento',
      title: 'A ligação do consignado',
      context: `De novo, uma ligação: “A senhora tem ${R(offer.amount)} liberados no consignado, em ${offer.months} parcelas de só ${R(s.payment)}”. Você não está precisando de dinheiro.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: 'Aceitar, já que a parcela é pequena',
          result: `${S(s.totalPaid)} pagos no total`,
          detail: `São ${R(s.payment)} por mês durante ${years(offer.months / 12)}, ${D(s.totalPaid, offer.amount)} só de juros. A sua sobra do mês cai de ${R(surplus)} para ${R(surplus - s.payment)}.`,
          numbers: s,
        },
        {
          id: 'b',
          quality: 'best',
          label: 'Agradecer e recusar: você não precisa do dinheiro',
          result: 'O benefício fica inteiro',
          detail: `Você mantém a sobra de ${R(surplus)} por mês e não paga ${D(s.totalPaid, offer.amount)} de juros.`,
          numbers: { totalPaid: 0 },
        },
        {
          id: 'c',
          quality: 'ok',
          label: 'Pedir a proposta por escrito para pensar com calma',
          result: `No papel: ${S(s.totalPaid)} para receber ${R(offer.amount)}`,
          detail: 'Bom não decidir por telefone, na pressão. No papel, fica claro o custo total.',
          numbers: s,
        },
      ],
      why: 'Parcela pequena e prazo longo escondem o custo total. Empréstimo só faz sentido com um objetivo claro. E ninguém pode contratar um consignado no seu nome sem a sua autorização.',
      lesson: 'Olhar o custo total, não a parcela.',
    }
  },

  // Dia 2 — quanto tirar do plano por mês
  (p, a) => {
    const current = p.plan.monthlyBenefit
    const surplus = monthlyBalance(p)
    const higher = 4000
    const lower = current - surplus
    const until = (b) => balanceLastsUntil(p, b, a)
    return {
      id: 'lucia-2',
      theme: 'previdencia',
      title: 'Quanto tirar do plano por mês',
      context: `Você recebe ${R(current)} por mês do plano. O dinheiro sai do seu saldo, que hoje é de ${S(p.plan.balance)} e segue rendendo. Uma vez por ano, você pode rever esse valor.`,
      question: 'O que você faria na revisão deste ano?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: `Manter os ${R(current)}`,
          result: `O saldo dura até os seus ${until(current)} anos`,
          detail: 'É um ritmo razoável, mas muita gente passa dos 85 anos.',
          numbers: { untilAge: until(current) },
        },
        {
          id: 'b',
          quality: 'weak',
          label: `Aumentar para ${R(higher)}, para viajar mais`,
          result: `O saldo dura até os seus ${until(higher)} anos`,
          detail: `Seriam ${R(higher - current)} a mais por mês agora, mas a renda do plano acabaria ${years(until(current) - until(higher))} antes.`,
          numbers: { untilAge: until(higher), benefit: higher },
        },
        {
          id: 'c',
          quality: 'best',
          label: `Baixar para ${R(lower)}, usando a sobra que hoje fica parada`,
          result: `O saldo dura até os seus ${until(lower)} anos`,
          detail: `Os gastos continuam cobertos (a sobra de ${R(surplus)} zera) e a renda do plano dura ${years(until(lower) - until(current))} a mais.`,
          numbers: { untilAge: until(lower), benefit: lower },
        },
      ],
      why: 'No plano de contribuição definida, o benefício sai do saldo. Tirar um pouco menos hoje faz a renda durar mais, e viver muito é justamente o risco que a aposentadoria precisa cobrir.',
      lesson: 'Tirar menos hoje faz a renda durar mais.',
    }
  },

  // Dia 3 — onde está a reserva
  (p, a) => {
    const amount = p.reserve.amount
    const fv = (r) => futureValue(amount, r, 5)
    return {
      id: 'lucia-3',
      theme: 'investimentos',
      title: 'A reserva na poupança',
      context: `Você tem ${S(amount)} de reserva na poupança. É o dinheiro para emergências, como um conserto em casa ou um remédio caro.`,
      question: 'O que você faria com a reserva?',
      options: [
        {
          id: 'a',
          quality: 'best',
          label: 'Passar para um investimento conservador que dá para resgatar a qualquer dia',
          result: `${S(fv(a.fixedIncomeReturn))} em 5 anos`,
          detail: `Continua à mão e rende ${D(fv(a.fixedIncomeReturn), fv(a.savingsReturn))} a mais que na poupança, em dinheiro de hoje.`,
          numbers: { projected: fv(a.fixedIncomeReturn) },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Deixar na poupança',
          result: `${S(fv(a.savingsReturn))} em 5 anos`,
          detail: 'É segura e fácil de pegar, mas rende menos.',
          numbers: { projected: fv(a.savingsReturn) },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Sacar e guardar em casa, por segurança',
          result: `Vale ${S(fv(idleRate(a)))} em 5 anos, em dinheiro de hoje`,
          detail: 'Em casa, o dinheiro perde para a inflação e ainda pode ser roubado ou perdido.',
          numbers: { projected: fv(idleRate(a)) },
        },
      ],
      why: 'Reserva de emergência precisa ser segura e fácil de pegar, e pode render um pouco mais sem perder isso.',
      lesson: 'Reserva segura também pode render.',
    }
  },

  // Dia 4 — o sobrinho pede um favor
  (p, a) => {
    const amount = 15000
    const n = 84
    const s = loanSummary(amount, a.payrollLoanMonthly, n)
    const surplus = monthlyBalance(p)
    const lent = 2000
    const exp = totalExpenses(p)
    return {
      id: 'lucia-4',
      theme: 'orcamento',
      title: 'O sobrinho pede um favor',
      context: `O seu sobrinho está apertado e pede que você faça um consignado de ${R(amount)} no seu nome. Ele promete pagar as parcelas.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: `Emprestar ${R(lent)} da reserva, um valor que você aceita não ver de volta`,
          result: `A reserva cai para ${S(p.reserve.amount - lent)}`,
          detail: `Passa de ${oneDecimal(p.reserve.amount / exp)} para ${oneDecimal((p.reserve.amount - lent) / exp)} meses de gastos. Ajuda sem criar dívida no seu nome.`,
          numbers: { reserveAfter: p.reserve.amount - lent },
        },
        {
          id: 'b',
          quality: 'weak',
          label: 'Fazer o consignado no seu nome',
          result: `${R(s.payment)} descontados do benefício por ${years(n / 12)}`,
          detail: `É mais que a sua sobra, de ${R(surplus)}. Total: ${S(s.totalPaid)}. Se ele não pagar, a dívida é sua.`,
          numbers: s,
        },
        {
          id: 'c',
          quality: 'best',
          label: 'Dizer não com carinho e ajudar o sobrinho a organizar as contas',
          result: 'Nada sai do seu benefício',
          detail: 'Ajudar a montar um orçamento pode resolver a causa do aperto, sem colocar a sua aposentadoria em risco.',
          numbers: { totalPaid: 0 },
        },
      ],
      why: 'O consignado é descontado direto do benefício: quem assina é quem paga, aconteça o que acontecer. Emprestar o nome é emprestar a aposentadoria.',
      lesson: 'Emprestar o nome é emprestar a renda.',
    }
  },

  // Dia 5 — a viagem com os netos
  (p, a) => {
    const cost = 6000
    const monthly = 500
    const toSave = monthsToReach(cost, 0, monthly, a.fixedIncomeReturn)
    const loan = loanSummary(cost, a.payrollLoanMonthly, 24)
    const exp = totalExpenses(p)
    const surplus = monthlyBalance(p)
    return {
      id: 'lucia-5',
      theme: 'orcamento',
      title: 'A viagem com os netos',
      context: `Você quer levar os netos para a praia nas férias do ano que vem. A viagem custa ${R(cost)}. Hoje sobram ${R(surplus)} por mês.`,
      question: 'Como você pagaria a viagem?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: `Pegar um consignado de ${R(cost)} em 24 vezes`,
          result: `${R(loan.totalPaid)} no total`,
          detail: `São ${R(loan.payment)} por mês por 2 anos (mais que a sua sobra) e ${R(loan.totalInterest)} só de juros.`,
          numbers: loan,
        },
        {
          id: 'b',
          quality: 'best',
          label: `Guardar ${R(monthly)} por mês até a viagem`,
          result: `Em ${months(toSave)}, você tem os ${R(cost)} e paga à vista`,
          detail: `A sobra de ${R(surplus)} mais ${R(monthly - surplus)} cortados de “outros”, num investimento conservador. Sem juros e sem mexer na reserva.`,
          numbers: { months: toSave },
        },
        {
          id: 'c',
          quality: 'ok',
          label: `Tirar os ${R(cost)} da reserva agora`,
          result: `A reserva cai para ${S(p.reserve.amount - cost)}`,
          detail: `Passa de ${oneDecimal(p.reserve.amount / exp)} para ${oneDecimal((p.reserve.amount - cost) / exp)} meses de gastos. A reserva é para imprevistos, e a viagem dá para planejar.`,
          numbers: { reserveAfter: p.reserve.amount - cost },
        },
      ],
      why: 'Sonho com data marcada se planeja: juntando antes, o dinheiro rende a seu favor, em vez de você pagar juros a alguém.',
      lesson: 'Sonho com data se planeja.',
    }
  },

  // Dia 6 — a oferta do gerente
  (p, a) => {
    const monthly = 200
    const fv = (r) => futureValueOfMonthly(monthly, r, 5)
    return {
      id: 'lucia-6',
      theme: 'investimentos',
      title: 'A oferta do gerente',
      context: `O gerente do banco oferece um título que “guarda dinheiro e ainda concorre a prêmios”: ${R(monthly)} por mês, por 5 anos. No fim, ele devolve só o valor pago, ${R(monthly * 60)}.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: `Guardar os ${R(monthly)} por mês na poupança`,
          result: `${S(fv(a.savingsReturn))} em 5 anos, em dinheiro de hoje`,
          detail: 'Rende pouco, mas rende.',
          numbers: { projected: fv(a.savingsReturn) },
        },
        {
          id: 'b',
          quality: 'best',
          label: `Recusar e guardar os ${R(monthly)} num investimento conservador`,
          result: `${S(fv(a.fixedIncomeReturn))} em 5 anos, em dinheiro de hoje`,
          detail: `São ${D(fv(a.fixedIncomeReturn), fv(idleRate(a)))} a mais do que o título devolveria, em dinheiro de hoje.`,
          numbers: { projected: fv(a.fixedIncomeReturn) },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Aceitar: vai que ganha o prêmio',
          result: `Os ${R(monthly * 60)} devolvidos valem ${S(fv(idleRate(a)))} em dinheiro de hoje`,
          detail: 'Receber de volta só o valor pago, depois de 5 anos, é perder para a inflação. E a chance de prêmio é pequena.',
          numbers: { projected: fv(idleRate(a)) },
        },
      ],
      why: 'Sorteio não é rendimento. Antes de aceitar qualquer produto, vale comparar com quanto o dinheiro renderia num investimento simples.',
      lesson: 'Sorteio não é rendimento.',
    }
  },

  // Dia 7 — a neta se formou
  (p, a) => {
    const help = expense(p, 'familia')
    const current = p.plan.monthlyBenefit
    const until = (b) => balanceLastsUntil(p, b, a)
    const reserveAfter = p.reserve.amount + futureValueOfMonthly(help, a.fixedIncomeReturn, 1)
    return {
      id: 'lucia-7',
      theme: 'previdencia',
      title: 'A neta se formou',
      context: `A sua neta se formou e arrumou emprego. A ajuda de ${R(help)} por mês não é mais necessária.`,
      question: `O que você faria com esses ${R(help)}?`,
      options: [
        {
          id: 'a',
          quality: 'best',
          label: `Tirar ${R(help)} a menos do plano por mês`,
          result: `O saldo passa a durar até os seus ${until(current - help)} anos`,
          detail: `Antes, durava até os ${until(current)}. São ${years(until(current - help) - until(current))} a mais de renda do plano.`,
          numbers: { untilAge: until(current - help), monthly: help },
        },
        {
          id: 'b',
          quality: 'weak',
          label: 'Deixar o dinheiro na conta, para o que aparecer',
          result: 'Tende a sumir em pequenos gastos',
          detail: 'Sem destino, o dinheiro costuma se misturar com as despesas do mês.',
          numbers: {},
        },
        {
          id: 'c',
          quality: 'ok',
          label: `Guardar os ${R(help)} na reserva`,
          result: `Em 1 ano, a reserva vai de ${S(p.reserve.amount)} para ${S(reserveAfter)}`,
          detail: 'Bom, mas você já tem uma reserva razoável. Usar o dinheiro para a renda durar mais protege um risco maior.',
          numbers: { reserveAfter },
        },
      ],
      why: 'Quando um gasto acaba, abre uma chance de fazer a aposentadoria durar mais. Decidir logo o destino evita que o dinheiro escorra.',
      lesson: 'Gasto que acaba vira renda que dura.',
    }
  },
]

// ---------------------------------------------------------------- Pedro
const pedro = [
  // Dia 1 — a primeira bolsa
  (p, a) => {
    const surplus = monthlyBalance(p)
    const likelyLeft = 50 // suposição: guardando "o que sobrar", costuma sobrar bem menos
    const fv = (m) => futureValueOfMonthly(m, a.fixedIncomeReturn, 1)
    return {
      id: 'pedro-1',
      theme: 'orcamento',
      title: 'A bolsa caiu na conta',
      context: `Você recebe ${R(p.income.net)} de bolsa e gasta, em média, ${R(totalExpenses(p))}. Daria para sobrar ${R(surplus)} por mês.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: 'Guardar o que sobrar no fim do mês',
          result: `Cerca de ${R(fv(likelyLeft))} em 1 ano`,
          detail: `Na prática, costuma sobrar menos. Na conta, supomos ${R(likelyLeft)} por mês.`,
          numbers: { projected: fv(likelyLeft) },
        },
        {
          id: 'b',
          quality: 'weak',
          label: 'Não guardar agora: é o seu primeiro dinheiro',
          result: 'R$ 0 em 1 ano',
          detail: 'Aproveitar é bom, mas o hábito de guardar é mais fácil de criar no começo.',
          numbers: { projected: 0 },
        },
        {
          id: 'c',
          quality: 'best',
          label: `Separar ${R(surplus)} no dia em que a bolsa cai`,
          result: `${R(fv(surplus))} em 1 ano`,
          detail: 'Guardando primeiro, você se acostuma a viver com o resto.',
          numbers: { projected: fv(surplus), monthly: surplus },
        },
      ],
      why: 'Guardar primeiro e gastar depois é o hábito que mais faz diferença. E, quanto mais cedo começa, mais fácil fica.',
      lesson: 'Guardar primeiro, gastar depois.',
    }
  },

  // Dia 2 — delivery e apps
  (p, a) => {
    const delivery = expense(p, 'delivery')
    const fv = (m) => futureValueOfMonthly(m, a.fixedIncomeReturn, 10)
    return {
      id: 'pedro-2',
      theme: 'orcamento',
      title: 'Delivery e aplicativos',
      context: `Você gasta ${R(delivery)} por mês com delivery e aplicativos: quase um quarto da bolsa.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'best',
          label: 'Cortar pela metade',
          result: `${S(fv(delivery / 2))} em 10 anos`,
          detail: `Se os ${R(delivery / 2)} por mês forem guardados num investimento conservador.`,
          numbers: { projected: fv(delivery / 2), monthly: delivery / 2 },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Cortar R$ 100 por mês',
          result: `${S(fv(100))} em 10 anos`,
          detail: 'Já dá para sentir a diferença.',
          numbers: { projected: fv(100) },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Manter: é a sua vida social',
          result: 'Nada muda',
          detail: `Só para comparar: os ${R(delivery)} por mês, guardados por 10 anos, virariam ${S(fv(delivery))}.`,
          numbers: { projected: 0 },
        },
      ],
      why: 'Com juros compostos e tempo, um gasto pequeno de todo mês vira muito dinheiro. E você tem tempo de sobra.',
      lesson: 'Tempo é o melhor amigo de quem guarda.',
    }
  },

  // Dia 3 — o plano família
  (p, a) => {
    const monthly = 100
    const fv = (startAge) => futureValueOfMonthly(monthly, a.planReturn, a.retirementAge - startAge)
    const share30 = fv(30) / fv(p.age)
    return {
      id: 'pedro-3',
      theme: 'previdencia',
      title: 'O plano família',
      context: `Como filho de participante, você pode entrar no plano família da PrevExemplo. Você pensa em colocar ${R(monthly)} por mês, mas acha que “ainda é cedo”.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: 'Entrar quando se formar, aos 23',
          result: `${S(fv(23))} aos ${a.retirementAge}`,
          detail: `Só 4 anos de diferença já custam ${D(fv(p.age), fv(23))}.`,
          numbers: { projected: fv(23) },
        },
        {
          id: 'b',
          quality: 'best',
          label: `Entrar agora, aos ${p.age}`,
          result: `${S(fv(p.age))} aos ${a.retirementAge}`,
          detail: `Você coloca ${S(monthly * 12 * (a.retirementAge - p.age))} ao longo dos anos; o resto são os juros compostos trabalhando.`,
          numbers: { projected: fv(p.age), monthly },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Deixar para os 30',
          result: `${S(fv(30))} aos ${a.retirementAge}`,
          detail: `Com o mesmo valor por mês, é só ${Math.round(share30 * 100)}% do que você teria começando aos ${p.age}.`,
          numbers: { projected: fv(30), share30 },
        },
      ],
      why: 'No longo prazo, o tempo pesa tanto quanto o valor. Começar com pouco, mas cedo, faz o dinheiro trabalhar por mais anos.',
      lesson: 'Começar cedo faz o tempo trabalhar por você.',
    }
  },

  // Dia 4 — o celular novo
  (p, a) => {
    const price = 3000
    const cash = price * 0.9
    const installment = price / 12
    const surplus = monthlyBalance(p)
    const wait = monthsToReach(cash, p.reserve.amount, surplus, a.fixedIncomeReturn)
    const capMonths = monthsToRevolvingCap(a.revolvingMonthly, a.revolvingCap)
    const revolving = revolvingAtCap(price, a)
    return {
      id: 'pedro-4',
      theme: 'orcamento',
      title: 'O celular novo',
      context: `O seu celular está lento e você quer trocar. O modelo que você quer custa ${R(price)} em 12 vezes sem juros, ou ${R(cash)} à vista no Pix. Você tem ${R(p.reserve.amount)} guardados.`,
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: 'Comprar no cartão e deixar a fatura no rotativo',
          result: `A dívida pode chegar a ${R(revolving)}`,
          detail: `A 13% ao mês, a dívida dobra em cerca de ${capMonths} meses. O dobro é o máximo que a lei deixa cobrar.`,
          numbers: { total: revolving },
        },
        {
          id: 'b',
          quality: 'best',
          label: 'Seguir com o celular atual e juntar para comprar à vista',
          result: `Em cerca de ${months(wait)}, compra por ${R(cash)}`,
          detail: `Guardando a sobra de ${R(surplus)} por mês. Cortando um pouco do delivery, chega antes.`,
          numbers: { months: wait, total: cash },
        },
        {
          id: 'c',
          quality: 'ok',
          label: `Parcelar em 12 vezes de ${R(installment)}`,
          result: `Paga ${R(price - cash)} a mais que à vista`,
          detail: `Sem juros, mas a parcela é maior que a sua sobra (${R(surplus)}): vão faltar ${R(installment - surplus)} por mês durante 1 ano.`,
          numbers: { total: price },
        },
      ],
      why: 'Parcelar compromete a renda dos próximos meses. E, se a fatura não for paga inteira, o rotativo do cartão é uma das dívidas mais caras que existem.',
      lesson: 'Parcela maior que a sobra vira dívida.',
    }
  },

  // Dia 5 — a aposta que "dobra"
  (p) => {
    const surplus = monthlyBalance(p)
    const yearlyBets = 50 * 52
    return {
      id: 'pedro-5',
      theme: 'investimentos',
      title: 'Dinheiro fácil?',
      context: 'Um influenciador que você segue diz: “deposite R$ 300 na plataforma e saque R$ 600 em uma semana”. Vários amigos seus já entraram.',
      question: 'O que você faria?',
      options: [
        {
          id: 'a',
          quality: 'weak',
          label: `Colocar a reserva toda (${R(p.reserve.amount)})`,
          result: 'Se der errado, a reserva zera',
          detail: `São ${months(Math.round(p.reserve.amount / surplus))} da sua sobra.`,
          numbers: { atRisk: p.reserve.amount },
        },
        {
          id: 'b',
          quality: 'ok',
          label: 'Colocar só R$ 50 para ver',
          result: `Se virar hábito, são ${R(yearlyBets)} por ano`,
          detail: `R$ 50 por semana somam ${R(yearlyBets)} por ano, mais de uma bolsa e meia. Apostas são feitas para a casa ganhar.`,
          numbers: { yearly: yearlyBets },
        },
        {
          id: 'c',
          quality: 'best',
          label: 'Não entrar: dobrar em uma semana é promessa de golpe',
          result: 'A reserva continua inteira',
          detail: 'Nenhum investimento sério promete dobrar o dinheiro em dias. Influenciador pago para divulgar não é garantia.',
          numbers: { atRisk: 0 },
        },
      ],
      why: 'Promessa de ganho rápido e alto é o padrão dos golpes e das apostas. Investir de verdade é devagar e sem promessas.',
      lesson: 'Ganho rápido demais é sinal de golpe.',
    }
  },

  // Dia 6 — a meta da reserva
  (p, a) => {
    const target = totalExpenses(p) * 3
    const surplus = monthlyBalance(p)
    const reach = (r) => monthsToReach(target, p.reserve.amount, surplus, r)
    return {
      id: 'pedro-6',
      theme: 'investimentos',
      title: 'A meta da reserva',
      context: `Você quer juntar ${R(target)}, 3 meses dos seus gastos, para emergências. Já tem ${R(p.reserve.amount)} e vai guardar ${R(surplus)} por mês.`,
      question: 'Onde você guardaria?',
      options: [
        {
          id: 'a',
          quality: 'best',
          label: 'Num investimento conservador que dá para resgatar a qualquer dia',
          result: `Chega lá em ${months(reach(a.fixedIncomeReturn))}`,
          detail: 'Rende acima da inflação, fica separado do dia a dia e continua à mão.',
          numbers: { months: reach(a.fixedIncomeReturn) },
        },
        {
          id: 'b',
          quality: 'weak',
          label: 'Deixar na conta, junto com o dinheiro do dia a dia',
          result: `Chega lá em ${months(reach(idleRate(a)))}`,
          detail: 'Parado, perde para a inflação. E, misturado com o dia a dia, é fácil gastar sem perceber.',
          numbers: { months: reach(idleRate(a)) },
        },
        {
          id: 'c',
          quality: 'ok',
          label: 'Na poupança',
          result: `Chega lá em ${months(reach(a.savingsReturn))}`,
          detail: 'Segura e separada do dia a dia, mas rende menos.',
          numbers: { months: reach(a.savingsReturn) },
        },
      ],
      why: 'Separar a reserva do dinheiro do dia a dia ajuda a não gastar. E, rendendo, ela chega antes na meta.',
      lesson: 'Reserva separada chega antes.',
    }
  },

  // Dia 7 — a bolsa aumentou
  (p, a) => {
    const raise = 400
    const yrs = yearsToRetirement(p, a.retirementAge)
    const extraPlan = futureValueOfMonthly(100, a.planReturn, yrs)
    return {
      id: 'pedro-7',
      theme: 'previdencia',
      title: 'A bolsa aumentou',
      context: `A sua bolsa subiu de ${R(p.income.net)} para ${R(p.income.net + raise)}: ${R(raise)} a mais por mês. Suponha que você já coloque R$ 100 por mês no plano família.`,
      question: 'O que você faria com o aumento?',
      options: [
        {
          id: 'a',
          quality: 'ok',
          label: 'Guardar R$ 100 na reserva e aproveitar o resto',
          result: `+${R(100 * 12)} na reserva por ano`,
          detail: 'Bom para chegar mais rápido à meta de emergência.',
          numbers: { reservePerYear: 1200 },
        },
        {
          id: 'b',
          quality: 'best',
          label: 'Subir o plano família para R$ 200, guardar R$ 100 na reserva e aproveitar o resto',
          result: `+${S(extraPlan)} no plano aos ${a.retirementAge}`,
          detail: `Os R$ 100 a mais no plano, por ${years(yrs)}, viram ${S(extraPlan)}. E ainda sobram ${R(raise - 200)} por mês para curtir.`,
          numbers: { projected: extraPlan, monthly: 200 },
        },
        {
          id: 'c',
          quality: 'weak',
          label: 'Gastar todo o aumento',
          result: 'A sobra continua a mesma',
          detail: 'Quando a renda sobe, é a melhor hora de aumentar o que se guarda: você ainda não se acostumou a gastar mais.',
          numbers: { projected: 0 },
        },
      ],
      why: 'Dividir cada aumento entre presente e futuro é um jeito simples de crescer sem apertar o dia a dia.',
      lesson: 'Cada aumento: um pedaço para o futuro.',
    }
  },
]

const WEEKS = { carla, roberto, lucia, pedro }

// As 7 situações da semana de uma persona, já com os números calculados
export function weekFor(persona, assumptions) {
  return (WEEKS[persona.id] ?? []).map((build, i) => ({ day: i + 1, ...build(persona, assumptions) }))
}
