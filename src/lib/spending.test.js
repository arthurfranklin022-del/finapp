import { describe, it, expect } from 'vitest'
import { SPENDING_GROUPS, groupOf, spendingByGroup, monthOverview } from './spending.js'
import { personas, totalExpenses, getPersona } from '../data/personas.js'

describe('grupos de gastos do resumo', () => {
  it('são 6 grupos e nenhuma categoria aparece em dois grupos', () => {
    expect(SPENDING_GROUPS).toHaveLength(6)
    const all = SPENDING_GROUPS.flatMap((g) => g.categories)
    expect(new Set(all).size).toBe(all.length)
  })

  it.each(personas)('$name: todo gasto tem um grupo (nenhum fica de fora)', (p) => {
    for (const e of p.expenses) expect(groupOf(e.id), `${p.name}: ${e.label}`).toBeDefined()
  })

  it.each(personas)('$name: os grupos somam exatamente o total gasto e listam todos os itens', (p) => {
    const groups = spendingByGroup(p)
    expect(groups.reduce((s, g) => s + g.amount, 0)).toBe(totalExpenses(p))
    expect(groups.flatMap((g) => g.items).length).toBe(p.expenses.length)
    for (const g of groups) expect(g.items.reduce((s, e) => s + e.amount, 0)).toBe(g.amount)
  })

  it('grupos vêm do maior para o menor e sem grupos vazios', () => {
    const groups = spendingByGroup(getPersona('pedro'))
    expect(groups.map((g) => g.amount)).toEqual([...groups.map((g) => g.amount)].sort((a, b) => b - a))
    expect(groups.find((g) => g.id === 'saude')).toBeUndefined() // Pedro não tem gasto com saúde
  })

  it('Carla: Alimentação abre mercado e delivery; gasta 109% da renda e faltam R$ 450', () => {
    const carla = getPersona('carla')
    const food = spendingByGroup(carla).find((g) => g.id === 'alimentacao')
    expect(food.items.map((e) => e.id)).toEqual(['mercado', 'delivery'])
    expect(food.amount).toBe(1740)
    const o = monthOverview(carla)
    expect(o.balance).toBe(-450)
    expect(o.shareOfIncome).toBeCloseTo(5650 / 5200)
  })
})
