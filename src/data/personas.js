// Personas fictícias da PrevExemplo (números aprovados na Etapa 2).
// Valores em reais, por mês, salvo indicação. Nada aqui é de pessoa real.
//
// Campos:
// - income: renda (bruto = salário antes dos descontos; líquido = o que cai na conta)
// - expenses: gastos por categoria; a soma é o "gasta por mês"
// - debts: dívidas; `rateKey` aponta para a taxa em src/data/assumptions.js
// - reserve: dinheiro guardado fora do plano
// - plan: situação no plano da PrevExemplo
//   - contributionPct: quanto a pessoa contribui, em % do salário bruto (só ativos)
//   - monthlyBenefit: benefício recebido por mês (só assistidos)
// - start: como a persona chega na semana da demo (já usa o app há um tempo — Etapa 3)
//   - points: pontos acumulados · streak: dias seguidos respondendo, até ontem

export const personas = [
  {
    id: 'carla',
    start: { points: 30, streak: 1 },
    name: 'Carla',
    age: 38,
    profile: 'Endividada, no limite',
    link: 'Participante ativa',
    story:
      'Analista administrativa, mãe do Davi, de 10 anos. Desde que se separou, as contas apertaram: o salário acaba antes do mês, e a diferença vai para o cartão de crédito, que já está no rotativo.',
    goals: ['Sair do rotativo do cartão', 'Montar uma reserva para imprevistos'],
    income: { gross: 6800, net: 5200, sources: [{ label: 'Salário líquido', amount: 5200 }] },
    expenses: [
      { id: 'moradia', label: 'Aluguel', amount: 1600 },
      { id: 'mercado', label: 'Mercado', amount: 1100 },
      { id: 'delivery', label: 'Delivery', amount: 640 },
      { id: 'filhos', label: 'Escola e material do Davi', amount: 500 },
      { id: 'transporte', label: 'Transporte', amount: 450 },
      { id: 'contas', label: 'Luz, água e internet', amount: 380 },
      { id: 'lazer', label: 'Lazer', amount: 350 },
      { id: 'saude', label: 'Saúde', amount: 280 },
      { id: 'outros', label: 'Outros', amount: 200 },
      { id: 'assinaturas', label: 'Celular e assinaturas', amount: 150 },
    ],
    debts: [{ id: 'cartao', label: 'Rotativo do cartão', balance: 3800, rateKey: 'revolvingMonthly' }],
    reserve: { amount: 0, where: 'Não tem' },
    plan: { kind: 'ativo', balance: 38000, contributionPct: 0.02 },
  },
  {
    id: 'roberto',
    start: { points: 110, streak: 5 },
    name: 'Roberto',
    age: 45,
    profile: 'Guarda, mas não investe',
    link: 'Participante ativo',
    story:
      'Engenheiro de manutenção, casado, uma filha na faculdade. É organizado e sobra dinheiro todo mês, mas tudo vai para a poupança "por segurança". Contribui pouco para o plano porque nunca parou para entender a contrapartida.',
    goals: ['Se aposentar aos 60 com tranquilidade', 'Fazer o dinheiro guardado render mais'],
    income: { gross: 15000, net: 11000, sources: [{ label: 'Salário líquido', amount: 11000 }] },
    expenses: [
      { id: 'moradia', label: 'Financiamento da casa', amount: 2800 },
      { id: 'mercado', label: 'Mercado', amount: 1600 },
      { id: 'transporte', label: 'Carro e combustível', amount: 900 },
      { id: 'saude', label: 'Plano de saúde', amount: 700 },
      { id: 'contas', label: 'Luz, água e internet', amount: 650 },
      { id: 'lazer', label: 'Lazer e viagens', amount: 600 },
      { id: 'delivery', label: 'Delivery', amount: 450 },
      { id: 'outros', label: 'Outros', amount: 300 },
      { id: 'assinaturas', label: 'Celular e assinaturas', amount: 200 },
    ],
    debts: [],
    reserve: { amount: 85000, where: 'Poupança' },
    plan: { kind: 'ativo', balance: 210000, contributionPct: 0.04 },
  },
  {
    id: 'lucia',
    start: { points: 280, streak: 12 },
    name: 'Dona Lúcia',
    age: 62,
    profile: 'Aposentada recente',
    link: 'Assistida',
    story:
      'Trabalhou 32 anos na patrocinadora e se aposentou no ano passado. Vive do benefício do plano e do INSS, ajuda a neta com a faculdade e recebe ligações quase toda semana oferecendo empréstimo consignado.',
    goals: ['Fazer a renda da aposentadoria durar', 'Viajar com os netos uma vez por ano'],
    income: {
      gross: 6000,
      net: 6000,
      sources: [
        { label: 'Benefício do plano PrevExemplo', amount: 3100 },
        { label: 'Aposentadoria do INSS', amount: 2900 },
      ],
    },
    expenses: [
      { id: 'mercado', label: 'Mercado', amount: 1300 },
      { id: 'saude', label: 'Plano de saúde e remédios', amount: 1300 },
      { id: 'moradia', label: 'Condomínio e IPTU', amount: 900 },
      { id: 'familia', label: 'Ajuda à neta', amount: 600 },
      { id: 'contas', label: 'Luz, água e internet', amount: 450 },
      { id: 'lazer', label: 'Lazer', amount: 350 },
      { id: 'outros', label: 'Outros', amount: 350 },
      { id: 'transporte', label: 'Transporte', amount: 300 },
      { id: 'assinaturas', label: 'Celular e assinaturas', amount: 150 },
    ],
    debts: [],
    reserve: { amount: 22000, where: 'Poupança' },
    // Plano de contribuição definida: o benefício sai do saldo, que segue rendendo
    plan: { kind: 'assistido', balance: 480000, monthlyBenefit: 3100 },
    // Oferta de consignado que ela recebe (usada nas contas de destaque e na Etapa 3)
    loanOffer: { amount: 10000, months: 84, rateKey: 'payrollLoanMonthly' },
  },
  {
    id: 'pedro',
    start: { points: 0, streak: 0 },
    name: 'Pedro',
    age: 19,
    profile: 'Jovem da família',
    link: 'Filho de participante',
    story:
      'Filho de um participante da PrevExemplo, faz faculdade e começou o primeiro estágio. É a primeira vez que tem um dinheiro só dele, e boa parte vai para delivery e aplicativos.',
    goals: ['Juntar para trocar de celular sem parcelar', 'Começar a investir cedo'],
    income: { gross: 1600, net: 1600, sources: [{ label: 'Bolsa de estágio', amount: 1600 }] },
    expenses: [
      { id: 'delivery', label: 'Delivery e aplicativos', amount: 380 },
      { id: 'casa', label: 'Ajuda em casa', amount: 300 },
      { id: 'lazer', label: 'Lazer e saídas', amount: 250 },
      { id: 'transporte', label: 'Transporte', amount: 220 },
      { id: 'assinaturas', label: 'Celular e assinaturas', amount: 120 },
      { id: 'roupas', label: 'Roupas', amount: 100 },
      { id: 'estudos', label: 'Material e cursos', amount: 80 },
    ],
    debts: [],
    reserve: { amount: 300, where: 'Conta digital' },
    // Pode entrar no plano família da PrevExemplo (sem contrapartida), mas ainda não entrou
    plan: { kind: 'familia', balance: 0, member: false, contributionPct: 0 },
  },
]

export const DEFAULT_PERSONA_ID = 'carla'

export function getPersona(id) {
  return personas.find((p) => p.id === id) ?? personas.find((p) => p.id === DEFAULT_PERSONA_ID)
}

// Total gasto por mês
export function totalExpenses(persona) {
  return persona.expenses.reduce((sum, e) => sum + e.amount, 0)
}

// Quanto sobra (positivo) ou falta (negativo) por mês
export function monthlyBalance(persona) {
  return persona.income.net - totalExpenses(persona)
}

// Total de dívidas
export function totalDebt(persona) {
  return persona.debts.reduce((sum, d) => sum + d.balance, 0)
}

// Quantos meses de gastos a reserva cobre
export function reserveMonths(persona) {
  return persona.reserve.amount / totalExpenses(persona)
}

// Anos até a aposentadoria (zero para quem já se aposentou)
export function yearsToRetirement(persona, retirementAge) {
  return Math.max(0, retirementAge - persona.age)
}
