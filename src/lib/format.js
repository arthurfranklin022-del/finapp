// Formata um número como dinheiro brasileiro: 1234.5 -> "R$ 1.234,50"
// O espaço depois de "R$" é "inquebrável": o símbolo nunca fica numa linha e o número na outra.
export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
