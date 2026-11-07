// Personas fictícias da PrevExemplo (resumo da Etapa 1, só para o seletor da demo).
// Os números (renda, gastos, saldo do plano...) entram na Etapa 2.
export const personas = [
  { id: 'carla', name: 'Carla', age: 38, profile: 'Endividada, no limite', link: 'Participante ativa' },
  { id: 'roberto', name: 'Roberto', age: 45, profile: 'Guarda, mas não investe', link: 'Participante ativo' },
  { id: 'lucia', name: 'Dona Lúcia', age: 62, profile: 'Aposentada recente', link: 'Assistida' },
  { id: 'pedro', name: 'Pedro', age: 19, profile: 'Jovem da família', link: 'Filho de participante' },
]

export const DEFAULT_PERSONA_ID = 'carla'

export function getPersona(id) {
  return personas.find((p) => p.id === id) ?? personas.find((p) => p.id === DEFAULT_PERSONA_ID)
}
