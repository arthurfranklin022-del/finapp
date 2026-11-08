import { describe, it, expect } from 'vitest'
import { formatBRL, formatBRLRounded, formatBRLShort, formatPercent } from './format.js'

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

describe('formatBRLRounded (sem centavos)', () => {
  it('arredonda para o real mais próximo', () => {
    expect(formatBRLRounded(1234.56)).toBe(`R$${NBSP}1.235`)
  })
})

describe('formatBRLShort (valores grandes, curtos)', () => {
  it('abaixo de R$ 10 mil mostra o valor inteiro', () => {
    expect(formatBRLShort(9876.4)).toBe(`R$${NBSP}9.876`)
  })
  it('milhares viram "mil"', () => {
    expect(formatBRLShort(93890)).toBe(`R$${NBSP}94${NBSP}mil`)
    expect(formatBRLShort(-38700)).toBe(`-R$${NBSP}39${NBSP}mil`)
  })
  it('milhões no singular e no plural', () => {
    expect(formatBRLShort(1250000)).toBe(`R$${NBSP}1,3${NBSP}milhão`)
    expect(formatBRLShort(2400000)).toBe(`R$${NBSP}2,4${NBSP}milhões`)
  })
  it('perto de 1 milhão não escreve "1000 mil"', () => {
    expect(formatBRLShort(999700)).toBe(`R$${NBSP}1${NBSP}milhão`)
  })
})

describe('formatPercent', () => {
  it('usa vírgula e tira o zero à toa', () => {
    expect(formatPercent(0.04)).toBe('4%')
    expect(formatPercent(0.075)).toBe('7,5%')
  })
})
