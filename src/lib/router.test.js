import { describe, it, expect } from 'vitest'
import { AREAS, pageFromHash, hashForPage, DEFAULT_PAGE } from './router.js'

describe('navegação por endereço', () => {
  it('tem as 4 áreas da demo e a ficha da persona', () => {
    expect(AREAS.map((a) => a.id)).toEqual(['apresentacao', 'whatsapp', 'situacao', 'painel', 'persona'])
  })
  it('lê a área a partir do endereço', () => {
    expect(pageFromHash('#/whatsapp')).toBe('whatsapp')
    expect(pageFromHash('#/painel')).toBe('painel')
    expect(pageFromHash('#/identidades')).toBe('identidades')
  })
  it('ignora detalhes depois da área e maiúsculas', () => {
    expect(pageFromHash('#/Situacao/3')).toBe('situacao')
    expect(pageFromHash('#/whatsapp?persona=carla')).toBe('whatsapp')
  })
  it('volta para a apresentação se o endereço estiver vazio ou errado', () => {
    expect(pageFromHash('')).toBe(DEFAULT_PAGE)
    expect(pageFromHash('#/')).toBe(DEFAULT_PAGE)
    expect(pageFromHash('#/nao-existe')).toBe(DEFAULT_PAGE)
    expect(pageFromHash(undefined)).toBe(DEFAULT_PAGE)
  })
  it('monta o endereço de cada área', () => {
    expect(hashForPage('painel')).toBe('#/painel')
    for (const a of AREAS) expect(pageFromHash(hashForPage(a.id))).toBe(a.id)
  })
})
