// Premissas da demo (aprovadas pelo Arthur na Etapa 2). Valores aproximados e redondos.
// Rendimentos: ao ano, ACIMA da inflação (resultado em dinheiro de hoje).
// Dívidas: ao mês, nominais (como aparecem no contrato).
export const ASSUMPTIONS = {
  inflation: 0.04, // inflação ao ano
  planReturn: 0.04, // rendimento do plano PrevExemplo, acima da inflação
  fixedIncomeReturn: 0.04, // investimento conservador de renda fixa, acima da inflação
  savingsReturn: 0.02, // poupança, acima da inflação
  revolvingMonthly: 0.13, // rotativo do cartão, ao mês
  revolvingCap: 1, // teto legal: juros do rotativo/parcelamento não passam de 100% da dívida
  overdraftMonthly: 0.075, // cheque especial, ao mês
  payrollLoanMonthly: 0.018, // consignado para aposentados, ao mês
  match: { matchRate: 1, matchCap: 0.08 }, // empresa põe 100% do que a pessoa contribui, até 8% do salário
  retirementAge: 60, // idade de aposentadoria usada nas projeções do plano
  payoutYears: 25, // por quantos anos o saldo do plano paga a renda (dos 60 aos 85)
  idleCash: 0, // dinheiro parado na conta corrente ou em casa: rende 0% (perde a inflação)
}

// Mesmas premissas, em linguagem de gente, para o quadro "Premissas" na tela
export const ASSUMPTION_ROWS = [
  { label: 'Inflação', value: '4% ao ano', note: 'Perto da média recente (a meta oficial é 3%).' },
  { label: 'Rendimento do plano PrevExemplo', value: '4% ao ano acima da inflação', note: 'Meta comum dos fundos de pensão.' },
  { label: 'Investimento conservador de renda fixa', value: '4% ao ano acima da inflação', note: 'Média histórica de títulos que acompanham a inflação.' },
  { label: 'Poupança', value: '2% ao ano acima da inflação', note: 'Rende cerca de 6,2% ao ano; tirando a inflação, sobra cerca de 2%.' },
  { label: 'Rotativo do cartão', value: '13% ao mês', note: 'Média do Banco Central, cerca de 400% ao ano.' },
  { label: 'Cheque especial', value: '7,5% ao mês', note: 'O teto legal é 8% ao mês.' },
  { label: 'Consignado para aposentados', value: '1,8% ao mês', note: 'Perto do teto do consignado do INSS.' },
  { label: 'Contrapartida da patrocinadora', value: '100% até 8% do salário', note: 'Para cada R$ 1 da pessoa, a empresa põe R$ 1.' },
  { label: 'Teto dos juros do rotativo', value: 'a dívida no máximo dobra', note: 'Lei 14.690/2023: juros do rotativo e do parcelamento da fatura limitados a 100% da dívida.' },
  { label: 'Dinheiro parado na conta ou em casa', value: '0% (perde para a inflação)', note: 'Em dinheiro de hoje, perde cerca de 3,8% por ano.' },
  { label: 'Idade de aposentadoria', value: '60 anos', note: 'Usada nas projeções do plano.' },
  { label: 'Impostos', value: 'não entram nas contas', note: 'Para simplificar, os valores são antes do Imposto de Renda.' },
  { label: 'Renda do plano na aposentadoria', value: 'paga por 25 anos', note: 'Dos 60 aos 85 anos, com o saldo rendendo 4% acima da inflação.' },
]
