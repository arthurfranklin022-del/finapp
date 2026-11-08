// Regras do jogo da trilha (Etapa 3): pontos, níveis, sequência de dias seguidos e a semana.
// Tudo aqui é "puro": recebe o estado e devolve um estado novo, sem mexer em tela nem navegador.
//
// Regras decididas com o Arthur:
// - Pontos por escolha: melhor 30 · meio 20 · dá para melhorar 10.
// - Níveis = fases do Broto: Semente (0) → Broto (100) → Muda (250) → Árvore (450 pontos).
// - Sequência: responder no dia soma 1. O 1º dia pulado na semana fica "protegido" (folga);
//   o 2º zera a sequência.
// - "Avançar um dia" (modo demo) passa para o próximo dia; se o dia não foi respondido, conta
//   como dia pulado. Depois do 7º dia, a semana termina e aparece o resumo.
import { POINTS } from '../data/situations.js'

export const DAYS_IN_WEEK = 7

export const LEVELS = [
  { id: 'semente', name: 'Semente', min: 0, stage: 1 },
  { id: 'broto', name: 'Broto', min: 100, stage: 2 },
  { id: 'muda', name: 'Muda', min: 250, stage: 3 },
  { id: 'arvore', name: 'Árvore', min: 450, stage: 4 },
]

// Nível de quem tem X pontos
export function levelFor(points) {
  return [...LEVELS].reverse().find((l) => points >= l.min)
}

// Próximo nível e quanto falta (null se já está no topo)
export function nextLevel(points) {
  const next = LEVELS.find((l) => l.min > points)
  if (!next) return null
  const current = levelFor(points)
  return {
    level: next,
    missing: next.min - points,
    // fração do caminho entre o nível atual e o próximo (0 a 1), para a barrinha de progresso
    progress: (points - current.min) / (next.min - current.min),
  }
}

// Estado do começo da semana, a partir do histórico da persona
export function initialProgress(persona) {
  const start = persona.start ?? { points: 0, streak: 0 }
  return {
    day: 1, // dia da semana em que a pessoa está (1 a 7)
    points: start.points,
    startPoints: start.points,
    streak: start.streak,
    bestStreak: start.streak,
    freezeUsed: false, // a folga da semana já foi usada?
    answers: {}, // { [dia]: { optionId, quality, points } }
    skipped: [], // dias pulados
    lastSkip: null, // o que aconteceu no último dia pulado: 'protected' | 'reset' | null
    finished: false, // a semana acabou (mostra o resumo)
  }
}

// Responder a situação do dia. Só vale uma resposta por dia.
export function answer(state, situation, optionId) {
  if (state.finished || state.answers[state.day]) return state
  const option = situation.options.find((o) => o.id === optionId)
  if (!option) return state
  const points = POINTS[option.quality]
  const streak = state.streak + 1
  return {
    ...state,
    points: state.points + points,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    answers: { ...state.answers, [state.day]: { optionId, quality: option.quality, points } },
    lastSkip: null,
  }
}

// Passar para o dia seguinte (botão "Avançar um dia" do modo demo).
// Se o dia não foi respondido, conta como pulado: usa a folga da semana ou zera a sequência.
export function advanceDay(state) {
  if (state.finished) return state
  let next = { ...state }
  if (!state.answers[state.day]) {
    next.skipped = [...state.skipped, state.day]
    if (!state.freezeUsed) {
      next.freezeUsed = true
      next.lastSkip = 'protected'
    } else {
      next.streak = 0
      next.lastSkip = 'reset'
    }
  } else {
    next.lastSkip = null
  }
  if (state.day >= DAYS_IN_WEEK) next.finished = true
  else next.day = state.day + 1
  return next
}

// Resumo da semana, para a tela final
export function weekSummary(state) {
  const answered = Object.values(state.answers)
  return {
    weekPoints: state.points - state.startPoints,
    answeredCount: answered.length,
    bestCount: answered.filter((a) => a.quality === 'best').length,
    skippedCount: state.skipped.length,
    level: levelFor(state.points),
    startLevel: levelFor(state.startPoints),
    streak: state.streak,
  }
}

// Confere se um estado salvo no navegador ainda tem o formato certo (senão, recomeça)
export function isValidProgress(s) {
  return (
    !!s &&
    typeof s === 'object' &&
    Number.isInteger(s.day) &&
    s.day >= 1 &&
    s.day <= DAYS_IN_WEEK &&
    typeof s.points === 'number' &&
    typeof s.startPoints === 'number' &&
    typeof s.streak === 'number' &&
    typeof s.answers === 'object' &&
    Array.isArray(s.skipped)
  )
}
