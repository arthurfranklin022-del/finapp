// Gastos da persona agrupados em 6 grandes grupos, para o gráfico do resumo do mês (Etapa 4).
// Cada categoria de gasto das personas pertence a exatamente um grupo; os testes garantem
// que nenhum gasto fica de fora e que a soma dos grupos é igual ao total gasto.
import { totalExpenses } from '../data/personas.js'

export const SPENDING_GROUPS = [
  { id: 'moradia', label: 'Moradia e contas', emoji: '🏠', categories: ['moradia', 'contas'] },
  { id: 'alimentacao', label: 'Alimentação', emoji: '🍽️', categories: ['mercado', 'delivery'] },
  { id: 'transporte', label: 'Transporte', emoji: '🚌', categories: ['transporte'] },
  { id: 'saude', label: 'Saúde', emoji: '🩺', categories: ['saude'] },
  { id: 'lazer', label: 'Lazer e assinaturas', emoji: '🎬', categories: ['lazer', 'assinaturas'] },
  {
    id: 'familia',
    label: 'Família e outros',
    emoji: '👪',
    categories: ['filhos', 'familia', 'casa', 'roupas', 'estudos', 'outros'],
  },
]

// Em que grupo fica uma categoria (undefined = categoria sem grupo, o que os testes barram)
export function groupOf(categoryId) {
  return SPENDING_GROUPS.find((g) => g.categories.includes(categoryId))
}

// Grupos da persona, do maior para o menor, com os itens de cada um.
// shareOfIncome = fração da renda líquida (pode passar de 100% no total, como na Carla).
export function spendingByGroup(persona) {
  const income = persona.income.net
  return SPENDING_GROUPS.map((g) => {
    const items = persona.expenses
      .filter((e) => g.categories.includes(e.id))
      .sort((x, y) => y.amount - x.amount)
      .map((e) => ({ ...e, shareOfIncome: e.amount / income }))
    const amount = items.reduce((s, e) => s + e.amount, 0)
    return { id: g.id, label: g.label, emoji: g.emoji, amount, shareOfIncome: amount / income, items }
  })
    .filter((g) => g.amount > 0)
    .sort((x, y) => y.amount - x.amount)
}

// Visão geral do mês: renda, total gasto, quanto sobrou (ou faltou)
export function monthOverview(persona) {
  const spent = totalExpenses(persona)
  return {
    income: persona.income.net,
    spent,
    balance: persona.income.net - spent,
    shareOfIncome: spent / persona.income.net,
  }
}
