import { describe, it, expect } from 'vitest'
import { personas, getPersona, DEFAULT_PERSONA_ID } from './personas.js'

describe('personas da demo', () => {
  it('são 4, com identificadores diferentes', () => {
    expect(personas).toHaveLength(4)
    expect(new Set(personas.map((p) => p.id)).size).toBe(4)
  })
  it('encontra uma persona pelo identificador', () => {
    expect(getPersona('lucia').name).toBe('Dona Lúcia')
  })
  it('volta para a persona padrão se o identificador não existir', () => {
    expect(getPersona('ninguem').id).toBe(DEFAULT_PERSONA_ID)
  })
})
