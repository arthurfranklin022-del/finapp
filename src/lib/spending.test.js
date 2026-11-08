import { describe, it, expect } from 'vitest'
import { SPENDING_GROUPS, groupOf, spendingByGroup, monthOverview, donutSlices } from './spending.js'
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

  it('grupos vêm sempre na mesma ordem (a da rosca), sem grupos vazios, cada um com a sua cor', () => {
    const groups = spendingByGroup(getPersona('pedro'))
    const order = SPENDING_GROUPS.map((g) => g.id)
    expect(groups.map((g) => order.indexOf(g.id))).toEqual([...groups.map((g) => order.indexOf(g.id))].sort((a, b) => a - b))
    expect(groups.find((g) => g.id === 'saude')).toBeUndefined() // Pedro não tem gasto com saúde
    expect(new Set(SPENDING_GROUPS.map((g) => g.color)).size).toBe(6)
  })

  it.each(personas)('$name: as fatias da rosca fecham 100%', (p) => {
    const { slices } = donutSlices(p)
    expect(slices.reduce((s, x) => s + x.fraction, 0)).toBeCloseTo(1)
  })

  it('rosca: com sobra, inclui "Sobrou" (Roberto 25%); a Carla, que gasta mais do que ganha, não', () => {
    const roberto = donutSlices(getPersona('roberto'))
    expect(roberto.base).toBe(11000)
    expect(roberto.slices.at(-1)).toMatchObject({ id: 'sobrou', amount: 2800 })
    expect(roberto.slices.at(-1).fraction).toBeCloseTo(2800 / 11000)
    const carla = donutSlices(getPersona('carla'))
    expect(carla.base).toBe(5650)
    expect(carla.slices.find((s) => s.id === 'sobrou')).toBeUndefined()
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
