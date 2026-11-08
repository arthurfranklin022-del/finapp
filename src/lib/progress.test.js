import { describe, it, expect } from 'vitest'
import { LEVELS, levelFor, nextLevel, initialProgress, answer, advanceDay, weekSummary, isValidProgress } from './progress.js'
import { personas, getPersona } from '../data/personas.js'
import { weekFor } from '../data/situations.js'
import { ASSUMPTIONS } from '../data/assumptions.js'

const idOf = (situation, quality) => situation.options.find((o) => o.quality === quality).id

// Joga a semana inteira: `choices` = lista de 'best' | 'ok' | 'weak' | 'skip' (um por dia)
function play(personaId, choices) {
  const persona = getPersona(personaId)
  const week = weekFor(persona, ASSUMPTIONS)
  let s = initialProgress(persona)
  const levelUps = []
  choices.forEach((c, i) => {
    if (c !== 'skip') {
      const before = levelFor(s.points)
      s = answer(s, week[i], idOf(week[i], c))
      if (levelFor(s.points) !== before) levelUps.push({ day: i + 1, to: levelFor(s.points).name })
    }
    s = advanceDay(s)
  })
  return { s, levelUps }
}

describe('níveis (fases do Broto)', () => {
  it('Semente 0 · Broto 100 · Muda 250 · Árvore 450', () => {
    expect(LEVELS.map((l) => [l.name, l.min])).toEqual([
      ['Semente', 0],
      ['Broto', 100],
      ['Muda', 250],
      ['Árvore', 450],
    ])
  })
  it.each([
    [0, 'Semente'],
    [99, 'Semente'],
    [100, 'Broto'],
    [249, 'Broto'],
    [250, 'Muda'],
    [449, 'Muda'],
    [450, 'Árvore'],
    [9999, 'Árvore'],
  ])('%i pontos = %s', (points, name) => {
    expect(levelFor(points).name).toBe(name)
  })
  it('mostra quanto falta para o próximo nível', () => {
    expect(nextLevel(30)).toMatchObject({ missing: 70, progress: 0.3 })
    expect(nextLevel(30).level.name).toBe('Broto')
    expect(nextLevel(450)).toBeNull()
  })
})

describe('ponto de partida de cada persona', () => {
  it.each([
    ['carla', 30, 1, 'Semente'],
    ['roberto', 110, 5, 'Broto'],
    ['lucia', 280, 12, 'Muda'],
    ['pedro', 0, 0, 'Semente'],
  ])('%s: %i pontos, %i dias seguidos, nível %s', (id, points, streak, level) => {
    const s = initialProgress(getPersona(id))
    expect(s).toMatchObject({ day: 1, points, streak, finished: false })
    expect(levelFor(s.points).name).toBe(level)
  })
})

describe('responder', () => {
  const persona = getPersona('carla')
  const week = weekFor(persona, ASSUMPTIONS)
  it.each([
    ['best', 30],
    ['ok', 20],
    ['weak', 10],
  ])('escolha %s vale %i pontos e soma 1 dia na sequência', (quality, pts) => {
    const s = answer(initialProgress(persona), week[0], idOf(week[0], quality))
    expect(s.points).toBe(30 + pts)
    expect(s.streak).toBe(2)
    expect(s.answers[1]).toMatchObject({ quality, points: pts })
  })
  it('só vale uma resposta por dia', () => {
    const once = answer(initialProgress(persona), week[0], idOf(week[0], 'weak'))
    const twice = answer(once, week[0], idOf(week[0], 'best'))
    expect(twice).toBe(once)
  })
  it('opção inexistente não muda nada', () => {
    const s = initialProgress(persona)
    expect(answer(s, week[0], 'z')).toBe(s)
  })
})

describe('sequência com 1 folga por semana', () => {
  it('o 1º dia pulado fica protegido; o 2º zera a sequência', () => {
    const persona = getPersona('lucia') // começa com 12 dias seguidos
    let s = advanceDay(initialProgress(persona)) // pula o dia 1
    expect(s).toMatchObject({ day: 2, streak: 12, freezeUsed: true, lastSkip: 'protected' })
    s = advanceDay(s) // pula o dia 2
    expect(s).toMatchObject({ day: 3, streak: 0, lastSkip: 'reset' })
    expect(s.skipped).toEqual([1, 2])
  })
  it('responder depois de pular volta a contar e limpa o aviso', () => {
    const persona = getPersona('carla')
    const week = weekFor(persona, ASSUMPTIONS)
    let s = advanceDay(initialProgress(persona))
    s = answer(s, week[1], idOf(week[1], 'best'))
    expect(s).toMatchObject({ streak: 2, lastSkip: null })
  })
})

describe('a semana inteira', () => {
  it.each(personas)('$name: jogando bem, sobe exatamente 1 nível e ganha 210 pontos', (p) => {
    const { s, levelUps } = play(p.id, Array(7).fill('best'))
    expect(s.finished).toBe(true)
    expect(levelUps).toHaveLength(1)
    const sum = weekSummary(s)
    expect(sum).toMatchObject({ weekPoints: 210, answeredCount: 7, bestCount: 7, skippedCount: 0 })
    expect(s.streak).toBe(p.start.streak + 7)
  })
  it('em que dia cada persona sobe de nível jogando bem', () => {
    expect(play('carla', Array(7).fill('best')).levelUps).toEqual([{ day: 3, to: 'Broto' }])
    expect(play('roberto', Array(7).fill('best')).levelUps).toEqual([{ day: 5, to: 'Muda' }])
    expect(play('lucia', Array(7).fill('best')).levelUps).toEqual([{ day: 6, to: 'Árvore' }])
    expect(play('pedro', Array(7).fill('best')).levelUps).toEqual([{ day: 4, to: 'Broto' }])
  })
  it('semana misturada: pontos, sequência e resumo batem', () => {
    // Pedro: melhor, meio, pula (folga), dá para melhorar, pula (zera), melhor, melhor
    const { s } = play('pedro', ['best', 'ok', 'skip', 'weak', 'skip', 'best', 'best'])
    expect(s.points).toBe(30 + 20 + 10 + 30 + 30)
    expect(s.streak).toBe(2)
    expect(weekSummary(s)).toMatchObject({ weekPoints: 120, answeredCount: 5, bestCount: 3, skippedCount: 2 })
    expect(levelFor(s.points).name).toBe('Broto')
  })
  it('depois de terminar, nada mais muda', () => {
    const { s } = play('carla', Array(7).fill('best'))
    expect(advanceDay(s)).toBe(s)
    expect(answer(s, weekFor(getPersona('carla'), ASSUMPTIONS)[6], 'a')).toBe(s)
  })
})

describe('estado salvo no navegador', () => {
  it('aceita um estado válido e recusa lixo', () => {
    expect(isValidProgress(initialProgress(getPersona('carla')))).toBe(true)
    expect(isValidProgress(null)).toBe(false)
    expect(isValidProgress({ day: 9 })).toBe(false)
    expect(isValidProgress('texto')).toBe(false)
  })
})
