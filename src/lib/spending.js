// Gastos da persona agrupados em 6 grandes grupos, para o gráfico do resumo do mês (Etapa 4).
// Cada categoria de gasto das personas pertence a exatamente um grupo; os testes garantem
// que nenhum gasto fica de fora e que a soma dos grupos é igual ao total gasto.
import { totalExpenses } from '../data/personas.js'

// Cores do gráfico de rosca: cada grupo tem sempre a mesma cor, em todas as personas.
// Verde e mel puxam a marca; a ordem foi testada com o validador de paleta (daltonismo e
// visão normal) para fatias vizinhas. "Sobrou" é cinza, por não ser um gasto.
export const SPENDING_GROUPS = [
  { id: 'moradia', label: 'Moradia e contas', emoji: '🏠', color: '#2f8a4e', categories: ['moradia', 'contas'] },
  { id: 'alimentacao', label: 'Alimentação', emoji: '🍽️', color: '#E9A23B', categories: ['mercado', 'delivery'] },
  { id: 'transporte', label: 'Transporte', emoji: '🚌', color: '#d55181', categories: ['transporte'] },
  { id: 'saude', label: 'Saúde', emoji: '🩺', color: '#6250d6', categories: ['saude'] },
  { id: 'lazer', label: 'Lazer e assinaturas', emoji: '🎬', color: '#1baf7a', categories: ['lazer', 'assinaturas'] },
  {
    id: 'familia',
    label: 'Família e outros',
    emoji: '👪',
    color: '#2a78d6',
    categories: ['filhos', 'familia', 'casa', 'roupas', 'estudos', 'outros'],
  },
]
export const SURPLUS_COLOR = '#C4CAD0'

// Em que grupo fica uma categoria (undefined = categoria sem grupo, o que os testes barram)
export function groupOf(categoryId) {
  return SPENDING_GROUPS.find((g) => g.categories.includes(categoryId))
}

// Grupos da persona, sempre na mesma ordem (a da rosca), com os itens de cada um (do maior ao menor).
// shareOfIncome = fração da renda líquida (pode passar de 100% no total, como na Carla).
export function spendingByGroup(persona) {
  const income = persona.income.net
  return SPENDING_GROUPS.map((g) => {
    const items = persona.expenses
      .filter((e) => g.categories.includes(e.id))
      .sort((x, y) => y.amount - x.amount)
      .map((e) => ({ ...e, shareOfIncome: e.amount / income }))
    const amount = items.reduce((s, e) => s + e.amount, 0)
    return { id: g.id, label: g.label, emoji: g.emoji, color: g.color, amount, shareOfIncome: amount / income, items }
  }).filter((g) => g.amount > 0)
}

// Fatias da rosca. Quando sobra dinheiro, a rosca inteira é a renda (6 grupos + "Sobrou").
// Quando falta (gasta mais do que ganha), a rosca inteira é o total gasto.
export function donutSlices(persona) {
  const groups = spendingByGroup(persona)
  const { balance, spent, income } = monthOverview(persona)
  const slices = groups.map((g) => ({ id: g.id, label: g.label, color: g.color, amount: g.amount }))
  if (balance > 0) slices.push({ id: 'sobrou', label: 'Sobrou', color: SURPLUS_COLOR, amount: balance })
  const base = balance >= 0 ? income : spent
  return { base, slices: slices.map((s) => ({ ...s, fraction: s.amount / base })) }
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
