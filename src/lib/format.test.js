import { describe, it, expect } from 'vitest'
import { formatBRL } from './format.js'

const NBSP = ' ' // espaço inquebrável

describe('formatBRL (formatar dinheiro)', () => {
  it('usa R$, ponto no milhar e vírgula nos centavos', () => {
    expect(formatBRL(1234.5)).toBe(`R$${NBSP}1.234,50`)
  })
  it('formata zero', () => {
    expect(formatBRL(0)).toBe(`R$${NBSP}0,00`)
  })
  it('formata valores negativos (ex.: dívida)', () => {
    expect(formatBRL(-5200)).toBe(`-R$${NBSP}5.200,00`)
  })
})
