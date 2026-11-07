// As 3 opções de identidade visual da Etapa 1, usadas na página de comparação.
// Cores em hexadecimal; o teste src/lib/contrast.test.js confere se todas são legíveis.

// A mesma mensagem, escrita no tom de cada identidade
const SAMPLE_PERSONA = 'Carla'

export const identities = [
  {
    id: 'raiz',
    letter: 'A',
    name: 'Raiz',
    tagline: 'O dinheiro que cresce com o tempo',
    metaphor:
      'Uma plantinha que cresce aos poucos, como a reserva e a previdência. Cada nível da trilha é uma fase do Broto: semente, broto, muda, árvore.',
    symbol: { kind: 'mascote', name: 'Broto', description: 'Plantinha simpática que cresce com o nível da pessoa' },
    fonts: { heading: "'Nunito Variable', sans-serif", body: "'Nunito Variable', sans-serif", label: 'Nunito (títulos e texto)' },
    colors: {
      primary: '#1F5D3F', // verde-floresta
      onPrimary: '#FFFFFF',
      accent: '#E9A23B', // mel
      onAccent: '#1E2A22',
      background: '#FBF7EE', // creme
      surface: '#FFFFFF',
      soft: '#DDEBDF', // verde-claro
      text: '#1E2A22',
      muted: '#56655B',
    },
    colorNames: { primary: 'Verde-floresta', accent: 'Mel', background: 'Creme', soft: 'Folha clara' },
    voice: {
      description: 'Acolhedor e próximo. Fala como um amigo paciente, sem pressa e sem julgamento.',
      words: ['acolhedor', 'paciente', 'otimista'],
      sample: `Bom dia, ${SAMPLE_PERSONA}! 🌱 O Broto separou uma situação pra você: os R$ 640 de delivery deste mês. Vamos ver juntos quanto isso pode virar em 10 anos?`,
    },
    radius: '1.25rem',
  },
  {
    id: 'horizonte',
    letter: 'B',
    name: 'Horizonte',
    tagline: 'Um futuro tranquilo, planejado hoje',
    metaphor:
      'O sol nascendo no horizonte: a aposentadoria vista de longe, com calma e segurança. Passa a seriedade de uma instituição financeira.',
    symbol: { kind: 'símbolo', name: 'Sol nascente', description: 'Sol surgindo sobre linhas de horizonte' },
    fonts: {
      heading: "'Source Serif 4 Variable', Georgia, serif",
      body: "'Inter Variable', sans-serif",
      label: 'Source Serif (títulos) + Inter (texto)',
    },
    colors: {
      primary: '#14284B', // azul-marinho
      onPrimary: '#FFFFFF',
      accent: '#F2A93B', // âmbar
      onAccent: '#14284B',
      background: '#F5F7FA',
      surface: '#FFFFFF',
      soft: '#DFE6F1',
      text: '#111A2B',
      muted: '#4F5C72',
    },
    colorNames: { primary: 'Azul-marinho', accent: 'Âmbar', background: 'Névoa', soft: 'Céu claro' },
    voice: {
      description: 'Sóbrio e confiante. Frases curtas e diretas, com o respeito de quem cuida do futuro da pessoa.',
      words: ['confiável', 'claro', 'respeitoso'],
      sample: `${SAMPLE_PERSONA}, sua situação do dia está disponível. Tema: delivery. Veja quanto R$ 640 por mês representam em 10 anos. Leva 2 minutos.`,
    },
    radius: '0.75rem',
  },
  {
    id: 'coruja',
    letter: 'C',
    name: 'Coruja',
    tagline: 'Aprender sobre dinheiro pode ser leve',
    metaphor:
      'A coruja é símbolo de sabedoria. A Sábia faz perguntas, comemora os acertos e explica as contas como numa conversa.',
    symbol: { kind: 'mascote', name: 'Sábia', description: 'Coruja curiosa que puxa conversa e comemora acertos' },
    fonts: { heading: "'Outfit Variable', sans-serif", body: "'Outfit Variable', sans-serif", label: 'Outfit (títulos e texto)' },
    colors: {
      primary: '#0F5E66', // azul-petróleo
      onPrimary: '#FFFFFF',
      accent: '#F47C6B', // coral
      onAccent: '#13282B',
      background: '#F3F9F8',
      surface: '#FFFFFF',
      soft: '#D3ECE9',
      text: '#13282B',
      muted: '#4A6264',
    },
    colorNames: { primary: 'Azul-petróleo', accent: 'Coral', background: 'Bruma', soft: 'Água clara' },
    voice: {
      description: 'Leve e de conversa. Usa perguntas, um pouco de humor e comemora cada passo.',
      words: ['curioso', 'divertido', 'encorajador'],
      sample: `Ei, ${SAMPLE_PERSONA}! 🦉 A Sábia fez as contas: R$ 640 de delivery em um mês. Dá um palpite: quanto isso vira em 10 anos?`,
    },
    radius: '1.5rem',
  },
]

export function getIdentity(id) {
  return identities.find((i) => i.id === id)
}
