// Formata um número como dinheiro brasileiro: 1234.5 -> "R$ 1.234,50"
// O espaço depois de "R$" é "inquebrável": o símbolo nunca fica numa linha e o número na outra.
export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// Dinheiro sem centavos: 1234.56 -> "R$ 1.235"
export function formatBRLRounded(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(
    value,
  )
}

// Dinheiro curto para valores grandes: 93890 -> "R$ 94 mil"; 1250000 -> "R$ 1,3 milhão".
// Abaixo de R$ 10 mil mostra o valor inteiro sem centavos.
export function formatBRLShort(value) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs < 10000) return formatBRLRounded(value)
  if (abs < 999500) return `${sign}R$ ${Math.round(abs / 1000)} mil`
  const millions = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(abs / 1e6)
  return `${sign}R$ ${millions} ${abs < 1.95e6 ? 'milhão' : 'milhões'}`
}

// Porcentagem: 0.04 -> "4%"; 0.075 -> "7,5%"
export function formatPercent(rate) {
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(rate * 100)}%`
}
