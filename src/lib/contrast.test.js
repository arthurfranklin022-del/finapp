import { describe, it, expect } from 'vitest'
import { hexToRgb, contrastRatio } from './contrast.js'
import { identities } from '../data/identities.js'

describe('contraste de cores', () => {
  it('converte hexadecimal em RGB (inclusive forma curta)', () => {
    expect(hexToRgb('#1F5D3F')).toEqual([31, 93, 63])
    expect(hexToRgb('#fff')).toEqual([255, 255, 255])
  })
  it('preto no branco dá 21 e cor igual dá 1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5)
  })
  it('recusa cor inválida', () => {
    expect(() => hexToRgb('verde')).toThrow()
  })
})

// Toda identidade precisa ser legível (pensando na Dona Lúcia)
describe.each(identities)('identidade $name: combinações legíveis', ({ colors: c }) => {
  it.each([
    ['texto sobre fundo', c.text, c.background],
    ['texto secundário sobre fundo', c.muted, c.background],
    ['texto secundário sobre cartão', c.muted, c.surface],
    ['texto branco sobre a cor principal', c.onPrimary, c.primary],
    ['cor principal como texto sobre cartão', c.primary, c.surface],
    ['texto sobre a cor de destaque', c.onAccent, c.accent],
    ['texto sobre a cor suave', c.text, c.soft],
  ])('%s (mínimo 4,5)', (_, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(4.5)
  })
})
